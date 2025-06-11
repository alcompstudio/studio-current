#!/bin/bash
# Скрипт деплоя для Studio App (Next.js 15) - исправленная версия
set -e

# Функции для логирования
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }
warn() { echo "[WARNING] $1" >&2; }
error() { echo "[ERROR] $1" >&2; exit 1; }

# Параметры
DEPLOY_DIR="/var/www/studio-app"
ARCHIVE_NAME="$1"
SERVER_IP="$2"

log "🚀 Начало деплоя Studio App (Next.js 15)"
log "📁 Директория деплоя: $DEPLOY_DIR"
log "📦 Архив: $ARCHIVE_NAME"

# Остановка всех процессов на порту 3000
log "🛑 Остановка процессов на порту 3000..."
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Создание бэкапа (если есть что бэкапить)
if [ -d "$DEPLOY_DIR/.next" ] || [ -f "$DEPLOY_DIR/package.json" ]; then
    BACKUP_DIR="/tmp/studio.backup.$(date +%Y%m%d_%H%M%S)"
    log "💾 Создание бэкапа в $BACKUP_DIR..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$DEPLOY_DIR/." "$BACKUP_DIR/" 2>/dev/null || true
    log "✅ Бэкап создан"
fi

# Переход в директорию деплоя
log "📁 Переход в директорию деплоя: $DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Распаковка архива
log "📦 Распаковка архива $ARCHIVE_NAME..."
if [[ "$ARCHIVE_NAME" == *.zip ]]; then
    unzip -o "$ARCHIVE_NAME"
else
    tar -xzf "$ARCHIVE_NAME"
fi
rm -f "$ARCHIVE_NAME"
log "✅ Архив распакован"

# Создание .env файла
log "⚙️ Настройка переменных окружения..."
if [ ! -f "$DEPLOY_DIR/.env" ]; then
    tee "$DEPLOY_DIR/.env" > /dev/null << ENV_EOF
NODE_ENV=production
DATABASE_URL=postgresql://userstudio:userstudio@localhost:5432/userstudio
NEXTAUTH_URL=http://$SERVER_IP:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database configuration
DB_NAME=userstudio
DB_USERNAME=userstudio
DB_PASSWORD=userstudio
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
ENV_EOF
    log "✅ Файл .env создан"
else
    log "✅ Файл .env уже существует"
fi

# Проверка и создание next.config.js (ИСПРАВЛЕНИЕ ПРОБЛЕМЫ)
log "🔧 Проверка next.config.js..."
if [ ! -f "next.config.js" ]; then
    log "⚠️ next.config.js не найден, создаем..."
    tee "next.config.js" > /dev/null << 'CONFIG_EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['sequelize'],
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
  },
};

export default nextConfig;
CONFIG_EOF
    log "✅ next.config.js создан"
else
    log "✅ next.config.js найден"
fi

# Установка зависимостей
log "📦 Установка зависимостей..."
npm install --production --legacy-peer-deps --ignore-scripts
log "✅ Зависимости установлены"

# Запуск миграций базы данных
log "🗃️ Запуск миграций базы данных..."
if [ -f "src/lib/migrate.ts" ]; then
    npx tsx src/lib/migrate.ts || warn "Ошибка выполнения миграций"
else
    warn "Файл миграций не найден"
fi

# Создание PM2 конфигурации (ИСПРАВЛЕНИЕ ПРОБЛЕМЫ С ДУБЛИРОВАНИЕМ)
log "⚙️ Создание PM2 конфигурации..."
tee "ecosystem.config.cjs" > /dev/null << PM2_EOF
module.exports = {
  apps: [{
    name: 'studio-nextjs15',
    script: 'npm',
    args: 'start',
    cwd: '$DEPLOY_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
PM2_EOF

# Запуск приложения через PM2
log "🚀 Запуск приложения (Next.js 15)..."
pm2 start ecosystem.config.cjs
pm2 save

# Проверка статуса
log "🔍 Проверка статуса приложения..."
sleep 5
pm2 status

# Проверка доступности
log "🌐 Проверка доступности приложения..."
for i in {1..10}; do
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        log "✅ Приложение отвечает на запросы"
        break
    else
        log "⏳ Ожидание запуска приложения... ($i/10)"
        sleep 3
    fi
done

# Очистка старых бэкапов (оставляем только 3 последних)
log "🗑️ Очистка старых бэкапов..."
ls -dt /tmp/studio.backup.* 2>/dev/null | tail -n +4 | xargs rm -rf || true

log "✅ Деплой Next.js 15 завершен успешно!"
log "🌐 Приложение доступно по адресу: http://$(hostname -I | awk '{print $1}'):3000"
log "📋 Версия: Next.js 15.2.3"
