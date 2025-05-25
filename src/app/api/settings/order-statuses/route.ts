import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/models';

// Используем модель Sequelize для работы с БД
const { OrderStatusOS } = db;

// GET запрос для получения всех статусов заказов
export async function GET(request: NextRequest) {
  try {
    // Получаем все статусы заказов из БД
    const statuses = await OrderStatusOS.findAll({
      order: [['id', 'ASC']], // Сортировка по ID
    });
    
    return NextResponse.json(statuses);
  } catch (error) {
    console.error("Ошибка при получении статусов заказов:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
