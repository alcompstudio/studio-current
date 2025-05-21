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
        name: 'В работе',
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
        name: 'Завершен',
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

    // Используем bulkInsert для вставки, но с опцией updateOnDuplicate для name, если хотим поведение upsert.
    // Однако, стандартный bulkInsert не поддерживает updateOnDuplicate напрямую для всех диалектов без кастомных решений.
    // Проще всего сначала удалить существующие (если это допустимо для сидов), а потом вставить.
    // Либо, для сидов, мы можем просто вставлять, предполагая, что таблица пуста или дубликаты по 'name' вызовут ошибку
    // (т.к. у нас unique constraint на name).
    // Для простоты, если сиды запускаются на чистую таблицу или если ошибки дубликатов приемлемы при повторном запуске,
    // можно просто использовать bulkInsert.
    // Если нужно поведение "вставить или обновить", это сложнее и зависит от диалекта БД.
    // Для PostgreSQL можно использовать ON CONFLICT DO UPDATE.
    // Пока что сделаем простой bulkInsert.

    try {
      await queryInterface.bulkInsert('project_status_os', statuses, {});
    } catch (error) {
      console.error('Error in bulkInsert for project_status_os:', error);
      // Если у вас PostgreSQL и вы хотите "upsert" по полю name:
      // for (const status of statuses) {
      //   await queryInterface.sequelize.query(
      //     `INSERT INTO "project_status_os" (name, text_color, background_color, created_at, updated_at)
      //      VALUES (:name, :text_color, :background_color, :created_at, :updated_at)
      //      ON CONFLICT (name) DO UPDATE SET
      //        text_color = EXCLUDED.text_color,
      //        background_color = EXCLUDED.background_color,
      //        updated_at = EXCLUDED.updated_at;`,
      //     {
      //       replacements: status,
      //       type: Sequelize.QueryTypes.INSERT,
      //     }
      //   );
      // }
      // console.log('Project statuses upserted successfully using ON CONFLICT for PostgreSQL.');
    }
  },

  async down(queryInterface, Sequelize) {
    // Удаляем только те записи, которые мы добавили, если это возможно (например, по именам)
    // или все записи, если это сид для начального наполнения.
    await queryInterface.bulkDelete('project_status_os', {
      name: ['Новый', 'В работе', 'На паузе', 'Завершен', 'Отменен']
    }, {});
  }
};
