-- Файл: 003_alter_projects_status_column.sql

-- Предполагаем, что все существующие проекты получат статус с ID = 1 (например, "Новый")
-- Если у вас нет такого статуса или ID другой, измените значение '1' ниже.
-- Также, если таблица projects пуста, этот UPDATE не сделает ничего.

-- 1. Добавляем новый столбец для ID статуса
ALTER TABLE projects ADD COLUMN status_id INTEGER;

-- 2. Обновляем новый столбец: устанавливаем всем существующим проектам статус с ID=1 (или другим ID по умолчанию)
-- Убедитесь, что статус с ID=1 существует в таблице project_status_os!
-- Если таблица project_status_os пуста, или в ней нет статуса с ID=1,
-- этот шаг может вызвать ошибку при добавлении внешнего ключа, если projects не пуста.
-- Возможно, сначала нужно убедиться, что в project_status_os есть нужный статус.
UPDATE projects SET status_id = 1; -- ИЗМЕНИТЕ '1' при необходимости

-- 3. Удаляем старый столбец status (VARCHAR)
ALTER TABLE projects DROP COLUMN status;

-- 4. Переименовываем новый столбец в 'status'
ALTER TABLE projects RENAME COLUMN status_id TO status;

-- 5. Устанавливаем ограничение NOT NULL для нового столбца status
-- (Если вы установили какой-то ID в UPDATE выше, то это должно пройти успешно)
ALTER TABLE projects ALTER COLUMN status SET NOT NULL;

-- 6. Добавляем внешний ключ к таблице project_status_os
ALTER TABLE projects
ADD CONSTRAINT fk_projects_project_status_os
FOREIGN KEY (status)
REFERENCES project_status_os(id)
ON DELETE RESTRICT -- или ON DELETE SET NULL, если разрешено NULL и есть смысл
ON UPDATE CASCADE;

-- (Опционально) Добавить индекс на новый столбец status для производительности
CREATE INDEX idx_projects_status ON projects(status);
