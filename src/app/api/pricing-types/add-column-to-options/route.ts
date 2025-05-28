import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Проверяем существование колонки pricing_type_id в таблице order_stage_options
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'order_stage_options' AND column_name = 'pricing_type_id'
    `;
    
    const columnExists = await db.sequelize.query(
      checkColumnQuery,
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    // Если колонка уже существует, возвращаем сообщение
    if (columnExists.length > 0) {
      return NextResponse.json({ 
        message: 'Колонка pricing_type_id уже существует в таблице order_stage_options' 
      });
    }
    
    // Добавляем колонку pricing_type_id
    await db.sequelize.query(`
      ALTER TABLE order_stage_options 
      ADD COLUMN pricing_type_id INTEGER
    `);
    
    // Заполняем значения на основе существующей колонки pricing_type
    await db.sequelize.query(`
      UPDATE order_stage_options 
      SET pricing_type_id = CASE 
        WHEN pricing_type = 'calculable' THEN 1 
        WHEN pricing_type = 'included' THEN 2 
        ELSE NULL 
      END
    `);
    
    return NextResponse.json({ 
      message: 'Колонка pricing_type_id успешно добавлена в таблицу order_stage_options и заполнена значениями' 
    });
  } catch (error) {
    console.error('Ошибка при добавлении колонки pricing_type_id:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении колонки pricing_type_id' },
      { status: 500 }
    );
  }
}
