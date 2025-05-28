import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/models';
import db from '@/lib/models'; // db экспортируется как default export

// Получение всех типов ценообразования
export async function GET() {
  try {
    await connectDB(); // Убедимся, что соединение с БД установлено
    const pricingTypes = await db.PricingTypeOs.findAll({
      order: [['name', 'ASC']], // Опционально: сортировка по имени
    });
    return NextResponse.json(pricingTypes);
  } catch (error) {
    console.error('Error fetching pricing types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing types' },
      { status: 500 }
    );
  }
}

// Создание нового типа ценообразования
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid name provided' },
        { status: 400 }
      );
    }

    await connectDB();
    const newPricingType = await db.PricingTypeOs.create({
      name: name.trim(),
    });

    return NextResponse.json(newPricingType, { status: 201 });
  } catch (error) {
    console.error('Error creating pricing type:', error);
    // Проверка на дубликат (нарушение уникальности)
    if (error instanceof db.Sequelize.UniqueConstraintError) {
      return NextResponse.json(
        { error: 'Pricing type with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create pricing type' },
      { status: 500 }
    );
  }
}