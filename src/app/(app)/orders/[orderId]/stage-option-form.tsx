"use client";

import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
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
import { StageOption } from "@/lib/types/stage";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Тип для опций из таблицы pricing_type_os
interface PricingTypeOption {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Схема валидации формы
const stageOptionFormSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
  description: z.string().optional(),
  pricing_type_id: z.coerce.number().min(1, "Тип ценообразования обязателен"),
  volume_min: z.coerce.number().nullable().optional(),
  volume_max: z.coerce.number().nullable().optional(),
  volume_unit_id: z.coerce.number().nullable().optional(),
  nominal_volume: z.coerce.number().nullable().optional(),
  price_per_unit: z.coerce.number().nullable().optional(),
});

export type StageOptionFormValues = z.infer<typeof stageOptionFormSchema>;

interface StageOptionFormProps {
  orderId: string;
  stageId: string;
  optionToEdit?: StageOption | null;
  onSuccess: () => void;
  onCancel: () => void;
  orderCurrency?: string;
}

const StageOptionForm: React.FC<StageOptionFormProps> = ({
  orderId,
  stageId,
  optionToEdit = null,
  onSuccess,
  onCancel,
  orderCurrency = "руб.",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [units, setUnits] = useState<
    { id: number; full_name: string; short_name: string }[]
  >([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [calculatedPrices, setCalculatedPrices] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const { toast } = useToast();

  // Инициализация формы с корректным использованием volume_unit_id
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
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  data-oid=".47wctr"
                >
                  <FormField
                    control={form.control}
                    name="volume_min"
                    render={({ field }) => (
                      <FormItem data-oid="_j9qox9">
                        <FormLabel data-oid="b.y98qd">
                          Минимальный объем
                        </FormLabel>
                        <FormControl data-oid="cu-qwhv">
                          <Input
                            type="number"
                            step="0.0001"
                            placeholder="Мин. объем"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value),
                              )
                            }
                            data-oid="xw59u.i"
                          />
                        </FormControl>
                        <FormMessage data-oid="vwfrjiw" />
                      </FormItem>
                    )}
                    data-oid="nn8d4.n"
                  />

                  <FormField
                    control={form.control}
                    name="volume_max"
                    render={({ field }) => (
                      <FormItem data-oid="8_n6hw1">
                        <FormLabel data-oid="y_.5wif">
                          Максимальный объем
                        </FormLabel>
                        <FormControl data-oid=".v1vxoo">
                          <Input
                            type="number"
                            step="0.0001"
                            placeholder="Макс. объем"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value),
                              )
                            }
                            data-oid="gn15cof"
                          />
                        </FormControl>
                        <FormMessage data-oid=".3r-yyl" />
                      </FormItem>
                    )}
                    data-oid="qwex:pz"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="volume_unit_id"
                  render={({ field }) => (
                    <FormItem data-oid="k11gvcf">
                      <FormLabel data-oid="5_46zsf">
                        Единица измерения объема
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? parseInt(value) : null)
                        }
                        value={field.value?.toString() || ""}
                        data-oid="3w8rv74"
                      >
                        <FormControl data-oid="i_1a-u4">
                          <SelectTrigger data-oid="kj2s.oc">
                            <SelectValue
                              placeholder="Выберите единицу измерения"
                              data-oid="bcxo33v"
                            >
                              {field.value &&
                                units.find((unit) => unit.id === field.value)
                                  ?.short_name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="ou4ggpo">
                          {loadingUnits ? (
                            <SelectItem
                              value="loading"
                              disabled
                              data-oid="54gelrj"
                            >
                              Загрузка...
                            </SelectItem>
                          ) : units.length === 0 ? (
                            <SelectItem
                              value="empty"
                              disabled
                              data-oid="nq_.bcm"
                            >
                              Нет доступных единиц измерения
                            </SelectItem>
                          ) : (
                            units.map((unit) => (
                              <SelectItem
                                key={unit.id}
                                value={unit.id.toString()}
                                data-oid="8xedy1z"
                              >
                                {unit.full_name} ({unit.short_name})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid=":51638-" />
                    </FormItem>
                  )}
                  data-oid="x194f37"
                />

                <FormField
                  control={form.control}
                  name="nominal_volume"
                  render={({ field }) => (
                    <FormItem data-oid="qot0fo_">
                      <FormLabel data-oid="a5:jagm">
                        Номинальный объем*
                      </FormLabel>
                      <FormControl data-oid="a7u6lu.">
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="Номинальный объем (например, 1000)"
                          {...field}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value),
                            )
                          }
                          data-oid="vp5r.9d"
                        />
                      </FormControl>
                      <FormDescription data-oid="ttvu5pv">
                        Объем, на который установлена цена (например, 1000
                        символов)
                      </FormDescription>
                      <FormMessage data-oid="xyxrnss" />
                    </FormItem>
                  )}
                  data-oid="6xo6b86"
                />

                <FormField
                  control={form.control}
                  name="price_per_unit"
                  render={({ field }) => (
                    <FormItem data-oid="gk._lha">
                      <FormLabel data-oid="3npfxss">
                        Цена за единицу номинального объема*
                      </FormLabel>
                      <FormControl data-oid="0tycp1.">
                        <div className="relative" data-oid="l0lqh8u">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Цена за единицу"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value),
                              )
                            }
                            data-oid="8e8cd9z"
                          />

                          <div
                            className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
                            data-oid="fxa07zq"
                          >
                            <span
                              className="text-muted-foreground"
                              data-oid="4r-gue7"
                            >
                              {orderCurrency}
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription data-oid="fvxsybe">
                        Цена за номинальный объем (например, 2 {orderCurrency}{" "}
                        за 1000 символов)
                      </FormDescription>
                      <FormMessage data-oid="eprznof" />
                    </FormItem>
                  )}
                  data-oid="shml78b"
                />

                <div
                  className="p-3 border rounded-md bg-muted/30"
                  data-oid="1_77acg"
                >
                  <h5 className="text-sm font-semibold mb-2" data-oid="3ucvz19">
                    Предварительный расчет:
                  </h5>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
                    data-oid="_:.hge:"
                  >
                    <div data-oid="zl11ebf">
                      <span
                        className="text-muted-foreground"
                        data-oid="9et8u3p"
                      >
                        Мин. стоимость:{" "}
                      </span>
                      {calculatedPrices.min !== null ? (
                        <span className="font-medium" data-oid="ji21gn-">
                          {calculatedPrices.min.toFixed(2)} {orderCurrency}
                        </span>
                      ) : (
                        <span
                          className="text-muted-foreground"
                          data-oid="ltixe1t"
                        >
                          Не указано
                        </span>
                      )}
                    </div>
                    <div data-oid="vg-4x8q">
                      <span
                        className="text-muted-foreground"
                        data-oid="9vu5ntt"
                      >
                        Макс. стоимость:{" "}
                      </span>
                      {calculatedPrices.max !== null ? (
                        <span className="font-medium" data-oid="7-d-9ke">
                          {calculatedPrices.max.toFixed(2)} {orderCurrency}
                        </span>
                      ) : (
                        <span
                          className="text-muted-foreground"
                          data-oid="v.cnai5"
                        >
                          Не указано
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
