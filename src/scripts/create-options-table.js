// Скрипт для создания таблицы order_stage_options, если она отсутствует

const { Client } = require('pg');
require('dotenv').config();

async function createOptionsTable() {
  // Чтение переменных окружения
  const dbName = process.env.DB_NAME || 'studio';
  const dbUser = process.env.DB_USERNAME || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

  console.log('Параметры подключения к БД:', {
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    // Пароль не выводим из соображений безопасности
  });
  
  const client = new Client({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
  });

  try {
    await client.connect();
    console.log('Подключение к БД успешно установлено');

    // Проверяем существует ли таблица
    const tableCheck = await client.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_stage_options')"
    );

    const tableExists = tableCheck.rows[0].exists;
    console.log('Таблица order_stage_options существует:', tableExists);

    if (!tableExists) {
      console.log('Создаём таблицу order_stage_options...');
      
      // Создаём таблицу
      await client.query(`
        CREATE TABLE order_stage_options (
          id SERIAL PRIMARY KEY,
          order_stage_id INTEGER NOT NULL REFERENCES order_stages(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          pricing_type VARCHAR(20) NOT NULL DEFAULT 'included',
          volume_min DECIMAL(12, 4),
          volume_max DECIMAL(12, 4),
          volume_unit VARCHAR(20),
          nominal_volume DECIMAL(12, 4),
          price_per_unit DECIMAL(10, 2),
          calculated_price_min DECIMAL(10, 2),
          calculated_price_max DECIMAL(10, 2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('Таблица order_stage_options успешно создана');
    } else {
      console.log('Таблица order_stage_options уже существует, проверяем структуру...');
      
      // Проверяем и при необходимости добавляем нужные колонки
      const columns = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'order_stage_options'
      `);
      
      const columnNames = columns.rows.map(row => row.column_name);
      console.log('Существующие колонки:', columnNames);
      
      // Проверяем основные поля и добавляем их, если они отсутствуют
      const requiredColumns = [
        { name: 'pricing_type', type: 'character varying(20)', default: "'included'" },
        { name: 'volume_min', type: 'numeric(12,4)', default: null },
        { name: 'volume_max', type: 'numeric(12,4)', default: null },
        { name: 'volume_unit', type: 'character varying(20)', default: null },
        { name: 'nominal_volume', type: 'numeric(12,4)', default: null },
        { name: 'calculated_price_min', type: 'numeric(10,2)', default: null },
        { name: 'calculated_price_max', type: 'numeric(10,2)', default: null }
      ];
      
      for (const column of requiredColumns) {
        if (!columnNames.includes(column.name)) {
          console.log(`Добавляем колонку ${column.name}...`);
          await client.query(`
            ALTER TABLE order_stage_options 
            ADD COLUMN ${column.name} ${column.type} ${column.default ? `DEFAULT ${column.default}` : ''}
          `);
        }
      }
      
      console.log('Структура таблицы order_stage_options обновлена');
    }
    
    console.log('Операция успешно завершена');
  } catch (error) {
    console.error('Ошибка при работе с базой данных:', error);
  } finally {
    await client.end();
    console.log('Соединение с БД закрыто');
  }
}

createOptionsTable()
  .then(() => console.log('Скрипт завершен'))
  .catch(err => console.error('Ошибка при выполнении скрипта:', err));
