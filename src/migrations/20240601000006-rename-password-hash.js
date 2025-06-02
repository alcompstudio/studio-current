'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Переименовываем колонку password_hash в passwordHash
    await queryInterface.renameColumn('users', 'password_hash', 'passwordHash');
    console.log('Колонка password_hash переименована в passwordHash');
  },

  async down(queryInterface, Sequelize) {
    // Возвращаем обратно
    await queryInterface.renameColumn('users', 'passwordHash', 'password_hash');
    console.log('Колонка passwordHash переименована обратно в password_hash');
  }
};
