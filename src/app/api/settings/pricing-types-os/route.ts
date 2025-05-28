// src/app/api/settings/pricing-types-os/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

const PricingTypeOs = db.PricingTypeOs;

// Схема валидации для создания и обновления типа ценообразования
const pricingTypeSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
});

// GET - Получение всех типов ценообразования
export async function GET(request: Request) {
  try {
    const pricingTypes = await PricingTypeOs.findAll({
      order: [['id', 'ASC']], // Сортировка по ID
    });
    return NextResponse.json(pricingTypes);
  } catch (error) {
    console.error('[API_PRICING_TYPES_OS] Ошибка при получении типов ценообразования:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении типов ценообразования' },
      { status: 500 }
    );
  }
}

// POST - Создание нового типа ценообразования
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация входных данных
    const validationResult = pricingTypeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name } = validationResult.data;
    
    // Создаем новый тип ценообразования
    const newPricingType = await PricingTypeOs.create({
      name,
    });
    
    return NextResponse.json(newPricingType, { status: 201 });
  } catch (error) {
    console.error('[API_PRICING_TYPES_OS] Ошибка при создании типа ценообразования:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании типа ценообразования' },
      { status: 500 }
    );
  }
}

// PATCH - Обновление типа ценообразования
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID не указан' },
        { status: 400 }
      );
    }
    
    // Валидация данных для обновления
    const validationResult = pricingTypeSchema.safeParse({ name });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
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
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID не указан' },
        { status: 400 }
      );
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
