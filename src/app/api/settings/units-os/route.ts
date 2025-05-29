import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const units = await (db as any).UnitOs.findAll({
      order: [['id', 'ASC']],
    });
    return NextResponse.json(units);
  } catch (error) {
    console.error('Ошибка при получении единиц измерения:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Создание новой единицы измерения
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Валидация входных данных
    if (!data.full_name || !data.short_name) {
      return NextResponse.json(
        { error: "Полное и краткое названия обязательны" },
        { status: 400 }
      );
    }

    // Проверка на дубликаты
    const existingUnit = await (db as any).UnitOs.findOne({
      where: {
        short_name: data.short_name
      }
    });

    if (existingUnit) {
      return NextResponse.json(
        { error: `Единица измерения с кратким названием '${data.short_name}' уже существует` },
        { status: 400 }
      );
    }

    // Создание новой единицы измерения
    const newUnit = await (db as any).UnitOs.create({
      full_name: data.full_name,
      short_name: data.short_name,
    });

    return NextResponse.json({
      success: true,
      message: "Единица измерения успешно создана",
      data: newUnit,
    });
  } catch (error) {
    console.error("Ошибка при создании единицы измерения:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
