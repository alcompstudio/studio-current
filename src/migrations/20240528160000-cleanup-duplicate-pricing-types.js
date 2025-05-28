'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Удаляем дублирующиеся записи с id 3 и 4
    await queryInterface.sequelize.query(`DELETE FROM pricing_type_os WHERE id IN (3, 4);`);
    
    // Проверяем, что осталось только две записи
    console.log('Выполнена очистка дублирующихся записей в таблице pricing_type_os');
  },

  async down(queryInterface, Sequelize) {
    // Восстанавливаем удаленные записи (не требуется, так как они были дубликатами)
    console.log('Это операция удаления дубликатов, откат не требуется');
  }
};
