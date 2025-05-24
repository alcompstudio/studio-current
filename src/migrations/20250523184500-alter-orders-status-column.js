'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Добавляем новый столбец для ID статуса
    await queryInterface.addColumn('orders', 'status_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Сначала null, потом сделаем NOT NULL
    });

    // 2. Обновляем новый столбец статусов для существующих заказов
    // Предполагаем, что статус с ID=1 ("Новый") существует в таблице order_status_os
    await queryInterface.sequelize.query(`
      UPDATE orders SET status_id = 1
      WHERE status IN ('Новый', 'new', 'новый')
    `);

    await queryInterface.sequelize.query(`
      UPDATE orders SET status_id = 2
      WHERE status IN ('В работе', 'in_progress', 'в работе')
    `);

    await queryInterface.sequelize.query(`
      UPDATE orders SET status_id = 3
      WHERE status IN ('На паузе', 'paused', 'на паузе')
    `);

    await queryInterface.sequelize.query(`
      UPDATE orders SET status_id = 4
      WHERE status IN ('Завершен', 'completed', 'завершен')
    `);

    await queryInterface.sequelize.query(`
      UPDATE orders SET status_id = 5
      WHERE status IN ('Отменен', 'cancelled', 'отменен')
    `);

    // Если есть записи с другими статусами, установим им статус "Новый" (ID=1)
    await queryInterface.sequelize.query(`
      UPDATE orders SET status_id = 1
      WHERE status_id IS NULL
    `);

    // 3. Удаляем старый столбец status (VARCHAR)
    await queryInterface.removeColumn('orders', 'status');

    // 4. Переименовываем новый столбец в 'status'
    await queryInterface.renameColumn('orders', 'status_id', 'status');

    // 5. Устанавливаем ограничение NOT NULL для нового столбца status
    await queryInterface.changeColumn('orders', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // 6. Добавляем внешний ключ к таблице order_status_os
    await queryInterface.addConstraint('orders', {
      fields: ['status'],
      type: 'foreign key',
      name: 'fk_orders_order_status_os',
      references: {
        table: 'order_status_os',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    // 7. Добавляем индекс на новый столбец status для производительности
    await queryInterface.addIndex('orders', ['status'], {
      name: 'idx_orders_status'
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Удаляем внешний ключ
    await queryInterface.removeConstraint('orders', 'fk_orders_order_status_os');
    
    // 2. Удаляем индекс
    await queryInterface.removeIndex('orders', 'idx_orders_status');
    
    // 3. Переименовываем текущий столбец status обратно в status_id
    await queryInterface.renameColumn('orders', 'status', 'status_id');
    
    // 4. Добавляем новый текстовый столбец status
    await queryInterface.addColumn('orders', 'status', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    
    // 5. Копируем данные из order_status_os обратно в текстовое поле status
    // Для каждого значения status_id найдем соответствующее имя в order_status_os
    await queryInterface.sequelize.query(`
      UPDATE orders o
      SET status = (SELECT name FROM order_status_os os WHERE os.id = o.status_id)
    `);
    
    // 6. Делаем status NOT NULL
    await queryInterface.changeColumn('orders', 'status', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    
    // 7. Удаляем столбец status_id
    await queryInterface.removeColumn('orders', 'status_id');
  }
};
