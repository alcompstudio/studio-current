import db from "@/lib/db";
import { NextResponse } from "next/server";

// Эндпоинт для запуска миграции данных единиц измерения
export async function POST() {
  try {
    // Получаем все единицы измерения
    const units = await (db as any).UnitOs.findAll();
    // Создаем карту соответствия краткое_название => id
    const unitMap = new Map();
    units.forEach((unit: any) => {
      unitMap.set(unit.short_name, unit.id);
    });

    // Получаем все опции, у которых есть volume_unit, но нет volume_unit_id
    const options = await (db as any).StageOption.findAll({
      where: {
        volume_unit: {
          [db.Sequelize.Op.not]: null
        },
        volume_unit_id: null
      }
    });

    console.log(`Найдено ${options.length} опций для обновления`);

    // Обновляем записи
    let updatedCount = 0;
    let errorCount = 0;

    for (const option of options) {
      const unitId = unitMap.get(option.volume_unit);
      if (unitId) {
        // Обновляем запись
        option.volume_unit_id = unitId;
        await option.save();
        updatedCount++;
      } else {
        errorCount++;
        console.error(`Не найдено соответствие для единицы измерения: "${option.volume_unit}"`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Обновлено ${updatedCount} опций, пропущено ${errorCount} опций`,
      updated: updatedCount,
      errors: errorCount
    });
  } catch (error) {
    console.error('Ошибка при миграции единиц измерения:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Внутренняя ошибка сервера',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}
