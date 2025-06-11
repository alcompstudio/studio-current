# 🔧 Скрипт установки окружения Next.js 15
# Использование: .\02-setup-environment.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$NodeVersion = "22.15.0",
    [string]$NextVersion = "15.2.3"
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

Write-Log "🔧 Установка окружения Next.js 15 на сервере"
Write-Log "Сервер: $Username@$ServerIP"
Write-Log "Node.js: v$NodeVersion"
Write-Log "Next.js: v$NextVersion"

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

NODE_VERSION="$NodeVersion"
NEXT_VERSION="$NextVersion"

log "🔧 Начинаем установку окружения Next.js 15..."

# Обновление системы
log "📦 Обновление системы..."
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
log "📚 Установка необходимых пакетов..."
sudo apt install -y curl wget git build-essential

# Удаление старых версий Node.js
log "🗑️ Удаление старых версий Node.js..."
sudo apt remove -y nodejs npm || true
sudo rm -rf /usr/local/bin/node || true
sudo rm -rf /usr/local/bin/npm || true

# Установка Node.js через NodeSource
log "📥 Установка Node.js v`$NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версий
log "✅ Проверка установленных версий..."
NODE_INSTALLED=`$(node --version)
NPM_INSTALLED=`$(npm --version)

log "Node.js: `$NODE_INSTALLED"
log "npm: `$NPM_INSTALLED"

# Проверка соответствия версий
if [[ "`$NODE_INSTALLED" != "v`$NODE_VERSION" ]]; then
    warn "Версия Node.js не соответствует требуемой: `$NODE_INSTALLED != v`$NODE_VERSION"
fi

# Установка PM2 глобально
log "🔄 Установка PM2..."
sudo npm install -g pm2

# Установка PostgreSQL если не установлен
if ! command -v psql > /dev/null; then
    log "🐘 Установка PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
else
    log "✅ PostgreSQL уже установлен"
fi

# Создание пользователя и базы данных PostgreSQL
log "🔐 Настройка PostgreSQL..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS userstudio;" || true
sudo -u postgres psql -c "DROP USER IF EXISTS userstudio;" || true
sudo -u postgres psql -c "CREATE USER userstudio WITH PASSWORD 'userstudio';"
sudo -u postgres psql -c "CREATE DATABASE userstudio OWNER userstudio;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE userstudio TO userstudio;"

# Создание директории для приложения
log "📁 Создание директории приложения..."
sudo mkdir -p /var/www/studio-app
sudo chown -R `$USER:`$USER /var/www/studio-app

# Настройка брандмауэра
log "🔥 Настройка брандмауэра..."
sudo ufw allow ssh || true
sudo ufw allow 3000/tcp || true
sudo ufw --force enable || true

log "✅ Установка окружения завершена!"
log "📋 Установленные версии:"
log "   - Node.js: `$(node --version)"
log "   - npm: `$(npm --version)"
log "   - PM2: `$(pm2 --version)"
log "   - PostgreSQL: `$(psql --version | head -n1)"
log "🔄 Сервер готов для деплоя Next.js 15"
"@

    # Выполнение скрипта на сервере
    Write-Log "🔧 Выполнение установки на сервере..."
    $remoteScript | & ssh "$Username@$ServerIP" 'bash -s'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Установка окружения завершена успешно!"
        Write-Log "🔄 Сервер готов для деплоя Next.js 15"
        
        # Проверка версий на сервере
        Write-Log "📋 Проверка установленных версий на сервере:"
        & ssh "$Username@$ServerIP" 'node --version; npm --version; pm2 --version'
    } else {
        throw "Установка завершилась с ошибкой!"
    }
}
catch {
    Write-Error "Ошибка установки: $($_.Exception.Message)"
}
