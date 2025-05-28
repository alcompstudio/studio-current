// src/app/api/settings/pricing-types-os/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

const PricingTypeOs = db.PricingTypeOs;

// Схема валидации для обновления типа ценообразования
const pricingTypeSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
});

// GET - Получение конкретного типа ценообразования
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 });
    }
    
    // Получаем тип ценообразования по ID
    const pricingType = await PricingTypeOs.findByPk(id);
    
    if (!pricingType) {
      return NextResponse.json({ error: 'Тип ценообразования не найден' }, { status: 404 });
    }
    
    return NextResponse.json(pricingType);
  } catch (error) {
    console.error('[API_PRICING_TYPES_OS] Ошибка при получении типа ценообразования:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении типа ценообразования' },
      { status: 500 }
    );
  }
}

// PUT - Обновление типа ценообразования
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Валидация данных
    const validationResult = pricingTypeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name } = validationResult.data;
    
    // Проверяем существование записи
    const pricingType = await PricingTypeOs.findByPk(id);
    
    if (!pricingType) {
      return NextResponse.json(
        { error: 'Тип ценообразования не найден' },
        { status: 404 }
      );
    }
    
    // Обновляем запись
    await pricingType.update({ name });
    
    return NextResponse.json(pricingType);
  } catch (error) {
    console.error('[API_PRICING_TYPES_OS] Ошибка при обновлении типа ценообразования:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении типа ценообразования' },
      { status: 500 }
    );
  }
}

// DELETE - Удаление типа ценообразования
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 });
    }
    
    // Проверяем существование записи
    const pricingType = await PricingTypeOs.findByPk(id);
    
    if (!pricingType) {
      return NextResponse.json(
        { error: 'Тип ценообразования не найден' },
        { status: 404 }
      );
    }
    
    // Удаляем запись
    await pricingType.destroy();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API_PRICING_TYPES_OS] Ошибка при удалении типа ценообразования:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении типа ценообразования' },
      { status: 500 }
    );
  }
}
