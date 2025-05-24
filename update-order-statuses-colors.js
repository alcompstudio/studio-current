// Скрипт для обновления цветов статусов заказа
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

async function updateOrderStatusesColors() {
  try {
    const statuses = [
      {
        id: 1,
        name: 'Новый',
        text_color: '#13a1e7',
        background_color: '#c0e6f8'
      },
      {
        id: 2,
        name: 'Сбор ставок',
        text_color: '#e4c500',
        background_color: '#f8f0bf'
      },
      {
        id: 3,
        name: 'На паузе',
        text_color: '#c1c1c1',
        background_color: '#eeeeee'
      },
      {
        id: 4,
        name: 'Сбор завершен',
        text_color: '#4ad286',
        background_color: '#d2f4e1'
      },
      {
        id: 5,
        name: 'Отменен',
        text_color: '#e36262',
        background_color: '#f8d8d8'
      }
    ];
    
    for (const status of statuses) {
      await sequelize.query(`
        UPDATE order_status_os 
        SET text_color = :text_color, background_color = :background_color 
        WHERE id = :id
      `, {
        replacements: status
      });
    }
    
    console.log('Цвета статусов заказа успешно обновлены.');
    
    // Проверяем результат
    const [results] = await sequelize.query('SELECT * FROM order_status_os ORDER BY id');
    
    console.log('\nТекущие значения статусов заказа:');
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
    console.error('Ошибка при обновлении цветов статусов заказа:', error);
    await sequelize.close();
  }
}

updateOrderStatusesColors();
