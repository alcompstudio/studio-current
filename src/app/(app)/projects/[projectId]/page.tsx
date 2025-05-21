// src/app/(app)/projects/[projectId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectDetailsTabs from './project-details-tabs'; // Импорт нового клиентского компонента

// Тип Project остается здесь, так как он используется серверным компонентом для получения данных
type Project = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  currency: string;
  budget: number;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    name: string;
    email: string;
  };
};

interface ProjectPageProps {
  params: {
    projectId: string;
  };
  // searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProjectPage(props: ProjectPageProps) {
  const { projectId } = await props.params;
  // Получаем данные проекта
  const response = await fetch(
    `http://localhost:3000/api/projects/${projectId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch project');
  }

  const project: Project = await response.json();

  return (
    <div className="w-full p-0">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              asChild
              className="rounded-full h-10 w-10"
            >
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold tracking-tight">{project.title}</h2>
            <div className="rounded-full border px-2.5 py-0.5 font-semibold text-foreground border-current flex items-center text-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
              {project.status}
            </div>
          </div>
          <Button 
            asChild 
            variant="outline"
            className="h-10 px-4 py-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Link href={`/projects/${projectId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Редактировать
            </Link>
          </Button>
        </div>
      </div>

      <ProjectDetailsTabs project={project} /> {/* Рендер клиентского компонента с передачей данных проекта */}
      
    </div>
  );
}