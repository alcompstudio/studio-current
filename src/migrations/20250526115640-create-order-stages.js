'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Проверяем существование таблицы order_stages
    try {
      // Проверяем, существует ли таблица order_stages
      const tablesResult = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'order_stages'
        );`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      const orderStagesExists = tablesResult[0].exists;
      
      if (!orderStagesExists) {
        // Создание таблицы order_stages
        await queryInterface.createTable('order_stages', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          order_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'orders',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          title: {
            type: Sequelize.STRING(255),
            allowNull: false
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          sequence: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          color: {
            type: Sequelize.STRING(7),
            allowNull: true
          },
          work_type: {
            type: Sequelize.STRING(50),
            allowNull: true
          },
          estimated_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        });

        console.log('Таблица order_stages создана');

        // Проверяем индекс перед его созданием
        const indexResult = await queryInterface.sequelize.query(
          `SELECT EXISTS (
            SELECT FROM pg_indexes 
            WHERE indexname = 'idx_order_stages_order_id'
          );`,
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const indexExists = indexResult[0].exists;

        if (!indexExists) {
          // Создание индекса для order_id
          await queryInterface.addIndex('order_stages', ['order_id'], {
            name: 'idx_order_stages_order_id'
          });
          console.log('Индекс idx_order_stages_order_id создан');
        } else {
          console.log('Индекс idx_order_stages_order_id уже существует');
        }
      } else {
        console.log('Таблица order_stages уже существует');
      }

      // Проверяем, существует ли таблица order_stage_options
      const optionsTableResult = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'order_stage_options'
        );`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      const orderStageOptionsExists = optionsTableResult[0].exists;
      
      if (!orderStageOptionsExists) {
        // Создание таблицы order_stage_options
        await queryInterface.createTable('order_stage_options', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          order_stage_id: {
            type: Sequelize.INTEGER,
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
          is_calculable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          included_in_price: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
          },
          calculation_formula: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          plan_units: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
          },
          unit_divider: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
          },
          price_per_unit: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
          },
          calculated_plan_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        });

        console.log('Таблица order_stage_options создана');

        // Проверяем индекс перед его созданием
        const optionsIndexResult = await queryInterface.sequelize.query(
          `SELECT EXISTS (
            SELECT FROM pg_indexes 
            WHERE indexname = 'idx_order_stage_options_order_stage_id'
          );`,
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const optionsIndexExists = optionsIndexResult[0].exists;

        if (!optionsIndexExists) {
          // Создание индекса для order_stage_id
          await queryInterface.addIndex('order_stage_options', ['order_stage_id'], {
            name: 'idx_order_stage_options_order_stage_id'
          });
          console.log('Индекс idx_order_stage_options_order_stage_id создан');
        } else {
          console.log('Индекс idx_order_stage_options_order_stage_id уже существует');
        }
      } else {
        console.log('Таблица order_stage_options уже существует');
      }

    } catch (error) {
      console.error('Ошибка при создании таблиц: ', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Удаляем таблицы в обратном порядке, чтобы избежать проблем с внешними ключами
    await queryInterface.dropTable('order_stage_options');
    await queryInterface.dropTable('order_stages');
  }
};
