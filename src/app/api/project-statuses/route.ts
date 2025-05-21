// src/app/api/project-statuses/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/models'; // Путь к вашей инициализации Sequelize (models/index.ts)
import { ProjectStatusOS } from '@/lib/models/ProjectStatusOS'; // Импортируем сам класс модели
import type { ProjectStatusOSAttributes } from '@/lib/models/ProjectStatusOS'; // Импортируем тип атрибутов

export async function GET() {
  try {
    // Получаем экземпляры модели ProjectStatusOS
    const projectStatusesModels: ProjectStatusOS[] = await db.ProjectStatusOS.findAll({
      order: [['id', 'ASC']], // Опционально: сортируем по ID или name
    });

    // Преобразуем экземпляры модели в простые объекты ProjectStatusOSAttributes
    const projectStatuses: ProjectStatusOSAttributes[] = projectStatusesModels.map(
      (statusInstance: ProjectStatusOS) => statusInstance.get({ plain: true })
    );

    return NextResponse.json(projectStatuses);
  } catch (error) {
    console.error('Error fetching project statuses:', error);
    // Определяем, является ли ошибка экземпляром Error
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to fetch project statuses', details: errorMessage }, { status: 500 });
  }
}
