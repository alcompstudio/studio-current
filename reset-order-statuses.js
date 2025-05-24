// Скрипт для сброса и заполнения таблицы order_status_os
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

async function resetOrderStatuses() {
  try {
    // Сначала удаляем все существующие записи
    await sequelize.query('TRUNCATE TABLE order_status_os RESTART IDENTITY CASCADE');
    
    // Вставляем требуемые 5 статусов
    const statuses = [
      {
        name: 'Новый',
        text_color: '#000000',
        background_color: '#E0E0E0'
      },
      {
        name: 'Сбор ставок',
        text_color: '#FFFFFF',
        background_color: '#3B82F6'
      },
      {
        name: 'На паузе',
        text_color: '#000000',
        background_color: '#F59E0B'
      },
      {
        name: 'Сбор завершен',
        text_color: '#FFFFFF',
        background_color: '#10B981'
      },
      {
        name: 'Отменен',
        text_color: '#FFFFFF',
        background_color: '#EF4444'
      }
    ];
    
    for (const status of statuses) {
      await sequelize.query(`
        INSERT INTO order_status_os (name, text_color, background_color, created_at, updated_at)
        VALUES (:name, :text_color, :background_color, NOW(), NOW())
      `, {
        replacements: status
      });
    }
    
    console.log('Таблица order_status_os успешно сброшена и заполнена требуемыми статусами.');
    
    // Проверяем результат
    const [results] = await sequelize.query('SELECT * FROM order_status_os ORDER BY id');
    
    console.log('\nТекущие значения в таблице order_status_os:');
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
    console.error('Ошибка при сбросе и заполнении статусов заказа:', error);
    await sequelize.close();
  }
}

resetOrderStatuses();
