"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusCircle,
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
// import { mockProjects } from './mockProjects'; // Remove mock data import
import { cn } from "@/lib/utils"; // Import cn for conditional classes
import React, { useEffect, useState } from "react"; // Added useEffect, useState
import type { Project } from "@/lib/types"; // Assuming Project type exists and is compatible

// Определение интерфейса для проектов, полученных с API
interface ProjectWithCustomer {
  id: number;
  title: string;
  name?: string; // Некоторые проекты могут иметь поле name вместо title
  description: string | null;
  status: number;
  currency: number;
  budget: number;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number | string;
    name: string;
    email?: string;
    // Другие возможные поля
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
  // Возможно также включаются orders
}

// Helper function to select icon based on status name
const getStatusIcon = (statusName: string) => {
  // Упрощенная логика выбора иконки на основе имени статуса
  // Можно настроить более точное соответствие
  if (
    statusName.toLowerCase().includes("прогресс") ||
    statusName.toLowerCase().includes("progress")
  ) {
    return <Clock className="mr-1 h-3 w-3" data-oid="v.radh8" />;
  } else if (
    statusName.toLowerCase().includes("заверш") ||
    statusName.toLowerCase().includes("complet")
  ) {
    return <CheckCircle className="mr-1 h-3 w-3" data-oid="kdy7pxs" />;
  } else if (
    statusName.toLowerCase().includes("план") ||
    statusName.toLowerCase().includes("plan")
  ) {
    return <Briefcase className="mr-1 h-3 w-3" data-oid="5d6p30-" />;
  } else if (
    statusName.toLowerCase().includes("ожида") ||
    statusName.toLowerCase().includes("hold")
  ) {
    return <Clock className="mr-1 h-3 w-3" data-oid="s097p3d" />;
  } else {
    return null;
  }
};

export default function ProjectsPage() {
  // TODO: Fetch and display projects based on user role
  const userRole = "Заказчик"; // Mock role - replace with actual role check

  const [projects, setProjects] = useState<ProjectWithCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Failed to fetch projects: ${response.statusText}`,
          );
        }
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col gap-6" data-oid="ounroel">
      {/* Page Header */}
      <div className="flex items-center justify-between" data-oid="fb.bnnu">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="53hax6v">
          Projects
        </h2>
        {userRole === "Заказчик" && ( // Show button only for Заказчик (Client)
          <Link href="/projects/new" passHref data-oid="::ot9lx">
            <Button data-oid="csspllw">
              <PlusCircle className="mr-2 h-4 w-4" data-oid="ov95gtf" /> Create
              New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Project List Header Info */}
      <div className="mb-2" data-oid="tiix69l">
        <h3 className="text-lg font-semibold" data-oid="72goe:j">
          Project List
        </h3>
        <p className="text-sm text-muted-foreground" data-oid="7mn839p">
          Manage your ongoing and completed projects.
        </p>
      </div>

      {/* Project List Content - No wrapping Card */}
      <div className="space-y-4" data-oid="1jlzhzh">
        {isLoading && (
          <Card className="shadow-sm border-none" data-oid="u8xy.p.">
            <CardContent data-oid="uh7smok">
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-oid="r6a0:ab"
              >
                Loading projects...
              </p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card
            className="shadow-sm border-destructive bg-destructive/10"
            data-oid="du4_ver"
          >
            <CardContent
              className="flex items-center gap-2 text-destructive py-4"
              data-oid="aph96nd"
            >
              <AlertTriangle className="h-5 w-5" data-oid="pu179cp" />
              <p className="text-sm font-semibold" data-oid="5.hubj2">
                Error loading projects: {error}
              </p>
            </CardContent>
          </Card>
        )}
        {!isLoading && !error && projects.length > 0
          ? projects.map((project) => (
              <Card
                key={project.id}
                className="shadow-sm hover:shadow-md transition-shadow border-none"
                data-oid="wigwe:6"
              >
                {" "}
                {/* Removed border */}
                <CardHeader className="pb-2" data-oid="dme.bkp">
                  {" "}
                  {/* Reduce padding bottom */}
                  <div
                    className="flex justify-between items-start"
                    data-oid="il4q_ql"
                  >
                    <CardTitle
                      className="text-lg font-semibold"
                      data-oid="zknfe6x"
                    >
                      {project.title ?? project.name}
                    </CardTitle>
                    <Badge
                      className="flex items-center"
                      style={{
                        backgroundColor:
                          project.projectStatus?.backgroundColor || "#e2e8f0",
                        color: project.projectStatus?.textColor || "#1f2937",
                        borderColor:
                          project.projectStatus?.textColor || "#1f2937",
                      }}
                      data-oid="5uuk8:n"
                    >
                      {project.projectStatus &&
                        getStatusIcon(project.projectStatus.name)}
                      {project.projectStatus?.name ||
                        `Статус #${project.status}`}
                    </Badge>
                  </div>
                  <CardDescription data-oid="f21hmk_">
                    Client: {project.customer?.name || "N/A"} • Budget:{" "}
                    {project.budget
                      ? `${project.budget.toLocaleString()} ${project.currencyDetails?.isoCode || ""}`
                      : "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent data-oid="n_.j3vb">
                  <div
                    className="text-sm text-muted-foreground mb-4 line-clamp-2"
                    data-oid=":32rd4a"
                    data-component-name="ProjectsPage"
                  >
                    {project.description ? (
                      <div 
                        className="prose-content" 
                        dangerouslySetInnerHTML={{ __html: project.description }} 
                      />
                    ) : (
                      <p>Нет описания</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2" data-oid="bilkn8:">
                    <Link
                      href={`/projects/${project.id}`}
                      passHref
                      data-oid="c7u3:8d"
                    >
                      <Button variant="outline" size="sm" data-oid="920z7zk">
                        View Details
                      </Button>
                    </Link>
                    <DeleteProjectDialog
                      projectId={project.id}
                      size="sm"
                      variant="outline"
                      onDeleteSuccess={() => {
                        // Обновляем список после удаления, удаляя проект из текущего состояния
                        setProjects(
                          projects.filter((p) => p.id !== project.id),
                        );
                      }}
                      data-oid="y0-p7:d"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          : !isLoading &&
            !error && (
              <Card className="shadow-sm border-none" data-oid="u21ri:d">
                {" "}
                {/* Removed border */}
                <CardContent data-oid="indogd3">
                  <p
                    className="text-sm text-muted-foreground py-4 text-center"
                    data-oid="0ph9xjm"
                  >
                    No projects created yet.
                  </p>
                </CardContent>
              </Card>
            )}
      </div>
    </div>
  );
}
