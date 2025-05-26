import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/db';
import { QueryTypes } from 'sequelize';
import { Stage, UpdateStageDto, WorkType } from '@/lib/types/stage';
import { z } from 'zod';

// Схема валидации для обновления этапа
const updateStageSchema = z.object({
  name: z.string().min(1, 'Название этапа обязательно').optional(),
  description: z.string().optional().nullable(),
  sequence: z.number().int().positive().optional().nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().nullable(),
  workType: z.enum(['Параллельный', 'Последовательный'] as const).optional().nullable(),
  estimatedPrice: z.number().positive().optional().nullable(),
});

// Вспомогательная функция для обработки ошибок
function handleError(error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
  return NextResponse.json(
    { error: defaultMessage, details: errorMessage },
    { status: 500 }
  );
}

// GET /api/orders/[orderId]/stages/[stageId]
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string } }
) {
  // Важно: добавлен await перед доступом к params в Next.js
  const { orderId, stageId } = await params;

  if (!orderId || !stageId) {
    return NextResponse.json(
      { error: 'ID заказа и ID этапа обязательны' },
      { status: 400 }
    );
  }

  try {
    // Получаем этап
    const stages = await sequelize.query(
      `
      SELECT 
        id::text, 
        order_id::text as "order_id", 
        title as "title", 
        description, 
        created_at as "createdAt", 
        updated_at as "updatedAt",
        sequence,
        color,
        work_type as "workType",
        estimated_price as "estimatedPrice"
      FROM order_stages
      WHERE id = :stageId AND order_id = :orderId;
      `,
      {
        replacements: { 
          stageId: parseInt(stageId, 10),
          orderId: parseInt(orderId, 10)
        },
        type: QueryTypes.SELECT,
      }
    );

    if (stages.length === 0) {
      return NextResponse.json(
        { error: 'Этап не найден' },
        { status: 404 }
      );
    }

    const stage = stages[0];
    return NextResponse.json(stage);
  } catch (error) {
    return handleError(error, 'Не удалось загрузить данные этапа');
  }
}

// PUT /api/orders/[orderId]/stages/[stageId]
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string } }
) {
  // Важно: добавлен await перед доступом к params в Next.js
  const { orderId, stageId } = await params;

  if (!orderId || !stageId) {
    return NextResponse.json(
      { error: 'ID заказа и ID этапа обязательны' },
      { status: 400 }
    );
  }

  try {
    // Валидируем тело запроса
    const body = await request.json();
    const validation = updateStageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Ошибка валидации',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Начинаем транзакцию
    const transaction = await sequelize.transaction();
    
    try {
      // Обновляем этап
      const updated = await sequelize.query(
        `
        UPDATE order_stages
        SET
          title = COALESCE(:title, title),
          description = :description,
          sequence = :sequence,
          color = :color,
          work_type = :workType,
          estimated_price = :estimatedPrice,
          updated_at = NOW()
        WHERE order_id = :orderId
        RETURNING 
          id::text,
          order_id::text as "order_id",
          title as "title",
          description,
          sequence,
          color,
          work_type as "workType",
          estimated_price as "estimatedPrice",
          created_at as "createdAt",
          updated_at as "updatedAt"
        ;
      `,
        {
          replacements: {
            stageId: parseInt(stageId, 10),
            orderId: parseInt(orderId, 10),
            title: data.name || null, // Используем title вместо name
            description: data.description,
            sequence: data.sequence,
            color: data.color,
            workType: data.workType,
            estimatedPrice: data.estimatedPrice,
          },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      if (!updated || updated[0].length === 0) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Этап не найден' },
          { status: 404 }
        );
      }

      await transaction.commit();
      return NextResponse.json(updated[0][0]);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    return handleError(error, 'Не удалось обновить этап заказа');
  }
}

// DELETE /api/orders/[orderId]/stages/[stageId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string } }
) {
  // Важно: добавлен await перед доступом к params в Next.js
  const { orderId, stageId } = await params;

  if (!orderId || !stageId) {
    return NextResponse.json(
      { error: 'ID заказа и ID этапа обязательны' },
      { status: 400 }
    );
  }

  try {
    // Начинаем транзакцию
    const transaction = await sequelize.transaction();
    
    try {
      console.log('Начало удаления этапа:', { orderId, stageId });
      
      // Проверка существования этапа перед удалением
      const stageExists = await sequelize.query(
        'SELECT id FROM order_stages WHERE id = :stageId AND order_id = :orderId',
        {
          replacements: { 
            stageId: parseInt(stageId, 10),
            orderId: parseInt(orderId, 10)
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );
      
      console.log('Проверка существования этапа:', stageExists);
      
      if (!stageExists || stageExists.length === 0) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Этап не найден' },
          { status: 404 }
        );
      }
      
      // Удаляем все опции этапа (хотя они пока не используются, но на всякий случай)
      await sequelize.query(
        'DELETE FROM order_stage_options WHERE order_stage_id = :stageId',
        {
          replacements: { stageId: parseInt(stageId, 10) },
          type: QueryTypes.DELETE,
          transaction,
        }
      );

      // Фактически удаляем этап из базы данных
      const deleted = await sequelize.query(
        `DELETE FROM order_stages WHERE id = :stageId AND order_id = :orderId RETURNING id`,
        {
          replacements: { 
            stageId: parseInt(stageId, 10),
            orderId: parseInt(orderId, 10)
          },
          type: QueryTypes.DELETE,
          transaction,
        }
      );
      
      console.log('Результат физического удаления этапа:', deleted);

      if (!deleted || !deleted[0] || deleted[0].length === 0) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Этап не найден' },
          { status: 404 }
        );
      }

      await transaction.commit();
      return NextResponse.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    return handleError(error, 'Не удалось удалить этап заказа');
  }
}
