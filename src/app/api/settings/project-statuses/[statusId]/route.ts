import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/models';

// Используем модель Sequelize для работы с БД
const { ProjectStatusOS } = db;

// GET запрос для получения конкретного статуса
export async function GET(
  request: NextRequest,
  { params }: { params: { statusId: string } }
) {
  try {
    const statusId = parseInt(params.statusId);
    
    if (isNaN(statusId)) {
      return NextResponse.json(
        { error: "Некорректный ID статуса" },
        { status: 400 }
      );
    }
    
    // Используем Sequelize для получения данных из БД
    const status = await ProjectStatusOS.findByPk(statusId);
    
    if (!status) {
      return NextResponse.json(
        { error: "Статус не найден" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(status);
  } catch (error) {
    console.error("Ошибка при получении статуса проекта:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// PUT запрос для обновления статуса
export async function PUT(
  request: NextRequest,
  { params }: { params: { statusId: string } }
) {
  try {
    const statusId = parseInt(params.statusId);
    
    if (isNaN(statusId)) {
      return NextResponse.json(
        { error: "Некорректный ID статуса" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, textColor, backgroundColor } = body;
    
    if (!name || !textColor || !backgroundColor) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля" },
        { status: 400 }
      );
    }
    
    // Проверяем, существует ли статус
    const status = await ProjectStatusOS.findByPk(statusId);
    
    if (!status) {
      return NextResponse.json(
        { error: "Статус не найден" },
        { status: 404 }
      );
    }
    
    // Обновляем статус в БД
    await status.update({
      name,
      textColor,
      backgroundColor
    });
    
    // Получаем обновленный статус
    await status.reload();
    
    return NextResponse.json(status);
  } catch (error) {
    console.error("Ошибка при обновлении статуса проекта:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
