-- Файл: 008_alter_projects_currency_column.sql

-- 1. Добавляем новый столбец для ID валюты
ALTER TABLE projects ADD COLUMN currency_id INTEGER;

-- 2. Обновляем новый столбец на основе текущего значения currency
-- Для существующих записей устанавливаем значения из currency_os по iso_code
UPDATE projects p
SET currency_id = c.id
FROM currency_os c
WHERE p.currency = c.iso_code;

-- 3. Если есть проекты без валюты или с валютой, которой нет в currency_os,
-- установим им валюту по умолчанию (USD, id=1)
UPDATE projects
SET currency_id = 1
WHERE currency_id IS NULL AND currency IS NOT NULL;

-- 4. Удаляем старый столбец currency (VARCHAR)
ALTER TABLE projects DROP COLUMN currency;

-- 5. Переименовываем новый столбец в 'currency'
ALTER TABLE projects RENAME COLUMN currency_id TO currency;

-- 6. Добавляем внешний ключ к таблице currency_os
ALTER TABLE projects
ADD CONSTRAINT fk_projects_currency_os
FOREIGN KEY (currency)
REFERENCES currency_os(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- 7. Добавляем индекс на новый столбец currency для производительности
CREATE INDEX idx_projects_currency ON projects(currency);
