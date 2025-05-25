import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/models';

// Используем модель Sequelize для работы с БД
const { CurrencyOS } = db;

// GET запрос для получения конкретной валюты
export async function GET(
  request: NextRequest,
  { params }: { params: { currencyId: string } }
) {
  try {
    const currencyId = parseInt(params.currencyId);
    
    if (isNaN(currencyId)) {
      return NextResponse.json(
        { error: "Некорректный ID валюты" },
        { status: 400 }
      );
    }
    
    // Используем Sequelize для получения данных из БД
    const currency = await CurrencyOS.findByPk(currencyId);
    
    if (!currency) {
      return NextResponse.json(
        { error: "Валюта не найдена" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(currency);
  } catch (error) {
    console.error("Ошибка при получении валюты:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// PUT запрос для обновления валюты
export async function PUT(
  request: NextRequest,
  { params }: { params: { currencyId: string } }
) {
  try {
    const currencyId = parseInt(params.currencyId);
    
    if (isNaN(currencyId)) {
      return NextResponse.json(
        { error: "Некорректный ID валюты" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, isoCode, symbol, exchangeRate } = body;
    
    if (!name || !isoCode || !symbol || exchangeRate === undefined) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля" },
        { status: 400 }
      );
    }
    
    // Проверяем, существует ли валюта
    const currency = await CurrencyOS.findByPk(currencyId);
    
    if (!currency) {
      return NextResponse.json(
        { error: "Валюта не найдена" },
        { status: 404 }
      );
    }
    
    // Обновляем валюту в БД
    await currency.update({
      name,
      isoCode,
      symbol,
      exchangeRate: parseFloat(exchangeRate)
    });
    
    // Получаем обновленную валюту
    await currency.reload();
    
    return NextResponse.json(currency);
  } catch (error) {
    console.error("Ошибка при обновлении валюты:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
