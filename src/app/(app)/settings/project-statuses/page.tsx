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
  Plus,
  Edit3,
  Trash2,
  Palette,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ViewToggle } from "@/components/status/view-toggle";
import { StatusTable } from "@/components/status/status-table";

// Тип для статуса проекта
interface ProjectStatus {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  // Возможно, другие поля, такие как порядок сортировки, описание и т.д.
}

export default function ProjectStatusesPage() {
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "table">("table"); // По умолчанию - табличный вид

  useEffect(() => {
    const fetchProjectStatuses = async () => {
      try {
        setIsLoading(true);
        
        // Запрашиваем данные из БД через API
        const response = await fetch("/api/settings/project-statuses");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Ошибка получения статусов проектов: ${response.statusText}`,
          );
        }
        
        const data = await response.json();
        setProjectStatuses(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch project statuses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectStatuses();
  }, []);

  // TODO: Implement delete functionality
  const handleDelete = async (statusId: number) => {
    console.log(`Delete project status with id: ${statusId}`);
    // Optimistically remove from UI or refetch
    // setProjectStatuses(projectStatuses.filter(status => status.id !== statusId));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Статусы проектов</h1>
          <p className="text-sm text-muted-foreground">
            Управление различными статусами для ваших проектов.
          </p>
        </div>
        <div className="flex gap-2">
          <ViewToggle view={view} onViewChange={setView} />
          <Button asChild>
            <Link href="/settings/project-statuses/new">
              <Plus className="w-4 h-4 mr-2" /> Создать статус проекта
            </Link>
          </Button>
        </div>
      </div>

      {/* Status List Content */}
      <div>
        {isLoading && (
          <Card className="shadow-sm border-none">
            <CardContent className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Загрузка статусов проектов...</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card className="shadow-sm border-destructive bg-destructive/10">
            <CardContent className="flex items-center gap-2 text-destructive py-4">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-semibold">
                Ошибка загрузки статусов проектов: {error}
              </p>
            </CardContent>
          </Card>
        )}
        
        {!isLoading && !error && (
          view === "table" ? (
            <Card>
              <StatusTable 
                items={projectStatuses} 
                basePath="/settings/project-statuses" 
                onDelete={handleDelete} 
              />
            </Card>
          ) : (
            <div className="space-y-4">
              {projectStatuses.length > 0 ? projectStatuses.map((status) => (
                <Card
                  key={status.id}
                  className="shadow-sm hover:shadow-md transition-shadow border-none"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <Palette className="mr-2 h-5 w-5" style={{ color: status.textColor }} />
                        {status.name}
                      </CardTitle>
                      <div
                        className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex items-center"
                        style={{
                          backgroundColor: status.backgroundColor,
                          color: status.textColor,
                          borderColor: status.textColor
                        }}
                      >
                        {status.name}
                      </div>
                    </div>
                    <CardDescription>
                      ID: {status.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link href={`/settings/project-statuses/${status.id}/edit`}>
                          <Edit3 className="mr-1 h-3.5 w-3.5" /> Редактировать
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(status.id)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
              : (
                <Card className="shadow-sm border-none">
                  <CardContent>
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Статусы проектов не найдены. Создайте статус, чтобы начать работу.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}