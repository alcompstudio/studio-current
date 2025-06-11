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

  const handleEdit = (status: ProjectStatus) => {
    // Перенаправляем на страницу редактирования
    window.location.href = `/settings/project-statuses/${status.id}/edit`;
  };

  return (
    <div className="flex flex-col gap-6" data-oid="jf6v3_9">
      {/* Page Header */}
      <div className="flex items-center justify-between" data-oid=".49x883">
        <div data-oid=":tq0ewd">
          <h1 className="text-xl font-semibold" data-oid="vzc_zga">
            Статусы проектов
          </h1>
          <p className="text-sm text-muted-foreground" data-oid="1bi9le_">
            Управление различными статусами для ваших проектов.
          </p>
        </div>
        <div className="flex gap-2" data-oid="cp4m29m">
          <ViewToggle view={view} onViewChange={setView} data-oid="jbxf.ds" />
          <Button asChild data-oid="_jtlt4.">
            <Link href="/settings/project-statuses/new" data-oid="_w02:92">
              <Plus className="w-4 h-4 mr-2" data-oid="fncvoh_" /> Создать
              статус проекта
            </Link>
          </Button>
        </div>
      </div>

      {/* Status List Content */}
      <div data-oid="c_r8blb">
        {isLoading && (
          <Card className="shadow-sm border-none" data-oid="c10ypgg">
            <CardContent
              className="flex items-center justify-center gap-2 py-6 text-muted-foreground"
              data-oid="edfq9qh"
            >
              <Loader2 className="h-5 w-5 animate-spin" data-oid="q4iwstr" />
              <p data-oid="3douk86">Загрузка статусов проектов...</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card
            className="shadow-sm border-destructive bg-destructive/10"
            data-oid="5aqou:j"
          >
            <CardContent
              className="flex items-center gap-2 text-destructive py-4"
              data-oid="g8v212x"
            >
              <AlertTriangle className="h-5 w-5" data-oid="9x2__g5" />
              <p className="text-sm font-semibold" data-oid="q.i7alp">
                Ошибка загрузки статусов проектов: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          !error &&
          (view === "table" ? (
            <Card data-oid=".f-8171">
              <StatusTable
                items={projectStatuses}
                basePath="/settings/project-statuses"
                onDelete={handleDelete}
                onEdit={handleEdit}
                data-oid="_:hdsfz"
              />
            </Card>
          ) : (
            <div className="space-y-4" data-oid="ywar_aa">
              {projectStatuses.length > 0 ? (
                projectStatuses.map((status) => (
                  <Card
                    key={status.id}
                    className="shadow-sm hover:shadow-md transition-shadow border-none"
                    data-oid="yt9.gpj"
                  >
                    <CardHeader className="pb-3" data-oid="4zo9fjd">
                      <div
                        className="flex justify-between items-start"
                        data-oid="h86x6xr"
                      >
                        <CardTitle
                          className="text-lg font-semibold flex items-center"
                          data-oid="3eztstf"
                        >
                          <Palette
                            className="mr-2 h-5 w-5"
                            style={{ color: status.textColor }}
                            data-oid="7cu7qu3"
                          />

                          {status.name}
                        </CardTitle>
                        <div
                          className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex items-center"
                          style={{
                            backgroundColor: status.backgroundColor,
                            color: status.textColor,
                            borderColor: status.textColor,
                          }}
                          data-oid="82h1k.i"
                        >
                          {status.name}
                        </div>
                      </div>
                      <CardDescription data-oid="_cql729">
                        ID: {status.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="lg3i_93">
                      <div
                        className="flex items-center gap-2"
                        data-oid="ckuk08t"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          data-oid="6oftxh3"
                        >
                          <Link
                            href={`/settings/project-statuses/${status.id}/edit`}
                            data-oid="1sl6j9f"
                          >
                            <Edit3
                              className="mr-1 h-3.5 w-3.5"
                              data-oid="0b9ru9e"
                            />{" "}
                            Редактировать
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(status.id)}
                          data-oid="fdsw8w3"
                        >
                          <Trash2
                            className="mr-1 h-3.5 w-3.5"
                            data-oid="zi1u3xj"
                          />{" "}
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-sm border-none" data-oid="9gqjenx">
                  <CardContent data-oid="4vs9jc:">
                    <p
                      className="text-sm text-muted-foreground py-4 text-center"
                      data-oid="s6czwka"
                    >
                      Статусы проектов не найдены. Создайте статус, чтобы начать
                      работу.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
