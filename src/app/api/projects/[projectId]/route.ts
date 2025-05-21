// src/app/api/projects/[projectId]/route.ts
import { NextResponse } from 'next/server';
import { Project, Customer, Order, ProjectStatusOS } from '@/lib/db'; // Исправленный импорт моделей, добавлен ProjectStatusOS

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
        { model: ProjectStatusOS, as: 'projectStatus' } // Добавляем статус проекта
      ]
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`[API_PROJECT_DETAIL] Error fetching project ${projectIdNum} (raw: ${projectIdStr}):`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to fetch project', error: errorMessage }, { status: 500 });
  }
}

// TODO: Добавить обработчики PUT и DELETE для редактирования и удаления проекта, если необходимо

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
            { model: ProjectStatusOS, as: 'projectStatus' } // Добавляем статус проекта для ответа
        ]
    });

    return NextResponse.json(updatedProject);

  } catch (error) {
    console.error(`[API_PROJECT_UPDATE] Error updating project ${projectIdNum} (raw: ${projectIdStr}):`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to update project', error: errorMessage }, { status: 500 });
  }
}
