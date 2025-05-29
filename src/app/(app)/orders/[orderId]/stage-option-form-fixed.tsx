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
    <div className="border rounded-lg p-4 mb-4 bg-card" data-oid="1v6uyie">
      <h4 className="text-base font-semibold mb-3" data-oid="kiaqwje">
        {optionToEdit ? "Редактирование опции" : "Создание новой опции"}
      </h4>

      <Form {...form} data-oid="jcm5qi7">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          data-oid="4odfhzj"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem data-oid="gkwjyj1">
                <FormLabel data-oid="68gcd1x">Название опции</FormLabel>
                <FormControl data-oid=":zh4z1v">
                  <Input
                    placeholder="Введите название опции"
                    {...field}
                    data-oid="t:kiwod"
                  />
                </FormControl>
                <FormMessage data-oid=":v7ve7i" />
              </FormItem>
            )}
            data-oid="w7ldx_u"
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem data-oid="42stq11">
                <FormLabel data-oid="clcer5i">Описание</FormLabel>
                <FormControl data-oid="f0fiso.">
                  <Textarea
                    placeholder="Введите описание (необязательно)"
                    {...field}
                    value={field.value || ""}
                    data-oid="3i1m4zh"
                  />
                </FormControl>
                <FormMessage data-oid="bwbyscb" />
              </FormItem>
            )}
            data-oid="92_2.on"
          />

          <FormField
            control={form.control}
            name="pricing_type_id"
            render={({ field }) => (
              <FormItem data-oid="94fkrnu">
                <FormLabel data-oid="04g9.id">Тип ценообразования</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                  disabled={isLoadingPricingTypes}
                  data-oid=".oaes1k"
                >
                  <FormControl data-oid="dv2f9t0">
                    <SelectTrigger data-oid="-hhhkst">
                      <SelectValue
                        placeholder={
                          isLoadingPricingTypes
                            ? "Загрузка типов..."
                            : "Выберите тип ценообразования"
                        }
                        data-oid="b8h2:-r"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="880xgs9">
                    {pricingTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                        data-oid="jfkj:b0"
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
                <FormMessage data-oid="i5htwgr" />
              </FormItem>
            )}
            data-oid="53x6ouu"
          />

          {/* Все поля отображаются всегда, независимо от типа ценообразования */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-oid=".gg5goo"
          >
            <FormField
              control={form.control}
              name="volume_min"
              render={({ field }) => (
                <FormItem data-oid="3j-e:o1">
                  <FormLabel data-oid=".6ozfq8">Минимальный объем</FormLabel>
                  <FormControl data-oid="3zqqx6q">
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
                      data-oid="ueznp2c"
                    />
                  </FormControl>
                  <FormMessage data-oid="y8bnigy" />
                </FormItem>
              )}
              data-oid="-ensvot"
            />

            <FormField
              control={form.control}
              name="volume_max"
              render={({ field }) => (
                <FormItem data-oid="yyfc4ul">
                  <FormLabel data-oid="vj-ogoc">Максимальный объем</FormLabel>
                  <FormControl data-oid="rczwr7b">
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
                      data-oid="de7rdx3"
                    />
                  </FormControl>
                  <FormMessage data-oid="h822_yz" />
                </FormItem>
              )}
              data-oid=":-l3daj"
            />
          </div>

          <FormField
            control={form.control}
            name="volume_unit"
            render={({ field }) => (
              <FormItem data-oid="9bgxykj">
                <FormLabel data-oid="_7.fw49">
                  Единица измерения объема
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                  data-oid="qw1utj8"
                >
                  <FormControl data-oid="7zr7p8y">
                    <SelectTrigger data-oid="53pqlzv">
                      <SelectValue
                        placeholder="Выберите единицу измерения"
                        data-oid="343i_xr"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="0e_b9vk">
                    <SelectItem value="шт." data-oid="y8xir_3">
                      шт.
                    </SelectItem>
                    <SelectItem value="симв." data-oid="h:juzll">
                      симв.
                    </SelectItem>
                    <SelectItem value="%" data-oid="q-5f3q:">
                      %
                    </SelectItem>
                    <SelectItem value="слов" data-oid="v99hd7m">
                      слов
                    </SelectItem>
                    <SelectItem value="ч" data-oid="fsoso3-">
                      ч
                    </SelectItem>
                    <SelectItem value="мин" data-oid="6vd2ji8">
                      мин
                    </SelectItem>
                    <SelectItem value="дн" data-oid=".zc0lci">
                      дн
                    </SelectItem>
                    <SelectItem value="кг" data-oid="y:_9tb0">
                      кг
                    </SelectItem>
                    <SelectItem value="л" data-oid="f2:v_3d">
                      л
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage data-oid="6u06nwm" />
              </FormItem>
            )}
            data-oid="u9cwnlt"
          />

          <FormField
            control={form.control}
            name="nominal_volume"
            render={({ field }) => (
              <FormItem data-oid="2m_0smm">
                <FormLabel data-oid="m5aqrsq">Номинальный объем</FormLabel>
                <FormControl data-oid="6j5g6bm">
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
                    data-oid=".3gi64-"
                  />
                </FormControl>
                <FormDescription data-oid="7-5_jt3">
                  Объем, на который установлена цена (например, 1000 символов)
                </FormDescription>
                <FormMessage data-oid="4x0_jcs" />
              </FormItem>
            )}
            data-oid="yc17-7g"
          />

          <FormField
            control={form.control}
            name="price_per_unit"
            render={({ field }) => (
              <FormItem data-oid="qly0gdw">
                <FormLabel data-oid="reb:_gs">
                  Цена за единицу номинального объема
                </FormLabel>
                <FormControl data-oid="-u_uw5i">
                  <div className="relative" data-oid="mdalv3u">
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
                      data-oid="pun9gc_"
                    />

                    <div
                      className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
                      data-oid="n-x9sx_"
                    >
                      <span
                        className="text-muted-foreground"
                        data-oid="5_7xl:a"
                      >
                        {orderCurrency}
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription data-oid="cktvtsj">
                  Цена за номинальный объем (например, 2 {orderCurrency} за 1000
                  символов)
                </FormDescription>
                <FormMessage data-oid="gtauyo1" />
              </FormItem>
            )}
            data-oid="n7gopo6"
          />

          <div className="p-3 border rounded-md bg-muted/30" data-oid="a6xd2j.">
            <h5 className="text-sm font-semibold mb-2" data-oid="k:bhh1f">
              Предварительный расчет:
            </h5>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
              data-oid="7ttz4d4"
            >
              <div data-oid="il8xr6i">
                <span className="text-muted-foreground" data-oid="00m-:a_">
                  Мин. стоимость:{" "}
                </span>
                {calculatedPrices.min !== null ? (
                  <span className="font-medium" data-oid=".wtwlrq">
                    {calculatedPrices.min.toFixed(2)} {orderCurrency}
                  </span>
                ) : (
                  <span className="text-muted-foreground" data-oid="oibi4p1">
                    Не указано
                  </span>
                )}
              </div>
              <div data-oid="yc285uu">
                <span className="text-muted-foreground" data-oid="agqr.qc">
                  Макс. стоимость:{" "}
                </span>
                {calculatedPrices.max !== null ? (
                  <span className="font-medium" data-oid="-jz5vqp">
                    {calculatedPrices.max.toFixed(2)} {orderCurrency}
                  </span>
                ) : (
                  <span className="text-muted-foreground" data-oid="ueh6:nd">
                    Не указано
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4" data-oid="2g4fvzt">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-oid="9apldnw"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="q_113k2">
              {isSubmitting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="ke4_an8"
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
