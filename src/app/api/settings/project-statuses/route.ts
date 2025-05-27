import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/models';

// Используем модель Sequelize для работы с БД
const { ProjectStatusOS } = db;

// GET запрос для получения всех статусов проектов
export async function GET(request: NextRequest) {
  try {
    // Получаем все статусы проектов из БД
    const statuses = await ProjectStatusOS.findAll({
      order: [['id', 'ASC']], // Сортировка по ID
    });
    
    return NextResponse.json(statuses);
  } catch (error) {
    console.error("Ошибка при получении статусов проектов:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// POST запрос для создания нового статуса проекта
export async function POST(request: NextRequest) {
  try {
    // Получаем данные из тела запроса
    const body = await request.json();
    
    // Валидация данных
    if (!body.name || !body.textColor || !body.backgroundColor) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля" },
        { status: 400 }
      );
    }
    
    // Создаем новый статус проекта в БД
    const newStatus = await ProjectStatusOS.create({
      name: body.name,
      textColor: body.textColor,
      backgroundColor: body.backgroundColor,
      isDefault: body.isDefault || false
    });
    
    return NextResponse.json(newStatus, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании статуса проекта:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
