// Первая миграция для создания базовых таблиц
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем базовую таблицу customers
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true
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

    console.log('Таблица customers успешно создана');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
    console.log('Таблица customers удалена');
  }
};
