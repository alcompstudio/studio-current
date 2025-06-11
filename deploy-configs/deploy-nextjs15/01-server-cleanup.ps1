# 🧹 Скрипт полной очистки удаленного сервера (Next.js 15)
# Использование: .\01-server-cleanup.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser"
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

Write-Log "🧹 Начинаем полную очистку сервера для Next.js 15"
Write-Log "Сервер: $Username@$ServerIP"

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

try {
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

log "🧹 Начинаем полную очистку сервера..."

# Остановка всех процессов приложения
log "⏹️ Остановка всех процессов приложения..."
sudo pkill -f "npm start" || true
sudo pkill -f "next start" || true
sudo pkill -f "node" || true
sudo systemctl stop studio || true
sudo systemctl stop nginx || true

# Остановка PM2 процессов
if command -v pm2 > /dev/null; then
    log "⏹️ Остановка PM2 процессов..."
    pm2 stop all || true
    pm2 delete all || true
    pm2 kill || true
fi

# Удаление старых директорий приложения
log "🗑️ Удаление старых директорий приложения..."
sudo rm -rf /var/www/studio* || true
sudo rm -rf /var/www/nextn* || true
sudo rm -rf /opt/studio* || true
sudo rm -rf /home/*/studio* || true

# Очистка временных файлов
log "🧹 Очистка временных файлов..."
sudo rm -rf /tmp/studio* || true
sudo rm -rf /tmp/nextn* || true
sudo rm -rf /tmp/*.tar.gz || true

# Удаление старых логов
log "📝 Очистка логов..."
sudo rm -rf /var/log/studio* || true
sudo rm -rf /var/log/nextn* || true

# Очистка systemd сервисов
log "🔧 Удаление старых systemd сервисов..."
sudo systemctl disable studio || true
sudo rm -f /etc/systemd/system/studio.service || true
sudo systemctl daemon-reload

# Очистка nginx конфигураций
log "🌐 Очистка nginx конфигураций..."
sudo rm -f /etc/nginx/sites-available/studio* || true
sudo rm -f /etc/nginx/sites-enabled/studio* || true

# Проверка и очистка портов
log "🔌 Проверка занятых портов..."
netstat -tlnp | grep :3000 || true
sudo fuser -k 3000/tcp || true

log "✅ Полная очистка сервера завершена!"
log "🔄 Сервер готов к новой установке Next.js 15"
"@

    # Выполнение скрипта на сервере
    Write-Log "🔧 Выполнение очистки на сервере..."
    $remoteScript | & ssh "$Username@$ServerIP" 'bash -s'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Полная очистка сервера завершена успешно!"
        Write-Log "🔄 Сервер готов к установке Next.js 15"
    } else {
        throw "Очистка завершилась с ошибкой!"
    }
}
catch {
    Write-Error "Ошибка очистки: $($_.Exception.Message)"
}
