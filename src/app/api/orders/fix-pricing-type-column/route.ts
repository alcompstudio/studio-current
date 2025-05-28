import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/models';
import db from '@/lib/models';

// Миграция для добавления столбца pricing_type_id в таблицу order_stage_options
export async function POST() {
  try {
    await connectDB();
    const sequelize = db.sequelize;
    
    // Проверка существования столбца pricing_type_id в таблице order_stage_options
    const columnExists = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'order_stage_options' AND column_name = 'pricing_type_id'
      );
    `, { type: db.Sequelize.QueryTypes.SELECT });
    
    const exists = columnExists[0].exists;
    
    if (exists) {
      return NextResponse.json({ 
        message: 'Столбец pricing_type_id уже существует в таблице order_stage_options',
        created: false
      });
    }
    
    // Добавление столбца pricing_type_id в таблицу order_stage_options
    await sequelize.query(`
      ALTER TABLE order_stage_options
      ADD COLUMN pricing_type_id INTEGER;
    `);
    
    // Обновление значений в соответствии с pricing_type
    await sequelize.query(`
      UPDATE order_stage_options
      SET pricing_type_id = CASE
          WHEN pricing_type = 'calculable' THEN 1
          WHEN pricing_type = 'included' THEN 2
          ELSE NULL
        END;
    `);
    
    // Добавление внешнего ключа
    await sequelize.query(`
      ALTER TABLE order_stage_options
      ADD CONSTRAINT fk_pricing_type_id
      FOREIGN KEY (pricing_type_id)
      REFERENCES pricing_type_os (id);
    `);
    
    return NextResponse.json({ 
      message: 'Столбец pricing_type_id успешно добавлен и заполнен данными',
      created: true
    });
  } catch (error) {
    console.error('Ошибка при добавлении столбца pricing_type_id:', error);
    return NextResponse.json(
      { error: 'Не удалось добавить столбец pricing_type_id' },
      { status: 500 }
    );
  }
}

// Метод для получения информации о столбце pricing_type_id
export async function GET() {
  try {
    await connectDB();
    const sequelize = db.sequelize;
    
    // Проверка существования столбца pricing_type_id в таблице order_stage_options
    const columnExists = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'order_stage_options' AND column_name = 'pricing_type_id'
      );
    `, { type: db.Sequelize.QueryTypes.SELECT });
    
    const exists = columnExists[0].exists;
    
    if (!exists) {
      return NextResponse.json({ 
        message: 'Столбец pricing_type_id не существует в таблице order_stage_options',
        exists: false
      });
    }
    
    // Получение информации о соотношении pricing_type и pricing_type_id
    const stats = await sequelize.query(`
      SELECT 
        pricing_type,
        pricing_type_id,
        COUNT(*) as count
      FROM order_stage_options
      GROUP BY pricing_type, pricing_type_id
      ORDER BY count DESC;
    `, { type: db.Sequelize.QueryTypes.SELECT });
    
    return NextResponse.json({ 
      message: 'Столбец pricing_type_id существует в таблице order_stage_options',
      exists: true,
      statistics: stats
    });
  } catch (error) {
    console.error('Ошибка при получении информации о столбце pricing_type_id:', error);
    return NextResponse.json(
      { error: 'Не удалось получить информацию о столбце pricing_type_id' },
      { status: 500 }
    );
  }
}
