#!/bin/bash

# 🚀 Автоматический скрипт деплоя Studio App (Next.js 14)
# Использование: ./deploy-nextjs14.sh [server_ip] [username]

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Параметры
SERVER_IP=${1:-"185.46.8.179"}
USERNAME=${2:-"alcompstudio"}
DEPLOY_DIR="/var/www/studio"
ARCHIVE_NAME="studio-deploy-nextjs14.tar.gz"

log "🚀 Начинаем деплой Studio App (Next.js 14)"
log "Сервер: $USERNAME@$SERVER_IP"
log "Директория: $DEPLOY_DIR"

# Проверка наличия архива
if [ ! -f "$ARCHIVE_NAME" ]; then
    error "Архив $ARCHIVE_NAME не найден! Сначала выполните сборку проекта."
fi

log "📦 Архив найден: $(ls -lh $ARCHIVE_NAME | awk '{print $5}')"

# Проверка доступности сервера
log "🔍 Проверка доступности сервера..."
if ! ping -c 1 "$SERVER_IP" > /dev/null 2>&1; then
    warn "Сервер не отвечает на ping. Продолжаем..."
fi

# Загрузка архива на сервер
log "📤 Загрузка архива на сервер..."
scp "$ARCHIVE_NAME" "$USERNAME@$SERVER_IP:/tmp/" || error "Ошибка загрузки архива"

# Подключение к серверу и выполнение деплоя
log "🔧 Выполнение деплоя на сервере..."
ssh "$USERNAME@$SERVER_IP" << 'EOF'
set -e

# Цвета для удаленного сервера
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[REMOTE] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[REMOTE WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[REMOTE ERROR] $1${NC}"
    exit 1
}

DEPLOY_DIR="/var/www/studio"
ARCHIVE_NAME="studio-deploy.tar.gz"

log "🏗️ Подготовка директории деплоя (Next.js 14)..."

# Создание директории если не существует
sudo mkdir -p "$DEPLOY_DIR"

# Остановка приложения если запущено
log "⏹️ Остановка текущего приложения..."
sudo pkill -f "npm start" || true
sudo systemctl stop studio || true
pm2 stop studio || true

# Бэкап текущей версии
if [ -d "$DEPLOY_DIR/.next" ]; then
    log "💾 Создание бэкапа текущей версии..."
    sudo mv "$DEPLOY_DIR" "$DEPLOY_DIR.backup.nextjs14.$(date +%Y%m%d_%H%M%S)" || true
    sudo mkdir -p "$DEPLOY_DIR"
fi

# Распаковка нового архива
log "📦 Распаковка нового архива (Next.js 14)..."
sudo tar -xzf "/tmp/$ARCHIVE_NAME" -C "$DEPLOY_DIR"

# Установка зависимостей
log "📚 Установка зависимостей..."
cd "$DEPLOY_DIR"
sudo npm ci --only=production

# Настройка прав доступа
log "🔐 Настройка прав доступа..."
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"

# Создание .env файла если не существует
if [ ! -f "$DEPLOY_DIR/.env" ]; then
    log "⚙️ Создание файла окружения..."
    sudo cp "$DEPLOY_DIR/.env.example" "$DEPLOY_DIR/.env"
    warn "Не забудьте настроить переменные в $DEPLOY_DIR/.env"
fi

# Запуск приложения
log "🚀 Запуск приложения (Next.js 14)..."

# Попытка запуска через PM2
if command -v pm2 > /dev/null; then
    log "Запуск через PM2..."
    cd "$DEPLOY_DIR"
    pm2 start npm --name "studio-nextjs14" -- start || warn "Ошибка запуска через PM2"
    pm2 save || true
elif systemctl is-enabled studio > /dev/null 2>&1; then
    log "Запуск через systemd..."
    sudo systemctl start studio || warn "Ошибка запуска через systemd"
else
    log "Запуск в фоновом режиме..."
    cd "$DEPLOY_DIR"
    nohup npm start > studio-nextjs14.log 2>&1 &
fi

# Очистка временных файлов
log "🧹 Очистка временных файлов..."
rm -f "/tmp/$ARCHIVE_NAME"

# Удаление старых бэкапов (оставляем только 3 последних)
log "🗑️ Очистка старых бэкапов..."
ls -dt /var/www/studio.backup.* 2>/dev/null | tail -n +4 | sudo xargs rm -rf || true

log "✅ Деплой Next.js 14 завершен успешно!"
log "🌐 Приложение доступно по адресу: http://$(hostname -I | awk '{print $1}'):3000"
log "📋 Версия: Next.js 14.2.29 (стабильная)"

EOF

if [ $? -eq 0 ]; then
    log "✅ Деплой Next.js 14 завершен успешно!"
    log "🌐 Приложение должно быть доступно по адресу: http://$SERVER_IP:3000"
    log "📋 Следующие шаги:"
    echo "   1. Настройте переменные окружения в /var/www/studio/.env"
    echo "   2. Проверьте подключение к базе данных"
    echo "   3. Настройте Nginx для проксирования (опционально)"
    echo "   4. Настройте SSL сертификат (рекомендуется)"
    echo ""
    echo "🔧 Версия: Next.js 14.2.29 (стабильная)"
    echo "⚠️  Отличия от Next.js 15:"
    echo "   - Стабильная работа с Sequelize"
    echo "   - Нет проблем с clientModules"
    echo "   - Совместимость с Node.js 18+"
else
    error "Деплой завершился с ошибкой!"
fi
