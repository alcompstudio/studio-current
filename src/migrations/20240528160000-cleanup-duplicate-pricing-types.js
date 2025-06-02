// Эта миграция была перенесена на более позднюю дату, чтобы выполняться после создания таблицы pricing_type_os
'use strict';

// Эта миграция была перенесена в файл 20240720000000-cleanup-duplicate-pricing-types.js
// чтобы выполняться после создания таблицы pricing_type_os

module.exports = {
  async up(queryInterface, Sequelize) {
    // Пустая миграция, реальная логика перенесена в 20240720000000-cleanup-duplicate-pricing-types.js
    console.log('Эта миграция отключена, используйте 20240720000000-cleanup-duplicate-pricing-types.js');
  },

  async down(queryInterface, Sequelize) {
    // Пустая миграция
    console.log('Эта миграция отключена, используйте 20240720000000-cleanup-duplicate-pricing-types.js');
  }
};
