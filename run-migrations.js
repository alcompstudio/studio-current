const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Настройки подключения к базе данных
const config = {
  user: 'userstudio',
  host: 'localhost',
  database: 'userstudio',
  password: 'userstudio',
  port: 5432,
};

// Путь к миграциям
const migrationsDir = path.join(__dirname, 'src', 'migrations');

async function runMigrations() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Подключено к базе данных PostgreSQL');
    
    // Выполняем SQL-миграции
    const migrationFiles = [
      '007_create_currency_os_table.sql',
      '008_alter_projects_currency_column.sql'
    ];
    
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Выполнение миграции: ${file}`);
      
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
      
      console.log(`Миграция ${file} успешно выполнена`);
    }
    
    // Выполняем вставку данных из сидера
    console.log('Заполнение таблицы валют данными...');
    
    const now = new Date();
    const currencies = [
      ['USD', 'Доллар США', '$', 1.0000, now, now],
      ['EUR', 'Евро', '€', 0.9200, now, now],
      ['RUB', 'Российский рубль', '₽', 90.5000, now, now],
      ['GBP', 'Фунт стерлингов', '£', 0.7800, now, now],
      ['JPY', 'Японская иена', '¥', 110.5000, now, now],
      ['CNY', 'Китайский юань', '¥', 6.4500, now, now]
    ];
    
    for (const currency of currencies) {
      await client.query(
        'INSERT INTO currency_os (iso_code, name, symbol, exchange_rate, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
        currency
      );
    }
    
    console.log('Данные валют успешно добавлены');
    
    console.log('Все миграции и сидеры успешно выполнены');
  } catch (error) {
    console.error('Ошибка при выполнении миграций:', error);
  } finally {
    await client.end();
    console.log('Соединение с базой данных закрыто');
  }
}

runMigrations();
