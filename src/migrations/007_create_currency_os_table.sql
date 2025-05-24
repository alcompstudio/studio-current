-- Файл: 007_create_currency_os_table.sql

-- Создаем таблицу для хранения валют
CREATE TABLE currency_os (
  id SERIAL PRIMARY KEY,
  iso_code VARCHAR(10) NOT NULL UNIQUE,  -- Буквенный код валюты (USD, EUR, RUB и т.д.)
  name VARCHAR(255) NOT NULL,            -- Текстовое наименование (Доллар США, Евро и т.д.)
  symbol VARCHAR(10) NOT NULL,           -- Символьное обозначение ($, €, ₽ и т.д.)
  exchange_rate DECIMAL(10, 4) NOT NULL, -- Текущий курс валюты (4 символа после запятой)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индекс для быстрого поиска по коду валюты
CREATE INDEX idx_currency_os_iso_code ON currency_os(iso_code);

-- Добавляем несколько базовых валют
INSERT INTO currency_os (iso_code, name, symbol, exchange_rate) VALUES
('USD', 'Доллар США', '$', 1.0000),
('EUR', 'Евро', '€', 0.9200),
('RUB', 'Российский рубль', '₽', 90.5000);
