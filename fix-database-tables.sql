-- Скрипт для создания недостающих таблиц в базе данных
-- Исправляет ошибку 500 в приложении

-- 1. Создание таблицы project_status_os
CREATE TABLE IF NOT EXISTS project_status_os (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    text_color VARCHAR(50) NOT NULL,
    background_color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Создание таблицы order_status_os
CREATE TABLE IF NOT EXISTS order_status_os (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    text_color VARCHAR(50) NOT NULL,
    background_color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Создание таблицы currency_os
CREATE TABLE IF NOT EXISTS currency_os (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Заполнение таблицы project_status_os базовыми данными
INSERT INTO project_status_os (name, text_color, background_color) VALUES
('Новый', '#000000', '#e3f2fd'),
('В работе', '#ffffff', '#2196f3'),
('На паузе', '#000000', '#fff3e0'),
('Завершен', '#ffffff', '#4caf50'),
('Отменен', '#ffffff', '#f44336')
ON CONFLICT (name) DO NOTHING;

-- 5. Заполнение таблицы order_status_os базовыми данными
INSERT INTO order_status_os (name, text_color, background_color) VALUES
('Новый', '#000000', '#e3f2fd'),
('В работе', '#ffffff', '#2196f3'),
('На паузе', '#000000', '#fff3e0'),
('Завершен', '#ffffff', '#4caf50'),
('Отменен', '#ffffff', '#f44336')
ON CONFLICT (name) DO NOTHING;

-- 6. Заполнение таблицы currency_os базовыми данными
INSERT INTO currency_os (code, name, symbol, is_active) VALUES
('USD', 'Доллар США', '$', true),
('EUR', 'Евро', '€', true),
('RUB', 'Российский рубль', '₽', true),
('UAH', 'Украинская гривна', '₴', true)
ON CONFLICT (code) DO NOTHING;

-- 7. Создание таблицы users если не существует
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Создание администратора по умолчанию
INSERT INTO users (email, password, name, role) VALUES
('admin@taskverse.test', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 9. Создание таблицы projects если не существует
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status INTEGER REFERENCES project_status_os(id) DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Создание таблицы orders если не существует
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status INTEGER REFERENCES order_status_os(id) DEFAULT 1,
    project_id INTEGER REFERENCES projects(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Проверка созданных таблиц
SELECT 'project_status_os' as table_name, COUNT(*) as records FROM project_status_os
UNION ALL
SELECT 'order_status_os' as table_name, COUNT(*) as records FROM order_status_os
UNION ALL
SELECT 'currency_os' as table_name, COUNT(*) as records FROM currency_os
UNION ALL
SELECT 'users' as table_name, COUNT(*) as records FROM users;
