import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');
  
  try {
    // Проверяем наличие и валидность токена
    if (!authToken?.value || authToken.value.length < 32) {
      throw new Error('Invalid token');
    }
    
    // Проверяем наличие данных пользователя в cookies
    const storedUser = cookieStore.get('auth-user');
    if (!storedUser?.value) {
      throw new Error('User data not found');
    }
    
    // Перенаправляем авторизованного пользователя в dashboard
    return redirect('/dashboard');
  } catch {
    // Очищаем невалидные данные перед редиректом
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser');
    }
    return redirect('/auth');
  }
}