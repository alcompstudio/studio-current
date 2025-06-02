// Вторая миграция для создания базовых таблиц, выполняется после создания customers
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем базовую таблицу projects
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    console.log('Таблица projects успешно создана');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
    console.log('Таблица projects удалена');
  }
};
