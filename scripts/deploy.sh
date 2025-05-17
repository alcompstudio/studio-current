#!/bin/bash

# --- КОНФИГУРАЦИЯ ---
SERVER_USER="deployuser"
SERVER_IP="157.180.87.32"
SERVER_APP_DIR="/var/www/studio_app"
LOCAL_PROJECT_DIR="." # Текущая директория, где лежит ваш проект
ARCHIVE_NAME="studio_app_update.tar.gz"

# --- НАЧАЛО СКРИПТА ---
echo "Начинаем процесс обновления приложения..."

# 1. Сборка проекта локально
echo "1. Сборка проекта локально (npm run build)..."
cd "$LOCAL_PROJECT_DIR"
if ! npm run build; then
    echo "Ошибка сборки проекта! Прерывание."
    exit 1
fi
echo "Сборка завершена."

# 2. Архивирование необходимых файлов
echo "2. Архивирование файлов для загрузки..."
tar -czf "$ARCHIVE_NAME" \
    .next \
    public \
    package.json \
    package-lock.json \
    src/migrations \
    src/lib/migrate.ts
echo "Архивирование завершено: $ARCHIVE_NAME"

# 3. Копирование архива на сервер
echo "3. Копирование архива на сервер..."
if ! scp "$ARCHIVE_NAME" "${SERVER_USER}@${SERVER_IP}:${SERVER_APP_DIR}/" ; then
    echo "Ошибка копирования архива на сервер! Прерывание."
    rm "$ARCHIVE_NAME"
    exit 1
fi
echo "Архив скопирован."

# 4. Удаление локального архива
rm "$ARCHIVE_NAME"

# 5. Выполнение команд на сервере
echo "5. Выполнение команд на сервере..."
ssh "${SERVER_USER}@${SERVER_IP}" "
    cd '${SERVER_APP_DIR}' && \
    echo 'Распаковка архива...' && \
    tar -xzf '${ARCHIVE_NAME}' && \
    rm '${ARCHIVE_NAME}' && \
    echo 'Установка зависимостей (npm install)...' && \
    npm install && \
    echo 'Запуск миграций базы данных (npx tsx src/lib/migrate.ts)...' && \
    npx tsx src/lib/migrate.ts && \
    echo 'Перезапуск приложения (pm2 restart studio-app)...' && \
    pm2 restart studio-app && \
    echo 'Обновление завершено успешно!'
"

if [ $? -eq 0 ]; then
    echo "Процесс обновления приложения на сервере успешно завершен."
else
    echo "Во время выполнения команд на сервере произошла ошибка."
    exit 1
fi

exit 0
