#!/bin/bash

# --- КОНФИГУРАЦИЯ ---
SERVER_USER="deployuser"
SERVER_IP="157.180.87.32"
SERVER_APP_DIR="/var/www/studio_app"
LOCAL_PROJECT_DIR="." # Текущая директория, где лежит ваш проект
ARCHIVE_NAME="studio_app_docker_deploy.tar.gz"

# --- НАЧАЛО СКРИПТА ---
echo "Начинаем процесс деплоя приложения с использованием Docker..."

# 1. Архивирование проекта
echo "1. Архивирование проекта для загрузки..."
cd "$LOCAL_PROJECT_DIR"

# Создаем архив проекта, исключая node_modules, .git и другие ненужные файлы
git archive --format=tar.gz -o "$ARCHIVE_NAME" HEAD

echo "Архивирование завершено: $ARCHIVE_NAME"

# 2. Копирование архива на сервер
echo "2. Копирование архива на сервер..."
if ! scp "$ARCHIVE_NAME" "${SERVER_USER}@${SERVER_IP}:${SERVER_APP_DIR}/" ; then
    echo "Ошибка копирования архива на сервер! Прерывание."
    rm "$ARCHIVE_NAME"
    exit 1
fi
echo "Архив скопирован."

# 3. Удаление локального архива
rm "$ARCHIVE_NAME"

# 4. Выполнение команд на сервере
echo "4. Выполнение команд на сервере..."
ssh "${SERVER_USER}@${SERVER_IP}" "
    cd '${SERVER_APP_DIR}' && \
    echo 'Останавливаем контейнеры, если они запущены...' && \
    docker-compose down || true && \
    
    echo 'Распаковка архива...' && \
    mkdir -p temp_extract && \
    tar -xzf '${ARCHIVE_NAME}' -C temp_extract && \
    
    echo 'Копирование новых файлов...' && \
    cp -R temp_extract/* . && \
    rm -rf temp_extract && \
    rm '${ARCHIVE_NAME}' && \
    
    echo 'Копирование .env.docker в .env...' && \
    cp .env.docker .env && \
    
    echo 'Запуск Docker контейнеров...' && \
    docker-compose up -d --build && \
    
    echo 'Проверка статуса контейнеров...' && \
    docker-compose ps && \
    
    echo 'Деплой с использованием Docker завершен успешно!'
"

if [ $? -eq 0 ]; then
    echo "✅ Деплой успешно выполнен!"
else
    echo "❌ Произошла ошибка во время деплоя."
    exit 1
fi
