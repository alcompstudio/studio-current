/**
 * Скрипт для проверки настроек окружения
 * Запускать: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Загрузка переменных окружения
require('dotenv').config();

// Проверка наличия необходимых переменных окружения
const requiredEnvVars = [
  'DB_NAME',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'NODE_ENV'
];

console.log('🔍 Проверка настроек окружения...\n');

// Вывод текущего NODE_ENV
console.log(`📌 Режим работы: ${process.env.NODE_ENV}`);
console.log(`📌 URL API: ${process.env.NEXT_PUBLIC_API_URL}`);
console.log('');

// Проверка переменных окружения
let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Отсутствуют необходимые переменные окружения:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nПроверьте файл .env и убедитесь, что все переменные заданы.');
  process.exit(1);
}

// Проверка подключения к базе данных
console.log('🔌 Проверка подключения к базе данных...');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false
  }
);

// Проверка соединения
sequelize.authenticate()
  .then(() => {
    console.log('✅ Подключение к базе данных успешно!');
    console.log(`   - Хост: ${process.env.DB_HOST}`);
    console.log(`   - База данных: ${process.env.DB_NAME}`);
    console.log(`   - Пользователь: ${process.env.DB_USERNAME}`);
    console.log('\n✅ Окружение настроено правильно. Можно разрабатывать!');
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к базе данных:');
    console.error(err.message);
    console.error('\nПроверьте настройки подключения к базе данных в файле .env.');
    
    if (process.env.DB_HOST === 'localhost') {
      console.log('\n💡 Советы:');
      console.log('  1. Убедитесь, что PostgreSQL запущен на вашем компьютере');
      console.log('  2. Проверьте, что база данных и пользователь существуют');
      console.log('  3. Проверьте пароль пользователя');
    }
  })
  .finally(() => {
    sequelize.close();
  });
