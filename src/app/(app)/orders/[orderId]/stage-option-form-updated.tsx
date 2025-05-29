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
  volume_unit: z.string().nullable().optional(),
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
  const [calculatedPrices, setCalculatedPrices] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [pricingTypes, setPricingTypes] = useState<PricingTypeOption[]>([]);
  const [isLoadingPricingTypes, setIsLoadingPricingTypes] = useState(false);
  const { toast } = useToast();

  // Инициализация формы
  const form = useForm<StageOptionFormValues>({
    resolver: zodResolver(stageOptionFormSchema),
    defaultValues: {
      name: optionToEdit?.name || "",
      description: optionToEdit?.description || "",
      pricing_type_id: optionToEdit?.pricing_type_id || undefined,
      volume_min: optionToEdit?.volume_min || null,
      volume_max: optionToEdit?.volume_max || null,
      volume_unit: optionToEdit?.volume_unit || null,
      nominal_volume: optionToEdit?.nominal_volume || null,
      price_per_unit: optionToEdit?.price_per_unit || null,
    },
  });

  // Следим за типом ценообразования
  const pricingTypeId = form.watch("pricing_type_id");
  const selectedPricingType = pricingTypes.find(
    (pt) => pt.id === pricingTypeId,
  );
  const isCalculable = selectedPricingType?.name === "calculable";

  // Загрузка типов ценообразования
  useEffect(() => {
    const fetchPricingTypes = async () => {
      setIsLoadingPricingTypes(true);
      try {
        const response = await fetch("/api/pricing-types");
        if (!response.ok) {
          throw new Error("Failed to fetch pricing types");
        }
        const data = await response.json();
        setPricingTypes(data);

        // Логика установки типа ценообразования при редактировании
        if (optionToEdit && data.length > 0) {
          // Если у опции уже есть pricing_type_id, используем его
          if (optionToEdit.pricing_type_id) {
            form.setValue("pricing_type_id", optionToEdit.pricing_type_id);
          }
          // Если есть только старое поле pricing_type, ищем соответствующий id
          else if (optionToEdit.pricing_type) {
            const typeToSet = data.find(
              (pt: PricingTypeOption) => pt.name === optionToEdit.pricing_type,
            );
            if (typeToSet) {
              form.setValue("pricing_type_id", typeToSet.id);
            } else {
              // Если тип из optionToEdit не найден, ставим первый из списка
              form.setValue("pricing_type_id", data[0].id);
            }
          } else {
            // По умолчанию устанавливаем первый тип из списка
            form.setValue("pricing_type_id", data[0].id);
          }
        } else if (!optionToEdit && data.length > 0) {
          // Если создаем новую опцию, устанавливаем 'included' по умолчанию
          const defaultType =
            data.find((pt: PricingTypeOption) => pt.name === "included") ||
            data[0];
          form.setValue("pricing_type_id", defaultType.id);
        }
      } catch (error) {
        console.error("Error fetching pricing types:", error);
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

    // Если тип ценообразования не "calculable", то не рассчитываем
    if (!isCalculable) {
      setCalculatedPrices({ min: null, max: null });
      return;
    }

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
  }, [form, isCalculable]);

  // Реализуем динамический расчет при изменении любого поля формы
  useEffect(() => {
    // Подписываемся на изменения любого поля формы
    const subscription = form.watch(() => {
      // Вызываем расчет немедленно
      calculatePrices();
    });

    // Запускаем начальный расчет
    calculatePrices();

    // Отписываемся при размонтировании
    return () => subscription.unsubscribe();
  }, [form, calculatePrices]);

  // Функция отправки формы
  const onSubmit = async (values: StageOptionFormValues) => {
    setIsSubmitting(true);

    try {
      const isEditing = Boolean(optionToEdit);
      const url = isEditing
        ? `/api/orders/${orderId}/stages/${stageId}/options/${optionToEdit?.id}`
        : `/api/orders/${orderId}/stages/${stageId}/options`;

      const method = isEditing ? "PUT" : "POST";

      // Логгирование данных перед отправкой
      console.log("Отправляем данные опции:", values);

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
    <div className="border rounded-lg p-4 mb-4 bg-card" data-oid="5d4pas0">
      <h4 className="text-base font-semibold mb-3" data-oid="ppub5xw">
        {optionToEdit ? "Редактирование опции" : "Создание новой опции"}
      </h4>

      <Form {...form} data-oid="-g01zde">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          data-oid="qtpncjk"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem data-oid="xxh1-bl">
                <FormLabel data-oid="3nozeno">Название опции</FormLabel>
                <FormControl data-oid="ewzbzf.">
                  <Input
                    placeholder="Введите название опции"
                    {...field}
                    data-oid="n0tfll8"
                  />
                </FormControl>
                <FormMessage data-oid="-c5hj77" />
              </FormItem>
            )}
            data-oid="v9omb97"
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem data-oid="60s0.tq">
                <FormLabel data-oid="4:taz4o">Описание</FormLabel>
                <FormControl data-oid="yppzf1m">
                  <Textarea
                    placeholder="Введите описание (необязательно)"
                    {...field}
                    value={field.value || ""}
                    data-oid="pbtp2c0"
                  />
                </FormControl>
                <FormMessage data-oid="ief0f4o" />
              </FormItem>
            )}
            data-oid="fmt3up3"
          />

          <FormField
            control={form.control}
            name="pricing_type_id"
            render={({ field }) => (
              <FormItem data-oid="ahevjhr">
                <FormLabel data-oid="9mk2exf">Тип ценообразования</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                  disabled={isLoadingPricingTypes}
                  data-oid="y51xr90"
                >
                  <FormControl data-oid="2ga.1gf">
                    <SelectTrigger data-oid="9iuqjj.">
                      <SelectValue
                        placeholder={
                          isLoadingPricingTypes
                            ? "Загрузка типов..."
                            : "Выберите тип ценообразования"
                        }
                        data-oid="u9cswcb"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="3emm_le">
                    {pricingTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                        data-oid="w29y:4o"
                      >
                        {type.name === "calculable"
                          ? "Калькулируемая"
                          : type.name === "included"
                            ? "Входит в стоимость"
                            : type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage data-oid="dwdwv5f" />
              </FormItem>
            )}
            data-oid="otthwnh"
          />

          {/* Отображаем все поля независимо от типа ценообразования */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-oid="8b39m_v"
          >
            <FormField
              control={form.control}
              name="volume_min"
              render={({ field }) => (
                <FormItem data-oid="_ab.1er">
                  <FormLabel data-oid="cmjpzfa">Минимальный объем</FormLabel>
                  <FormControl data-oid="mqrskpn">
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
                      data-oid="76gih:i"
                    />
                  </FormControl>
                  <FormMessage data-oid="1he0ggk" />
                </FormItem>
              )}
              data-oid="3krw4ud"
            />

            <FormField
              control={form.control}
              name="volume_max"
              render={({ field }) => (
                <FormItem data-oid="bbg1q72">
                  <FormLabel data-oid="s6gkdnb">Максимальный объем</FormLabel>
                  <FormControl data-oid="qf250j2">
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
                      data-oid=".-bbmk:"
                    />
                  </FormControl>
                  <FormMessage data-oid="4un1e7u" />
                </FormItem>
              )}
              data-oid="of98b2n"
            />
          </div>

          <FormField
            control={form.control}
            name="volume_unit"
            render={({ field }) => (
              <FormItem data-oid="kjwyau9">
                <FormLabel data-oid="oe.by8g">
                  Единица измерения объема
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                  data-oid="-jgx4n7"
                >
                  <FormControl data-oid="sg4rw4s">
                    <SelectTrigger data-oid="ip7j.a2">
                      <SelectValue
                        placeholder="Выберите единицу измерения"
                        data-oid="h5jqg11"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="vgf5.cy">
                    <SelectItem value="шт." data-oid="oy.rfh8">
                      шт.
                    </SelectItem>
                    <SelectItem value="симв." data-oid="8jh9ezr">
                      симв.
                    </SelectItem>
                    <SelectItem value="%" data-oid="728ssgj">
                      %
                    </SelectItem>
                    <SelectItem value="слов" data-oid="9ptinn_">
                      слов
                    </SelectItem>
                    <SelectItem value="ч" data-oid="al8i5q9">
                      ч
                    </SelectItem>
                    <SelectItem value="мин" data-oid="tleh0h6">
                      мин
                    </SelectItem>
                    <SelectItem value="дн" data-oid="nr0xmid">
                      дн
                    </SelectItem>
                    <SelectItem value="кг" data-oid="wmju-t8">
                      кг
                    </SelectItem>
                    <SelectItem value="л" data-oid="gri-y45">
                      л
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage data-oid="62demta" />
              </FormItem>
            )}
            data-oid="pq2o771"
          />

          <FormField
            control={form.control}
            name="nominal_volume"
            render={({ field }) => (
              <FormItem data-oid="9zpob4g">
                <FormLabel data-oid="j0afmy_">Номинальный объем</FormLabel>
                <FormControl data-oid="b212upz">
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
                    data-oid="_p8mt5d"
                  />
                </FormControl>
                <FormDescription data-oid="9ix1w1r">
                  Объем, на который установлена цена (например, 1000 символов)
                </FormDescription>
                <FormMessage data-oid="f3iq3dg" />
              </FormItem>
            )}
            data-oid="02c2hmt"
          />

          <FormField
            control={form.control}
            name="price_per_unit"
            render={({ field }) => (
              <FormItem data-oid="yoa8qwo">
                <FormLabel data-oid="nm4es1d">
                  Цена за единицу номинального объема
                </FormLabel>
                <FormControl data-oid="rbyn-qh">
                  <div className="relative" data-oid="zx518_h">
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
                      data-oid="3ly_i5-"
                    />

                    <div
                      className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
                      data-oid="iyigdgt"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="oi7rdsq"
                      >
                        {orderCurrency}
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription data-oid="ow_ld6h">
                  Цена за номинальный объем (например, 2 {orderCurrency} за 1000
                  символов)
                </FormDescription>
                <FormMessage data-oid="my866pp" />
              </FormItem>
            )}
            data-oid="90jqvt_"
          />

          {/* Показываем расчетную стоимость только для калькулируемых опций */}
          {isCalculable && (
            <div
              className="p-3 border rounded-md bg-muted/30"
              data-oid="i4psvc4"
            >
              <h5 className="text-sm font-semibold mb-2" data-oid="x4cad72">
                Предварительный расчет:
              </h5>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
                data-oid="4_26b0e"
              >
                <div data-oid="luzm8b:">
                  <span className="text-muted-foreground" data-oid="_t5c-ci">
                    Мин. стоимость:{" "}
                  </span>
                  {calculatedPrices.min !== null ? (
                    <span className="font-medium" data-oid="o0ie5zt">
                      {calculatedPrices.min.toFixed(2)} {orderCurrency}
                    </span>
                  ) : (
                    <span className="text-muted-foreground" data-oid="n3u7a.4">
                      Не указано
                    </span>
                  )}
                </div>
                <div data-oid="01x5za1">
                  <span className="text-muted-foreground" data-oid="hx73ym4">
                    Макс. стоимость:{" "}
                  </span>
                  {calculatedPrices.max !== null ? (
                    <span className="font-medium" data-oid="-scnzg4">
                      {calculatedPrices.max.toFixed(2)} {orderCurrency}
                    </span>
                  ) : (
                    <span className="text-muted-foreground" data-oid="dgxij5m">
                      Не указано
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4" data-oid="5-sd4ru">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-oid="dyomwje"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="q2a12h:">
              {isSubmitting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="4u:_w0t"
                  />

                  {optionToEdit ? "Сохранение..." : "Создание..."}
                </>
              ) : (
                <>{optionToEdit ? "Сохранить изменения" : "Создать опцию"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StageOptionForm;
