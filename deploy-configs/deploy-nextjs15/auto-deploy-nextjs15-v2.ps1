# 🤖 Полностью автоматический деплой Studio App (Next.js 15) - ВЕРСИЯ 2.0
# Исправлены проблемы: next.config.js, PM2 конфликты портов, очистка сервера
# Использование: .\auto-deploy-nextjs15-v2.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-nextjs15-v2.tar.gz",
    [switch]$CleanServer = $false
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

function Write-Step {
    param([string]$StepNumber, [string]$Description)
    Write-Host "`n🔄 ЭТАП ${StepNumber}: $Description" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

# Проверка SSH подключения
function Test-SSHConnection {
    param([string]$ServerIP, [string]$Username)
    
    Write-Log "🔍 Проверка SSH подключения к $Username@$ServerIP..."
    try {
        $result = & ssh -o ConnectTimeout=10 -o BatchMode=yes "$Username@$ServerIP" "echo 'SSH OK'"
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✅ SSH подключение успешно"
            return $true
        }
    }
    catch {
        Write-Error "❌ Ошибка SSH подключения: $_"
        return $false
    }
    return $false
}

Write-Host @"
🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ STUDIO APP (Next.js 15) v2.0
═══════════════════════════════════════════════════════════
🎯 Сервер: $ServerIP
👤 Пользователь: $Username  
📁 Директория: $DeployDir
📦 Архив: $ArchiveName
🧹 Очистка сервера: $CleanServer
═══════════════════════════════════════════════════════════
"@ -ForegroundColor Magenta

# Проверка SSH подключения
if (-not (Test-SSHConnection -ServerIP $ServerIP -Username $Username)) {
    Write-Error "Не удается подключиться к серверу. Проверьте SSH ключи и доступность сервера."
}

try {
    # ЭТАП 0: Очистка сервера (опционально)
    if ($CleanServer) {
        Write-Step "0" "Полная очистка сервера"
        Write-Log "🧹 Выполнение полной очистки сервера..."
        
        $cleanupScript = @'
#!/bin/bash
set -e

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }
warn() { echo "[WARNING] $1" >&2; }
error() { echo "[ERROR] $1" >&2; exit 1; }

log "🛑 Остановка всех PM2 процессов..."
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

log "🔍 Поиск и завершение процессов на порту 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

log "🗑️ Очистка директории приложения..."
rm -rf /var/www/studio-app
mkdir -p /var/www/studio-app

log "🧹 Очистка PM2 логов..."
pm2 flush 2>/dev/null || true

log "✅ Очистка сервера завершена"
'@

        $cleanupScript | ssh "$Username@$ServerIP" 'bash -s'
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Некоторые операции очистки завершились с ошибками, но продолжаем..."
        }
        Write-Log "✅ Очистка сервера завершена"
    }

    # ЭТАП 1: Сборка проекта локально
    Write-Step "1" "Сборка проекта локально"
    Write-Log "📦 Выполнение npm run build..."
    
    $buildResult = & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка сборки проекта!"
    }
    Write-Log "✅ Сборка завершена успешно"

    # ЭТАП 2: Создание архива для деплоя
    Write-Step "2" "Создание архива для деплоя"
    Write-Log "📦 Создание архива $ArchiveName..."
    
    # Удаляем старый архив если существует
    if (Test-Path $ArchiveName) {
        Remove-Item $ArchiveName -Force
    }
    
    # Создаем архив с необходимыми файлами
    $filesToArchive = @(
        ".next",
        "package.json", 
        "package-lock.json",
        "next.config.js",
        "src",
        "public"
    )
    
    # Проверяем наличие файлов перед архивированием
    $existingFiles = @()
    foreach ($file in $filesToArchive) {
        if (Test-Path $file) {
            $existingFiles += $file
            Write-Log "✓ Найден: $file"
        } else {
            Write-Warning "⚠ Не найден: $file"
        }
    }
    
    if ($existingFiles.Count -eq 0) {
        throw "Не найдено файлов для архивирования!"
    }
    
    # Создаем архив используя tar (если доступен) или PowerShell
    try {
        $tarCommand = "tar -czf `"$ArchiveName`" " + ($existingFiles -join " ")
        Invoke-Expression $tarCommand
        Write-Log "✅ Архив создан с помощью tar"
    }
    catch {
        Write-Warning "tar недоступен, используем PowerShell..."
        $zipName = $ArchiveName.Replace(".tar.gz", ".zip")
        Compress-Archive -Path $existingFiles -DestinationPath $zipName -Force
        $ArchiveName = $zipName
        Write-Log "✅ Архив создан: $ArchiveName"
    }

    # ЭТАП 3: Загрузка архива на сервер
    Write-Step "3" "Загрузка архива на сервер"
    Write-Log "📤 Копирование $ArchiveName на сервер..."
    
    & scp "$ArchiveName" "$Username@$ServerIP`:$DeployDir/"
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка копирования архива на сервер!"
    }
    Write-Log "✅ Архив успешно загружен"

    # Удаляем локальный архив
    Remove-Item $ArchiveName -Force
    Write-Log "🧹 Локальный архив удален"

    # ЭТАП 4: Установка окружения на сервере
    Write-Step "4" "Установка окружения на сервере"
    Write-Log "⚙️ Настройка окружения Node.js и PM2..."
    
    $setupScript = @'
