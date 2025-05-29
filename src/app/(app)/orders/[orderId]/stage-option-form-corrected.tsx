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

// Базовая схема валидации формы
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
        if (optionToEdit && data.length > 0) {
          const typeToSet = data.find(
            (pt: PricingTypeOption) => pt.name === optionToEdit.pricing_type,
          );
          if (typeToSet) {
            form.setValue("pricing_type_id", typeToSet.id);
          } else {
            // Если тип из optionToEdit не найден, ставим первый из списка или оставляем как есть
            if (data[0] && !form.getValues("pricing_type_id")) {
              form.setValue("pricing_type_id", data[0].id);
            }
          }
        } else if (!optionToEdit && data.length > 0) {
          // Установить значение по умолчанию, если это новая опция и типы загружены
          const defaultType =
            data.find((pt: PricingTypeOption) => pt.name === "calculable") ||
            data[0];
          if (defaultType) {
            form.setValue("pricing_type_id", defaultType.id);
          }
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
  }, [form]);

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
    <div className="border rounded-lg p-4 mb-4 bg-card" data-oid="l1-vnv4">
      <h4 className="text-base font-semibold mb-3" data-oid="fx64nh8">
        {optionToEdit ? "Редактирование опции" : "Создание новой опции"}
      </h4>

      <Form {...form} data-oid="hpejcx_">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          data-oid="cfkg..s"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem data-oid=":ev5bfv">
                <FormLabel data-oid="b62_nug">Название опции</FormLabel>
                <FormControl data-oid="0kkpjwu">
                  <Input
                    placeholder="Введите название опции"
                    {...field}
                    data-oid="ed.f:oo"
                  />
                </FormControl>
                <FormMessage data-oid="gc2w9q4" />
              </FormItem>
            )}
            data-oid="wnvy-ku"
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem data-oid="885psnj">
                <FormLabel data-oid="clngyqd">Описание</FormLabel>
                <FormControl data-oid="2vwj9o3">
                  <Textarea
                    placeholder="Введите описание (необязательно)"
                    {...field}
                    value={field.value || ""}
                    data-oid="5j6k6kh"
                  />
                </FormControl>
                <FormMessage data-oid="j8atjl." />
              </FormItem>
            )}
            data-oid="e9hiwjd"
          />

          <FormField
            control={form.control}
            name="pricing_type_id"
            render={({ field }) => (
              <FormItem data-oid="gms4g1l">
                <FormLabel data-oid="a:u4.as">Тип ценообразования</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                  disabled={isLoadingPricingTypes}
                  data-oid="r68u3lv"
                >
                  <FormControl data-oid="3ez_nh:">
                    <SelectTrigger data-oid="bp7wyfa">
                      <SelectValue
                        placeholder={
                          isLoadingPricingTypes
                            ? "Загрузка типов..."
                            : "Выберите тип ценообразования"
                        }
                        data-oid="ag.3dpx"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="eq4n1_e">
                    {pricingTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                        data-oid="a2sex6y"
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
                <FormMessage data-oid="pp-rx5t" />
              </FormItem>
            )}
            data-oid="xeo--:t"
          />

          {/* Все поля отображаются всегда, независимо от типа ценообразования */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-oid="6i9tzcj"
          >
            <FormField
              control={form.control}
              name="volume_min"
              render={({ field }) => (
                <FormItem data-oid="mgafy5y">
                  <FormLabel data-oid="..hfqe8">Минимальный объем</FormLabel>
                  <FormControl data-oid="9_uwcpm">
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
                      data-oid="iikk_.3"
                    />
                  </FormControl>
                  <FormMessage data-oid="ca4lop0" />
                </FormItem>
              )}
              data-oid="1880xa_"
            />

            <FormField
              control={form.control}
              name="volume_max"
              render={({ field }) => (
                <FormItem data-oid="_cd0t8q">
                  <FormLabel data-oid="j6pzzvw">Максимальный объем</FormLabel>
                  <FormControl data-oid="-ir3z1i">
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
                      data-oid="pra.g59"
                    />
                  </FormControl>
                  <FormMessage data-oid="t.iuket" />
                </FormItem>
              )}
              data-oid="1mfvk2x"
            />
          </div>

          <FormField
            control={form.control}
            name="volume_unit"
            render={({ field }) => (
              <FormItem data-oid="am8--hj">
                <FormLabel data-oid="lapb7m1">
                  Единица измерения объема
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                  data-oid="mrq_ywp"
                >
                  <FormControl data-oid="7k57_9z">
                    <SelectTrigger data-oid="51fx0lr">
                      <SelectValue
                        placeholder="Выберите единицу измерения"
                        data-oid="z.mxhoa"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="xn-ny5o">
                    <SelectItem value="шт." data-oid="zvxnyr3">
                      шт.
                    </SelectItem>
                    <SelectItem value="симв." data-oid="ucxw5mm">
                      симв.
                    </SelectItem>
                    <SelectItem value="%" data-oid="yyzaq:a">
                      %
                    </SelectItem>
                    <SelectItem value="слов" data-oid="0d8b9kx">
                      слов
                    </SelectItem>
                    <SelectItem value="ч" data-oid="11dkite">
                      ч
                    </SelectItem>
                    <SelectItem value="мин" data-oid="9tfhfvx">
                      мин
                    </SelectItem>
                    <SelectItem value="дн" data-oid="grw2:50">
                      дн
                    </SelectItem>
                    <SelectItem value="кг" data-oid="y9gtz-8">
                      кг
                    </SelectItem>
                    <SelectItem value="л" data-oid="io.e_x3">
                      л
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage data-oid="xeu2yj5" />
              </FormItem>
            )}
            data-oid="v741l2x"
          />

          <FormField
            control={form.control}
            name="nominal_volume"
            render={({ field }) => (
              <FormItem data-oid="re.en5.">
                <FormLabel data-oid="-i-ms04">Номинальный объем</FormLabel>
                <FormControl data-oid="ce-wzwf">
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
                    data-oid="wt1fwik"
                  />
                </FormControl>
                <FormDescription data-oid="xs:cpch">
                  Объем, на который установлена цена (например, 1000 символов)
                </FormDescription>
                <FormMessage data-oid="sb10ol5" />
              </FormItem>
            )}
            data-oid="vdgjomm"
          />

          <FormField
            control={form.control}
            name="price_per_unit"
            render={({ field }) => (
              <FormItem data-oid="ph-zx75">
                <FormLabel data-oid="gk3zpci">
                  Цена за единицу номинального объема
                </FormLabel>
                <FormControl data-oid="lk652v4">
                  <div className="relative" data-oid="7l_nfcf">
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
                      data-oid="ud5q6h7"
                    />

                    <div
                      className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
                      data-oid="x1p54.-"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="wf6fatb"
                      >
                        {orderCurrency}
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription data-oid="t.g5uql">
                  Цена за номинальный объем (например, 2 {orderCurrency} за 1000
                  символов)
                </FormDescription>
                <FormMessage data-oid=".5evk4_" />
              </FormItem>
            )}
            data-oid="b0xe5po"
          />

          <div className="p-3 border rounded-md bg-muted/30" data-oid="iz94adm">
            <h5 className="text-sm font-semibold mb-2" data-oid="p7hrk.e">
              Предварительный расчет:
            </h5>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
              data-oid="d:tpa9b"
            >
              <div data-oid="c.0m8vo">
                <span className="text-muted-foreground" data-oid="8_k9usj">
                  Мин. стоимость:{" "}
                </span>
                {calculatedPrices.min !== null ? (
                  <span className="font-medium" data-oid="lb3ff7:">
                    {calculatedPrices.min.toFixed(2)} {orderCurrency}
                  </span>
                ) : (
                  <span className="text-muted-foreground" data-oid="f3u.ret">
                    Не указано
                  </span>
                )}
              </div>
              <div data-oid="lsog.l2">
                <span className="text-muted-foreground" data-oid="e87ta4.">
                  Макс. стоимость:{" "}
                </span>
                {calculatedPrices.max !== null ? (
                  <span className="font-medium" data-oid="6uiq5i7">
                    {calculatedPrices.max.toFixed(2)} {orderCurrency}
                  </span>
                ) : (
                  <span className="text-muted-foreground" data-oid="w39u07i">
                    Не указано
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4" data-oid="lg.c_tj">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-oid="x2cidgq"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="zo0yxq2">
              {isSubmitting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="f_r.yon"
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
