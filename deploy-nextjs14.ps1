# 🚀 PowerShell скрипт деплоя Studio App (Next.js 14)
# Использование: .\deploy-nextjs14.ps1 -ServerIP "185.46.8.179" -Username "alcompstudio"

param(
    [string]$ServerIP = "185.46.8.179",
    [string]$Username = "alcompstudio",
    [string]$DeployDir = "/var/www/studio",
    [string]$ArchiveName = "studio-deploy-nextjs14.tar.gz"
)

# Функции для вывода
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
    exit 1
}

Write-Log "🚀 Начинаем деплой Studio App (Next.js 14)"
Write-Log "Сервер: $Username@$ServerIP"
Write-Log "Директория: $DeployDir"
Write-Log "Архив: $ArchiveName"

# Проверка наличия архива
if (-not (Test-Path $ArchiveName)) {
    Write-Error "Архив $ArchiveName не найден! Сначала выполните сборку проекта."
}

$archiveSize = (Get-Item $ArchiveName).Length / 1MB
Write-Log "📦 Архив найден: $([math]::Round($archiveSize, 2)) MB"

# Проверка доступности сервера
Write-Log "🔍 Проверка доступности сервера..."
$pingResult = Test-Connection -ComputerName $ServerIP -Count 1 -Quiet
if (-not $pingResult) {
    Write-Warning "Сервер не отвечает на ping. Продолжаем..."
}

# Проверка наличия SSH клиента
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Error "SSH клиент не найден! Установите OpenSSH или используйте WSL."
}

if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Error "SCP не найден! Установите OpenSSH или используйте WSL."
}

try {
    # Загрузка архива на сервер
    Write-Log "📤 Загрузка архива на сервер..."
    & scp $ArchiveName "$Username@$ServerIP:/tmp/"
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка загрузки архива"
    }

    # Создание скрипта для выполнения на сервере
    $remoteScript = @"
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "`${GREEN}[REMOTE] `$1`${NC}"
}

warn() {
    echo -e "`${YELLOW}[REMOTE WARNING] `$1`${NC}"
}

error() {
    echo -e "`${RED}[REMOTE ERROR] `$1`${NC}"
    exit 1
}

DEPLOY_DIR="$DeployDir"
ARCHIVE_NAME="$ArchiveName"

log "🏗️ Подготовка директории деплоя (Next.js 14)..."

# Создание директории если не существует
sudo mkdir -p "`$DEPLOY_DIR"

# Остановка приложения если запущено
log "⏹️ Остановка текущего приложения..."
sudo pkill -f "npm start" || true
sudo systemctl stop studio || true
pm2 stop studio || true

# Бэкап текущей версии
if [ -d "`$DEPLOY_DIR/.next" ]; then
    log "💾 Создание бэкапа текущей версии..."
    sudo mv "`$DEPLOY_DIR" "`$DEPLOY_DIR.backup.nextjs14.`$(date +%Y%m%d_%H%M%S)" || true
    sudo mkdir -p "`$DEPLOY_DIR"
fi

# Распаковка нового архива
log "📦 Распаковка нового архива (Next.js 14)..."
sudo tar -xzf "/tmp/`$ARCHIVE_NAME" -C "`$DEPLOY_DIR"

# Установка зависимостей
log "📚 Установка зависимостей..."
cd "`$DEPLOY_DIR"
sudo npm ci --only=production

# Настройка прав доступа
log "🔐 Настройка прав доступа..."
sudo chown -R www-data:www-data "`$DEPLOY_DIR"
sudo chmod -R 755 "`$DEPLOY_DIR"

# Создание .env файла если не существует
if [ ! -f "`$DEPLOY_DIR/.env" ]; then
    log "⚙️ Создание файла окружения..."
    sudo cp "`$DEPLOY_DIR/.env.example" "`$DEPLOY_DIR/.env" || sudo cp "`$DEPLOY_DIR/.env.local.example" "`$DEPLOY_DIR/.env" || true
    warn "Не забудьте настроить переменные в `$DEPLOY_DIR/.env"
fi

# Запуск приложения
log "🚀 Запуск приложения (Next.js 14)..."

# Попытка запуска через PM2
if command -v pm2 > /dev/null; then
    log "Запуск через PM2..."
    cd "`$DEPLOY_DIR"
    pm2 start npm --name "studio-nextjs14" -- start || warn "Ошибка запуска через PM2"
    pm2 save || true
elif systemctl is-enabled studio > /dev/null 2>&1; then
    log "Запуск через systemd..."
    sudo systemctl start studio || warn "Ошибка запуска через systemd"
else
    log "Запуск в фоновом режиме..."
    cd "`$DEPLOY_DIR"
    nohup npm start > studio-nextjs14.log 2>&1 &
fi

# Очистка временных файлов
log "🧹 Очистка временных файлов..."
rm -f "/tmp/`$ARCHIVE_NAME"

# Удаление старых бэкапов (оставляем только 3 последних)
log "🗑️ Очистка старых бэкапов..."
ls -dt /var/www/studio.backup.* 2>/dev/null | tail -n +4 | sudo xargs rm -rf || true

log "✅ Деплой Next.js 14 завершен успешно!"
log "🌐 Приложение доступно по адресу: http://`$(hostname -I | awk '{print `$1}'):3000"
log "📋 Версия: Next.js 14.2.29 (стабильная)"
"@

    # Выполнение скрипта на сервере
    Write-Log "🔧 Выполнение деплоя на сервере..."
    $remoteScript | & ssh "$Username@$ServerIP" 'bash -s'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Деплой Next.js 14 завершен успешно!"
        Write-Log "🌐 Приложение должно быть доступно по адресу: http://$ServerIP:3000"
        Write-Log "📋 Следующие шаги:"
        Write-Host "   1. Настройте переменные окружения в $DeployDir/.env" -ForegroundColor Cyan
        Write-Host "   2. Проверьте подключение к базе данных" -ForegroundColor Cyan
        Write-Host "   3. Настройте Nginx для проксирования (опционально)" -ForegroundColor Cyan
        Write-Host "   4. Настройте SSL сертификат (рекомендуется)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🔧 Версия: Next.js 14.2.29 (стабильная)" -ForegroundColor Green
        Write-Host "⚠️  Отличия от Next.js 15:" -ForegroundColor Yellow
        Write-Host "   - Стабильная работа с Sequelize" -ForegroundColor Yellow
        Write-Host "   - Нет проблем с clientModules" -ForegroundColor Yellow
        Write-Host "   - Совместимость с Node.js 18+" -ForegroundColor Yellow
    } else {
        throw "Деплой завершился с ошибкой!"
    }
}
catch {
    Write-Error "Ошибка деплоя: $($_.Exception.Message)"
}
