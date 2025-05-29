// src/app/(app)/projects/[projectId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectDetailsTabs from "./project-details-tabs"; // Импорт нового клиентского компонента
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"; // Импорт компонента диалога удаления проекта

// Тип Project остается здесь, так как он используется серверным компонентом для получения данных
type Project = {
  id: number;
  title: string;
  description: string | null;
  status: number;
  currency: number;
  budget: number;
  createdAt: string | null;
  updatedAt: string | null;
  // Для совместимости с API
  created_at?: string;
  updated_at?: string;
  customer?: {
    id: number;
    name: string;
    email: string;
  };
  projectStatus?: {
    id: number;
    name: string;
    textColor: string;
    backgroundColor: string;
  };
  currencyDetails?: {
    id: number;
    isoCode: string;
    name: string;
    symbol: string;
    exchangeRate: number;
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
    `http://localhost:3000/api/projects/${projectId}`,
    { cache: "no-store" }, // Добавляем опцию, чтобы данные всегда были актуальными
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch project");
  }

  const project: Project = await response.json();

  return (
    <div className="w-full p-0" data-oid="dqku2cn">
      <div className="mb-6" data-oid="z4f824h">
        <div
          className="flex items-center justify-between mb-2"
          data-oid="es.8tuz"
        >
          <div className="flex items-center gap-4" data-oid="m8l2gth">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="rounded-full h-10 w-10"
              data-oid="c48irev"
            >
              <Link href="/projects" data-oid="qim:sal">
                <ArrowLeft className="h-4 w-4" data-oid="qc9pf:y" />
              </Link>
            </Button>
            <h2
              className="text-2xl font-bold tracking-tight"
              data-oid="tj4borj"
            >
              {project.title}
            </h2>
            <div
              className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center"
              style={{
                backgroundColor:
                  project.projectStatus?.backgroundColor || "#e2e8f0",
                color: project.projectStatus?.textColor || "#1f2937",
                borderColor: project.projectStatus?.textColor || "#1f2937",
              }}
              data-oid="n0pblqj"
            >
              <span
                className="h-2 w-2 rounded-full mr-1.5"
                style={{
                  backgroundColor:
                    project.projectStatus?.textColor || "#1f2937",
                }}
                data-oid=".9yjznt"
              ></span>
              {project.projectStatus?.name || `Статус #${project.status}`}
            </div>
          </div>
          <div className="flex items-center gap-2" data-oid="zgfpjgh">
            <Button
              asChild
              variant="outline"
              className="h-10 px-4 py-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              data-oid="csq_-_-"
            >
              <Link href={`/projects/${projectId}/edit`} data-oid="d.a5rt6">
                <Pencil className="mr-2 h-4 w-4" data-oid=".jd:pwr" />
                Редактировать
              </Link>
            </Button>
            <DeleteProjectDialog
              projectId={projectId}
              size="icon"
              buttonClassName="h-10 w-10 rounded-full border border-input bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors"
              data-oid="h9oac1_"
            />
          </div>
        </div>
      </div>
      <ProjectDetailsTabs project={project} data-oid="1o9fwn5" />{" "}
      {/* Рендер клиентского компонента с передачей данных проекта */}
    </div>
  );
}
