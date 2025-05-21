import { NextResponse } from 'next/server';
import { Project, Customer, Order, ProjectStatusOS } from '@/lib/db'; // Импортируем ProjectStatusOS // Импортируем инициализированные модели из db.ts

export async function GET() {
  try {
    const projects = await Project.findAll({
      // include: [
      //   {
      //     model: Customer,
      //     as: 'customer',
      //   },
      //   {
      //     model: Order,
      //     as: 'orders',
      //   },
      //   {
      //     model: ProjectStatusOS,
      //     as: 'projectStatus', // Должно совпадать с 'as' в модели Project
      //   },
      // ],
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API_PROJECTS_ERROR] Failed to fetch projects. Full error object:', error);
    let errorDetails = 'An unknown error occurred';
    if (error instanceof Error) {
      errorDetails = error.message;
      if (error.stack) {
        console.error('[API_PROJECTS_ERROR_STACK]:', error.stack);
        errorDetails += ` | Stack: ${error.stack}`;
      }
    }
    return NextResponse.json(
      { error: 'Failed to fetch projects from API', details: errorDetails },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, status, customerId, currency, budget } = body;

    // Validate required fields
    if (!name || !customerId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: name, customerId, status are required.' },
        { status: 400 }
      );
    }

    // Prepare data for Project.create, mapping frontend names to backend model attributes
    const projectDataToCreate: any = {
      title: name, // Map name to title
      customer_id: parseInt(customerId, 10), // Map customerId to customer_id and parse to int
      status: parseInt(status, 10), // Убедимся, что статус это число
    };

    if (description !== undefined) {
      projectDataToCreate.description = description;
    }

    // Добавляем budget и currency, если они есть и не пустые строки
    if (budget !== undefined && budget !== null && String(budget).trim() !== '') {
      const parsedBudget = parseFloat(String(budget));
      if (!isNaN(parsedBudget)) {
        projectDataToCreate.budget = parsedBudget;
      }
    }
    if (currency !== undefined && String(currency).trim() !== '') {
      projectDataToCreate.currency = String(currency).trim();
    }

    const project = await Project.create(projectDataToCreate);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error); // Log the actual error
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create project', details: errorMessage },
      { status: 500 }
    );
  }
}