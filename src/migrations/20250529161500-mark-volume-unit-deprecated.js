'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем комментарий к колонке volume_unit, отмечая её как устаревшую
    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN order_stage_options.volume_unit IS 'DEPRECATED: Использовать volume_unit_id. Оставлено для обратной совместимости';
    `);

    console.log('Колонка volume_unit отмечена как устаревшая в комментарии к таблице');
    
    // Добавляем также комментарий к колонке volume_unit_id
    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN order_stage_options.volume_unit_id IS 'Связь с таблицей единиц измерения (unit_os)';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Удаляем комментарии при откате
    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN order_stage_options.volume_unit IS NULL;
      COMMENT ON COLUMN order_stage_options.volume_unit_id IS NULL;
    `);
  }
};
