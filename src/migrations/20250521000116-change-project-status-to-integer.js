'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Добавить новую временную колонку status_temp_new с типом INTEGER
      await queryInterface.addColumn('projects', 'status_temp_new', {
        type: Sequelize.INTEGER,
        allowNull: true, // Установите false, если статус обязателен и будет заполнен
      }, { transaction });

      // 2. Скопировать и преобразовать данные из старой колонки 'status' в 'status_temp_new'
      //    ВАЖНО: Этот блок потребует вашего ввода для сопоставления строковых статусов с ID.
      //    Если сопоставление не предоставлено, этот шаг может быть пропущен,
      //    и данные нужно будет переносить вручную или другим скриптом.
      // Пример для PostgreSQL:
      // await queryInterface.sequelize.query(`
      //   UPDATE "projects"
      //   SET "status_temp_new" = CASE "status"
      //     WHEN 'Старый Статус 1' THEN 1
      //     WHEN 'Старый Статус 2' THEN 2
      //     -- Добавьте здесь все ваши сопоставления
      //     ELSE NULL -- или какое-то значение по умолчанию
      //   END;
      // `, { transaction });
            // Для PostgreSQL (и других СУБД, поддерживающих CASE)
      await queryInterface.sequelize.query(`
        UPDATE "projects"
        SET "status_temp_new" = CASE "status"
          WHEN 'Новый' THEN 1
          WHEN 'В работе' THEN 2
          WHEN 'На паузе' THEN 3
          WHEN 'Завершен' THEN 4
          WHEN 'Отменен' THEN 5
          ELSE NULL -- Если старый статус не найден в списке, устанавливаем NULL
        END
        WHERE "status" IS NOT NULL; -- Обновляем только если старый статус существует
      `, { transaction });


      // 3. Удалить старую колонку 'status'
      await queryInterface.removeColumn('projects', 'status', { transaction });

      // 4. Переименовать 'status_temp_new' в 'status'
      await queryInterface.renameColumn('projects', 'status_temp_new', 'status', { transaction });

      // 5. Добавить внешний ключ к новой колонке 'status'
      // Убедитесь, что таблица 'project_status_os' и колонка 'id' существуют
      await queryInterface.addConstraint('projects', {
        fields: ['status'],
        type: 'foreign key',
        name: 'projects_status_id_fkey', // Новое имя для внешнего ключа
        references: {
          table: 'project_status_os',
          field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Удалить внешний ключ
      await queryInterface.removeConstraint('projects', 'projects_status_id_fkey', { transaction });

      // 2. Переименовать новую колонку 'status' обратно в 'status_temp_new'
      await queryInterface.renameColumn('projects', 'status', 'status_temp_new', { transaction });

      // 3. Добавить старую колонку 'status' с типом STRING
      await queryInterface.addColumn('projects', 'status', {
        type: Sequelize.STRING,
        allowNull: true, // или как было до этого
      }, { transaction });

      // 4. Скопировать данные обратно из 'status_temp_new' в 'status' (если нужно)
      //    Это потребует обратного сопоставления ID к строкам.
      // await queryInterface.sequelize.query(`
      //   UPDATE "projects"
      //   SET "status" = CASE "status_temp_new"
      //     WHEN 1 THEN 'Старый Статус 1'
      //     WHEN 2 THEN 'Старый Статус 2'
      //     -- Добавьте здесь все ваши обратные сопоставления
      //     ELSE NULL
      //   END;
      // `, { transaction });
            // Для PostgreSQL (и других СУБД, поддерживающих CASE)
      await queryInterface.sequelize.query(`
        UPDATE "projects"
        SET "status" = CASE "status_temp_new"
          WHEN 1 THEN 'Новый'
          WHEN 2 THEN 'В работе'
          WHEN 3 THEN 'На паузе'
          WHEN 4 THEN 'Завершен'
          WHEN 5 THEN 'Отменен'
          ELSE NULL -- Если числовой ID не найден в актуальном списке, устанавливаем NULL
        END
        WHERE "status_temp_new" IS NOT NULL;
      `, { transaction });


      // 5. Удалить временную колонку 'status_temp_new'
      await queryInterface.removeColumn('projects', 'status_temp_new', { transaction });
    });
  }
};
