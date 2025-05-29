"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit3, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ViewToggle } from "@/components/status/view-toggle";
import { useToast } from "@/hooks/use-toast";

// Импортируем компоненты таблицы и формы
import { StageWorkTypeForm } from "./stage-work-type-form";
import { StageWorkTypesTable } from "./stage-work-types-table";

// Тип для данных типа работы
interface WorkType {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export function StageWorkTypesContent() {
  const { toast } = useToast();
  const router = useRouter();
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "table">("table");
  const [showForm, setShowForm] = useState(false);
  const [editingWorkType, setEditingWorkType] = useState<WorkType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workTypeToDelete, setWorkTypeToDelete] = useState<WorkType | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Загрузка типов работы при монтировании компонента
  useEffect(() => {
    fetchWorkTypes();
  }, []);

  // Функция для загрузки типов работы
  const fetchWorkTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stage-work-types-os");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка загрузки типов работы: ${response.statusText}`,
        );
      }
      const data = await response.json();
      setWorkTypes(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
      console.error("Ошибка при загрузке типов работы:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для открытия диалога подтверждения удаления
  const openDeleteDialog = (workType: WorkType) => {
    setWorkTypeToDelete(workType);
    setDeleteDialogOpen(true);
  };

  // Функция удаления типа работы
  const handleDelete = async () => {
    if (!workTypeToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/stage-work-types-os?id=${workTypeToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка удаления типа работы: ${response.statusText}`,
        );
      }

      // Оптимистично удаляем из UI
      setWorkTypes(workTypes.filter((type) => type.id !== workTypeToDelete.id));

      toast({
        title: "Тип работы удален",
        description: `Тип работы "${workTypeToDelete.name}" успешно удален`,
      });

      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error("Не удалось удалить тип работы:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка удаления типа работы",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setWorkTypeToDelete(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6" data-oid=".wl-eru">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between" data-oid="x3.vkk.">
          <div data-oid="uv9swbw">
            <h2 className="text-lg font-semibold" data-oid="_x28lgc">
              Типы работы этапов
            </h2>
            <p className="text-sm text-muted-foreground" data-oid="v2ndi32">
              Управление типами работы для этапов
            </p>
          </div>
          <div className="flex gap-2" data-oid="wpb28su">
            {!showForm && (
              <ViewToggle
                view={view}
                onViewChange={setView}
                data-oid="b9bf1.k"
              />
            )}
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingWorkType(null);
                  setShowForm(true);
                }}
                data-oid="ki5embq"
              >
                <Plus className="w-4 h-4 mr-2" data-oid="8gn_i5-" /> Добавить
                тип работы
              </Button>
            )}
          </div>
        </div>

        {/* Форма или список типов работы */}
        <div data-oid="3vwi3fd">
          {showForm ? (
            <StageWorkTypeForm
              initialData={editingWorkType}
              onSave={() => {
                setShowForm(false);
                setEditingWorkType(null);
                fetchWorkTypes(); // Обновляем список после сохранения
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingWorkType(null);
              }}
              data-oid="j2wrmy4"
            />
          ) : isLoading ? (
            <Card className="shadow-sm border-none" data-oid="g39rjtl">
              <CardContent
                className="flex items-center justify-center gap-2 py-6 text-muted-foreground"
                data-oid="p.vi0hl"
              >
                <Loader2 className="h-5 w-5 animate-spin" data-oid="s6ory34" />
                <p data-oid="e3e.n9d">Загрузка типов работы...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card
              className="shadow-sm border-destructive bg-destructive/10"
              data-oid="7::mqof"
            >
              <CardContent
                className="flex items-center gap-2 text-destructive py-4"
                data-oid="xt2fg:f"
              >
                <AlertTriangle className="h-5 w-5" data-oid="h3caefe" />
                <p className="text-sm font-semibold" data-oid="r57uhpx">
                  Ошибка загрузки типов работы: {error}
                </p>
              </CardContent>
            </Card>
          ) : view === "table" ? (
            <StageWorkTypesTable
              items={workTypes}
              onDelete={(id: number) => {
                const workType = workTypes.find((t) => t.id === id);
                if (workType) openDeleteDialog(workType);
              }}
              onEdit={(workType: WorkType) => {
                setEditingWorkType(workType);
                setShowForm(true);
              }}
              data-oid="xt361tz"
            />
          ) : (
            <div className="space-y-4" data-oid="uy-i7.p">
              {workTypes.length > 0 ? (
                workTypes.map((workType) => (
                  <Card
                    key={workType.id}
                    className="shadow-sm hover:shadow-md transition-shadow border-none"
                    data-oid="7-5dkr4"
                  >
                    <CardHeader className="pb-3" data-oid="0lhcr1z">
                      <div
                        className="flex justify-between items-start"
                        data-oid="plolurh"
                      >
                        <CardTitle
                          className="text-lg font-semibold"
                          data-oid="w_98y92"
                        >
                          {workType.name}
                        </CardTitle>
                      </div>
                      <CardDescription data-oid="c.6ibk7">
                        ID: {workType.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="6axzgpq">
                      <div
                        className="flex items-center gap-2"
                        data-oid="floq6mr"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingWorkType(workType);
                            setShowForm(true);
                          }}
                          data-oid="7gq9d7q"
                        >
                          <Edit3
                            className="mr-1 h-3.5 w-3.5"
                            data-oid="gi-vaiq"
                          />{" "}
                          Редактировать
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => openDeleteDialog(workType)}
                          data-oid="kki789c"
                        >
                          <Trash2
                            className="mr-1 h-3.5 w-3.5"
                            data-oid="ouz4:kp"
                          />{" "}
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-sm border-none" data-oid=".-scpb_">
                  <CardContent data-oid="so:dxvw">
                    <p
                      className="text-sm text-muted-foreground py-4 text-center"
                      data-oid="6f8trqo"
                    >
                      Типы работы не найдены. Создайте тип работы, чтобы начать.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        data-oid=":g2qhj-"
      >
        <AlertDialogContent data-oid="9v2zc3c">
          <AlertDialogHeader data-oid="p8-xp8r">
            <AlertDialogTitle data-oid="jyj0__1">Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription data-oid="ibbxhdw">
              {workTypeToDelete && (
                <>
                  Вы собираетесь удалить тип работы "{workTypeToDelete.name}".
                  Это действие нельзя отменить, и оно может повлиять на
                  существующие этапы, использующие данный тип работы.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-oid="-lftk7c">
            <AlertDialogCancel disabled={isDeleting} data-oid="yimq1tn">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-oid="w7hilkh"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="q7ljn:s"
                  />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
