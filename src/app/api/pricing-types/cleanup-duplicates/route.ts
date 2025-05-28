import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/models';
import db from '@/lib/models'; // db экспортируется как default export

// API эндпоинт для удаления дублирующихся записей
export async function DELETE() {
  try {
    await connectDB(); // Убедимся, что соединение с БД установлено
    
    // Используем raw query для удаления записей с id 3 и 4
    await db.sequelize.query(`DELETE FROM pricing_type_os WHERE id IN (3, 4);`);
    
    // Проверяем оставшиеся записи
    const remainingPricingTypes = await db.PricingTypeOs.findAll({
      order: [['id', 'ASC']]
    });
    
    return NextResponse.json({
      message: 'Дублирующиеся записи успешно удалены',
      remainingRecords: remainingPricingTypes
    });
  } catch (error) {
    console.error('Ошибка при удалении дублирующихся записей:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить дублирующиеся записи' },
      { status: 500 }
    );
  }
}
