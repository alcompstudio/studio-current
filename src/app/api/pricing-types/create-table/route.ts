import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/models';
import db from '@/lib/models';

// Миграция для создания таблицы pricing_type_os и добавления начальных данных
export async function POST() {
  try {
    await connectDB();
    const sequelize = db.sequelize;
    
    // Проверка существования таблицы pricing_type_os
    const tableExists = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pricing_type_os'
      );
    `, { type: db.Sequelize.QueryTypes.SELECT });
    
    const exists = tableExists[0].exists;
    
    if (exists) {
      return NextResponse.json({ 
        message: 'Таблица pricing_type_os уже существует',
        created: false
      });
    }
    
    // Создание таблицы pricing_type_os
    await sequelize.query(`
      CREATE TABLE pricing_type_os (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Добавление начальных данных
    await sequelize.query(`
      INSERT INTO pricing_type_os (name, created_at, updated_at) 
      VALUES 
        ('Калькулируемая', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Входит в стоимость', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `);
    
    return NextResponse.json({ 
      message: 'Таблица pricing_type_os успешно создана и заполнена начальными данными',
      created: true
    });
  } catch (error) {
    console.error('Ошибка при создании таблицы pricing_type_os:', error);
    return NextResponse.json(
      { error: 'Не удалось создать таблицу pricing_type_os' },
      { status: 500 }
    );
  }
}

// Метод для получения информации о таблице и ее записях
export async function GET() {
  try {
    await connectDB();
    const sequelize = db.sequelize;
    
    // Проверка существования таблицы pricing_type_os
    const tableExists = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pricing_type_os'
      );
    `, { type: db.Sequelize.QueryTypes.SELECT });
    
    const exists = tableExists[0].exists;
    
    if (!exists) {
      return NextResponse.json({ 
        message: 'Таблица pricing_type_os не существует',
        exists: false,
        records: []
      });
    }
    
    // Получение всех записей из таблицы
    const records = await sequelize.query(`
      SELECT * FROM pricing_type_os ORDER BY id;
    `, { type: db.Sequelize.QueryTypes.SELECT });
    
    return NextResponse.json({ 
      message: 'Таблица pricing_type_os существует',
      exists: true,
      records
    });
  } catch (error) {
    console.error('Ошибка при получении информации о таблице pricing_type_os:', error);
    return NextResponse.json(
      { error: 'Не удалось получить информацию о таблице pricing_type_os' },
      { status: 500 }
    );
  }
}
