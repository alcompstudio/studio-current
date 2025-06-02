'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем таблицу валют
    await queryInterface.createTable('currency_os', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Добавляем индекс для более быстрого поиска по коду валюты
    await queryInterface.addIndex('currency_os', ['code']);
    
    console.log('Таблица currency_os успешно создана');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('currency_os');
    console.log('Таблица currency_os удалена');
  }
};
