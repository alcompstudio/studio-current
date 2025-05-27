'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Сначала переименуем текущее поле work_type в old_work_type, чтобы сохранить данные
    await queryInterface.renameColumn('order_stages', 'work_type', 'old_work_type');
    
    // Создаем новое поле work_type как INTEGER
    await queryInterface.addColumn('order_stages', 'work_type', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'stage_work_type_os',
        key: 'id'
      }
    });

    // Получаем данные из таблицы типов работы
    const workTypes = await queryInterface.sequelize.query(
      'SELECT id, name FROM stage_work_type_os',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Получаем записи из таблицы этапов
    const stages = await queryInterface.sequelize.query(
      'SELECT id, old_work_type FROM order_stages WHERE old_work_type IS NOT NULL',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Обновляем записи, установив соответствующий id из таблицы типов работы
    for (const stage of stages) {
      const matchingWorkType = workTypes.find(wt => wt.name === stage.old_work_type);
      if (matchingWorkType) {
        await queryInterface.sequelize.query(
          `UPDATE order_stages SET work_type = ${matchingWorkType.id} WHERE id = ${stage.id}`
        );
      }
    }

    // Удаляем старое поле
    await queryInterface.removeColumn('order_stages', 'old_work_type');
  },

  async down(queryInterface, Sequelize) {
    // Сначала переименуем текущее поле work_type в temp_work_type
    await queryInterface.renameColumn('order_stages', 'work_type', 'temp_work_type');
    
    // Создаем новое поле work_type как ENUM
    await queryInterface.addColumn('order_stages', 'work_type', {
      type: Sequelize.ENUM('Параллельный', 'Последовательный'),
      allowNull: true
    });

    // Получаем данные из таблицы типов работы
    const workTypes = await queryInterface.sequelize.query(
      'SELECT id, name FROM stage_work_type_os',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Получаем записи из таблицы этапов
    const stages = await queryInterface.sequelize.query(
      'SELECT id, temp_work_type FROM order_stages WHERE temp_work_type IS NOT NULL',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Обновляем записи, устанавливая старое значение ENUM
    for (const stage of stages) {
      const matchingWorkType = workTypes.find(wt => wt.id === parseInt(stage.temp_work_type));
      if (matchingWorkType) {
        await queryInterface.sequelize.query(
          `UPDATE order_stages SET work_type = '${matchingWorkType.name}' WHERE id = ${stage.id}`
        );
      }
    }

    // Удаляем временное поле
    await queryInterface.removeColumn('order_stages', 'temp_work_type');
  }
};
