-- Создание таблицы пользователей для аутентификации
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL, -- Хранит хеш пароля
  role VARCHAR(50) NOT NULL, -- Роль пользователя (Заказчик, Исполнитель, Администратор и т.д.)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по email
CREATE INDEX idx_users_email ON users(email);
