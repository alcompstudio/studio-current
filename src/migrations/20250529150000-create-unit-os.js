'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('unit_os', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      short_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Добавляем начальные данные
    await queryInterface.bulkInsert('unit_os', [
      { full_name: 'Штуки', short_name: 'шт.', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Метры', short_name: 'м', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Квадратные метры', short_name: 'м²', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Кубические метры', short_name: 'м³', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Листы', short_name: 'л.', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Упаковки', short_name: 'уп.', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('unit_os');
  }
};
