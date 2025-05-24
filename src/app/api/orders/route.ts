import { NextResponse } from 'next/server';
import db from '@/lib/models'; // Импорт объекта db по умолчанию
const Order = db.Order; // Получаем модель Order из объекта db

// GET /api/orders - Получить все заказы или отфильтровать по project_id
export async function GET(request: Request) {
  console.log('[API/ORDERS] Received GET request');
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const orderId = searchParams.get('id');
    console.log(`[API/ORDERS] Project ID from search params: ${projectId}`);
    console.log(`[API/ORDERS] Order ID from search params: ${orderId}`);

    let orders;
    if (orderId) {
      // Если указан конкретный ID заказа
      console.log(`[API/ORDERS] Fetching order with id: ${orderId}`);
      const order = await Order.findByPk(parseInt(orderId, 10));
      if (!order) {
        console.log(`[API/ORDERS] Order with id ${orderId} not found`);
        return NextResponse.json({ error: `Order with id ${orderId} not found` }, { status: 404 });
      }
      console.log(`[API/ORDERS] Found order with id: ${orderId}`);
      return NextResponse.json(order);
    } else if (projectId) {
      // Если указан ID проекта
      console.log(`[API/ORDERS] Fetching orders for project_id: ${projectId}`);
      orders = await Order.findAll({ where: { project_id: parseInt(projectId, 10) } });
      console.log(`[API/ORDERS] Found ${orders.length} orders for project_id: ${projectId}`);
    } else {
      // Получаем все заказы
      console.log('[API/ORDERS] Fetching all orders');
      orders = await Order.findAll();
      console.log(`[API/ORDERS] Found ${orders.length} total orders`);
    }
    console.log('[API/ORDERS] Successfully fetched orders. Returning JSON response.');
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[API/ORDERS] Failed to fetch orders:', error);
    // Log the full error object for better debugging
    console.error('[API/ORDERS] Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Создать новый заказ
export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    // Валидация данных orderData (можно добавить более сложную валидацию с Zod или Yup)
    if (!orderData.project_id || !orderData.title || !orderData.status) {
        return NextResponse.json({ error: 'Missing required fields: project_id, title, status' }, { status: 400 });
    }
    const order = await Order.create(orderData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    // Проверка на ошибки валидации Sequelize
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: error.message, details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Обновить существующий заказ
export async function PUT(request: Request) {
  try {
    const { id, ...orderData } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required for update' }, { status: 400 });
    }
    const [updatedCount] = await Order.update(orderData, { where: { id } });
    if (updatedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found or no changes made' },
        { status: 404 }
      );
    }
    const updatedOrder = await Order.findByPk(id);
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order:', error);
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: error.message, details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders - Удалить заказ
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required for deletion' }, { status: 400 });
    }
    const deletedCount = await Order.destroy({ where: { id } });
    if (deletedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
