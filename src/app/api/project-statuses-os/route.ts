// src/app/api/project-statuses-os/route.ts
import { NextResponse } from 'next/server';
import { ProjectStatusOS } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const statuses = await ProjectStatusOS.findAll({
      order: [['id', 'ASC']], // Опционально: упорядочить по ID
    });
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('[API_PROJECT_STATUSES_OS] Error fetching project statuses:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { message: 'Failed to fetch project statuses', error: errorMessage },
      { status: 500 }
    );
  }
}
