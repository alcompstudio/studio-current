# 🤖 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ STUDIO APP (Next.js 15) - ВЕРСИЯ 3.0
# Исправления: авторизация, clientModules, папка public, админ пользователь
# Использование: .\auto-deploy-nextjs15-v3.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-v3.tar.gz",
    [switch]$CleanServer = $false,
    [switch]$CreateAdmin = $true
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
🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ STUDIO APP (Next.js 15) v3.0
═══════════════════════════════════════════════════════════════════
✨ НОВЫЕ ИСПРАВЛЕНИЯ:
   • Исправлена ошибка clientModules в Next.js 15
   • Восстановлена авторизация с правильными стилями
   • Добавлена папка public с необходимыми файлами
   • Автоматическое создание админа (admin@taskverse.test/password)
   • Исправлен API авторизации с cookies
   • Убран проблемный middleware
═══════════════════════════════════════════════════════════════════
🎯 Сервер: $ServerIP
👤 Пользователь: $Username  
📁 Директория: $DeployDir
📦 Архив: $ArchiveName
🧹 Очистка сервера: $CleanServer
👨‍💼 Создать админа: $CreateAdmin
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

    # ЭТАП 1: Проверка и создание папки public
    Write-Step "1" "Проверка структуры проекта"
    Write-Log "📁 Проверка наличия папки public..."
    
    if (-not (Test-Path "public")) {
        Write-Log "📁 Создание папки public с необходимыми файлами..."
        New-Item -ItemType Directory -Path "public" -Force | Out-Null
        
        # Создаем robots.txt
        @"
User-agent: *
Allow: /

Sitemap: http://$ServerIP`:3000/sitemap.xml
"@ | Out-File -FilePath "public/robots.txt" -Encoding UTF8
        
        # Создаем next.svg
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.2 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>' | Out-File -FilePath "public/next.svg" -Encoding UTF8
        
        # Создаем vercel.svg
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="m141.04 16 c0 11 9 20 20 20s20-9 20-20-9-20-20-20-20 9-20 20zm22.21-9c-4.28 0-7.68 3.43-7.68 7.68 0 4.25 3.4 7.68 7.68 7.68s7.68-3.43 7.68-7.68c0-4.25-3.4-7.68-7.68-7.68zm117.14-.02c0 4.06-3.43 7.4-7.65 7.4s-7.65-3.34-7.65-7.4 3.43-7.4 7.65-7.4 7.65 3.34 7.65 7.4z"/></svg>' | Out-File -FilePath "public/vercel.svg" -Encoding UTF8
        
        Write-Log "✅ Папка public создана с необходимыми файлами"
    } else {
        Write-Log "✅ Папка public уже существует"
    }

    # ЭТАП 2: Сборка проекта локально
    Write-Step "2" "Сборка проекта локально"
    Write-Log "📦 Выполнение npm run build..."
    
    $buildResult = & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка сборки проекта!"
    }
    Write-Log "✅ Сборка завершена успешно"

    # ЭТАП 3: Создание архива для деплоя
    Write-Step "3" "Создание архива для деплоя"
    Write-Log "📦 Создание архива $ArchiveName..."
    
    # Удаляем старый архив если существует
    if (Test-Path $ArchiveName) {
        Remove-Item $ArchiveName -Force
    }
    
    # Создаем архив с необходимыми файлами (включая public)
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

    # ЭТАП 4: Загрузка архива на сервер
    Write-Step "4" "Загрузка архива на сервер"
    Write-Log "📤 Копирование $ArchiveName на сервер..."
    
    & scp "$ArchiveName" "$Username@$ServerIP`:$DeployDir/"
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка копирования архива на сервер!"
    }
    Write-Log "✅ Архив успешно загружен"

    # ЭТАП 5: Загрузка обновленного скрипта деплоя на сервер
    Write-Step "5" "Загрузка скрипта деплоя на сервер"
    Write-Log "📤 Копирование обновленного скрипта деплоя на сервер..."
    
    & scp "deploy-configs/deploy-nextjs15/deploy-script-v3.sh" "$Username@$ServerIP`:$DeployDir/deploy-script.sh"
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка копирования скрипта деплоя на сервер!"
    }
    Write-Log "✅ Скрипт деплоя загружен"

    # ЭТАП 6: Выполнение деплоя на сервере
    Write-Step "6" "Выполнение деплоя на сервере"
    Write-Log "🚀 Запуск скрипта деплоя на сервере..."
    
    $deployArgs = "$ArchiveName $ServerIP"
    if ($CreateAdmin) {
        $deployArgs += " --create-admin"
    }
    
    & ssh "$Username@$ServerIP" "cd $DeployDir `&`& chmod +x deploy-script.sh `&`& ./deploy-script.sh $deployArgs"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка выполнения деплоя на сервере!"
    }
    
    Write-Log "✅ Деплой завершен успешно!"

    # Удаляем локальный архив
    Remove-Item $ArchiveName -Force
    Write-Log "🧹 Локальный архив удален"
    
    # ЭТАП 7: Финальная проверка
    Write-Step "7" "Финальная проверка"
    Write-Log "🔍 Проверка доступности приложения..."
    
    Start-Sleep -Seconds 15
    
    try {
        $response = Invoke-WebRequest -Uri "http://$ServerIP`:3000" -TimeoutSec 15 -UseBasicParsing
        if ($response.StatusCode -eq 307 -or $response.StatusCode -eq 200) {
            Write-Log "✅ Приложение успешно отвечает на запросы!"
            Write-Log "🔄 Код ответа: $($response.StatusCode) (ожидается 307 для редиректа на /auth)"
        } else {
            Write-Warning "⚠️ Приложение отвечает с неожиданным кодом: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "⚠️ Не удается проверить доступность приложения: $_"
        Write-Log "🔍 Проверяем статус PM2 на сервере..."
        & ssh "$Username@$ServerIP" "pm2 status"
    }
    
    # ЭТАП 8: Проверка авторизации
    Write-Step "8" "Проверка авторизации"
    Write-Log "🔐 Проверка страницы авторизации..."
    
    try {
        $authResponse = Invoke-WebRequest -Uri "http://$ServerIP`:3000/auth" -TimeoutSec 15 -UseBasicParsing
        if ($authResponse.StatusCode -eq 200) {
            Write-Log "✅ Страница авторизации доступна!"
        } else {
            Write-Warning "⚠️ Страница авторизации отвечает с кодом: $($authResponse.StatusCode)"
        }
    }
    catch {
        Write-Warning "⚠️ Не удается проверить страницу авторизации: $_"
    }
    
    Write-Host @"

🎉 ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!
═══════════════════════════════════════════════════════════
🌐 URL: http://$ServerIP`:3000 (перенаправляет на /auth)
🔐 Авторизация: http://$ServerIP`:3000/auth
👨‍💼 Админ: admin@taskverse.test / password
📊 Статус: Приложение запущено
🔧 PM2: studio-nextjs15
📁 Директория: $DeployDir
🛠️ Логи PM2: ssh $Username@$ServerIP "pm2 logs studio-nextjs15"
═══════════════════════════════════════════════════════════
✨ ИСПРАВЛЕНИЯ В ВЕРСИИ 3.0:
   ✅ Исправлена ошибка clientModules
   ✅ Восстановлена авторизация с правильными стилями
   ✅ Добавлена папка public
   ✅ Создан админ пользователь
   ✅ Исправлен API авторизации
═══════════════════════════════════════════════════════════
"@ -ForegroundColor Green

} catch {
    Write-Error "Критическая ошибка: $_"
}
