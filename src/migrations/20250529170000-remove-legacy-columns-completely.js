'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Проверка наличия полей перед удалением
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

    // Удаляем поля, если они существуют
    // 1. Сначала необходимо удалить ограничение ENUM для поля pricing_type
    if (hasPricingType) {
      console.log('Удаление устаревшего поля pricing_type из таблицы order_stage_options');
      
      // Удаляем поле pricing_type
      await queryInterface.removeColumn('order_stage_options', 'pricing_type');
      
      // Проверяем, существует ли тип ENUM "order_stage_options_pricing_type_enum"
      const enumExists = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT 1 FROM pg_type 
          WHERE typname = 'order_stage_options_pricing_type_enum'
        )`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      // Если ENUM существует, удаляем его
      if (enumExists[0].exists) {
        await queryInterface.sequelize.query(
          `DROP TYPE IF EXISTS "order_stage_options_pricing_type_enum"`
        );
        console.log('Удален ENUM тип order_stage_options_pricing_type_enum');
      }
    } else {
      console.log('Поле pricing_type уже удалено из таблицы order_stage_options');
    }

    // 2. Удаляем поле volume_unit
    if (hasVolumeUnit) {
      console.log('Удаление устаревшего поля volume_unit из таблицы order_stage_options');
      await queryInterface.removeColumn('order_stage_options', 'volume_unit');
    } else {
      console.log('Поле volume_unit уже удалено из таблицы order_stage_options');
    }

    // 3. Обновляем комментарии к полям
    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN order_stage_options.pricing_type_id IS 'ID типа ценообразования из таблицы pricing_type_os';
      COMMENT ON COLUMN order_stage_options.volume_unit_id IS 'ID единицы измерения из таблицы unit_os';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Восстанавливаем поля при откате миграции
    
    // 1. Создаем ENUM тип для pricing_type, если его нет
    const enumExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'order_stage_options_pricing_type_enum'
      )`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (!enumExists[0].exists) {
      await queryInterface.sequelize.query(
        `CREATE TYPE "order_stage_options_pricing_type_enum" AS ENUM ('calculable', 'included')`
      );
    }
    
    // 2. Добавляем поле pricing_type
    const pricingTypeExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_stage_options' AND column_name = 'pricing_type'
      )`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (!pricingTypeExists[0].exists) {
      await queryInterface.addColumn('order_stage_options', 'pricing_type', {
        type: Sequelize.ENUM('calculable', 'included'),
        allowNull: true
      });

      // Заполняем данные на основе pricing_type_id
      await queryInterface.sequelize.query(`
        UPDATE order_stage_options 
        SET pricing_type = CASE 
          WHEN pricing_type_id = 1 THEN 'calculable'
          ELSE 'included'
        END
        WHERE pricing_type_id IS NOT NULL
      `);
    }
    
    // 3. Добавляем поле volume_unit
    const volumeUnitExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_stage_options' AND column_name = 'volume_unit'
      )`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (!volumeUnitExists[0].exists) {
      await queryInterface.addColumn('order_stage_options', 'volume_unit', {
        type: Sequelize.STRING(20),
        allowNull: true
      });

      // Заполняем данные на основе volume_unit_id
      await queryInterface.sequelize.query(`
        UPDATE order_stage_options o
        SET volume_unit = u.short_name
        FROM unit_os u
        WHERE o.volume_unit_id = u.id AND o.volume_unit_id IS NOT NULL
      `);
    }
  }
};
