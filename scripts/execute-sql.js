// Простой скрипт для выполнения SQL из файла
// Работает с ES modules
import pg from 'pg';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Конфигурация подключения к базе данных
const config = {
  user: process.env.DB_USERNAME || 'userstudio',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'userstudio',
};

async function executeSql() {
  // Путь к SQL-файлу
  const sqlFilePath = join(__dirname, 'create_order_stages_tables.sql');
  
  // Читаем содержимое SQL-файла
  const sql = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Создаем клиент для подключения к базе данных
  const client = new pg.Client(config);
  
  try {
    // Подключаемся к базе данных
    await client.connect();
    console.log('Успешно подключились к базе данных');
    
    // Выполняем SQL-запрос
    await client.query(sql);
    console.log('SQL-запрос успешно выполнен');
    
    // Проверяем, что таблицы созданы
    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
            table_name IN ('order_stages', 'order_stage_options')
    `);
    
    console.log('Результат проверки таблиц:', rows);
    
  } catch (error) {
    console.error('Ошибка при выполнении SQL:', error);
  } finally {
    // Закрываем соединение
    await client.end();
    console.log('Соединение с базой данных закрыто');
  }
}

// Запускаем выполнение
executeSql();
