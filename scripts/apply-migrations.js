const { sequelize } = require('../src/lib/db');
const fs = require('fs');
const path = require('path');

async function applyMigration(filePath) {
  console.log(`Applying migration: ${filePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  try {
    await sequelize.query(sql);
    console.log(`Successfully applied migration: ${filePath}`);
  } catch (error) {
    console.error(`Error applying migration ${filePath}:`, error);
    throw error;
  }
}

async function main() {
  try {
    // Проверяем соединение с базой данных
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');

    // Путь к миграциям
    const migrationsDir = path.join(__dirname, '../src/migrations');
    
    // Применяем миграцию 004_create_order_stages_table.sql
    await applyMigration(path.join(migrationsDir, '004_create_order_stages_table.sql'));
    
    // Применяем миграцию 009_add_fields_to_order_stages_and_create_options_table.sql
    await applyMigration(path.join(migrationsDir, '009_add_fields_to_order_stages_and_create_options_table.sql'));

    console.log('All migrations applied successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }
}

main();
