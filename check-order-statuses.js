// Скрипт для проверки текущих значений в таблице order_status_os
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false
});

async function checkOrderStatuses() {
  try {
    // Выполняем прямой запрос к базе данных
    const [results] = await sequelize.query('SELECT * FROM order_status_os ORDER BY id');
    
    console.log('Текущие значения в таблице order_status_os:');
    console.log('------------------------------------------');
    
    results.forEach(status => {
      console.log(`ID: ${status.id}`);
      console.log(`Название: ${status.name}`);
      console.log(`Цвет текста: ${status.text_color}`);
      console.log(`Цвет фона: ${status.background_color}`);
      console.log('------------------------------------------');
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('Ошибка при получении статусов заказа:', error);
    await sequelize.close();
  }
}

checkOrderStatuses();
