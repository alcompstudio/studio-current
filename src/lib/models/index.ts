import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

import pg from 'pg'; // Явно импортируем pg

// Импортируем функции-дефайнеры моделей
import defineUser from './User'; // <<< ДОБАВЛЕНО
import defineCustomer from './Customer';
import defineProject from './Project';
import defineOrder from './Order';
import defineProjectStatusOS from './ProjectStatusOS'; // Импорт модели статусов проекта
import defineOrderStatusOS from './OrderStatusOS'; // Импорт модели статусов заказа
import defineCurrencyOS from './CurrencyOS'; // Импорт модели валют
import defineStage from './Stage'; // Импорт модели этапов заказа
import defineStageOption from './StageOption'; // Импорт модели опций этапов
import defineStageWorkTypeOS from './StageWorkTypeOS'; // Импорт модели типов работы этапов
import definePricingTypeOs from './PricingTypeOs'; // Импорт модели типов ценообразования опций
import defineUnitOs from './UnitOs'; // Импорт модели единиц измерения
// TODO: Импортировать другие модели по мере необходимости

dotenv.config(); // Загружает переменные из .env файла

// Определяем, запущено ли приложение в Docker
const isRunningInDocker = process.env.DOCKER_ENV === 'true';

// Настройки базы данных
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

// Определяем хост базы данных автоматически
// Если запущено в Docker, используем имя сервиса 'db', иначе 'localhost'
const dbHost = isRunningInDocker ? 'db' : (process.env.DB_HOST || 'localhost');
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

// Лог для отладки
console.log(`[Database] Connecting to ${dbHost}:${dbPort} (${isRunningInDocker ? 'Docker' : 'Local'} environment)`);


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
db.ProjectStatusOS = defineProjectStatusOS(sequelize); // Инициализация модели статусов проекта
db.OrderStatusOS = defineOrderStatusOS(sequelize); // Инициализация модели статусов заказа
db.CurrencyOS = defineCurrencyOS(sequelize); // Инициализация модели валют
db.StageWorkTypeOS = defineStageWorkTypeOS(sequelize); // Инициализация модели типов работы этапов
db.PricingTypeOs = definePricingTypeOs(sequelize); // Инициализация модели типов ценообразования опций
db.UnitOs = defineUnitOs(sequelize); // Инициализация модели единиц измерения
db.Stage = defineStage(sequelize); // Инициализация модели этапов заказа
db.StageOption = defineStageOption(sequelize); // Инициализация модели опций этапов

// Настройка связей между моделями
// Вызываем методы associate для настройки связей, если они определены
// ВАЖНО: вызывать associate только один раз для каждой модели!
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

    // Синхронизируем модели с базой данных (создаем таблицы если их нет)
    await sequelize.sync({ alter: false }); // alter: false чтобы не изменять существующие таблицы
    console.log('Database models synchronized successfully.');

    return true;
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database via authenticate() from models/index.ts:', error);
    throw error; // Перебрасываем ошибку для обработки в вызывающем коде
  }
};

export default db;
