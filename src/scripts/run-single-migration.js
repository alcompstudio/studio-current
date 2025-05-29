'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Загружаем конфигурацию из файла config.json
const configPath = path.resolve(__dirname, '../../config/config.json');
const configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = configJson.development;

async function runSingleMigration(migrationName) {
  console.log(`Запуск миграции: ${migrationName}`);
  
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: false,
    }
  );

  try {
    // Проверяем соединение с БД
    await sequelize.authenticate();
    console.log('Подключено к базе данных PostgreSQL');
    
    // Получаем полный путь к файлу миграции
    const migrationsPath = path.resolve(__dirname, '../migrations');
    const migrationFilePath = path.join(migrationsPath, migrationName);
    
    if (!fs.existsSync(migrationFilePath)) {
      throw new Error(`Файл миграции не найден: ${migrationFilePath}`);
    }
    
    // Загружаем и выполняем миграцию
    const migration = require(migrationFilePath);
    
    if (typeof migration.up === 'function') {
      console.log(`Выполнение миграции: ${migrationName}`);
      await migration.up(sequelize.getQueryInterface(), Sequelize);
      console.log(`Миграция ${migrationName} успешно выполнена`);
    } else {
      throw new Error(`Миграция ${migrationName} не содержит функцию up`);
    }
    
  } catch (error) {
    console.error('Ошибка при выполнении миграции:', error);
  } finally {
    await sequelize.close();
    console.log('Соединение с базой данных закрыто');
  }
}

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Пожалуйста, укажите имя файла миграции в качестве аргумента');
  process.exit(1);
}

runSingleMigration(migrationName);
