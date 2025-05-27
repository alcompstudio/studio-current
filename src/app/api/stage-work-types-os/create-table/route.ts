// src/app/api/stage-work-types-os/create-table/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Проверяем, что модель существует
    if (!db.StageWorkTypeOS) {
      return NextResponse.json(
        { message: 'Модель StageWorkTypeOS не определена' },
        { status: 500 }
      );
    }

    // Проверяем, существует ли таблица, создаем если нет
    await db.sequelize.query(`
      CREATE TABLE IF NOT EXISTS stage_work_type_os (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Проверяем, есть ли уже записи в таблице
    const existingTypes = await db.StageWorkTypeOS.findAll();
    
    // Если записей нет, добавляем начальные данные
    if (existingTypes.length === 0) {
      await db.StageWorkTypeOS.bulkCreate([
        {
          name: 'Параллельный',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Последовательный',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // Получаем все типы работы
    const workTypes = await db.StageWorkTypeOS.findAll({
      order: [['id', 'ASC']]
    });

    return NextResponse.json({
      message: 'Таблица типов работы этапов создана и заполнена начальными данными',
      workTypes
    });
  } catch (error) {
    console.error('[API_CREATE_STAGE_WORK_TYPES_TABLE] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка сервера';
    return NextResponse.json(
      { message: 'Не удалось создать таблицу типов работы', error: errorMessage },
      { status: 500 }
    );
  }
}
