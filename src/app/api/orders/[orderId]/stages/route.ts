import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/db';
import { QueryTypes } from 'sequelize';
import { Stage, CreateStageDto } from '@/lib/types/stage';
import { z } from 'zod';

// Validation schema for creating a stage
const createStageSchema = z.object({
  name: z.string().min(1, 'Название этапа обязательно'),
  description: z.string().optional().nullable(),
  sequence: z.number().int().positive().optional().nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().nullable(),
  workType: z.number().int().positive().optional().nullable(),
  estimatedPrice: z.number().positive().optional().nullable(),
});

// Временно убираем тип с опциями
// type StageWithOptions = Omit<Stage, 'options'> & {
//   options: StageOption[];
// };

// Helper function to handle errors
function handleError(error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
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
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    // First, fetch stages for the given order_id
    const stages = await sequelize.query(
      `
      SELECT 
        id::text, 
        order_id::text, 
        title as "title", 
        description, 
        created_at, 
        updated_at,
        sequence,
        color,
        work_type AS "workType",
        estimated_price AS "estimatedPrice",
        status
      FROM order_stages
      WHERE order_id = :orderId
      ORDER BY sequence ASC, created_at ASC;
    `,
      {
        replacements: { orderId },
        type: QueryTypes.SELECT,
      }
    );

    if (stages.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no stages found
    }

    // Временно не загружаем опции для этапов
    // Возвращаем только этапы
    return NextResponse.json(stages, { status: 200 });
  } catch (error) {
    return handleError(error, 'Не удалось загрузить этапы заказа');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // Важно: добавлен await перед доступом к params в Next.js
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json(
      { error: 'ID заказа обязателен' },
      { status: 400 }
    );
  }

  try {
    // Validate request body
    const body = await request.json();
    
    // Логируем полученные данные для отладки
    console.log('[API_STAGES] Полученные данные:', body);
    
    // Преобразование типов данных
    const processedBody = {
      ...body,
      sequence: body.sequence ? Number(body.sequence) : null,
      workType: body.workType ? Number(body.workType) : null,
      estimatedPrice: body.estimatedPrice ? Number(body.estimatedPrice) : null
    };
    
    console.log('[API_STAGES] Обработанные данные:', processedBody);
    
    const validation = createStageSchema.safeParse(processedBody);

    if (!validation.success) {
      console.log('[API_STAGES] Ошибка валидации:', validation.error.format());
      return NextResponse.json(
        { 
          error: 'Ошибка валидации',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Start a transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Create the stage
      const [stage] = await sequelize.query(
        `
        INSERT INTO order_stages (
          order_id, 
          title, 
          description, 
          sequence, 
          color, 
          work_type, 
          estimated_price,
          status
        ) 
        VALUES (:orderId, :title, :description, :sequence, :color, :workType, :estimatedPrice, 'active')
        RETURNING 
          id::text,
          order_id::text as "order_id",
          title as "title",
          description,
          sequence,
          color,
          work_type AS "workType",
          estimated_price AS "estimatedPrice",
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        ;
      `,
        {
          replacements: {
            orderId: parseInt(orderId, 10),
            title: data.name, // Используем title вместо name
            description: data.description || null,
            sequence: data.sequence || null,
            color: data.color || null,
            workType: data.workType ? parseInt(data.workType.toString(), 10) : null, // Преобразование в число
            estimatedPrice: data.estimatedPrice || null,
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      // Возвращаем созданный этап без опций
      const result = stage;

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    return handleError(error, 'Не удалось создать этап заказа');
  }
}