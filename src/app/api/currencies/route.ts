import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated Этот API-маршрут устарел и оставлен для обратной совместимости.
 * Используйте /api/settings/currencies вместо этого маршрута.
 */

// GET /api/currencies - переадресация на /api/settings/currencies
export async function GET(request: NextRequest) {
  // Получаем базовый URL для переадресации
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host');
  const url = new URL(`${protocol}://${host}/api/settings/currencies`);
  
  // Добавляем все параметры запроса к новому URL
  request.nextUrl.searchParams.forEach((value: string, key: string) => {
    url.searchParams.append(key, value);
  });

  // Логируем переадресацию для отладки
  console.log(`Переадресация с /api/currencies на ${url.toString()}`);
  
  // Создаем ответ с кодом 307 (временная переадресация)
  return NextResponse.redirect(url, { status: 307 });
}
