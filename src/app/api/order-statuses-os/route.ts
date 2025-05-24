import { NextResponse } from 'next/server';
import db from '@/lib/models';

// GET /api/order-statuses-os - Get all order statuses
export async function GET() {
  try {
    const statuses = await db.OrderStatusOS.findAll({
      order: [['id', 'ASC']],
    });
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Failed to fetch order statuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order statuses' },
      { status: 500 }
    );
  }
}
