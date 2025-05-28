-- Удаление дублирующихся записей из таблицы pricing_type_os
DELETE FROM pricing_type_os WHERE id IN (3, 4);

-- Для проверки, что записи удалены
SELECT * FROM pricing_type_os;
