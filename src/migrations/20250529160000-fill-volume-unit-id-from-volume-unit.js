'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Получаем все единицы измерения
    const units = await queryInterface.sequelize.query(
      'SELECT id, short_name FROM unit_os',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Создаем объект для быстрого поиска ID по краткому названию
    const unitMap = {};
    units.forEach(unit => {
      unitMap[unit.short_name] = unit.id;
    });

    // Получаем все опции с заполненным volume_unit
    const options = await queryInterface.sequelize.query(
      'SELECT id, volume_unit FROM order_stage_options WHERE volume_unit IS NOT NULL',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    console.log(`Найдено ${options.length} опций для обновления`);
    console.log('Карта соответствий единиц измерения:', unitMap);

    // Обновляем записи
    let updatedCount = 0;
    let skippedCount = 0;

    for (const option of options) {
      const unitId = unitMap[option.volume_unit];
      if (unitId) {
        await queryInterface.sequelize.query(
          'UPDATE order_stage_options SET volume_unit_id = ? WHERE id = ?',
          {
            replacements: [unitId, option.id],
            type: queryInterface.sequelize.QueryTypes.UPDATE
          }
        );
        updatedCount++;
      } else {
        console.log(`Не найдено соответствие для единицы измерения: "${option.volume_unit}"`);
        skippedCount++;
      }
    }

    console.log(`Обновлено ${updatedCount} опций, пропущено ${skippedCount} опций`);
  },

  async down(queryInterface, Sequelize) {
    // При необходимости отката
    await queryInterface.sequelize.query(
      'UPDATE order_stage_options SET volume_unit_id = NULL'
    );
    console.log('Все значения volume_unit_id сброшены');
  }
};
