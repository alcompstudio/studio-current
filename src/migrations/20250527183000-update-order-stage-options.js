'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Сначала проверим, существует ли таблица order_stage_options
    const tableExists = await queryInterface.tableExists('order_stage_options');
    
    if (tableExists) {
      // Удаляем старые колонки, которые больше не нужны
      await queryInterface.removeColumn('order_stage_options', 'is_calculable');
      await queryInterface.removeColumn('order_stage_options', 'included_in_price');
      await queryInterface.removeColumn('order_stage_options', 'calculation_formula');
      await queryInterface.removeColumn('order_stage_options', 'plan_units');
      await queryInterface.removeColumn('order_stage_options', 'unit_divider');
      await queryInterface.removeColumn('order_stage_options', 'calculated_plan_price');
      
      // Добавляем новые колонки
      await queryInterface.addColumn('order_stage_options', 'pricing_type', {
        type: Sequelize.ENUM('calculable', 'included'),
        allowNull: false,
        defaultValue: 'included'
      });
      
      await queryInterface.addColumn('order_stage_options', 'volume_min', {
        type: Sequelize.DECIMAL(12, 4),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'volume_max', {
        type: Sequelize.DECIMAL(12, 4),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'volume_unit', {
        type: Sequelize.STRING(20),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'nominal_volume', {
        type: Sequelize.DECIMAL(12, 4),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'calculated_price_min', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'calculated_price_max', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
    } else {
      // Если таблицы нет, создаем её с нуля
      await queryInterface.createTable('order_stage_options', {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },
        order_stage_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'order_stages',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        pricing_type: {
          type: Sequelize.ENUM('calculable', 'included'),
          allowNull: false,
          defaultValue: 'included'
        },
        volume_min: {
          type: Sequelize.DECIMAL(12, 4),
          allowNull: true
        },
        volume_max: {
          type: Sequelize.DECIMAL(12, 4),
          allowNull: true
        },
        volume_unit: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        nominal_volume: {
          type: Sequelize.DECIMAL(12, 4),
          allowNull: true
        },
        price_per_unit: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        calculated_price_min: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        calculated_price_max: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        }
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('order_stage_options');
    
    if (tableExists) {
      // Удаляем новые колонки
      await queryInterface.removeColumn('order_stage_options', 'pricing_type');
      await queryInterface.removeColumn('order_stage_options', 'volume_min');
      await queryInterface.removeColumn('order_stage_options', 'volume_max');
      await queryInterface.removeColumn('order_stage_options', 'volume_unit');
      await queryInterface.removeColumn('order_stage_options', 'nominal_volume');
      await queryInterface.removeColumn('order_stage_options', 'calculated_price_min');
      await queryInterface.removeColumn('order_stage_options', 'calculated_price_max');
      
      // Возвращаем старые колонки
      await queryInterface.addColumn('order_stage_options', 'is_calculable', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
      
      await queryInterface.addColumn('order_stage_options', 'included_in_price', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'calculation_formula', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'plan_units', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'unit_divider', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
      
      await queryInterface.addColumn('order_stage_options', 'calculated_plan_price', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
    }
  }
};
