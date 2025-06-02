'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

async function initializeDatabase() {
  try {
    // Получаем конфигурацию для текущего окружения
    const env = process.env.NODE_ENV || 'development';
    const dbConfig = config[env];
    
    // Создаем подключение к базе данных
    const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: console.log
    });
    
    // Проверяем подключение
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');
    
    // Создаем все таблицы на основе моделей (force: true сбросит таблицы, если они существуют)
    // ВНИМАНИЕ: используйте force: true только для разработки, не в продакшн!
    await sequelize.sync({ force: true });
    console.log('База данных синхронизирована. Все таблицы созданы.');
    
    process.exit(0);
  } catch (error) {
    console.error('Не удалось инициализировать базу данных:', error);
    process.exit(1);
  }
}

initializeDatabase();
