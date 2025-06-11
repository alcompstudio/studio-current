import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/db';
import { QueryTypes } from 'sequelize';

// Helper function to handle errors
function handleError(error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
  return NextResponse.json(
    { error: defaultMessage, details: errorMessage },
    { status: 500 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // Важно: добавлен await перед доступом к params в Next.js
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json({ error: 'ID заказа обязателен' }, { status: 400 });
  }

  try {
    // Запрос для получения максимального порядкового номера для этапов заказа
    const [result] = await sequelize.query(
      `
      SELECT COALESCE(MAX(sequence), 0) + 1 as next_sequence
      FROM order_stages
      WHERE order_id = :orderId
      `,
      {
        replacements: { orderId },
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json({ nextSequence: result.next_sequence || 1 }, { status: 200 });
  } catch (error) {
    return handleError(error, 'Не удалось получить следующий порядковый номер этапа');
  }
}
