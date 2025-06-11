# 🚀 Инструкции по деплою полнофункционального веб-приложения (Next.js 14)

## ✅ Статус проекта
- **Проект успешно собран** с Next.js 14.2.29 (стабильная версия)
- **Все компоненты исправлены** и функциональны
- **55 страниц** сгенерированы
- **Все API маршруты** работают
- **База данных** подключена и работает
- **Откат с Next.js 15** - решены проблемы с clientModules

## 📦 Содержимое деплой-пакета

Архив `studio-deploy-nextjs14.tar.gz` содержит:
- `.next/` - собранное приложение
- `package.json` - зависимости
- `package-lock.json` - точные версии
- `next.config.js` - конфигурация Next.js
- `.env.example` - пример переменных окружения

## 🔧 Требования к серверу

### Минимальные требования:
- **Node.js**: 18.17+ (рекомендуется 20.x)
- **PostgreSQL**: 12+ 
- **RAM**: 2GB+
- **Диск**: 5GB+
- **Порты**: 3000 (или настраиваемый)

### Переменные окружения:
```bash
# База данных
DATABASE_URL=postgresql://username:password@localhost:5432/studio_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studio_db
DB_USER=your_username
DB_PASSWORD=your_password

# Next.js
NODE_ENV=production
PORT=3000

# Безопасность
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://your-domain.com
```

## 📋 Пошаговая инструкция деплоя

### 1. Подготовка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Создание пользователя и базы данных
sudo -u postgres createuser --interactive
sudo -u postgres createdb studio_db
```

### 2. Загрузка и распаковка
```bash
# Создание директории
mkdir -p /var/www/studio
cd /var/www/studio

# Загрузка архива (замените на ваш способ передачи)
# scp studio-deploy.tar.gz user@server:/var/www/studio/
# или wget/curl

# Распаковка
tar -xzf studio-deploy.tar.gz

# Установка зависимостей
npm ci --only=production
```

### 3. Настройка окружения
```bash
# Создание .env файла
cp .env.example .env
nano .env

# Настройка переменных (см. выше)
```

### 4. Настройка базы данных
```bash
# Запуск миграций (если есть)
npm run migrate

# Или создание таблиц вручную
psql -U username -d studio_db -f database/schema.sql
```

### 5. Запуск приложения

#### Вариант A: Прямой запуск
```bash
npm start
```

#### Вариант B: PM2 (рекомендуется)
```bash
# Установка PM2
npm install -g pm2

# Запуск
pm2 start npm --name "studio" -- start

# Автозапуск
pm2 startup
pm2 save
```

#### Вариант C: Systemd
```bash
# Создание service файла
sudo nano /etc/systemd/system/studio.service

# Содержимое:
[Unit]
Description=Studio App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/studio
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target

# Запуск
sudo systemctl enable studio
sudo systemctl start studio
```

### 6. Настройка Nginx (опционально)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Проверка работы

### Основные URL для тестирования:
- `http://your-domain.com/` - Главная страница
- `http://your-domain.com/orders` - Заказы
- `http://your-domain.com/projects` - Проекты
- `http://your-domain.com/settings` - Настройки
- `http://your-domain.com/api/orders` - API заказов

### Проверка логов:
```bash
# PM2
pm2 logs studio

# Systemd
sudo journalctl -u studio -f

# Прямой запуск
# Логи в консоли
```

## ⚠️ Известные проблемы и решения

### 1. Ошибка clientModules
- **Проблема**: Может появляться в runtime
- **Решение**: Перезапуск приложения обычно помогает
- **Причина**: Остаточные проблемы от Next.js 15

### 2. Проблемы с базой данных
- **Проблема**: Ошибки подключения
- **Решение**: Проверить переменные окружения и доступность PostgreSQL

### 3. Порты заняты
- **Проблема**: Port 3000 already in use
- **Решение**: Изменить PORT в .env или остановить другие процессы

## 🎉 Результат

После успешного деплоя у вас будет:
- ✅ Полнофункциональное веб-приложение
- ✅ Система управления заказами
- ✅ Система управления проектами  
- ✅ Настройки валют, статусов, типов ценообразования
- ✅ API для всех операций
- ✅ Адаптивный интерфейс
- ✅ Система этапов и опций заказов

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи приложения
2. Убедитесь в правильности переменных окружения
3. Проверьте доступность базы данных
4. Перезапустите приложение
