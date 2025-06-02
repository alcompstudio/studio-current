-- Скрипт инициализации базы данных studio_db
-- Он будет автоматически выполнен при первом запуске контейнера PostgreSQL

-- Проверка существования базы данных
SELECT 'CREATE DATABASE studio_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studio_db');

-- Установка прав доступа
ALTER USER postgres WITH PASSWORD 'StrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE studio_db TO postgres;

-- Установка расширений, если необходимо
\c studio_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
