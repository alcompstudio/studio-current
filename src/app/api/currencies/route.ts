import { NextResponse } from 'next/server';
import db from '@/lib/models';
import { connectDB } from '@/lib/models';

// GET /api/currencies
export async function GET() {
  try {
    await connectDB();
    
    // Получаем все валюты из таблицы currency_os
    const currencies = await db.CurrencyOS.findAll({
      order: [['id', 'ASC']]
    });
    
    return NextResponse.json(currencies);
  } catch (error) {
    console.error('Ошибка при получении списка валют:', error);
    return NextResponse.json(
      { error: 'Не удалось получить список валют' },
      { status: 500 }
    );
  }
}
