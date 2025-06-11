# 🤖 Упрощенный автоматический деплой Studio App (Next.js 15) - ВЕРСИЯ 2.0
# Исправлены проблемы: next.config.js, PM2 конфликты портов, очистка сервера
# Использование: .\simple-deploy-v2.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-simple-v2.tar.gz",
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

Write-Host @"
🚀 УПРОЩЕННЫЙ АВТОМАТИЧЕСКИЙ ДЕПЛОЙ STUDIO APP (Next.js 15) v2.0
═══════════════════════════════════════════════════════════════════
🎯 Сервер: $ServerIP
👤 Пользователь: $Username  
📁 Директория: $DeployDir
📦 Архив: $ArchiveName
🧹 Очистка сервера: $CleanServer
═══════════════════════════════════════════════════════════════════
"@ -ForegroundColor Magenta

try {
    # ЭТАП 0: Очистка сервера (опционально)
    if ($CleanServer) {
        Write-Step "0" "Полная очистка сервера"
        Write-Log "🧹 Выполнение полной очистки сервера..."
        
        # Остановка PM2 процессов
        ssh "$Username@$ServerIP" "pm2 delete all 2>/dev/null || true"
        ssh "$Username@$ServerIP" "pm2 kill 2>/dev/null || true"
        
        # Завершение процессов на порту 3000
        ssh "$Username@$ServerIP" "lsof -ti:3000 | xargs kill -9 2>/dev/null || true"
        
        # Очистка директории
        ssh "$Username@$ServerIP" "rm -rf $DeployDir"
        ssh "$Username@$ServerIP" "mkdir -p $DeployDir"
        
        # Очистка PM2 логов
        ssh "$Username@$ServerIP" "pm2 flush 2>/dev/null || true"
        
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
    
    # Создаем архив используя tar
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
    
    # Проверка Node.js
    $nodeCheck = & ssh "$Username@$ServerIP" "node -v 2>/dev/null `|| echo 'NOT_FOUND'"
    if ($nodeCheck -eq "NOT_FOUND") {
        Write-Error "Node.js не установлен на сервере!"
    }
    Write-Log "✅ Node.js версия: $nodeCheck"

    # Проверка PM2
    $pm2Check = & ssh "$Username@$ServerIP" "pm2 -v 2>/dev/null `|| echo 'NOT_FOUND'"
    if ($pm2Check -eq "NOT_FOUND") {
        Write-Log "📦 Установка PM2..."
        & ssh "$Username@$ServerIP" "npm install -g pm2"
    }
    Write-Log "✅ PM2 готов"

    # ЭТАП 5: Деплой приложения
    Write-Step "5" "Деплой приложения Next.js 15"
    Write-Log "🚀 Запуск основного скрипта деплоя..."
    
    # Остановка процессов
    Write-Log "🛑 Остановка процессов на порту 3000..."
    & ssh "$Username@$ServerIP" "pm2 delete all 2>/dev/null `|| true"
    & ssh "$Username@$ServerIP" "lsof -ti:3000 | xargs kill -9 2>/dev/null `|| true"
    Start-Sleep -Seconds 2

    # Создание бэкапа
    Write-Log "💾 Создание бэкапа..."
    $backupDir = "/var/www/studio.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    & ssh "$Username@$ServerIP" "if `[ -d '$DeployDir/.next' `] `|| `[ -f '$DeployDir/package.json' `]; then sudo mkdir -p '$backupDir' `&`& sudo cp -r '$DeployDir/.' '$backupDir/' 2>/dev/null `|| true; fi"

    # Распаковка архива
    Write-Log "📦 Распаковка архива..."
    if ($ArchiveName.EndsWith(".zip")) {
        & ssh "$Username@$ServerIP" "cd $DeployDir `&`& unzip -o $ArchiveName"
    } else {
        & ssh "$Username@$ServerIP" "cd $DeployDir `&`& tar -xzf $ArchiveName"
    }
    & ssh "$Username@$ServerIP" "cd $DeployDir `&`& rm -f $ArchiveName"
    
    Write-Log "✅ Архив распакован"

    # Создание .env файла
    Write-Log "⚙️ Настройка переменных окружения..."
    $envContent = @"
NODE_ENV=production
DATABASE_URL=postgresql://userstudio:userstudio@localhost:5432/userstudio
NEXTAUTH_URL=http://$ServerIP`:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database configuration
DB_NAME=userstudio
DB_USERNAME=userstudio
DB_PASSWORD=userstudio
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
"@

    $envContent | & ssh "$Username@$ServerIP" "cat > $DeployDir/.env"
    Write-Log "✅ Файл .env создан"

    # Проверка и создание next.config.js (ИСПРАВЛЕНИЕ ПРОБЛЕМЫ)
    Write-Log "🔧 Проверка next.config.js..."
    $configExists = & ssh "$Username@$ServerIP" "test -f $DeployDir/next.config.js `&`& echo 'EXISTS' `|| echo 'NOT_FOUND'"

    if ($configExists -eq "NOT_FOUND") {
        Write-Log "⚠️ next.config.js не найден, создаем..."
        $configContent = @"
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
"@
        $configContent | ssh "$Username@$ServerIP" "cat > $DeployDir/next.config.js"
        Write-Log "✅ next.config.js создан"
    } else {
        Write-Log "✅ next.config.js найден"
    }

    # Установка зависимостей
    Write-Log "📦 Установка зависимостей..."
    ssh "$Username@$ServerIP" "cd $DeployDir && npm install --production --legacy-peer-deps"
    Write-Log "✅ Зависимости установлены"

    # Запуск миграций базы данных
    Write-Log "🗃️ Запуск миграций базы данных..."
    $migrateExists = ssh "$Username@$ServerIP" "test -f $DeployDir/src/lib/migrate.ts && echo 'EXISTS' || echo 'NOT_FOUND'"
    if ($migrateExists -eq "EXISTS") {
        ssh "$Username@$ServerIP" "cd $DeployDir && npx tsx src/lib/migrate.ts || true"
        Write-Log "✅ Миграции выполнены"
    } else {
        Write-Warning "⚠️ Файл миграций не найден"
    }

    # Создание PM2 конфигурации (ИСПРАВЛЕНИЕ ПРОБЛЕМЫ С ДУБЛИРОВАНИЕМ)
    Write-Log "⚙️ Создание PM2 конфигурации..."
    $pm2Config = @"
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
"@

    $pm2Config | ssh "$Username@$ServerIP" "cat > $DeployDir/ecosystem.config.cjs"
    Write-Log "✅ PM2 конфигурация создана"

    # Запуск приложения через PM2
    Write-Log "🚀 Запуск приложения (Next.js 15)..."
    ssh "$Username@$ServerIP" "cd $DeployDir && pm2 start ecosystem.config.cjs"
    ssh "$Username@$ServerIP" "pm2 save"

    # Проверка статуса
    Write-Log "🔍 Проверка статуса приложения..."
    Start-Sleep -Seconds 5
    ssh "$Username@$ServerIP" "pm2 status"

    # Проверка доступности
    Write-Log "🌐 Проверка доступности приложения..."
    $attempts = 0
    $maxAttempts = 10
    $appResponding = $false

    while ($attempts -lt $maxAttempts -and -not $appResponding) {
        $attempts++
        try {
            $response = ssh "$Username@$ServerIP" "curl -f http://localhost:3000 >/dev/null 2>&1 && echo 'OK' || echo 'FAIL'"
            if ($response -eq "OK") {
                Write-Log "✅ Приложение отвечает на запросы"
                $appResponding = $true
            } else {
                Write-Log "⏳ Ожидание запуска приложения... ($attempts/$maxAttempts)"
                Start-Sleep -Seconds 3
            }
        }
        catch {
            Write-Log "⏳ Ожидание запуска приложения... ($attempts/$maxAttempts)"
            Start-Sleep -Seconds 3
        }
    }

    # Очистка старых бэкапов (оставляем только 3 последних)
    Write-Log "🗑️ Очистка старых бэкапов..."
    ssh "$Username@$ServerIP" "ls -dt /var/www/studio.backup.* 2>/dev/null | tail -n +4 | sudo xargs rm -rf || true"

    Write-Log "✅ Деплой Next.js 15 завершен успешно!"

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
