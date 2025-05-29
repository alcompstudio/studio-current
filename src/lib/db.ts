import db from './models';

// Ре-экспортируем все модели и утилиты
export const sequelize = db.sequelize;
export const Sequelize = db.Sequelize;
export const User = db.User;
export const Customer = db.Customer;
export const Project = db.Project;
export const Order = db.Order;
export const ProjectStatusOS = db.ProjectStatusOS;
export const CurrencyOS = db.CurrencyOS;
export const Stage = db.Stage;
export const StageOption = db.StageOption;
export const UnitOs = db.UnitOs;

// Ре-экспортируем connectDB
export const connectDB = db.connectDB;

// Экспортируем объект db как экспорт по умолчанию
export default db;
