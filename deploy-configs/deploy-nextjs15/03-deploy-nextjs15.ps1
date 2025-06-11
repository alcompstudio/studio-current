# 🚀 Основной скрипт деплоя Studio App (Next.js 15)
# Использование: .\03-deploy-nextjs15.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-nextjs15.tar.gz"
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

Write-Log "🚀 Начинаем деплой Studio App (Next.js 15)"
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
    Write-Error "SSH клиент не найден! Установите OpenSSH."
}

if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Error "SCP не найден! Установите OpenSSH."
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

log "🏗️ Подготовка директории деплоя (Next.js 15)..."

# Создание директории если не существует
sudo mkdir -p "`$DEPLOY_DIR"

# Остановка приложения если запущено
log "⏹️ Остановка текущего приложения..."
sudo pkill -f "npm start" || true
sudo pkill -f "next start" || true
sudo systemctl stop studio || true
pm2 stop studio-nextjs15 || true

# Бэкап текущей версии
if [ -d "`$DEPLOY_DIR/.next" ]; then
    log "💾 Создание бэкапа текущей версии..."
    sudo mv "`$DEPLOY_DIR" "`$DEPLOY_DIR.backup.nextjs15.`$(date +%Y%m%d_%H%M%S)" || true
    sudo mkdir -p "`$DEPLOY_DIR"
fi

# Распаковка нового архива
log "📦 Распаковка нового архива (Next.js 15)..."
sudo tar -xzf "/tmp/`$ARCHIVE_NAME" -C "`$DEPLOY_DIR"

# Установка зависимостей
log "📚 Установка зависимостей..."
cd "`$DEPLOY_DIR"
npm install --omit=dev --ignore-scripts

# Настройка прав доступа
log "🔐 Настройка прав доступа..."
sudo chown -R deployuser:deployuser "`$DEPLOY_DIR"
sudo chmod -R 755 "`$DEPLOY_DIR"

# Создание .env файла
log "⚙️ Настройка переменных окружения..."
if [ ! -f "`$DEPLOY_DIR/.env" ]; then
    tee "`$DEPLOY_DIR/.env" > /dev/null << 'ENV_EOF'
NODE_ENV=production
DATABASE_URL=postgresql://userstudio:userstudio@localhost:5432/userstudio
NEXTAUTH_URL=http://$ServerIP:3000
NEXTAUTH_SECRET=your-secret-key-here
ENV_EOF
    log "✅ Файл .env создан с настройками по умолчанию"
else
    log "✅ Файл .env уже существует"
fi

# Запуск миграций базы данных
log "🗃️ Запуск миграций базы данных..."
cd "`$DEPLOY_DIR"
if [ -f "src/lib/migrate.ts" ]; then
    npx tsx src/lib/migrate.ts || warn "Ошибка выполнения миграций"
else
    warn "Файл миграций не найден"
fi

# Запуск приложения через PM2
log "🚀 Запуск приложения (Next.js 15)..."
cd "`$DEPLOY_DIR"
pm2 start npm --name "studio-nextjs15" -- start || error "Ошибка запуска приложения"
pm2 save || true

# Очистка временных файлов
log "🧹 Очистка временных файлов..."
rm -f "/tmp/`$ARCHIVE_NAME"

# Удаление старых бэкапов (оставляем только 3 последних)
log "🗑️ Очистка старых бэкапов..."
ls -dt /var/www/studio.backup.* 2>/dev/null | tail -n +4 | sudo xargs rm -rf || true

log "✅ Деплой Next.js 15 завершен успешно!"
log "🌐 Приложение доступно по адресу: http://`$(hostname -I | awk '{print `$1}'):3000"
log "📋 Версия: Next.js 15.2.3"
"@

    # Выполнение скрипта на сервере
    Write-Log "🔧 Выполнение деплоя на сервере..."
    $remoteScript | & ssh "$Username@$ServerIP" 'bash -s'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Деплой Next.js 15 завершен успешно!"
        Write-Log "🌐 Приложение должно быть доступно по адресу: http://$ServerIP:3000"
        Write-Log "📋 Следующие шаги:"
        Write-Host "   1. Проверьте работу приложения в браузере" -ForegroundColor Cyan
        Write-Host "   2. Проверьте подключение к базе данных" -ForegroundColor Cyan
        Write-Host "   3. Настройте Nginx для проксирования (опционально)" -ForegroundColor Cyan
        Write-Host "   4. Настройте SSL сертификат (рекомендуется)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🔧 Версия: Next.js 15.2.3" -ForegroundColor Green
        Write-Host "✨ Новые возможности Next.js 15:" -ForegroundColor Yellow
        Write-Host "   - Улучшенная производительность" -ForegroundColor Yellow
        Write-Host "   - Новые возможности React 19" -ForegroundColor Yellow
        Write-Host "   - Оптимизированная сборка" -ForegroundColor Yellow
    } else {
        throw "Деплой завершился с ошибкой!"
    }
}
catch {
    Write-Error "Ошибка деплоя: $($_.Exception.Message)"
}
