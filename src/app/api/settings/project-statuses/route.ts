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
