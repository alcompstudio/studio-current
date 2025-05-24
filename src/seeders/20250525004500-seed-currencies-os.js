'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Подготавливаем данные для заполнения таблицы currency_os
    const currencies = [
      {
        iso_code: 'USD',
        name: 'Доллар США',
        symbol: '$',
        exchange_rate: 1.0000,
        created_at: now,
        updated_at: now
      },
      {
        iso_code: 'EUR',
        name: 'Евро',
        symbol: '€',
        exchange_rate: 0.9200,
        created_at: now,
        updated_at: now
      },
      {
        iso_code: 'RUB',
        name: 'Российский рубль',
        symbol: '₽',
        exchange_rate: 90.5000,
        created_at: now,
        updated_at: now
      },
      {
        iso_code: 'GBP',
        name: 'Фунт стерлингов',
        symbol: '£',
        exchange_rate: 0.7800,
        created_at: now,
        updated_at: now
      },
      {
        iso_code: 'JPY',
        name: 'Японская иена',
        symbol: '¥',
        exchange_rate: 110.5000,
        created_at: now,
        updated_at: now
      },
      {
        iso_code: 'CNY',
        name: 'Китайский юань',
        symbol: '¥',
        exchange_rate: 6.4500,
        created_at: now,
        updated_at: now
      }
    ];

    try {
      // Вставляем данные в таблицу currency_os
      await queryInterface.bulkInsert('currency_os', currencies, {});
      console.log('Успешно добавлены валюты в таблицу currency_os');
    } catch (error) {
      console.error('Ошибка при вставке валют в currency_os:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    // Удаляем все записи из таблицы currency_os
    await queryInterface.bulkDelete('currency_os', {
      iso_code: {
        [Sequelize.Op.in]: ['USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CNY']
      }
    }, {});
  }
};
