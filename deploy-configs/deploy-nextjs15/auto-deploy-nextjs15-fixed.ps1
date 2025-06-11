# 🤖 Полностью автоматический деплой Studio App (Next.js 15) - ИСПРАВЛЕННАЯ ВЕРСИЯ
# Использование: .\auto-deploy-nextjs15-fixed.ps1 -ServerIP "157.180.87.32" -Username "deployuser"
# Версия: 2.0 - Исправлены проблемы с next.config.js, PM2 и портами

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-nextjs15-v2.tar.gz"
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
    param([string]$Step, [string]$Message)
    Write-Host ""
    Write-Host "=" * 80 -ForegroundColor Cyan
    Write-Host "ЭТАП ${Step}: $Message" -ForegroundColor Cyan
    Write-Host "=" * 80 -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🤖 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ STUDIO APP (NEXT.JS 15)" -ForegroundColor Magenta
Write-Host "=" * 80 -ForegroundColor Magenta
Write-Log "Сервер: $Username@$ServerIP"
Write-Log "Директория: $DeployDir"
Write-Log "Архив: $ArchiveName"
Write-Host ""

try {
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
        "src"
    )
    
    # Проверяем существование файлов и создаем архив
    $existingFiles = @()
    foreach ($file in $filesToArchive) {
        if (Test-Path $file) {
            $existingFiles += $file
        } else {
            Write-Warning "Файл/папка не найдена: $file"
        }
    }
    
    if ($existingFiles.Count -eq 0) {
        throw "Не найдено файлов для архивирования!"
    }
    
    # Используем tar для создания архива (доступен в Windows 10+)
    & tar -czf $ArchiveName $existingFiles
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка создания архива!"
    }
    
    $archiveSize = (Get-Item $ArchiveName).Length / 1MB
    Write-Log "✅ Архив создан: $([math]::Round($archiveSize, 2)) MB"

    # ЭТАП 3: Полная очистка сервера
    Write-Step "3" "Полная очистка сервера"
    Write-Log "🧹 Запуск скрипта очистки сервера..."
    
    & ".\deploy-configs\deploy-nextjs15\01-server-cleanup.ps1" -ServerIP $ServerIP -Username $Username
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка очистки сервера!"
    }
    Write-Log "✅ Очистка сервера завершена"

    # ЭТАП 4: Установка окружения Next.js 15
    Write-Step "4" "Установка окружения Next.js 15"
    Write-Log "🔧 Запуск скрипта установки окружения..."
    
    & ".\deploy-configs\deploy-nextjs15\02-setup-environment.ps1" -ServerIP $ServerIP -Username $Username
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка установки окружения!"
    }
    Write-Log "✅ Установка окружения завершена"

    # ЭТАП 5: Деплой приложения
    Write-Step "5" "Деплой приложения Next.js 15"
    Write-Log "🚀 Запуск основного скрипта деплоя..."
    
    & ".\deploy-configs\deploy-nextjs15\03-deploy-nextjs15.ps1" -ServerIP $ServerIP -Username $Username -DeployDir $DeployDir -ArchiveName $ArchiveName
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка деплоя приложения!"
    }
    Write-Log "✅ Деплой приложения завершен"

    # ЭТАП 6: Проверка работы приложения
    Write-Step "6" "Проверка работы приложения"
    Write-Log "🔍 Проверка доступности приложения..."
    
    Start-Sleep -Seconds 10  # Ждем запуска приложения
    
    try {
        $response = Invoke-WebRequest -Uri "http://$ServerIP:3000" -TimeoutSec 30 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Приложение успешно отвечает на запросы"
        } else {
            Write-Warning "Приложение отвечает с кодом: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "Не удалось проверить доступность приложения: $($_.Exception.Message)"
        Write-Warning "Проверьте вручную: http://$ServerIP:3000"
    }

    # ЭТАП 7: Очистка локальных временных файлов
    Write-Step "7" "Очистка временных файлов"
    Write-Log "🧹 Удаление локального архива..."
    
    if (Test-Path $ArchiveName) {
        Remove-Item $ArchiveName -Force
        Write-Log "✅ Локальный архив удален"
    }

    # ФИНАЛЬНЫЙ ОТЧЕТ
    Write-Host ""
    Write-Host "🎉 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!" -ForegroundColor Green
    Write-Host "=" * 80 -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 РЕЗУЛЬТАТЫ ДЕПЛОЯ:" -ForegroundColor Cyan
    Write-Host "   🌐 URL приложения: http://$ServerIP:3000" -ForegroundColor White
    Write-Host "   🔧 Версия Next.js: 15.2.3" -ForegroundColor White
    Write-Host "   🐘 База данных: PostgreSQL (userstudio/userstudio)" -ForegroundColor White
    Write-Host "   📁 Директория: $DeployDir" -ForegroundColor White
    Write-Host "   🔄 Процесс-менеджер: PM2 (studio-nextjs15)" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Yellow
    Write-Host "   1. Откройте http://$ServerIP:3000 в браузере" -ForegroundColor White
    Write-Host "   2. Проверьте функциональность приложения" -ForegroundColor White
    Write-Host "   3. Настройте Nginx для проксирования (опционально)" -ForegroundColor White
    Write-Host "   4. Настройте SSL сертификат (рекомендуется)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 УПРАВЛЕНИЕ ПРИЛОЖЕНИЕМ:" -ForegroundColor Cyan
    Write-Host "   Просмотр логов: ssh $Username@$ServerIP 'pm2 logs studio-nextjs15'" -ForegroundColor White
    Write-Host "   Перезапуск: ssh $Username@$ServerIP 'pm2 restart studio-nextjs15'" -ForegroundColor White
    Write-Host "   Остановка: ssh $Username@$ServerIP 'pm2 stop studio-nextjs15'" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "❌ ОШИБКА АВТОМАТИЧЕСКОГО ДЕПЛОЯ!" -ForegroundColor Red
    Write-Host "=" * 80 -ForegroundColor Red
    Write-Error "Деплой прерван: $($_.Exception.Message)"
}
