'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Проверяем существование колонки volume_unit_id
    const checkColumnQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'order_stage_options' 
        AND column_name = 'volume_unit_id'
      );
    `;

    const [results] = await queryInterface.sequelize.query(checkColumnQuery);
    const columnExists = results[0].exists;

    if (columnExists) {
      console.log('Колонка volume_unit_id уже существует в таблице order_stage_options');
      return;
    }

    // Добавляем колонку volume_unit_id
    await queryInterface.addColumn('order_stage_options', 'volume_unit_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // Добавляем внешний ключ
    await queryInterface.addConstraint('order_stage_options', {
      fields: ['volume_unit_id'],
      type: 'foreign key',
      name: 'fk_volume_unit_id',
      references: {
        table: 'unit_os',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    console.log('Колонка volume_unit_id успешно добавлена в таблицу order_stage_options');
  },

  async down(queryInterface, Sequelize) {
    // Удаляем внешний ключ
    await queryInterface.removeConstraint('order_stage_options', 'fk_volume_unit_id');
    
    // Удаляем колонку
    await queryInterface.removeColumn('order_stage_options', 'volume_unit_id');
  }
};
