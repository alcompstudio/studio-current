import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { StageOption } from '@/lib/models/StageOption';
import { OrderStageModel } from '@/lib/models/OrderStage';
import { Client } from 'pg';

// GET /api/orders/[orderId]/stages/[stageId]/options - Получение всех опций этапа
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string } }
) {
  try {
    const { orderId, stageId } = await params;
    console.log(`Запрос опций для этапа ${stageId} (тип: ${typeof stageId}) заказа ${orderId} (тип: ${typeof orderId})`);
    
    // Дополнительная проверка всех этапов заказа
    const allStages = await db.sequelize.query(
      'SELECT id::text FROM order_stages WHERE order_id::text = $1',
      { 
        bind: [String(orderId)],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    console.log('Все этапы заказа:', JSON.stringify(allStages, null, 2));
    
    // Прямой поиск этапа через SQL
    const stageResult = await db.sequelize.query(
      'SELECT * FROM order_stages WHERE id::text = $1',
      { 
        bind: [String(stageId)],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    console.log('Результат прямого SQL поиска этапа:', JSON.stringify(stageResult, null, 2));
    
    // Проверяем существование этапа
    console.log(`Ищем этап с ID: ${stageId}, преобразованный в строку: ${String(stageId)}`);
    
    // Если прямой SQL запрос нашел этап, но модель не может его найти,
    // используем результат из прямого запроса
    let stage = null;
    if (stageResult && stageResult.length > 0) {
      stage = stageResult[0];
    } else {
      stage = await OrderStageModel.findById(stageId);
    }
    console.log('Результат поиска этапа:', stage);
    
    if (!stage) {
      console.log('Этап не найден:', stageId);
      return NextResponse.json({ error: 'Этап не найден' }, { status: 404 });
    }
    
    // Проверяем, что этап принадлежит указанному заказу
    if (String(stage.order_id) !== String(orderId)) {
      console.log(`Этап (ID: ${stageId}) не принадлежит заказу (ID: ${orderId})`);
      return NextResponse.json({ error: 'Этап не принадлежит указанному заказу' }, { status: 403 });
    }
    
    try {
      // Используем sequelize для запроса к БД
      // Проверяем существует ли таблица order_stage_options
      const [tableResult] = await db.sequelize.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_stage_options')"
      );
      
      const tableExists = tableResult[0]?.exists;
      console.log('Таблица order_stage_options существует:', tableExists);
      
      if (!tableExists) {
        // Если таблица не существует, возвращаем пустой массив
        console.log('Таблица order_stage_options не существует, возвращаем пустой массив');
        return NextResponse.json([]);
      }
      
      // Получаем список опций для этапа
      const options = await db.sequelize.query(
        'SELECT * FROM order_stage_options WHERE order_stage_id = $1 ORDER BY created_at',
        { 
          bind: [stageId],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );

      console.log(`Получено ${options.length} опций для этапа ${stageId}`);
      return NextResponse.json(options);
      
    } catch (dbError: any) {
      // Если произошла ошибка при запросе к БД, возможно таблица не существует
      console.error('Ошибка при запросе к базе данных:', dbError);
      
      // Если ошибка связана с отсутствием таблицы, возвращаем пустой массив
      if (dbError.message && (dbError.message.includes('relation "order_stage_options" does not exist') || 
                              dbError.message.includes('\"order_stage_options\" does not exist'))) {
        console.log('Таблица order_stage_options не существует (по сообщению об ошибке), возвращаем пустой массив');
        return NextResponse.json([]);
      }
      
      throw dbError; // Пробрасываем другие ошибки в основной обработчик
    }
    
  } catch (error: any) {
    console.error('Ошибка при получении опций этапа:', error);
    return NextResponse.json({ 
      error: 'Ошибка сервера', 
      message: error.message || 'Неизвестная ошибка',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// POST /api/orders/[orderId]/stages/[stageId]/options - Создание новой опции для этапа
export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string } }
) {
  try {
    const { orderId, stageId } = await params;
    const data = await request.json();
    console.log('Создание опции для этапа', stageId, ':', data);

    // Прямой поиск этапа через SQL
    const stageResult = await db.sequelize.query(
      'SELECT * FROM order_stages WHERE id::text = $1',
      { 
        bind: [String(stageId)],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    console.log('Результат прямого SQL поиска этапа для POST:', JSON.stringify(stageResult, null, 2));
    
    // Используем прямой результат или модель для поиска
    let stage;
    if (stageResult && stageResult.length > 0) {
      stage = stageResult[0];
    } else {
      stage = await OrderStageModel.findById(stageId);
    }
    
    if (!stage) {
      return NextResponse.json({ error: 'Этап не найден' }, { status: 404 });
    }
    
    // Проверяем, что этап принадлежит указанному заказу
    if (String(stage.order_id) !== String(orderId)) {
      return NextResponse.json({ error: 'Этап не принадлежит указанному заказу' }, { status: 403 });
    }
    
    // Валидация данных
    if (!data.name) {
      return NextResponse.json({ error: 'Название опции обязательно' }, { status: 400 });
    }
    
    // Проверяем калькулируемый тип - только по новому полю pricing_type_id
    const isCalculable = data.pricing_type_id === 1; // ID=1 для Калькулируемая
    
    // Если тип калькулируемый, то проверяем наличие необходимых полей
    if (isCalculable) {
      if (data.nominal_volume === null || data.nominal_volume === undefined) {
        return NextResponse.json({ error: 'Для калькулируемой опции необходимо указать номинальный объем' }, { status: 400 });
      }
      
      if (data.price_per_unit === null || data.price_per_unit === undefined) {
        return NextResponse.json({ error: 'Для калькулируемой опции необходимо указать цену за единицу' }, { status: 400 });
      }
    }
    
    // Преобразуем данные для сохранения
    const optionData = {
      order_stage_id: Number(stageId),
      name: data.name,
      description: data.description || '',
      pricing_type_id: data.pricing_type_id, // Только новое поле
      volume_min: data.volume_min || null,
      volume_max: data.volume_max || null,
      volume_unit_id: data.volume_unit_id || null, // Только новое поле
      nominal_volume: data.nominal_volume || null,
      price_per_unit: data.price_per_unit || null,
    };
    
    // Рассчитываем calculated_price_min и calculated_price_max
    let calculated_price_min = null;
    let calculated_price_max = null;
    
    // Используем тот же флаг калькулируемости, что и выше
    
    if (isCalculable && data.nominal_volume && data.price_per_unit) {
      console.log('Рассчитываем стоимость для калькулируемой опции:', {
        pricing_type_id: data.pricing_type_id,
        volume_min: data.volume_min,
        volume_max: data.volume_max,
        nominal_volume: data.nominal_volume,
        price_per_unit: data.price_per_unit
      });
      
      if (data.volume_min) {
        calculated_price_min = (data.volume_min / data.nominal_volume) * data.price_per_unit;
        console.log('Рассчитанная минимальная стоимость:', calculated_price_min);
      }
      
      if (data.volume_max) {
        calculated_price_max = (data.volume_max / data.nominal_volume) * data.price_per_unit;
        console.log('Рассчитанная максимальная стоимость:', calculated_price_max);
      }
    }
    
    // Вставляем запись в БД
    const [result] = await db.sequelize.query(
      `INSERT INTO order_stage_options(
        order_stage_id, name, description, pricing_type_id,
        volume_min, volume_max, volume_unit_id, nominal_volume, 
        price_per_unit, calculated_price_min, calculated_price_max,
        created_at, updated_at
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING *`,
      {
        bind: [
          optionData.order_stage_id,
          optionData.name,
          optionData.description,
          optionData.pricing_type_id,
          optionData.volume_min,
          optionData.volume_max,
          optionData.volume_unit_id,
          optionData.nominal_volume,
          optionData.price_per_unit,
          calculated_price_min,
          calculated_price_max
        ],
        type: db.sequelize.QueryTypes.INSERT
      }
    );
    
    return NextResponse.json(result[0], { status: 201 });
    
  } catch (error) {
    console.error('Ошибка при создании опции:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
