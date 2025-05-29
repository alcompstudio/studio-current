// src/app/(app)/orders/[orderId]/order-stages-tab.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stage } from "@/lib/types/stage";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  Loader2,
  Plus,
  Edit,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import StageForm from "./stage-form";
import DeleteStageButton from "./delete-stage-button";
import StageOptionsList from "./stage-options-list";
import { cn } from "@/lib/utils";

interface OrderStagesTabProps {
  orderId: string;
  projectCurrency?: string;
}

const OrderStagesTab = ({
  orderId,
  projectCurrency = "руб.",
}: OrderStagesTabProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [workTypes, setWorkTypes] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [isLoadingWorkTypes, setIsLoadingWorkTypes] = useState(false);
  const { toast } = useToast();

  // Функция для загрузки этапов
  const fetchStages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/stages`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      setStages(data);
    } catch (error) {
      console.error("Ошибка при загрузке этапов:", error);
      // Можно добавить уведомление об ошибке через toast
    } finally {
      setIsLoading(false);
    }
  };

  // Функция загрузки типов работы
  const fetchWorkTypes = async () => {
    setIsLoadingWorkTypes(true);
    try {
      const response = await fetch("/api/stage-work-types-os");
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      setWorkTypes(data);
    } catch (error) {
      console.error("Ошибка при загрузке типов работы:", error);
    } finally {
      setIsLoadingWorkTypes(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchStages();
      fetchWorkTypes();
    }
  }, [orderId]);

  // Функция обработки успешного добавления/редактирования этапа
  const handleFormSuccess = () => {
    setShowAddForm(false); // Скрываем форму
    setEditingStage(null); // Сбрасываем редактируемый этап
    fetchStages(); // Обновляем список этапов
  };

  // Функция для получения названия типа работы по ID
  const getWorkTypeName = (typeId: number | string | null) => {
    if (!typeId) return null;

    const id = typeof typeId === "string" ? parseInt(typeId, 10) : typeId;
    const workType = workTypes.find((type) => type.id === id);
    return workType ? workType.name : id.toString();
  };

  // Обработчик отмены формы
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingStage(null);
  };

  // Самый простой обработчик удаления этапа
  const deleteStage = (stageId: string) => {
    console.log("Запуск удаления этапа:", stageId);

    // Показываем состояние загрузки
    setIsLoading(true);

    // Используем простой fetch для удаления
    fetch(`/api/orders/${orderId}/stages/${stageId}`, {
      method: "DELETE",
    })
      .then((response) => {
        console.log("Ответ API:", response.status);
        if (response.ok) {
          // Успешное удаление - загружаем обновленный список
          fetchStages();
          toast({
            title: "Успешно",
            description: "Этап был удален",
            variant: "default",
          });
        } else {
          console.error("Ошибка удаления:", response.statusText);
          toast({
            title: "Ошибка",
            description: "Не удалось удалить этап",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Ошибка запроса:", error);
        toast({
          title: "Ошибка сети",
          description: "Произошла ошибка при удалении этапа",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading && stages.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-10"
        data-oid="njk_fkr"
      >
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          data-oid="9yu32nd"
        />

        <p className="ml-2 text-muted-foreground" data-oid=":qzg-84">
          Загрузка этапов...
        </p>
      </div>
    );
  }

  if (error && stages.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 text-destructive"
        data-oid="jol9lo3"
      >
        <AlertTriangle className="h-8 w-8 mb-2" data-oid="iwx1vhl" />
        <p className="font-semibold" data-oid="yh289mi">
          Ошибка при загрузке этапов
        </p>
        <p className="text-sm" data-oid="ygq.lpn">
          {error}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => fetchStages()}
          data-oid="n0r-p03"
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex justify-between items-center mb-4"
        data-oid="x5nqv3y"
      >
        <h3 className="text-lg font-semibold" data-oid="bd6hr4r">
          Этапы заказа
        </h3>
        {!showAddForm && !editingStage && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1"
            data-oid="51f6l5k"
          >
            <Plus className="h-4 w-4" data-oid="kx73q.w" />
            Добавить этап
          </Button>
        )}
      </div>

      <div className="space-y-4" data-oid="5ji:tjo">
        {/* Форма добавления нового этапа */}
        {showAddForm && (
          <StageForm
            orderId={orderId}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            orderCurrency={projectCurrency}
            data-oid="7pvvpil"
          />
        )}

        {/* Форма редактирования этапа */}
        {editingStage && (
          <StageForm
            orderId={orderId}
            stageToEdit={editingStage}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            orderCurrency={projectCurrency}
            data-oid="_0yrm2t"
          />
        )}

        {/* Список этапов */}
        {stages.length === 0 && !showAddForm ? (
          <div
            className="text-center py-10 border rounded-lg bg-muted/20"
            data-oid="fntdi:b"
          >
            <p className="text-muted-foreground mb-4" data-oid="v9saitv">
              Для этого заказа еще не создано ни одного этапа. Добавьте первый
              этап.
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-oid="qg5-.ri">
            {stages.map((stage) => (
              <Card
                key={stage.id}
                className={cn(
                  "transition-all duration-200 border-0 shadow-none hover:shadow-md",
                  editingStage?.id === stage.id && "ring-2 ring-primary",
                )}
                data-oid="cke9nhf"
              >
                <CardHeader data-oid="-xvf35c">
                  <div
                    className="flex justify-between items-start"
                    data-oid="8rgidsf"
                  >
                    <CardTitle
                      className="text-base font-bold"
                      data-oid="g9f9o5t"
                    >
                      {stage.title ||
                        stage.name ||
                        `Этап ${stage.sequence || ""}`}
                    </CardTitle>
                    {stage.workType && (
                      <Badge
                        variant={
                          getWorkTypeName(stage.workType) === "Параллельный"
                            ? "default"
                            : "secondary"
                        }
                        style={{ backgroundColor: stage.color || undefined }}
                        data-oid="f44l.1z"
                      >
                        {getWorkTypeName(stage.workType) || stage.workType}
                      </Badge>
                    )}
                  </div>
                  {stage.description && (
                    <CardDescription data-oid="njt9vq5">
                      {stage.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent data-oid="j3.jee-">
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                    data-oid="j70ph3r"
                  >
                    <div data-oid="mrq-0xu">
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="wroznup"
                      >
                        Порядковый номер
                      </p>
                      <p className="text-sm font-medium" data-oid="vbz2y8v">
                        {stage.sequence ?? "Не указан"}
                      </p>
                    </div>
                    <div data-oid="9h:as_.">
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="tqh5omr"
                      >
                        Оценочная стоимость
                      </p>
                      <p className="text-sm font-medium" data-oid="0yw08i:">
                        {stage.estimatedPrice
                          ? `${stage.estimatedPrice} ${projectCurrency || ""}`
                          : "Не указана"}
                      </p>
                    </div>
                    <div data-oid="hw3jwpj">
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="jpicn27"
                      >
                        Статус
                      </p>
                      <p className="text-sm font-medium" data-oid="ngsykg5">
                        {stage.status || "Активный"}
                      </p>
                    </div>
                  </div>

                  {/* Компонент для работы с опциями этапа */}
                  <StageOptionsList
                    orderId={orderId}
                    stageId={stage.id}
                    orderCurrency={projectCurrency}
                    data-oid="pe6zhk1"
                  />
                </CardContent>
                <CardFooter
                  className="flex justify-end gap-2 pt-2"
                  data-oid="vhg4vy-"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setEditingStage(stage)}
                    data-oid=".c:.tov"
                  >
                    <Edit className="h-4 w-4" data-oid="gpb_sn_" />
                    Редактировать
                  </Button>
                  <DeleteStageButton
                    stageId={stage.id}
                    stageName={
                      stage.title || stage.name || `Этап ${stage.sequence}`
                    }
                    orderId={orderId}
                    onSuccess={fetchStages}
                    data-oid="9o0sd7l"
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderStagesTab;
