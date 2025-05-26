'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Проверяем существует ли колонка status в таблице order_stages
      const statusExists = await columnExists(queryInterface, 'order_stages', 'status');

      if (!statusExists) {
        // Добавляем колонку status с дефолтным значением 'active'
        await queryInterface.addColumn('order_stages', 'status', {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: 'active'
        });
        console.log('Добавлена колонка status в таблицу order_stages');
      } else {
        // Обновляем колонку status, добавляя дефолтное значение 'active' и делая NOT NULL
        await queryInterface.changeColumn('order_stages', 'status', {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: 'active'
        });
        console.log('Обновлена колонка status в таблице order_stages');
      }

      // Обновляем существующие записи, где status = NULL
      await queryInterface.sequelize.query(
        `UPDATE order_stages SET status = 'active' WHERE status IS NULL;`
      );
      console.log('Обновлены записи с пустым статусом');

    } catch (error) {
      console.error('Ошибка при добавлении колонки status в таблицу order_stages:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Удаляем ограничение NOT NULL и значение по умолчанию
      await queryInterface.changeColumn('order_stages', 'status', {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null
      });
      console.log('Изменена колонка status в таблице order_stages');
    } catch (error) {
      console.error('Ошибка при откате изменений колонки status:', error);
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
