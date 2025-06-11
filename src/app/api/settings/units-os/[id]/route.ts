import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Получение конкретной единицы измерения по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Некорректный ID единицы измерения" },
        { status: 400 }
      );
    }

    const unit = await (db as any).UnitOs.findByPk(id);
    
    if (!unit) {
      return NextResponse.json(
        { error: "Единица измерения не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(unit);
  } catch (error) {
    console.error("Ошибка при получении единицы измерения:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// Обновление единицы измерения
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Некорректный ID единицы измерения" },
        { status: 400 }
      );
    }

    const unit = await (db as any).UnitOs.findByPk(id);
    
    if (!unit) {
      return NextResponse.json(
        { error: "Единица измерения не найдена" },
        { status: 404 }
      );
    }

    const data = await request.json();
    
    // Валидация входных данных
    if (!data.full_name || !data.short_name) {
      return NextResponse.json(
        { error: "Полное и краткое названия обязательны" },
        { status: 400 }
      );
    }

    // Обновление единицы измерения
    await unit.update({
      full_name: data.full_name,
      short_name: data.short_name,
    });

    return NextResponse.json({
      success: true,
      message: "Единица измерения успешно обновлена",
      data: unit,
    });
  } catch (error) {
    console.error("Ошибка при обновлении единицы измерения:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// Удаление единицы измерения
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Некорректный ID единицы измерения" },
        { status: 400 }
      );
    }

    const unit = await (db as any).UnitOs.findByPk(id);
    
    if (!unit) {
      return NextResponse.json(
        { error: "Единица измерения не найдена" },
        { status: 404 }
      );
    }

    // Проверка, используется ли единица измерения в каких-либо опциях
    const usageCount = await (db as any).StageOption.count({
      where: {
        volume_unit_id: id,
      },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        { 
          error: "Эта единица измерения используется в опциях этапов", 
          message: `Эта единица измерения используется в ${usageCount} опциях. Сначала измените эти опции.`
        },
        { status: 400 }
      );
    }

    // Удаление единицы измерения
    await unit.destroy();

    return NextResponse.json({
      success: true,
      message: "Единица измерения успешно удалена",
    });
  } catch (error) {
    console.error("Ошибка при удалении единицы измерения:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
