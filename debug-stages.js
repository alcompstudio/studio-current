import db from './src/lib/db';

(async () => {
  try {
    // Проверяем этапы заказа 4
    const [stages] = await db.sequelize.query(
      'SELECT id, order_id, title FROM order_stages WHERE order_id = 4'
    );
    console.log('Этапы заказа 4:', JSON.stringify(stages, null, 2));
    
    // Проверяем этапы с конкретными ID
    const [stage5] = await db.sequelize.query(
      'SELECT * FROM order_stages WHERE id = 5'
    );
    console.log('Этап ID=5:', JSON.stringify(stage5, null, 2));
    
    const [stage6] = await db.sequelize.query(
      'SELECT * FROM order_stages WHERE id = 6'
    );
    console.log('Этап ID=6:', JSON.stringify(stage6, null, 2));
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  } finally {
    process.exit(0);
  }
})();
