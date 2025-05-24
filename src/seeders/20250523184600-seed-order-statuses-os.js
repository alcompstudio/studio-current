'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const statuses = [
      {
        name: 'Новый',
        text_color: '#000000',
        background_color: '#E0E0E0',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Сбор ставок',
        text_color: '#FFFFFF',
        background_color: '#3B82F6',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'На паузе',
        text_color: '#000000',
        background_color: '#F59E0B',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Сбор завершен',
        text_color: '#FFFFFF',
        background_color: '#10B981',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Отменен',
        text_color: '#FFFFFF',
        background_color: '#EF4444',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    try {
      await queryInterface.bulkInsert('order_status_os', statuses, {});
    } catch (error) {
      console.error('Error in bulkInsert for order_status_os:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_status_os', {
      name: ['Новый', 'Сбор ставок', 'На паузе', 'Сбор завершен', 'Отменен']
    }, {});
  }
};