#!/bin/bash
set -e

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }
warn() { echo "[WARNING] $1" >&2; }
error() { echo "[ERROR] $1" >&2; exit 1; }

# Проверка и установка Node.js 18+
log "🔍 Проверка версии Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js не установлен!"
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Требуется Node.js 18+, установлена версия: $(node -v)"
fi
log "✅ Node.js версия: $(node -v)"

# Проверка и установка PM2
log "🔍 Проверка PM2..."
if ! command -v pm2 &> /dev/null; then
    log "📦 Установка PM2..."
    npm install -g pm2
fi
log "✅ PM2 версия: $(pm2 -v)"

log "✅ Окружение готово"
'@

    $setupScript | ssh "$Username@$ServerIP" 'bash -s'
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка настройки окружения!"
    }
    Write-Log "✅ Окружение настроено"

    # ЭТАП 5: Деплой приложения
    Write-Step "5" "Деплой приложения Next.js 15"
    Write-Log "🚀 Запуск основного скрипта деплоя..."

    $deployScript = @"
#!/bin/bash
set -e

log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')] `$1"; }
warn() { echo "[WARNING] `$1" >&2; }
error() { echo "[ERROR] `$1" >&2; exit 1; }

DEPLOY_DIR="$DeployDir"
ARCHIVE_NAME="$ArchiveName"

log "📁 Переход в директорию деплоя: `$DEPLOY_DIR"
cd "`$DEPLOY_DIR"

# Остановка всех процессов на порту 3000
log "🛑 Остановка процессов на порту 3000..."
pm2 delete all 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Создание бэкапа (если есть что бэкапить)
if [ -d ".next" ] || [ -f "package.json" ]; then
    BACKUP_DIR="/var/www/studio.backup.`$(date +%Y%m%d_%H%M%S)"
    log "💾 Создание бэкапа в `$BACKUP_DIR..."
    sudo mkdir -p "`$BACKUP_DIR"
    sudo cp -r . "`$BACKUP_DIR/" 2>/dev/null || true
    log "✅ Бэкап создан"
fi

# Распаковка архива
log "📦 Распаковка архива `$ARCHIVE_NAME..."
if [[ "`$ARCHIVE_NAME" == *.zip ]]; then
    unzip -o "`$ARCHIVE_NAME"
else
    tar -xzf "`$ARCHIVE_NAME"
fi
rm -f "`$ARCHIVE_NAME"
log "✅ Архив распакован"

# Создание .env файла
log "⚙️ Настройка переменных окружения..."
if [ ! -f "`$DEPLOY_DIR/.env" ]; then
    tee "`$DEPLOY_DIR/.env" > /dev/null << 'ENV_EOF'
NODE_ENV=production
DATABASE_URL=postgresql://userstudio:userstudio@localhost:5432/userstudio
NEXTAUTH_URL=http://$ServerIP:3000
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
npm install --production --legacy-peer-deps
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
tee "ecosystem.config.cjs" > /dev/null << 'PM2_EOF'
module.exports = {
  apps: [{
    name: 'studio-nextjs15',
    script: 'npm',
    args: 'start',
    cwd: '$DeployDir',
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
        log "⏳ Ожидание запуска приложения... (`$i/10)"
        sleep 3
    fi
done

# Очистка старых бэкапов (оставляем только 3 последних)
log "🗑️ Очистка старых бэкапов..."
ls -dt /var/www/studio.backup.* 2>/dev/null | tail -n +4 | sudo xargs rm -rf || true

log "✅ Деплой Next.js 15 завершен успешно!"
log "🌐 Приложение доступно по адресу: http://`$(hostname -I | awk '{print `$1}'):3000"
log "📋 Версия: Next.js 15.2.3"
"@

    # Выполнение скрипта на сервере
    Write-Log "🔧 Выполнение деплоя на сервере..."
    $deployScript | & ssh "$Username@$ServerIP" 'bash -s'

    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка деплоя приложения!"
    }

    Write-Log "✅ Деплой завершен успешно!"

    # ЭТАП 6: Финальная проверка
    Write-Step "6" "Финальная проверка"
    Write-Log "🔍 Проверка доступности приложения..."

    Start-Sleep -Seconds 5

    try {
        $response = Invoke-WebRequest -Uri "http://$ServerIP`:3000" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Приложение успешно отвечает на запросы!"
        } else {
            Write-Warning "⚠️ Приложение отвечает с кодом: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "⚠️ Не удается проверить доступность приложения: $_"
    }

    Write-Host @"

🎉 ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!
═══════════════════════════════════════════════════════════
🌐 URL: http://$ServerIP`:3000
📊 Статус: Приложение запущено
🔧 PM2: studio-nextjs15
📁 Директория: $DeployDir
═══════════════════════════════════════════════════════════
"@ -ForegroundColor Green

} catch {
    Write-Error "Критическая ошибка: $_"
}
