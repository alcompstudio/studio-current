// src/app/api/projects/[projectId]/route.ts
import { NextResponse } from 'next/server';
import { Project, Customer, Order } from '@/lib/db'; // Исправленный импорт моделей

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;

  if (!projectId) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  try {
    const project = await Project.findByPk(projectId, {
      include: [
        { model: Customer, as: 'customer' }, // Предполагаем, что связь называется 'customer'
        { model: Order, as: 'orders' }      // Предполагаем, что связь называется 'orders'
      ]
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`[API_PROJECT_DETAIL] Error fetching project ${projectId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to fetch project', error: errorMessage }, { status: 500 });
  }
}

// TODO: Добавить обработчики PUT и DELETE для редактирования и удаления проекта, если необходимо

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;

  if (!projectId) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, description, status, currency, budget } = body;

    // Валидация (минимальная, можно расширить)
    // Убедимся, что budget и currency не undefined, если они переданы. Они могут быть null.
    if (!name || !status || currency === undefined || body.hasOwnProperty('budget') && budget === undefined) {
      return NextResponse.json(
        { message: 'Missing or invalid required fields: name, status are required. Currency and budget must be provided (can be null for budget).' },
        { status: 400 }
      );
    }
    
    const projectToUpdate = await Project.findByPk(projectId);

    if (!projectToUpdate) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Обновляем поля проекта
    projectToUpdate.title = name; 
    projectToUpdate.description = description || null;
    projectToUpdate.status = status;
    projectToUpdate.currency = currency || null; 
    projectToUpdate.budget = (budget === null || budget === undefined || isNaN(Number(budget))) ? null : Number(budget);

    await projectToUpdate.save();

    const updatedProject = await Project.findByPk(projectId, {
        include: [
            { model: Customer, as: 'customer' },
            { model: Order, as: 'orders' }
        ]
    });

    return NextResponse.json(updatedProject);

  } catch (error) {
    console.error(`[API_PROJECT_UPDATE] Error updating project ${projectId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: 'Failed to update project', error: errorMessage }, { status: 500 });
  }
}
