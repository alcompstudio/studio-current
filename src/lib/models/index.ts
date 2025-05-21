import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

import pg from 'pg'; // Явно импортируем pg

// Импортируем функции-дефайнеры моделей
import defineUser from './User'; // <<< ДОБАВЛЕНО
import defineCustomer from './Customer';
import defineProject from './Project';
import defineOrder from './Order';
import defineProjectStatusOS from './ProjectStatusOS'; // Импорт новой модели
// TODO: Импортировать другие модели по мере необходимости

dotenv.config(); // Загружает переменные из .env файла

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

if (!dbName || !dbUser || !dbPassword || !dbHost) {
  console.error('Database configuration is missing in .env file. Please check DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST.');
  throw new Error('Database configuration is incomplete.');
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  dialectModule: pg, // <--- Явно указываем модуль для диалекта
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    // ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
  },
});

const db: any = {
  sequelize,
  Sequelize, // Экспортируем сам класс Sequelize для удобства
};

// Определяем модели и сохраняем их в объекте db
db.User = defineUser(sequelize); // <<< ДОБАВЛЕНО
db.Customer = defineCustomer(sequelize);
db.Project = defineProject(sequelize);
db.Order = defineOrder(sequelize);
db.ProjectStatusOS = defineProjectStatusOS(sequelize); // Инициализация и добавление новой модели
// TODO: Добавить другие модели

// Вызываем методы associate для настройки связей, если они определены
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export const connectDB = async () => {
  try {
    console.log('Attempting sequelize.authenticate() from models/index.ts...');
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully via authenticate() from models/index.ts.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database via authenticate() from models/index.ts:', error);
  }
};

export default db;
