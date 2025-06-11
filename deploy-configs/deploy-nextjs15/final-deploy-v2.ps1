# 🤖 Финальный автоматический деплой Studio App (Next.js 15) - ВЕРСИЯ 2.0
# Исправлены проблемы: next.config.js, PM2 конфликты портов, очистка сервера
# Использование: .\final-deploy-v2.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-final-v2.tar.gz",
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
🚀 ФИНАЛЬНЫЙ АВТОМАТИЧЕСКИЙ ДЕПЛОЙ STUDIO APP (Next.js 15) v2.0
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
        & ssh "$Username@$ServerIP" "pm2 delete all 2>/dev/null || true"
        & ssh "$Username@$ServerIP" "pm2 kill 2>/dev/null || true"
        
        # Завершение процессов на порту 3000
        & ssh "$Username@$ServerIP" "lsof -ti:3000 | xargs kill -9 2>/dev/null || true"
        
        # Очистка директории
        & ssh "$Username@$ServerIP" "rm -rf $DeployDir"
        & ssh "$Username@$ServerIP" "mkdir -p $DeployDir"
        
        # Очистка PM2 логов
        & ssh "$Username@$ServerIP" "pm2 flush 2>/dev/null || true"
        
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

    # ЭТАП 4: Загрузка скрипта деплоя на сервер
    Write-Step "4" "Загрузка скрипта деплоя на сервер"
    Write-Log "📤 Копирование скрипта деплоя на сервер..."
    
    & scp "deploy-configs/deploy-nextjs15/deploy-script.sh" "$Username@$ServerIP`:$DeployDir/"
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка копирования скрипта деплоя на сервер!"
    }
    Write-Log "✅ Скрипт деплоя загружен"

    # ЭТАП 5: Выполнение деплоя на сервере
    Write-Step "5" "Выполнение деплоя на сервере"
    Write-Log "🚀 Запуск скрипта деплоя на сервере..."
    
    & ssh "$Username@$ServerIP" "cd $DeployDir `&`& chmod +x deploy-script.sh `&`& ./deploy-script.sh $ArchiveName $ServerIP"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка выполнения деплоя на сервере!"
    }
    
    Write-Log "✅ Деплой завершен успешно!"

    # Удаляем локальный архив
    Remove-Item $ArchiveName -Force
    Write-Log "🧹 Локальный архив удален"
    
    # ЭТАП 6: Финальная проверка
    Write-Step "6" "Финальная проверка"
    Write-Log "🔍 Проверка доступности приложения..."
    
    Start-Sleep -Seconds 10
    
    try {
        $response = Invoke-WebRequest -Uri "http://$ServerIP`:3000" -TimeoutSec 15 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Приложение успешно отвечает на запросы!"
        } else {
            Write-Warning "⚠️ Приложение отвечает с кодом: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "⚠️ Не удается проверить доступность приложения: $_"
        Write-Log "🔍 Проверяем статус PM2 на сервере..."
        & ssh "$Username@$ServerIP" "pm2 status"
    }
    
    Write-Host @"

🎉 ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!
═══════════════════════════════════════════════════════════
🌐 URL: http://$ServerIP`:3000
📊 Статус: Приложение запущено
🔧 PM2: studio-nextjs15
📁 Директория: $DeployDir
🛠️ Логи PM2: ssh $Username@$ServerIP "pm2 logs studio-nextjs15"
═══════════════════════════════════════════════════════════
"@ -ForegroundColor Green

} catch {
    Write-Error "Критическая ошибка: $_"
}
