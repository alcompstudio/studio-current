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

// POST запрос для создания нового статуса заказа
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
    
    // Создаем новый статус заказа в БД
    const newStatus = await OrderStatusOS.create({
      name: body.name,
      textColor: body.textColor,
      backgroundColor: body.backgroundColor,
      allowBids: body.allowBids || false,
      isDefault: body.isDefault || false
    });
    
    return NextResponse.json(newStatus, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании статуса заказа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
