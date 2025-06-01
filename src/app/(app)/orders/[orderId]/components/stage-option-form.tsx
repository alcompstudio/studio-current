"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import { 
  StageOptionFormProps, 
  stageOptionFormSchema, 
  StageOptionFormValues,
  VolumeUnit
} from "./types";
import VolumeFields from "./volume-fields";
import PriceFields from "./price-fields";
import PriceCalculation from "./price-calculation";

const StageOptionForm: React.FC<StageOptionFormProps> = ({
  orderId,
  stageId,
  optionToEdit = null,
  onSuccess,
  onCancel,
  orderCurrency = "руб.",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [units, setUnits] = useState<VolumeUnit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [calculatedPrices, setCalculatedPrices] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const { toast } = useToast();

  // Загрузка единиц измерения из БД
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true);
        const response = await fetch("/api/settings/units-os");
        if (!response.ok)
          throw new Error("Не удалось загрузить единицы измерения");
        const unitsData = await response.json();
        setUnits(unitsData);
      } catch (error) {
        console.error("Ошибка при загрузке единиц измерения:", error);
      } finally {
        setLoadingUnits(false);
      }
    };

    fetchUnits();
  }, []);

  const form = useForm<StageOptionFormValues>({
    resolver: zodResolver(stageOptionFormSchema),
    defaultValues: {
      name: optionToEdit?.name || "",
      description: optionToEdit?.description || "",
      pricing_type_id: optionToEdit?.pricing_type_id || undefined,
      volume_min: optionToEdit?.volume_min || null,
      volume_max: optionToEdit?.volume_max || null,
      volume_unit_id: optionToEdit?.volume_unit_id || null,
      nominal_volume: optionToEdit?.nominal_volume || null,
      price_per_unit: optionToEdit?.price_per_unit || null,
    },
  });

  // Следим за типом ценообразования, чтобы показывать/скрывать поля
  const pricingTypeId = form.watch("pricing_type_id");
  const [pricingTypes, setPricingTypes] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [isLoadingPricingTypes, setIsLoadingPricingTypes] = useState(false);
  const selectedPricingType = pricingTypes.find(
    (pt) => pt.id === pricingTypeId,
  );
  const isCalculable =
    selectedPricingType?.name === "calculable" ||
    selectedPricingType?.name === "Калькулируемая";

  // Загрузка типов ценообразования
  useEffect(() => {
    const fetchPricingTypes = async () => {
      setIsLoadingPricingTypes(true);
      try {
        const response = await fetch("/api/pricing-types");
        if (!response.ok) {
          throw new Error("Не удалось загрузить типы ценообразования");
        }
        const data = await response.json();
        setPricingTypes(data);

        if (optionToEdit && data.length > 0) {
          // Если у опции уже есть pricing_type_id, используем его
          if (optionToEdit.pricing_type_id) {
            form.setValue("pricing_type_id", optionToEdit.pricing_type_id);
          }
          // Если есть только старое поле pricing_type, ищем соответствующий id
          else if (optionToEdit.pricing_type) {
            // Ищем по английскому названию или русскому аналогу
            const typeToSet = data.find(
              (pt: { id: number; name: string }) =>
                pt.name === optionToEdit.pricing_type ||
                (optionToEdit.pricing_type === "calculable" &&
                  pt.name === "Калькулируемая") ||
                (optionToEdit.pricing_type === "included" &&
                  pt.name === "Входит в стоимость"),
            );
            if (typeToSet) {
              form.setValue("pricing_type_id", typeToSet.id);
            } else {
              // Если тип из optionToEdit не найден, ставим первый из списка
              form.setValue("pricing_type_id", data[0].id);
            }
          }
        } else if (!optionToEdit && data.length > 0) {
          // Если создаем новую опцию, устанавливаем 'Входит в стоимость' по умолчанию
          const defaultType =
            data.find(
              (pt: { id: number; name: string }) =>
                pt.name === "Входит в стоимость" || pt.name === "included",
            ) || data[0];
          form.setValue("pricing_type_id", defaultType.id);
        }
      } catch (error) {
        console.error("Ошибка при загрузке типов ценообразования:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить типы ценообразования.",
          variant: "destructive",
        });
      }
      setIsLoadingPricingTypes(false);
    };

    fetchPricingTypes();
  }, [optionToEdit, form, toast]);

  // Функция для расчета стоимости
  const calculatePrices = useCallback(() => {
    const values = form.getValues();
    const currentPricingTypeId = values.pricing_type_id;
    const currentPricingType = pricingTypes.find(
      (pt) => pt.id === currentPricingTypeId,
    );
    const currentIsCalculable =
      currentPricingType?.name === "Калькулируемая" ||
      currentPricingType?.name === "calculable";

    // Если тип ценообразования не "Калькулируемая", то не рассчитываем
    if (!currentIsCalculable) {
      setCalculatedPrices({ min: null, max: null });
      return;
    }

    // Получаем значения из формы
    const volumeMin = parseFloat(values.volume_min as any) || 0;
    const volumeMax = parseFloat(values.volume_max as any) || 0;
    const nominalVolume = parseFloat(values.nominal_volume as any) || 0;
    const pricePerUnit = parseFloat(values.price_per_unit as any) || 0;

    // Рассчитываем стоимость
    let minPrice = null;
    let maxPrice = null;

    if (nominalVolume > 0 && pricePerUnit > 0) {
      // Рассчитываем минимальную стоимость
      if (volumeMin > 0) {
        minPrice = (volumeMin / nominalVolume) * pricePerUnit;
      }

      // Рассчитываем максимальную стоимость
      if (volumeMax > 0) {
        maxPrice = (volumeMax / nominalVolume) * pricePerUnit;
      }
    }

    setCalculatedPrices({ min: minPrice, max: maxPrice });
  }, [form, pricingTypes]);

  // Реализуем динамический расчет при изменении любого поля формы
  useEffect(() => {
    // Подписываемся на изменения всех полей, которые влияют на расчет
    const subscription = form.watch((values) => {
      // Вызываем расчет немедленно
      calculatePrices();
    });

    // Запускаем начальный расчет
    calculatePrices();

    // Отписываемся при размонтировании
    return () => subscription.unsubscribe();
  }, [form, calculatePrices, pricingTypes]); // Добавлены pricingTypes в зависимости

  // Функция отправки формы
  const onSubmit = async (values: StageOptionFormValues) => {
    setIsSubmitting(true);

    try {
      const isEditing = Boolean(optionToEdit);
      const url = isEditing
        ? `/api/orders/${orderId}/stages/${stageId}/options/${optionToEdit?.id}`
        : `/api/orders/${orderId}/stages/${stageId}/options`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error ||
            `Ошибка ${method === "POST" ? "создания" : "обновления"} опции`,
        );
      }

      toast({
        title: isEditing ? "Опция обновлена" : "Опция создана",
        description: isEditing
          ? "Опция этапа успешно обновлена"
          : "Новая опция этапа успешно создана",
        variant: "default",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Ошибка при сохранении опции:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Произошла ошибка при сохранении опции",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-card" data-oid="lx:j34u">
      <h4 className="text-base font-semibold mb-3" data-oid="44b-i0z">
        {optionToEdit ? "Редактирование опции" : "Создание новой опции"}
      </h4>

      <Form {...form} data-oid="g4wmghn">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          data-oid="1ddbp-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem data-oid="189zy6e">
                <FormLabel data-oid="rkbmb82">Название*</FormLabel>
                <FormControl data-oid="n5-f_vv">
                  <Input
                    placeholder="Введите название опции"
                    {...field}
                    data-oid="jpiwz7d"
                  />
                </FormControl>
                <FormMessage data-oid="t_xrd09" />
              </FormItem>
            )}
            data-oid="672cmzx"
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem data-oid="6v15tpe">
                <FormLabel data-oid="4ql72w_">Описание</FormLabel>
                <FormControl data-oid="9zhyz30">
                  <Textarea
                    placeholder="Введите описание опции"
                    className="min-h-[80px]"
                    {...field}
                    value={field.value || ""}
                    data-oid="_.8skfz"
                  />
                </FormControl>
                <FormMessage data-oid="c5gtf2." />
              </FormItem>
            )}
            data-oid="w3nl0-l"
          />

          <FormField
            control={form.control}
            name="pricing_type_id"
            render={({ field }) => (
              <FormItem data-oid="mgxoe0x">
                <FormLabel data-oid="gqy6k7h">Тип ценообразования*</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString() || ""}
                  disabled={isLoadingPricingTypes}
                  data-oid="li9txzz"
                >
                  <FormControl data-oid="zav:xct">
                    <SelectTrigger data-oid="x52fkip">
                      <SelectValue
                        placeholder="Выберите тип ценообразования"
                        data-oid="g9-cqbt"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="mb9ph_s">
                    {pricingTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                        data-oid="j8-02wq"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription data-oid="87xpnrd">
                  Калькулируемая опция позволяет рассчитать стоимость на основе
                  объема и цены за единицу. "Входит в стоимость" просто
                  добавляет опцию без отдельного расчета цены.
                </FormDescription>
                <FormMessage data-oid="dmqw1ut" />
              </FormItem>
            )}
            data-oid=":bdrl9."
          />

          {/* Используем динамическую проверку на калькулируемую опцию */}
          {form.watch("pricing_type_id") &&
            pricingTypes.some(
              (pt) =>
                pt.id === form.watch("pricing_type_id") &&
                (pt.name === "Калькулируемая" || pt.name === "calculable"),
            ) && (
              <>
                {/* Поля объема в одной строке */}
                <VolumeFields 
                  form={form}
                  units={units}
                  loadingUnits={loadingUnits}
                />
                
                {/* Параметры цены */}
                <PriceFields 
                  form={form}
                  units={units}
                  orderCurrency={orderCurrency}
                />

                {/* Блок предварительного расчета */}
                <PriceCalculation 
                  calculatedPrices={calculatedPrices}
                  form={form}
                  units={units}
                  orderCurrency={orderCurrency}
                />
              </>
            )}

          <div className="flex justify-end gap-2 pt-2" data-oid="0c2_9j:">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-oid="npr4fly"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="gra:507">
              {isSubmitting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="bl4zsc1"
                  />
                  Сохранение...
                </>
              ) : optionToEdit ? (
                "Сохранить изменения"
              ) : (
                "Создать опцию"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StageOptionForm;
