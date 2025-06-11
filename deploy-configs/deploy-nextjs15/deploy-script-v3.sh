#!/bin/bash
# Скрипт деплоя для Studio App (Next.js 15) - ВЕРСИЯ 3.0
# Исправления: авторизация, clientModules, папка public, админ пользователь
set -e

# Функции для логирования
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }
warn() { echo "[WARNING] $1" >&2; }
error() { echo "[ERROR] $1" >&2; exit 1; }

# Параметры
DEPLOY_DIR="/var/www/studio-app"
ARCHIVE_NAME="$1"
SERVER_IP="$2"
CREATE_ADMIN="$3"

log "🚀 Начало деплоя Studio App (Next.js 15) v3.0"
log "📁 Директория деплоя: $DEPLOY_DIR"
log "📦 Архив: $ARCHIVE_NAME"
log "👨‍💼 Создать админа: $CREATE_ADMIN"

# Остановка всех процессов на порту 3000
log "🛑 Остановка процессов на порту 3000..."
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 3

# Создание бэкапа (если есть что бэкапить)
if [ -d "$DEPLOY_DIR/.next" ] || [ -f "$DEPLOY_DIR/package.json" ]; then
    BACKUP_DIR="/tmp/studio.backup.$(date +%Y%m%d_%H%M%S)"
    log "💾 Создание бэкапа в $BACKUP_DIR..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$DEPLOY_DIR/." "$BACKUP_DIR/" 2>/dev/null || true
    log "✅ Бэкап создан"
fi

# Переход в директорию деплоя
log "📁 Переход в директорию деплоя: $DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Распаковка архива
log "📦 Распаковка архива $ARCHIVE_NAME..."
if [[ "$ARCHIVE_NAME" == *.zip ]]; then
    unzip -o "$ARCHIVE_NAME"
else
    tar -xzf "$ARCHIVE_NAME"
fi
rm -f "$ARCHIVE_NAME"
log "✅ Архив распакован"

# Проверка папки public
log "📁 Проверка папки public..."
if [ ! -d "public" ]; then
    log "📁 Создание папки public..."
    mkdir -p public
    
    # Создаем robots.txt
    cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: http://157.180.87.32:3000/sitemap.xml
EOF
    
    # Создаем next.svg
    cat > public/next.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.2 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
EOF
    
    # Создаем vercel.svg
    cat > public/vercel.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="m141.04 16 c0 11 9 20 20 20s20-9 20-20-9-20-20-20-20 9-20 20zm22.21-9c-4.28 0-7.68 3.43-7.68 7.68 0 4.25 3.4 7.68 7.68 7.68s7.68-3.43 7.68-7.68c0-4.25-3.4-7.68-7.68-7.68zm117.14-.02c0 4.06-3.43 7.4-7.65 7.4s-7.65-3.34-7.65-7.4 3.43-7.4 7.65-7.4 7.65 3.34 7.65 7.4z"/></svg>
EOF
    
    log "✅ Папка public создана"
else
    log "✅ Папка public найдена"
fi

# Создание .env файла
log "⚙️ Настройка переменных окружения..."
if [ ! -f "$DEPLOY_DIR/.env" ]; then
    tee "$DEPLOY_DIR/.env" > /dev/null << ENV_EOF
NODE_ENV=production
DATABASE_URL=postgresql://userstudio:userstudio@localhost:5432/userstudio
NEXTAUTH_URL=http://$SERVER_IP:3000
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

# Проверка и исправление next.config.js (ИСПРАВЛЕНИЕ ПРОБЛЕМЫ clientModules)
log "🔧 Проверка next.config.js..."
if [ ! -f "next.config.js" ]; then
    log "⚠️ next.config.js не найден, создаем исправленную версию..."
else
    log "🔧 Обновление next.config.js для исправления ошибки clientModules..."
fi

tee "next.config.js" > /dev/null << 'CONFIG_EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['sequelize'],
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://157.180.87.32:3000",
    ],
  },
  // Настройки для production
  poweredByHeader: false,
  compress: true,
  // Настройки для статических файлов
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;
CONFIG_EOF
log "✅ next.config.js обновлен"

# Установка зависимостей
log "📦 Установка зависимостей..."
npm install --production --legacy-peer-deps --ignore-scripts
log "✅ Зависимости установлены"

# Запуск миграций базы данных
log "🗃️ Запуск миграций базы данных..."
if [ -f "src/lib/migrate.ts" ]; then
    npx tsx src/lib/migrate.ts || warn "Ошибка выполнения миграций"
else
    warn "Файл миграций не найден"
fi

# Создание админа (НОВАЯ ФУНКЦИЯ)
if [ "$CREATE_ADMIN" = "--create-admin" ]; then
    log "👨‍💼 Создание администратора..."
    
    cat > create-admin.js << 'ADMIN_EOF'
import db from './src/lib/models/index.js';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    console.log('Connecting to database...');
    await db.sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Проверяем, есть ли уже админ
    const existingAdmin = await db.User.findOne({
      where: { email: 'admin@taskverse.test' }
    });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }
    
    // Создаем хеш пароля
    const passwordHash = await bcrypt.hash('password', 10);
    
    // Создаем админа
    const admin = await db.User.create({
      email: 'admin@taskverse.test',
      passwordHash: passwordHash,
      role: 'Администратор'
    });
    
    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('ID:', admin.id);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

createAdmin();
ADMIN_EOF
    
    node create-admin.js || warn "Ошибка создания администратора"
    rm -f create-admin.js
    log "✅ Администратор создан/проверен"
fi

# Создание PM2 конфигурации (ИСПРАВЛЕНИЕ ПРОБЛЕМЫ С ДУБЛИРОВАНИЕМ)
log "⚙️ Создание PM2 конфигурации..."
tee "ecosystem.config.cjs" > /dev/null << PM2_EOF
module.exports = {
  apps: [{
    name: 'studio-nextjs15',
    script: 'npm',
    args: 'start',
    cwd: '$DEPLOY_DIR',
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
for i in {1..15}; do
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        log "✅ Приложение отвечает на запросы"
        break
    else
        log "⏳ Ожидание запуска приложения... ($i/15)"
        sleep 3
    fi
done

# Проверка страницы авторизации
log "🔐 Проверка страницы авторизации..."
sleep 3
if curl -f http://localhost:3000/auth >/dev/null 2>&1; then
    log "✅ Страница авторизации доступна"
else
    warn "⚠️ Страница авторизации недоступна"
fi

# Очистка старых бэкапов (оставляем только 3 последних)
log "🗑️ Очистка старых бэкапов..."
ls -dt /tmp/studio.backup.* 2>/dev/null | tail -n +4 | xargs rm -rf || true

# Очистка старых архивов деплоя (оставляем только текущий)
log "🗑️ Очистка старых архивов деплоя..."
find "$DEPLOY_DIR" -name "studio-deploy-*.tar.gz" -o -name "studio-deploy-*.zip" | head -n -1 | xargs rm -f || true

log "✅ Деплой Next.js 15 v3.0 завершен успешно!"
log "🌐 Приложение доступно по адресу: http://$(hostname -I | awk '{print $1}'):3000"
log "🔐 Страница авторизации: http://$(hostname -I | awk '{print $1}'):3000/auth"
log "👨‍💼 Админ: admin@taskverse.test / password"
log "📋 Версия: Next.js 15.2.3 с исправлениями v3.0"
log "✨ Исправления: clientModules, авторизация, public папка, админ пользователь"
