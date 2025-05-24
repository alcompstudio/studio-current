// src/app/api/projects/[projectId]/route.ts
import { NextResponse } from 'next/server';
import { Project, Customer, Order, ProjectStatusOS, CurrencyOS } from '@/lib/db'; // Исправленный импорт моделей, добавлены ProjectStatusOS и CurrencyOS
import { Transaction } from 'sequelize';

export async function GET(
  request: Request,
  context: { params: { projectId: string } }
) {
  const { projectId: projectIdStr } = await context.params;
  const projectIdNum = parseInt(projectIdStr, 10);

  if (isNaN(projectIdNum)) {
    return NextResponse.json({ message: 'Project ID must be a valid number.' }, { status: 400 });
  }

  try {
    const project = await Project.findByPk(projectIdNum, {
      include: [
        { model: Customer, as: 'customer' }, // Предполагаем, что связь называется 'customer'
        { model: Order, as: 'orders' },      // Предполагаем, что связь называется 'orders'
        { model: ProjectStatusOS, as: 'projectStatus' }, // Добавляем статус проекта
        { model: CurrencyOS, as: 'currencyDetails' } // Добавляем данные о валюте
      ]
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Проверка и корректировка дат
    let finalCreatedAt = null;
    console.log(`[API_PROJECT_DETAIL] Raw project.createdAt for project ${projectIdNum}:`, project.createdAt, `Type: ${typeof project.createdAt}`);
    if (project.createdAt && project.createdAt instanceof Date && !isNaN(project.createdAt.getTime())) {
        finalCreatedAt = project.createdAt.toISOString();
        console.log(`[API_PROJECT_DETAIL] Project ${projectIdNum} createdAt is a valid Date. ISOString: ${finalCreatedAt}`);
    } else if (project.createdAt) {
        // Попытка создать дату, если это не объект Date, но что-то существует (например, строка из БД, которую Sequelize не распознал как Date)
        const parsedDate = new Date(project.createdAt as string | number | Date); // Явное приведение типа для конструктора Date
        if (!isNaN(parsedDate.getTime())){
            finalCreatedAt = parsedDate.toISOString();
            console.warn(`[API_PROJECT_DETAIL] project.createdAt for project ${projectIdNum} was not a Date instance but parsable: ${project.createdAt}. ISOString: ${finalCreatedAt}`);
        } else {
            console.warn(`[API_PROJECT_DETAIL] project.createdAt for project ${projectIdNum} is problematic or unparsable. Value: ${project.createdAt}, Type: ${typeof project.createdAt}. Setting to null.`);
        }
    } else {
        console.log(`[API_PROJECT_DETAIL] project.createdAt for project ${projectIdNum} is null or undefined initially. Setting to null.`);
    }

    let finalUpdatedAt = null;
    console.log(`[API_PROJECT_DETAIL] Raw project.updatedAt for project ${projectIdNum}:`, project.updatedAt, `Type: ${typeof project.updatedAt}`);
    if (project.updatedAt && project.updatedAt instanceof Date && !isNaN(project.updatedAt.getTime())) {
        finalUpdatedAt = project.updatedAt.toISOString();
        console.log(`[API_PROJECT_DETAIL] Project ${projectIdNum} updatedAt is a valid Date. ISOString: ${finalUpdatedAt}`);
    } else if (project.updatedAt) {
        const parsedDate = new Date(project.updatedAt as string | number | Date);
        if (!isNaN(parsedDate.getTime())){
            finalUpdatedAt = parsedDate.toISOString();
            console.warn(`[API_PROJECT_DETAIL] project.updatedAt for project ${projectIdNum} was not a Date instance but parsable: ${project.updatedAt}. ISOString: ${finalUpdatedAt}`);
        } else {
            console.warn(`[API_PROJECT_DETAIL] project.updatedAt for project ${projectIdNum} is problematic or unparsable. Value: ${project.updatedAt}, Type: ${typeof project.updatedAt}. Setting to null.`);
        }
    } else {
        console.log(`[API_PROJECT_DETAIL] project.updatedAt for project ${projectIdNum} is null or undefined initially. Setting to null.`);
    }

    const projectData = project.toJSON(); // projectData будет иметь свои собственные строковые представления дат
    projectData.createdAt = finalCreatedAt; // Перезаписываем нашими тщательно обработанными датами
    projectData.updatedAt = finalUpdatedAt;

    return NextResponse.json(projectData);
  } catch (error) {
    console.error(`[API_PROJECT_DETAIL] Error fetching project ${projectIdNum} (raw: ${projectIdStr}):`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to fetch project', error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: { projectId: string } }
) {
  const { projectId: projectIdStr } = await context.params;
  const projectIdNum = parseInt(projectIdStr, 10);

  if (isNaN(projectIdNum)) {
    return NextResponse.json({ message: 'Project ID must be a valid number.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, description, status, currency, budget } = body;

    // Валидация (минимальная, можно расширить)
    // Убедимся, что budget и currency не undefined, если они переданы. Они могут быть null.
    if (!title || !status || currency === undefined || (body.hasOwnProperty('budget') && budget === undefined)) {
      return NextResponse.json(
        { message: 'Missing or invalid required fields: title, status are required. Currency and budget must be provided (can be null for budget).' },
        { status: 400 }
      );
    }
    
    const projectToUpdate = await Project.findByPk(projectIdNum);

    if (!projectToUpdate) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Обновляем поля проекта
    projectToUpdate.title = title; 
    projectToUpdate.description = description || null;
    projectToUpdate.status = parseInt(status, 10); // Убедимся, что статус это число
    projectToUpdate.currency = currency || null; 
    projectToUpdate.budget = (budget === null || budget === undefined || isNaN(Number(budget))) ? null : Number(budget);

    await projectToUpdate.save();

    const updatedProject = await Project.findByPk(projectIdNum, {
        include: [
            { model: Customer, as: 'customer' },
            { model: Order, as: 'orders' },
            { model: ProjectStatusOS, as: 'projectStatus' }, // Добавляем статус проекта для ответа
            { model: CurrencyOS, as: 'currencyDetails' } // Добавляем данные о валюте для ответа
        ]
    });

    return NextResponse.json(updatedProject);

  } catch (error) {
    console.error(`[API_PROJECT_UPDATE] Error updating project ${projectIdNum} (raw: ${projectIdStr}):`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to update project', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { projectId: string } }
) {
  const { projectId: projectIdStr } = await context.params;
  const projectIdNum = parseInt(projectIdStr, 10);

  if (isNaN(projectIdNum)) {
    return NextResponse.json({ message: 'Project ID must be a valid number.' }, { status: 400 });
  }

  try {
    // Используем транзакцию для атомарности операции
    const sequelize = Project.sequelize;
    const result = await sequelize?.transaction(async (t: Transaction) => {
      // Получаем проект вместе со связанными заказами
      const project = await Project.findByPk(projectIdNum, {
        include: [
          { model: Order, as: 'orders' }
        ],
        transaction: t
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Если есть связанные заказы, удаляем их сначала
      const orders = project.get('orders');
      if (orders && orders.length > 0) {
        for (const order of orders) {
          await order.destroy({ transaction: t });
        }
      }

      // Удаляем сам проект
      await project.destroy({ transaction: t });

      return { success: true };
    });

    return NextResponse.json({ 
      message: 'Project and all related data successfully deleted',
      relatedOrdersDeleted: true
    });
  } catch (error) {
    console.error(`[API_PROJECT_DELETE] Error deleting project ${projectIdNum} (raw: ${projectIdStr}):`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    
    // Обрабатываем специальные случаи ошибок
    if (errorMessage === 'Project not found') {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    
    // Общая ошибка
    return NextResponse.json({ message: 'Failed to delete project', error: errorMessage }, { status: 500 });
  }
}
