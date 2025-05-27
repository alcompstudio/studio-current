// src/app/api/orders/fix-work-type-column/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Проверяем текущую схему таблицы
    const [tableInfo] = await db.sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'order_stages' AND column_name = 'work_type'
    `);
    
    console.log('[API_FIX_WORK_TYPE] Текущая информация о столбце:', tableInfo);

    // Сначала получаем данные из таблицы, чтобы сохранить текущие значения
    const [stages] = await db.sequelize.query(`
      SELECT id, work_type FROM order_stages WHERE work_type IS NOT NULL
    `);
    
    console.log('[API_FIX_WORK_TYPE] Текущие этапы с work_type:', stages);

    // Получаем данные о типах работы из таблицы stage_work_type_os
    const [workTypes] = await db.sequelize.query(`
      SELECT id, name FROM stage_work_type_os
    `);
    
    console.log('[API_FIX_WORK_TYPE] Типы работы из таблицы stage_work_type_os:', workTypes);

    // Создаем временный столбец для хранения новых значений
    await db.sequelize.query(`
      ALTER TABLE order_stages ADD COLUMN temp_work_type INTEGER;
    `);

    // Обновляем временный столбец на основе соответствия имен
    for (const stage of stages) {
      const workTypeName = stage.work_type;
      const matchingWorkType = workTypes.find((wt: any) => wt.name === workTypeName);
      
      if (matchingWorkType) {
        await db.sequelize.query(`
          UPDATE order_stages SET temp_work_type = ${matchingWorkType.id} WHERE id = ${stage.id}
        `);
      }
    }

    // Удаляем существующий столбец work_type
    await db.sequelize.query(`
      ALTER TABLE order_stages DROP COLUMN work_type;
    `);

    // Переименовываем временный столбец
    await db.sequelize.query(`
      ALTER TABLE order_stages RENAME COLUMN temp_work_type TO work_type;
    `);

    // Добавляем внешний ключ
    await db.sequelize.query(`
      ALTER TABLE order_stages 
      ADD CONSTRAINT fk_work_type 
      FOREIGN KEY (work_type) 
      REFERENCES stage_work_type_os(id);
    `);

    // Проверяем обновленную схему таблицы
    const [updatedTableInfo] = await db.sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'order_stages' AND column_name = 'work_type'
    `);

    return NextResponse.json({
      message: 'Тип столбца work_type успешно изменен с VARCHAR(50) на INTEGER',
      before: tableInfo,
      after: updatedTableInfo
    });
  } catch (error) {
    console.error('[API_FIX_WORK_TYPE] Ошибка при изменении типа столбца:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка сервера';
    return NextResponse.json(
      { message: 'Не удалось изменить тип столбца work_type', error: errorMessage },
      { status: 500 }
    );
  }
}
