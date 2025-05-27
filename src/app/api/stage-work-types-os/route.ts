// src/app/api/stage-work-types-os/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

const StageWorkTypeOS = db.StageWorkTypeOS;

// Схема валидации для создания и обновления типа работы
const workTypeSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
});

// GET - Получение всех типов работы
export async function GET(request: Request) {
  try {
    const workTypes = await StageWorkTypeOS.findAll({
      order: [['id', 'ASC']], // Сортировка по ID
    });
    return NextResponse.json(workTypes);
  } catch (error) {
    console.error('[API_STAGE_WORK_TYPES_OS] Error fetching work types:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка сервера';
    return NextResponse.json(
      { message: 'Не удалось получить типы работы', error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Создание нового типа работы
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация данных
    const validationResult = workTypeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Ошибка валидации', errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Создание нового типа работы
    const newWorkType = await StageWorkTypeOS.create({
      name: body.name,
    });
    
    return NextResponse.json(newWorkType, { status: 201 });
  } catch (error) {
    console.error('[API_STAGE_WORK_TYPES_OS] Error creating work type:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка сервера';
    return NextResponse.json(
      { message: 'Не удалось создать тип работы', error: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH - Обновление типа работы
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    
    // Проверка наличия ID
    if (!body.id) {
      return NextResponse.json(
        { message: 'ID типа работы обязателен' },
        { status: 400 }
      );
    }
    
    // Валидация данных
    const validationResult = workTypeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Ошибка валидации', errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Поиск и обновление типа работы
    const workType = await StageWorkTypeOS.findByPk(body.id);
    if (!workType) {
      return NextResponse.json(
        { message: 'Тип работы не найден' },
        { status: 404 }
      );
    }
    
    workType.name = body.name;
    await workType.save();
    
    return NextResponse.json(workType);
  } catch (error) {
    console.error('[API_STAGE_WORK_TYPES_OS] Error updating work type:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка сервера';
    return NextResponse.json(
      { message: 'Не удалось обновить тип работы', error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Удаление типа работы
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID типа работы обязателен' },
        { status: 400 }
      );
    }
    
    const workType = await StageWorkTypeOS.findByPk(id);
    if (!workType) {
      return NextResponse.json(
        { message: 'Тип работы не найден' },
        { status: 404 }
      );
    }
    
    await workType.destroy();
    
    return NextResponse.json(
      { message: 'Тип работы успешно удален' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API_STAGE_WORK_TYPES_OS] Error deleting work type:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка сервера';
    return NextResponse.json(
      { message: 'Не удалось удалить тип работы', error: errorMessage },
      { status: 500 }
    );
  }
}
