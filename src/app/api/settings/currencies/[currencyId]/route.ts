import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/models';

// Используем модель Sequelize для работы с БД
const { CurrencyOS } = db;

// GET запрос для получения конкретной валюты
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ currencyId: string }> }
) {
  try {
    const { currencyId: currencyIdStr } = await params;
    const currencyId = parseInt(currencyIdStr);
    
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
  { params }: { params: Promise<{ currencyId: string }> }
) {
  try {
    const { currencyId: currencyIdStr } = await params;
    const currencyId = parseInt(currencyIdStr);

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

// DELETE запрос для удаления валюты
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ currencyId: string }> }
) {
  try {
    const { currencyId: currencyIdStr } = await params;
    const currencyId = parseInt(currencyIdStr);

    if (isNaN(currencyId)) {
      return NextResponse.json(
        { error: "Некорректный ID валюты" },
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
    
    // Проверяем, не является ли валюта базовой (по умолчанию)
    if (currency.isBase) {
      return NextResponse.json(
        { error: "Нельзя удалить базовую валюту" },
        { status: 400 }
      );
    }
    
    // Удаляем валюту из БД
    await currency.destroy();
    
    return NextResponse.json(
      { success: true, message: "Валюта успешно удалена" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении валюты:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
