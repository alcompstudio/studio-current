import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { OrderStageModel } from '@/lib/models/OrderStage';
import { Client } from 'pg';

// GET /api/orders/[orderId]/stages/[stageId]/options/[optionId] - Получение конкретной опции
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string; optionId: string } }
) {
  try {
    const { orderId, stageId, optionId } = await params;
    
    // Проверяем существование этапа
    const stage = await OrderStageModel.findById(stageId);
    if (!stage) {
      return NextResponse.json({ error: 'Этап не найден' }, { status: 404 });
    }
    
    // Проверяем, что этап принадлежит указанному заказу
    if (String(stage.order_id) !== String(orderId)) {
      return NextResponse.json({ error: 'Этап не принадлежит указанному заказу' }, { status: 403 });
    }
    
    // Получаем опцию по ID
    const [options] = await db.sequelize.query(
      'SELECT * FROM order_stage_options WHERE id = $1 AND order_stage_id = $2',
      { 
        bind: [optionId, stageId],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    
    if (options.length === 0) {
      return NextResponse.json({ error: 'Опция не найдена' }, { status: 404 });
    }
    
    return NextResponse.json(options[0]);
    
  } catch (error) {
    console.error('Ошибка при получении опции:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PUT /api/orders/[orderId]/stages/[stageId]/options/[optionId] - Обновление опции
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string; optionId: string } }
) {
  try {
    const { orderId, stageId, optionId } = await params;
    console.log('Обновление опции этапа', { orderId, stageId, optionId });
    
    // Прямой поиск этапа через SQL
    const stageResult = await db.sequelize.query(
      'SELECT * FROM order_stages WHERE id::text = $1',
      { 
        bind: [String(stageId)],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    console.log('Результат прямого SQL поиска этапа для PUT:', JSON.stringify(stageResult, null, 2));
    
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
    
    // Проверяем существование опции
    const existingOptions = await db.sequelize.query(
      'SELECT * FROM order_stage_options WHERE id::text = $1 AND order_stage_id::text = $2',
      { 
        bind: [String(optionId), String(stageId)],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    console.log('Проверка существования опции для PUT:', JSON.stringify(existingOptions, null, 2));
    
    if (!existingOptions || existingOptions.length === 0) {
      return NextResponse.json({ error: 'Опция не найдена' }, { status: 404 });
    }
    
    const existingOption = existingOptions[0];
    
    // Получаем данные из запроса
    const data = await request.json();
    
    // Валидация данных
    if (!data.name) {
      return NextResponse.json({ error: 'Название опции обязательно' }, { status: 400 });
    }
    
    // Проверяем калькулируемый тип (новый способ через pricing_type_id или старый через pricing_type)
    const priceTypeIsCalculable = 
      (data.pricing_type_id === 1) || // ID=1 для Калькулируемая (предполагаем, что в базе данных)
      (data.pricing_type === 'calculable') || 
      (data.pricing_type === 'Калькулируемая');
    
    // Если тип калькулируемый, то проверяем наличие необходимых полей
    if (priceTypeIsCalculable) {
      if (data.nominal_volume === null || data.nominal_volume === undefined) {
        return NextResponse.json({ error: 'Для калькулируемой опции необходимо указать номинальный объем' }, { status: 400 });
      }
      
      if (data.price_per_unit === null || data.price_per_unit === undefined) {
        return NextResponse.json({ error: 'Для калькулируемой опции необходимо указать цену за единицу' }, { status: 400 });
      }
    }
    
    // Подготавливаем обновленные данные
    const updateData = {
      name: data.name,
      description: data.description !== undefined ? data.description : existingOption.description,
      pricing_type: data.pricing_type || existingOption.pricing_type, // Сохраняем для обратной совместимости
      pricing_type_id: data.pricing_type_id !== undefined ? data.pricing_type_id : existingOption.pricing_type_id, // Новое поле
      volume_min: data.volume_min !== undefined ? data.volume_min : existingOption.volume_min,
      volume_max: data.volume_max !== undefined ? data.volume_max : existingOption.volume_max,
      volume_unit: data.volume_unit !== undefined ? data.volume_unit : existingOption.volume_unit,
      nominal_volume: data.nominal_volume !== undefined ? data.nominal_volume : existingOption.nominal_volume,
      price_per_unit: data.price_per_unit !== undefined ? data.price_per_unit : existingOption.price_per_unit
    };
    
    // Рассчитываем calculated_price_min и calculated_price_max
    let calculated_price_min = null;
    let calculated_price_max = null;
    
    // Проверяем калькулируемый тип по новому или старому полю
    const isCalculable = 
      (updateData.pricing_type_id === 1) || // ID=1 для Калькулируемая
      (updateData.pricing_type === 'calculable') || 
      (updateData.pricing_type === 'Калькулируемая');
    
    if (isCalculable && updateData.nominal_volume && updateData.price_per_unit) {
      console.log('Рассчитываем стоимость для калькулируемой опции при обновлении:', {
        pricing_type: updateData.pricing_type,
        pricing_type_id: updateData.pricing_type_id,
        volume_min: updateData.volume_min,
        volume_max: updateData.volume_max,
        nominal_volume: updateData.nominal_volume,
        price_per_unit: updateData.price_per_unit
      });
      
      if (updateData.volume_min !== null) {
        calculated_price_min = (updateData.volume_min / updateData.nominal_volume) * updateData.price_per_unit;
        console.log('Рассчитанная минимальная стоимость:', calculated_price_min);
      }
      
      if (updateData.volume_max !== null) {
        calculated_price_max = (updateData.volume_max / updateData.nominal_volume) * updateData.price_per_unit;
        console.log('Рассчитанная максимальная стоимость:', calculated_price_max);
      }
    }
    
    // Обновляем запись в БД
    const result = await db.sequelize.query(
      `UPDATE order_stage_options 
      SET name = $1, description = $2, pricing_type = $3, pricing_type_id = $4,
          volume_min = $5, volume_max = $6, volume_unit = $7, 
          nominal_volume = $8, price_per_unit = $9, 
          calculated_price_min = $10, calculated_price_max = $11,
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $12 AND order_stage_id::text = $13
      RETURNING *`,
      { 
        bind: [
          updateData.name,
          updateData.description,
          updateData.pricing_type,
          updateData.pricing_type_id,
          updateData.volume_min,
          updateData.volume_max,
          updateData.volume_unit,
          updateData.nominal_volume,
          updateData.price_per_unit,
          calculated_price_min,
          calculated_price_max,
          String(optionId),
          String(stageId)
        ],
        type: db.sequelize.QueryTypes.SELECT
      }
    );
    
    console.log('Результат обновления опции:', JSON.stringify(result, null, 2));
    
    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Ошибка при обновлении опции' }, { status: 500 });
    }
    
    return NextResponse.json(result[0]);
    
  } catch (error) {
    console.error('Ошибка при обновлении опции:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE /api/orders/[orderId]/stages/[stageId]/options/[optionId] - Удаление опции
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string; stageId: string; optionId: string } }
) {
  try {
    const { orderId, stageId, optionId } = await params;
    console.log('Удаление опции этапа', { orderId, stageId, optionId });
    
    // Прямой поиск этапа через SQL
    const stageResult = await db.sequelize.query(
      'SELECT * FROM order_stages WHERE id::text = $1',
      { 
        bind: [String(stageId)],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    console.log('Результат прямого SQL поиска этапа для DELETE:', JSON.stringify(stageResult, null, 2));
    
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
    
    // Проверяем существование опции перед удалением
    const checkOptionResult = await db.sequelize.query(
      'SELECT * FROM order_stage_options WHERE id::text = $1 AND order_stage_id::text = $2',
      { 
        bind: [String(optionId), String(stageId)],
        type: db.sequelize.QueryTypes.SELECT 
      }
    );
    console.log('Проверка существования опции:', JSON.stringify(checkOptionResult, null, 2));
    
    if (!checkOptionResult || checkOptionResult.length === 0) {
      return NextResponse.json({ error: 'Опция не найдена' }, { status: 404 });
    }
    
    // Удаляем опцию
    const [result] = await db.sequelize.query(
      'DELETE FROM order_stage_options WHERE id::text = $1 AND order_stage_id::text = $2 RETURNING id',
      { 
        bind: [String(optionId), String(stageId)],
        type: db.sequelize.QueryTypes.DELETE
      }
    );
    console.log('Результат удаления:', JSON.stringify(result, null, 2));
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Опция не найдена' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Опция успешно удалена' });
    
  } catch (error) {
    console.error('Ошибка при удалении опции:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
