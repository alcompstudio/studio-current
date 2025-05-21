// e:\Business\Projects\studio\src\migrations\20250521000115-create-project-status-os.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_status_os', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      // В модели мы указали 'textColor' и 'backgroundColor' с field: 'text_color' и field: 'background_color'
      // поэтому здесь используем snake_case для имен столбцов
      text_color: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      background_color: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      created_at: { // Sequelize автоматически управляет createdAt и updatedAt, если underscored: true в модели
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Для PostgreSQL можно так, или Sequelize сам обработает
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_status_os');
  }
};
