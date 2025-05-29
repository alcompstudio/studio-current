const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

async function runMigrations() {
  const env = process.env.NODE_ENV || 'development';
  const dbConfig = config[env];
  
  const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: console.log
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Выполняем миграцию для создания таблицы unit_os
    const createTableSQL = fs.readFileSync(path.join(__dirname, 'create_unit_os_table.sql'), 'utf8');
    await sequelize.query(createTableSQL);
    console.log('Table unit_os created successfully');

    // Выполняем миграцию для добавления колонки
    const alterTableSQL = fs.readFileSync(path.join(__dirname, 'add_volume_unit_id_column.sql'), 'utf8');
    await sequelize.query(alterTableSQL);
    console.log('Column volume_unit_id added successfully');

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await sequelize.close();
  }
}

runMigrations();
