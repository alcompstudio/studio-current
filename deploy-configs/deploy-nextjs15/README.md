# 🚀 Автоматический деплой Studio App (Next.js 15)

## 📋 Обзор

Этот набор скриптов обеспечивает полностью автоматический деплой веб-приложения Studio на удаленный сервер с использованием Next.js 15.2.3.

## 🔧 Требования

### Локальная машина:
- Windows 10+ с PowerShell 5.1+
- OpenSSH клиент
- Node.js v22.15.0
- npm v10.9.2
- Git

### Удаленный сервер:
- Ubuntu 20.04+ или Debian 11+
- SSH доступ с ключами
- Права sudo для пользователя

## 📁 Структура файлов

```
deploy-configs/deploy-nextjs15/
├── auto-deploy-nextjs15.ps1      # Главный автоматический скрипт
├── 01-server-cleanup.ps1         # Полная очистка сервера
├── 02-setup-environment.ps1      # Установка окружения Next.js 15
├── 03-deploy-nextjs15.ps1        # Основной деплой приложения
└── README.md                     # Эта документация
```

## 🚀 Быстрый старт

### Автоматический деплой (рекомендуется):

```powershell
# Перейти в корень проекта
cd "E:\Business\Projects\studio"

# Запустить автоматический деплой
.\deploy-configs\deploy-nextjs15\auto-deploy-nextjs15.ps1 -ServerIP "185.46.8.179" -Username "alcompstudio"
```

### Пошаговый деплой:

```powershell
# 1. Очистка сервера
.\deploy-configs\deploy-nextjs15\01-server-cleanup.ps1 -ServerIP "185.46.8.179" -Username "alcompstudio"

# 2. Установка окружения
.\deploy-configs\deploy-nextjs15\02-setup-environment.ps1 -ServerIP "185.46.8.179" -Username "alcompstudio"

# 3. Деплой приложения
.\deploy-configs\deploy-nextjs15\03-deploy-nextjs15.ps1 -ServerIP "185.46.8.179" -Username "alcompstudio"
```

## 📋 Этапы автоматического деплоя

1. **Сборка проекта локально** - `npm run build`
2. **Создание архива** - упаковка необходимых файлов
3. **Полная очистка сервера** - удаление старых установок
4. **Установка окружения** - Node.js 22.15.0, PostgreSQL, PM2
5. **Деплой приложения** - распаковка, установка зависимостей, запуск
6. **Проверка работы** - тестирование доступности
7. **Очистка** - удаление временных файлов

## 🔧 Настройки по умолчанию

- **Сервер**: 185.46.8.179
- **Пользователь**: alcompstudio
- **Директория**: /var/www/studio
- **Порт**: 3000
- **База данных**: userstudio/userstudio@localhost:5432/userstudio
- **Процесс-менеджер**: PM2 (studio-nextjs15)

## 🌐 После деплоя

Приложение будет доступно по адресу: `http://185.46.8.179:3000`

### Управление приложением:

```bash
# Просмотр логов
ssh alcompstudio@185.46.8.179 'pm2 logs studio-nextjs15'

# Перезапуск
ssh alcompstudio@185.46.8.179 'pm2 restart studio-nextjs15'

# Остановка
ssh alcompstudio@185.46.8.179 'pm2 stop studio-nextjs15'

# Статус
ssh alcompstudio@185.46.8.179 'pm2 status'
```

## 🔍 Диагностика проблем

### Проверка статуса сервисов:
```bash
ssh alcompstudio@185.46.8.179 'systemctl status postgresql'
ssh alcompstudio@185.46.8.179 'pm2 status'
```

### Проверка логов:
```bash
ssh alcompstudio@185.46.8.179 'pm2 logs studio-nextjs15 --lines 50'
```

### Проверка портов:
```bash
ssh alcompstudio@185.46.8.179 'netstat -tlnp | grep :3000'
```

## ⚠️ Важные замечания

1. **Полная очистка**: Скрипт полностью очищает сервер от предыдущих установок
2. **Автоматические бэкапы**: Создаются автоматически перед новым деплоем
3. **Идентичные версии**: Локальное и удаленное окружение синхронизированы
4. **Безопасность**: Используются SSH ключи для аутентификации

## 🔄 Обновление приложения

Для обновления просто запустите автоматический скрипт повторно:

```powershell
.\deploy-configs\deploy-nextjs15\auto-deploy-nextjs15.ps1
```

Старая версия будет автоматически сохранена в бэкап.

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи PM2
2. Убедитесь в доступности PostgreSQL
3. Проверьте настройки брандмауэра
4. Перезапустите приложение через PM2
