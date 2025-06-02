# Руководство по настройке Docker-среды

Это руководство описывает процесс настройки совместимой среды разработки с использованием Docker для локальной машины (Windows) и удаленного сервера (Hetzner, Linux).

## Содержание

1. [Подготовка локальной среды](#1-подготовка-локальной-среды)
2. [Настройка Docker на локальной машине](#2-настройка-docker-на-локальной-машине)
3. [Запуск приложения локально через Docker](#3-запуск-приложения-локально-через-docker)
4. [Подготовка удаленного сервера Hetzner](#4-подготовка-удаленного-сервера-hetzner)
5. [Деплой приложения на удаленный сервер](#5-деплой-приложения-на-удаленный-сервер)
6. [Настройка Nginx и SSL](#6-настройка-nginx-и-ssl)
7. [Обновление приложения](#7-обновление-приложения)
8. [Резервное копирование данных](#8-резервное-копирование-данных)

## 1. Подготовка локальной среды

### Требования
- Docker Desktop для Windows
- Git
- Доступ к интернету

### Проверка установки Docker
1. Откройте командную строку Windows (CMD) или PowerShell
2. Выполните команду: `docker --version`
3. Убедитесь, что Docker запущен, выполнив: `docker ps`

## 2. Настройка Docker на локальной машине

### Клонирование и настройка проекта
1. Убедитесь, что проект доступен локально
2. Перейдите в корневую директорию проекта
3. Создайте или убедитесь в наличии следующих файлов:
   - `Dockerfile`
   - `docker-compose.yml`
   - `.dockerignore`
   - `.env.docker`

### Настройка переменных окружения
1. Скопируйте файл `.env.docker` в `.env` (если необходимо)
2. Отредактируйте параметры в `.env` в соответствии с вашей конфигурацией

## 3. Запуск приложения локально через Docker

### Сборка и запуск контейнеров
1. Откройте командную строку в корневой директории проекта
2. Выполните: `docker-compose up -d --build`
3. Дождитесь завершения процесса сборки и запуска

### Проверка работоспособности
1. Откройте браузер и перейдите по адресу: `http://localhost:3000`
2. PgAdmin доступен по адресу: `http://localhost:8080`
3. Выполните миграции базы данных (при необходимости):
   ```
   docker-compose exec app npx sequelize-cli db:migrate
   ```

## 4. Подготовка удаленного сервера Hetzner

### Установка Docker на сервере
1. Подключитесь к серверу по SSH
2. Обновите список пакетов: `sudo apt update`
3. Установите Docker: `sudo apt install -y docker.io docker-compose`
4. Запустите и включите автозапуск Docker:
   ```
   sudo systemctl enable docker
   sudo systemctl start docker
   ```
5. Добавьте пользователя в группу docker: `sudo usermod -aG docker $USER`
6. Перезайдите на сервер для применения изменений

## 5. Деплой приложения на удаленный сервер

### Подготовка файлов на сервере
1. Создайте директорию для проекта: `mkdir -p ~/studio_app`
2. Скопируйте необходимые файлы на сервер:
   ```
   scp Dockerfile docker-compose.yml .dockerignore .env.docker username@your-server-ip:~/studio_app/
   ```
3. Создайте архив кода (локально): `git archive -o studio_app.tar.gz HEAD`
4. Загрузите архив на сервер: `scp studio_app.tar.gz username@your-server-ip:~/studio_app/`
5. Распакуйте архив на сервере:
   ```
   cd ~/studio_app
   tar -xzf studio_app.tar.gz
   ```

### Запуск приложения на сервере
1. Создайте файл .env из шаблона: `cp .env.docker .env`
2. Соберите и запустите контейнеры: `docker-compose up -d --build`
3. Выполните миграции базы данных (если необходимо):
   ```
   docker-compose exec app npx sequelize-cli db:migrate
   ```

## 6. Настройка Nginx и SSL

### Установка и настройка Nginx
1. Установите Nginx и Certbot:
   ```
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```
2. Настройте конфигурацию Nginx:
   ```
   sudo cp nginx.conf /etc/nginx/sites-available/studio_app
   sudo ln -s /etc/nginx/sites-available/studio_app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Настройка SSL-сертификата
1. Получите SSL-сертификат через Certbot:
   ```
   sudo certbot --nginx -d вашдомен.ru -d www.вашдомен.ru
   ```
2. Проверьте автообновление сертификатов: `sudo certbot renew --dry-run`

## 7. Обновление приложения

### Обновление кода
1. Локально внесите изменения в код
2. Создайте архив обновленного кода: `git archive -o studio_app.tar.gz HEAD`
3. Загрузите архив на сервер: `scp studio_app.tar.gz username@your-server-ip:~/studio_app/`
4. На сервере распакуйте архив и перезапустите контейнеры:
   ```
   cd ~/studio_app
   tar -xzf studio_app.tar.gz
   docker-compose up -d --build
   ```

## 8. Резервное копирование данных

### Резервное копирование базы данных
1. Создайте директорию для бэкапов: `mkdir -p ~/backups`
2. Создайте резервную копию базы данных:
   ```
   docker-compose exec db pg_dump -U postgres studio_db > ~/backups/backup_$(date +%Y%m%d).sql
   ```
3. Настройте автоматические бэкапы через cron (по желанию)

### Восстановление из резервной копии
1. Остановите работающие контейнеры: `docker-compose down`
2. Запустите только базу данных: `docker-compose up -d db`
3. Восстановите данные из бэкапа:
   ```
   cat ~/backups/backup_YYYYMMDD.sql | docker-compose exec -T db psql -U postgres -d studio_db
   ```
4. Запустите остальные контейнеры: `docker-compose up -d`
