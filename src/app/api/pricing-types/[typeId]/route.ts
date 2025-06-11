import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/models';
import db from '@/lib/models'; // db экспортируется как default export

interface RouteParams {
  params: Promise<{
    typeId: string;
  }>;
}

// Получение конкретного типа ценообразования по ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { typeId } = await params;
    const id = parseInt(typeId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid type ID format' },
        { status: 400 }
      );
    }

    await connectDB();
    const pricingType = await db.PricingTypeOs.findByPk(id);

    if (!pricingType) {
      return NextResponse.json(
        { error: 'Pricing type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pricingType);
  } catch (error) {
    console.error('Error fetching pricing type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing type' },
      { status: 500 }
    );
  }
}

// Обновление типа ценообразования
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { typeId } = await params;
    const id = parseInt(typeId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid type ID format' },
        { status: 400 }
      );
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid name provided' },
        { status: 400 }
      );
    }

    await connectDB();
    const pricingType = await db.PricingTypeOs.findByPk(id);

    if (!pricingType) {
      return NextResponse.json(
        { error: 'Pricing type not found' },
        { status: 404 }
      );
    }

    await pricingType.update({ name: name.trim() });

    return NextResponse.json(pricingType);
  } catch (error) {
    console.error('Error updating pricing type:', error);
    
    // Проверка на дубликат (нарушение уникальности)
    if (error instanceof db.Sequelize.UniqueConstraintError) {
      return NextResponse.json(
        { error: 'Pricing type with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update pricing type' },
      { status: 500 }
    );
  }
}

// Удаление типа ценообразования
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { typeId } = await params;
    const id = parseInt(typeId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid type ID format' },
        { status: 400 }
      );
    }

    await connectDB();
    const pricingType = await db.PricingTypeOs.findByPk(id);

    if (!pricingType) {
      return NextResponse.json(
        { error: 'Pricing type not found' },
        { status: 404 }
      );
    }

    // Проверка, используется ли тип ценообразования в опциях
    const stageOptions = await db.StageOption.findAll({
      where: { pricing_type_id: id }
    });

    if (stageOptions.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete this pricing type as it is being used in options',
          usageCount: stageOptions.length
        },
        { status: 409 }
      );
    }

    await pricingType.destroy();

    return NextResponse.json(
      { message: 'Pricing type deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting pricing type:', error);
    return NextResponse.json(
      { error: 'Failed to delete pricing type' },
      { status: 500 }
    );
  }
}
