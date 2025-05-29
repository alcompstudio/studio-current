"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StageOption } from "@/lib/types/stage";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import StageOptionForm from "./stage-option-form";
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

interface StageOptionsListProps {
  orderId: string;
  stageId: string;
  orderCurrency?: string;
}

const StageOptionsList: React.FC<StageOptionsListProps> = ({
  orderId,
  stageId,
  orderCurrency = "руб.",
}) => {
  const [options, setOptions] = useState<StageOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOption, setEditingOption] = useState<StageOption | null>(null);
  const [deleteOptionId, setDeleteOptionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [units, setUnits] = useState<
    { id: number; full_name: string; short_name: string }[]
  >([]);
  const { toast } = useToast();

  // Функция загрузки единиц измерения
  const fetchUnits = async () => {
    try {
      const response = await fetch("/api/settings/units-os");
      if (!response.ok)
        throw new Error("Не удалось загрузить единицы измерения");
      const unitsData = await response.json();
      setUnits(unitsData);
    } catch (error) {
      console.error("Ошибка при загрузке единиц измерения:", error);
    }
  };

  // Функция загрузки опций для этапа
  const fetchOptions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `Запрос опций для этапа: /api/orders/${orderId}/stages/${stageId}/options`,
      );
      const response = await fetch(
        `/api/orders/${orderId}/stages/${stageId}/options`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ошибка HTTP: ${response.status}`, errorText);
        throw new Error(`Ошибка HTTP: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      console.log("Полученные опции:", data);
      setOptions(data);
    } catch (error: any) {
      const errorMessage = error.message || "Неизвестная ошибка";
      console.error("Ошибка при загрузке опций:", errorMessage, error);
      setError(`Не удалось загрузить опции этапа: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка опций и единиц измерения при монтировании и изменении ID этапа
  useEffect(() => {
    if (orderId && stageId) {
      fetchOptions();
      fetchUnits();
    }
  }, [orderId, stageId]);

  // Обработчики событий форм
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingOption(null);
    fetchOptions();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingOption(null);
  };

  // Обработчик удаления опции
  const handleDelete = async () => {
    if (!deleteOptionId) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/orders/${orderId}/stages/${stageId}/options/${deleteOptionId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось удалить опцию");
      }

      toast({
        title: "Опция удалена",
        description: "Опция успешно удалена из этапа",
        variant: "default",
      });

      fetchOptions();
    } catch (error) {
      console.error("Ошибка при удалении опции:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить опцию",
        variant: "destructive",
      });
    } finally {
      setDeleteOptionId(null);
      setIsDeleting(false);
    }
  };

  // Отображение загрузки
  if (isLoading && options.length === 0) {
    return (
      <div className="flex items-center justify-center py-4" data-oid="4s:t:v0">
        <Loader2
          className="h-5 w-5 animate-spin text-muted-foreground"
          data-oid="6tij28y"
        />

        <p className="ml-2 text-sm text-muted-foreground" data-oid="xtnahkn">
          Загрузка опций...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-2" data-oid="5k51bh5">
      <div
        className="flex justify-between items-center border-t pt-3 mt-3 mb-4"
        data-oid="dxsq7ps"
      >
        <p className="text-sm font-medium" data-oid=".79an-e">
          Опции этапа
        </p>
        {!showAddForm && !editingOption && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs border-primary text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
            onClick={() => setShowAddForm(true)}
            data-oid="719bhgz"
          >
            <Plus className="h-3.5 w-3.5" data-oid="spc1gmu" />
            Добавить опцию
          </Button>
        )}
      </div>

      {/* Форма добавления опции */}
      {showAddForm && (
        <StageOptionForm
          orderId={orderId}
          stageId={stageId}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          orderCurrency={orderCurrency}
          data-oid="how2nd4"
        />
      )}

      {/* Форма редактирования опции */}
      {editingOption && (
        <StageOptionForm
          orderId={orderId}
          stageId={stageId}
          optionToEdit={editingOption}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          orderCurrency={orderCurrency}
          data-oid="mw.mj72"
        />
      )}

      {/* Список опций */}
      {options.length === 0 && !showAddForm ? (
        <div className="text-center py-4" data-oid="6_onwus">
          <p className="text-sm text-muted-foreground mb-2" data-oid="tcs1x57">
            У этого этапа еще нет опций.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-oid="esvp4d7">
          {options.map((option) => (
            <div
              key={option.id}
              className="p-3 border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
              data-oid="..-_trt"
            >
              <div
                className="flex justify-between items-start"
                data-oid="ycocco:"
              >
                <div data-oid="xj.fzwo">
                  <h5 className="font-medium text-sm" data-oid=".6ix0:n">
                    {option.name}
                  </h5>
                  {option.description && (
                    <p
                      className="text-xs text-muted-foreground mt-1"
                      data-oid="z8.4o2a"
                    >
                      {option.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1" data-oid="2c6twp1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditingOption(option)}
                    data-oid="i5:wbb:"
                  >
                    <Edit className="h-3.5 w-3.5" data-oid="fdh.v7g" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => setDeleteOptionId(option.id)}
                    data-oid="ox8umq:"
                  >
                    <Trash2 className="h-3.5 w-3.5" data-oid="hv1b:mm" />
                  </Button>
                </div>
              </div>

              {/* Детали опции */}
              <div className="mt-2 text-xs" data-oid="ufsrvmu">
                {/* Строка с ценой */}
                <div className="mb-1" data-oid="8333t2e">
                  <span className="text-muted-foreground" data-oid="y8z6f53">
                    Цена:{" "}
                  </span>
                  {/* Проверяем новое поле pricing_type_id или старое pricing_type */}
                  {option.pricing_type_id === 1 ||
                  option.pricing_type === "calculable" ? (
                    <span className="font-medium" data-oid="r471b63">
                      Калькулируемая, {option.price_per_unit} {orderCurrency} за{" "}
                      {option.nominal_volume}{" "}
                      {option.volume_unit_id
                        ? units.find(
                            (unit) => unit.id === option.volume_unit_id,
                          )?.short_name
                        : option.volume_unit}
                    </span>
                  ) : (
                    <span className="font-medium" data-oid="fxmmto7">
                      Входит в стоимость
                    </span>
                  )}
                </div>

                {/* Расчетная стоимость для калькулируемых опций */}
                {(option.pricing_type_id === 1 ||
                  option.pricing_type === "calculable") && (
                  <div
                    className="mt-1 p-1.5 bg-primary/10 rounded"
                    data-oid="ewl88lc"
                  >
                    <span className="text-muted-foreground" data-oid="drk7dlj">
                      Расчетная стоимость:{" "}
                    </span>
                    <span className="font-medium" data-oid="kugbhgy">
                      {option.calculated_price_min &&
                      option.calculated_price_max
                        ? `${Number(option.calculated_price_min).toFixed(2)} - ${Number(option.calculated_price_max).toFixed(2)} ${orderCurrency} за ${option.volume_min} - ${option.volume_max} ${
                            option.volume_unit_id
                              ? units.find(
                                  (unit) => unit.id === option.volume_unit_id,
                                )?.short_name
                              : option.volume_unit
                          }`
                        : option.calculated_price_min
                          ? `${Number(option.calculated_price_min).toFixed(2)} ${orderCurrency} за ${option.volume_min} ${
                              option.volume_unit_id
                                ? units.find(
                                    (unit) => unit.id === option.volume_unit_id,
                                  )?.short_name
                                : option.volume_unit
                            }`
                          : option.calculated_price_max
                            ? `${Number(option.calculated_price_max).toFixed(2)} ${orderCurrency} за ${option.volume_max} ${option.volume_unit}`
                            : "-"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={deleteOptionId !== null}
        onOpenChange={(open) => !open && setDeleteOptionId(null)}
        data-oid="po_w2lw"
      >
        <AlertDialogContent data-oid="5bfnoxa">
          <AlertDialogHeader data-oid=":61i3oo">
            <AlertDialogTitle data-oid="kusza:y">
              Подтверждение удаления
            </AlertDialogTitle>
            <AlertDialogDescription data-oid="te21osc">
              Вы действительно хотите удалить эту опцию? Это действие невозможно
              отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-oid="tikc3at">
            <AlertDialogCancel disabled={isDeleting} data-oid="q.znojx">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-oid="x0scq7e"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="722zikk"
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
    </div>
  );
};

export default StageOptionsList;
