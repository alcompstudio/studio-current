import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/models';

// Используем модель Sequelize для работы с БД
const { OrderStatusOS } = db;

// GET запрос для получения конкретного статуса
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ statusId: string }> }
) {
  try {
    const { statusId: statusIdStr } = await params;
    const statusId = parseInt(statusIdStr);
    
    if (isNaN(statusId)) {
      return NextResponse.json(
        { error: "Некорректный ID статуса" },
        { status: 400 }
      );
    }
    
    // Используем Sequelize для получения данных из БД
    const status = await OrderStatusOS.findByPk(statusId);
    
    if (!status) {
      return NextResponse.json(
        { error: "Статус не найден" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(status);
  } catch (error) {
    console.error("Ошибка при получении статуса заказа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// PUT запрос для обновления статуса
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ statusId: string }> }
) {
  try {
    const { statusId: statusIdStr } = await params;
    const statusId = parseInt(statusIdStr);

    if (isNaN(statusId)) {
      return NextResponse.json(
        { error: "Некорректный ID статуса" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, textColor, backgroundColor, allowBids } = body;
    
    if (!name || !textColor || !backgroundColor) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля" },
        { status: 400 }
      );
    }
    
    // Проверяем, существует ли статус
    const status = await OrderStatusOS.findByPk(statusId);
    
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
      backgroundColor,
      allowBids: allowBids !== undefined ? allowBids : status.allowBids
    });
    
    // Получаем обновленный статус
    await status.reload();
    
    return NextResponse.json(status);
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// DELETE запрос для удаления статуса заказа
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ statusId: string }> }
) {
  try {
    const { statusId: statusIdStr } = await params;
    const statusId = parseInt(statusIdStr);

    if (isNaN(statusId)) {
      return NextResponse.json(
        { error: "Некорректный ID статуса" },
        { status: 400 }
      );
    }
    
    // Проверяем, существует ли статус
    const status = await OrderStatusOS.findByPk(statusId);
    
    if (!status) {
      return NextResponse.json(
        { error: "Статус не найден" },
        { status: 404 }
      );
    }
    
    // Проверяем, не является ли статус статусом по умолчанию
    if (status.isDefault) {
      return NextResponse.json(
        { error: "Нельзя удалить статус по умолчанию" },
        { status: 400 }
      );
    }
    
    // Удаляем статус из БД
    await status.destroy();
    
    return NextResponse.json(
      { success: true, message: "Статус заказа успешно удален" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении статуса заказа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
