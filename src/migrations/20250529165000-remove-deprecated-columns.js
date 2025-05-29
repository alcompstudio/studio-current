'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Проверяем существование колонок перед удалением
    const checkColumns = async () => {
      const columns = await queryInterface.sequelize.query(
        `SELECT column_name 
         FROM information_schema.columns 
         WHERE table_name = 'order_stage_options' 
         AND column_name IN ('pricing_type', 'volume_unit')`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      return {
        hasPricingType: columns.some(col => col.column_name === 'pricing_type'),
        hasVolumeUnit: columns.some(col => col.column_name === 'volume_unit')
      };
    };

    const { hasPricingType, hasVolumeUnit } = await checkColumns();

    // Удаляем устаревшие колонки, если они существуют
    if (hasPricingType) {
      console.log('Удаление колонки pricing_type из таблицы order_stage_options');
      await queryInterface.removeColumn('order_stage_options', 'pricing_type');
    } else {
      console.log('Колонка pricing_type не найдена в таблице order_stage_options');
    }

    if (hasVolumeUnit) {
      console.log('Удаление колонки volume_unit из таблицы order_stage_options');
      await queryInterface.removeColumn('order_stage_options', 'volume_unit');
    } else {
      console.log('Колонка volume_unit не найдена в таблице order_stage_options');
    }
  },

  async down(queryInterface, Sequelize) {
    // Восстанавливаем колонки при откате миграции
    
    // Проверяем наличие колонок перед добавлением
    const checkColumns = async () => {
      const columns = await queryInterface.sequelize.query(
        `SELECT column_name 
         FROM information_schema.columns 
         WHERE table_name = 'order_stage_options' 
         AND column_name IN ('pricing_type', 'volume_unit')`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      return {
        hasPricingType: columns.some(col => col.column_name === 'pricing_type'),
        hasVolumeUnit: columns.some(col => col.column_name === 'volume_unit')
      };
    };

    const { hasPricingType, hasVolumeUnit } = await checkColumns();

    // Добавляем колонки обратно, если их нет
    if (!hasPricingType) {
      await queryInterface.addColumn('order_stage_options', 'pricing_type', {
        type: Sequelize.ENUM('calculable', 'included'),
        allowNull: true
      });
    }

    if (!hasVolumeUnit) {
      await queryInterface.addColumn('order_stage_options', 'volume_unit', {
        type: Sequelize.STRING(20),
        allowNull: true
      });
    }
  }
};
