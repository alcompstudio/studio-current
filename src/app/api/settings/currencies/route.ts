import { NextRequest, NextResponse } from "next/server";
import db, { connectDB } from "@/lib/models";
import type { CurrencyFormData } from "@/types/currency";

// Получение списка всех валют
export async function GET(request: NextRequest) {
  try {
    // Подключаемся к базе данных перед выполнением запроса
    await connectDB();
    
    // Используем модель CurrencyOS из объекта db
    // Добавляем сортировку по ID для консистентного отображения
    const currencies = await db.CurrencyOS.findAll({
      order: [['id', 'ASC']]
    });
    return NextResponse.json(currencies);
  } catch (error) {
    console.error("Ошибка при получении списка валют:", error);
    return NextResponse.json({ error: "Не удалось получить список валют" }, { status: 500 });
  }
}

// Создание новой валюты
export async function POST(request: NextRequest) {
  try {
    // Подключаемся к базе данных
    await connectDB();
    
    // Получаем данные из тела запроса
    const body = await request.json();
    const { name, isoCode, symbol, exchangeRate } = body as CurrencyFormData;
    
    // Проверяем обязательные поля
    if (!name || !isoCode || !symbol) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля" },
        { status: 400 }
      );
    }
    
    // Проверяем, что валюта с таким ISO кодом еще не существует
    const existingCurrency = await db.CurrencyOS.findOne({
      where: { isoCode }
    });
    
    if (existingCurrency) {
      return NextResponse.json(
        { error: `Валюта с кодом ${isoCode} уже существует` },
        { status: 409 } // Conflict
      );
    }
    
    // Создаем новую валюту
    const newCurrency = await db.CurrencyOS.create({
      name,
      isoCode,
      symbol,
      exchangeRate: exchangeRate || 1.0, // Если курс обмена не указан, используем 1.0 по умолчанию
    });
    
    return NextResponse.json(newCurrency, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Ошибка при создании валюты:", error);
    return NextResponse.json(
      { error: "Не удалось создать валюту" },
      { status: 500 }
    );
  }
}
