import defaultDbObject, { connectDB as connectDBFromModels } from './models'; // Импортируем объект по умолчанию и именованный connectDB

// Ре-экспортируем свойства объекта db
export const { 
  sequelize, 
  Sequelize, 
  User, 
  Customer, 
  Project, 
  Order, 
  ProjectStatusOS, 
  CurrencyOS,
  Stage,
  StageOption
} = defaultDbObject;

// Ре-экспортируем connectDB как именованный экспорт
export const connectDB = connectDBFromModels;

// Экспортируем объект db как экспорт по умолчанию
export default defaultDbObject;
