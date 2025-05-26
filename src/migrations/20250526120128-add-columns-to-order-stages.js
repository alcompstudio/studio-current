'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Проверяем существуют ли колонки в таблице order_stages
      const sequenceExists = await columnExists(queryInterface, 'order_stages', 'sequence');
      const colorExists = await columnExists(queryInterface, 'order_stages', 'color');
      const workTypeExists = await columnExists(queryInterface, 'order_stages', 'work_type');
      const estimatedPriceExists = await columnExists(queryInterface, 'order_stages', 'estimated_price');

      // Добавляем колонку sequence, если она еще не существует
      if (!sequenceExists) {
        await queryInterface.addColumn('order_stages', 'sequence', {
          type: Sequelize.INTEGER,
          allowNull: true
        });
        console.log('Добавлена колонка sequence в таблицу order_stages');
      } else {
        console.log('Колонка sequence уже существует в таблице order_stages');
      }

      // Добавляем колонку color, если она еще не существует
      if (!colorExists) {
        await queryInterface.addColumn('order_stages', 'color', {
          type: Sequelize.STRING(7),
          allowNull: true
        });
        console.log('Добавлена колонка color в таблицу order_stages');
      } else {
        console.log('Колонка color уже существует в таблице order_stages');
      }

      // Добавляем колонку work_type, если она еще не существует
      if (!workTypeExists) {
        await queryInterface.addColumn('order_stages', 'work_type', {
          type: Sequelize.STRING(50),
          allowNull: true
        });
        console.log('Добавлена колонка work_type в таблицу order_stages');
      } else {
        console.log('Колонка work_type уже существует в таблице order_stages');
      }

      // Добавляем колонку estimated_price, если она еще не существует
      if (!estimatedPriceExists) {
        await queryInterface.addColumn('order_stages', 'estimated_price', {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        });
        console.log('Добавлена колонка estimated_price в таблицу order_stages');
      } else {
        console.log('Колонка estimated_price уже существует в таблице order_stages');
      }

    } catch (error) {
      console.error('Ошибка при добавлении колонок в таблицу order_stages:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Удаляем добавленные колонки
      await queryInterface.removeColumn('order_stages', 'sequence');
      await queryInterface.removeColumn('order_stages', 'color');
      await queryInterface.removeColumn('order_stages', 'work_type');
      await queryInterface.removeColumn('order_stages', 'estimated_price');
      
      console.log('Удалены колонки sequence, color, work_type, estimated_price из таблицы order_stages');
    } catch (error) {
      console.error('Ошибка при удалении колонок из таблицы order_stages:', error);
      throw error;
    }
  }
};

// Функция для проверки существования колонки в таблице
async function columnExists(queryInterface, tableName, columnName) {
  try {
    const result = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' 
        AND column_name = '${columnName}'
      );`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    return result[0].exists;
  } catch (error) {
    console.error(`Ошибка при проверке колонки ${columnName} в таблице ${tableName}:`, error);
    return false;
  }
}
