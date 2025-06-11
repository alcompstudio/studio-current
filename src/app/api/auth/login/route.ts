import { NextResponse } from 'next/server';
import { User, Customer } from '@/lib/db'; // Импортируем User и Customer
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Находим пользователя по email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Сравниваем предоставленный пароль с хешем в базе данных
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Пароль верный. Ищем связанный профиль (Customer или Freelancer)
    let customerId: number | null = null;
    // Пока ищем только Customer
    if (user.role === 'Заказчик') {
        const customerProfile = await Customer.findOne({ where: { userId: user.id } });
        if (customerProfile) {
            customerId = customerProfile.id;
        }
    }
    // TODO: Добавить поиск профиля Freelancer, если роль 'Исполнитель'

    // Генерируем токен авторизации
    const authToken = crypto.randomBytes(32).toString('hex');

    // Возвращаем данные пользователя и ID профиля, если найден
    const userResponse: { userId: number; email: string; role: string; customerId?: number } = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    if (customerId) {
        userResponse.customerId = customerId;
    }

    // Создаем ответ с cookies
    const response = NextResponse.json(userResponse, { status: 200 });

    // Устанавливаем cookies для авторизации
    response.cookies.set('auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/'
    });

    response.cookies.set('auth-user', JSON.stringify(userResponse), {
      httpOnly: false, // Доступно для клиентского JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('[API_LOGIN_ERROR]', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to login', details: message },
      { status: 500 }
    );
  }
}
