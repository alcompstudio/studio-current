-- Проверка наличия колонки pricing_type_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns 
        WHERE table_name = 'order_stage_options' AND column_name = 'pricing_type_id'
    ) THEN
        -- Добавляем колонку pricing_type_id
        ALTER TABLE order_stage_options ADD COLUMN pricing_type_id INTEGER;
        
        -- Заполняем значения на основе существующей колонки pricing_type
        UPDATE order_stage_options 
        SET pricing_type_id = CASE 
            WHEN pricing_type = 'calculable' THEN 1 
            WHEN pricing_type = 'included' THEN 2 
            ELSE NULL 
        END;
        
        RAISE NOTICE 'Колонка pricing_type_id успешно добавлена и заполнена данными';
    ELSE
        RAISE NOTICE 'Колонка pricing_type_id уже существует в таблице';
    END IF;
END
$$;
