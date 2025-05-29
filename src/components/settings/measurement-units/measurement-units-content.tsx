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
import { Plus, Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react";
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

// Импортируем компоненты
import { MeasurementUnitForm } from "./measurement-unit-form";
import { MeasurementUnitsTable } from "./measurement-units-table";
import { MeasurementUnitCard } from "./measurement-unit-card";

// Интерфейс для единицы измерения
export interface MeasurementUnit {
  id: number;
  full_name: string;
  short_name: string;
  created_at: string;
  updated_at: string;
}

export function MeasurementUnitsContent() {
  const { toast } = useToast();
  const router = useRouter();
  const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnit[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "table">("table");
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<MeasurementUnit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<MeasurementUnit | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Загрузка единиц измерения при монтировании компонента
  useEffect(() => {
    fetchMeasurementUnits();
  }, []);

  // Функция для загрузки единиц измерения из БД
  const fetchMeasurementUnits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Запрашиваем данные из таблицы unit_os
      const response = await fetch("/api/settings/units-os");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка загрузки единиц измерения: ${response.statusText}`,
        );
      }
      const data = await response.json();
      setMeasurementUnits(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
      console.error("Ошибка при загрузке единиц измерения:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для открытия диалога подтверждения удаления
  const openDeleteDialog = (unit: MeasurementUnit) => {
    setUnitToDelete(unit);
    setDeleteDialogOpen(true);
  };

  // Функция удаления единицы измерения
  const handleDelete = async () => {
    if (!unitToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/settings/units-os/${unitToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка удаления единицы измерения: ${response.statusText}`,
        );
      }

      // Оптимистично удаляем из UI
      setMeasurementUnits(
        measurementUnits.filter((unit) => unit.id !== unitToDelete.id),
      );

      toast({
        title: "Единица измерения удалена",
        description: `Единица измерения "${unitToDelete.full_name}" успешно удалена`,
      });

      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error("Не удалось удалить единицу измерения:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка удаления единицы измерения",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUnitToDelete(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6" data-oid="63h7-9h">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between" data-oid="_r2:-4o">
          <div data-oid="yeze9vq">
            <h2 className="text-lg font-semibold" data-oid="k0so.va">
              Единицы измерения
            </h2>
            <p className="text-sm text-muted-foreground" data-oid="zhvdm8n">
              Управление единицами измерения объема
            </p>
          </div>
          <div className="flex gap-2" data-oid="k.9epk5">
            {!showForm && (
              <ViewToggle
                view={view}
                onViewChange={setView}
                data-oid="awj::ty"
              />
            )}
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingUnit(null);
                  setShowForm(true);
                }}
                data-oid="bqg4ppr"
              >
                <Plus className="w-4 h-4 mr-2" data-oid="c3was-z" /> Добавить
                единицу
              </Button>
            )}
          </div>
        </div>

        {/* Форма или список единиц измерения */}
        <div data-oid="tn8z4ed">
          {showForm ? (
            <MeasurementUnitForm
              initialData={editingUnit}
              onSave={() => {
                setShowForm(false);
                setEditingUnit(null);
                fetchMeasurementUnits(); // Обновляем список после сохранения
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingUnit(null);
              }}
              data-oid="4a2l6:i"
            />
          ) : isLoading ? (
            <Card className="shadow-sm border-none" data-oid="r7ep9u4">
              <CardContent
                className="flex items-center justify-center gap-2 py-6 text-muted-foreground"
                data-oid="nlgf0.f"
              >
                <Loader2 className="h-5 w-5 animate-spin" data-oid="1vxtbnf" />
                <p data-oid="jth625i">Загрузка единиц измерения...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card
              className="shadow-sm border-destructive bg-destructive/10"
              data-oid="pq9g879"
            >
              <CardContent
                className="flex items-center gap-2 text-destructive py-4"
                data-oid="ah1m104"
              >
                <AlertTriangle className="h-5 w-5" data-oid="dd4:6ws" />
                <p className="text-sm font-semibold" data-oid="tt1a1md">
                  Ошибка загрузки единиц измерения: {error}
                </p>
              </CardContent>
            </Card>
          ) : view === "table" ? (
            <MeasurementUnitsTable
              items={measurementUnits}
              onDelete={(id: number) => {
                const unit = measurementUnits.find((u) => u.id === id);
                if (unit) openDeleteDialog(unit);
              }}
              onEdit={(unit: MeasurementUnit) => {
                setEditingUnit(unit);
                setShowForm(true);
              }}
              data-oid="jsgcfoj"
            />
          ) : (
            <div className="space-y-4" data-oid="kn20dqj">
              {measurementUnits.length > 0 ? (
                measurementUnits.map((unit) => (
                  <MeasurementUnitCard
                    key={unit.id}
                    item={unit}
                    onEdit={(item) => {
                      setEditingUnit(item);
                      setShowForm(true);
                    }}
                    onDelete={(id) => {
                      const unit = measurementUnits.find((u) => u.id === id);
                      if (unit) openDeleteDialog(unit);
                    }}
                    data-oid=":hl:hww"
                  />
                ))
              ) : (
                <Card className="shadow-sm border-none" data-oid="01zq0ti">
                  <CardContent
                    className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground"
                    data-oid="gu3-43u"
                  >
                    <p className="mb-4" data-oid="c9er2ws">
                      Единицы измерения не найдены
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingUnit(null);
                        setShowForm(true);
                      }}
                      data-oid="mz-dzgc"
                    >
                      <Plus className="mr-2 h-4 w-4" data-oid="ciqj1-o" />
                      Добавить новую единицу измерения
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        data-oid="27sxq50"
      >
        <AlertDialogContent data-oid="evsct.3">
          <AlertDialogHeader data-oid="a160b2f">
            <AlertDialogTitle data-oid="hsf6:2k">
              Вы уверены, что хотите удалить эту единицу измерения?
            </AlertDialogTitle>
            <AlertDialogDescription data-oid="kg4ieh3">
              {unitToDelete && (
                <>
                  Единица измерения "
                  <strong data-oid=".2qdo2w">
                    {unitToDelete.full_name} ({unitToDelete.short_name})
                  </strong>
                  " будет удалена. Это действие нельзя отменить.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-oid="1w44bfl">
            <AlertDialogCancel disabled={isDeleting} data-oid=":x6.8aw">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-oid="qavynkx"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid=":y68vz-"
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
