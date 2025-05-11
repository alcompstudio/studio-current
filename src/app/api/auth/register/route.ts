import { NextResponse } from 'next/server';
import { User, Customer } from '@/lib/db'; // Импортируем модели User и Customer
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Сложность хеширования пароля

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, name } = body; // Ожидаем эти поля от фронтенда

    // Валидация входных данных
    if (!email || !password || !role || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, role, name are required.' },
        { status: 400 }
      );
    }

    // Проверка, существует ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Создание пользователя в таблице users
    const newUser = await User.create({
      email,
      passwordHash, // Сохраняем хеш
      role,
    });

    // Создание связанного профиля (Customer или Freelancer)
    // Пока реализуем только для Customer (Заказчик)
    if (role === 'Заказчик') {
      await Customer.create({
        userId: newUser.id, // Связываем с созданным пользователем
        name: name,
        email: email, // Дублируем email для удобства или можно убрать?
      });
    } else if (role === 'Исполнитель') {
      // TODO: Создать запись в таблице Freelancers, когда она будет
      console.warn(`Registration for role '${role}' is not fully implemented yet (missing Freelancer profile creation).`);
    } else {
       console.warn(`Registration attempted for unhandled role: '${role}'`);
       // Можно вернуть ошибку или просто создать пользователя без профиля?
       // Пока просто логируем
    }

    // <<< ВОЗВРАЩАЕМ ЛОГИКУ ПОЛУЧЕНИЯ customerId (без дублирования создания Customer)
    let customerId: number | null = null;
    if (role === 'Заказчик') {
      // Находим только что созданный Customer, чтобы получить его ID
      // (Предполагаем, что создание выше прошло успешно, если нет - будет ошибка раньше)
      const createdCustomer = await Customer.findOne({ where: { userId: newUser.id } });
      if (createdCustomer) {
          customerId = createdCustomer.id;
      } else {
          // Это странно, если создание Customer прошло, а найти не можем
          console.error(`[API_REGISTER_ERROR] Could not find created customer profile for user ID: ${newUser.id}`);
          // Можно вернуть ошибку или продолжить без customerId?
          // Пока продолжим, но залогировали.
      }
    }
    // TODO: Аналогично получить freelancerId, если роль Исполнитель

    // Возвращаем данные созданного пользователя (без хеша пароля!) и ID профиля, если он был создан
    const userResponse: { userId: number; email: string; role: string; customerId?: number } = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
    };
    // Используем customerId, который мы только что получили (или null, если роль не Заказчик или профиль не нашелся)
    if (customerId !== null) { 
        userResponse.customerId = customerId;
    }

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('[API_REGISTER_ERROR]', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to register user', details: message },
      { status: 500 }
    );
  }
}
