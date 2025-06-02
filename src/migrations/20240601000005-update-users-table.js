'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем недостающие колонки в таблицу users
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });

    // Обновляем существующего пользователя с хешем пароля
    await queryInterface.sequelize.query(
      `UPDATE users SET password = '$2a$10$XFD9QJYb1R/mnW5J5U0x7O9X9V5X9JZ5X9JZ5X9JZ5X9JZ5X9JZ5X9JZ5' WHERE email = 'admin@example.com';`
    );

    console.log('Таблица users успешно обновлена');
  },

  async down(queryInterface, Sequelize) {
    // Откатываем изменения
    await queryInterface.removeColumn('users', 'password');
    console.log('Изменения в таблице users отменены');
  }
};
