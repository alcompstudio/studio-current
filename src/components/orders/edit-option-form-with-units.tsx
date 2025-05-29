"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import type { StageOption } from "@/lib/types/stage";
import { useToast } from "@/hooks/use-toast";

// Интерфейсы для данных из БД
interface PricingType {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  full_name: string;
  short_name: string;
}

// Схема формы с использованием Zod
const optionFormSchema = z
  .object({
    name: z.string().min(1, { message: "Название опции обязательно" }),
    description: z.string().optional(),
    pricing_type_id: z.coerce.number({
      required_error: "Выберите тип ценообразования",
    }),
    volume_min: z.coerce
      .number()
      .positive({ message: "Минимальный объем должен быть положительным" })
      .optional()
      .nullable(),
    volume_max: z.coerce
      .number()
      .positive({ message: "Максимальный объем должен быть положительным" })
      .optional()
      .nullable(),
    volume_unit_id: z.coerce.number().optional().nullable(),
    nominal_volume: z.coerce
      .number()
      .positive({ message: "Номинальный объем должен быть положительным" })
      .optional()
      .nullable(),
    price_per_unit: z.coerce
      .number()
      .min(0, { message: "Цена за единицу не может быть отрицательной" })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.pricing_type_id === 1) {
        return (
          data.nominal_volume !== null &&
          data.nominal_volume !== undefined &&
          data.price_per_unit !== null &&
          data.price_per_unit !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Для калькулируемых опций требуется указать номинальный объем и цену за единицу",
      path: ["pricing_type_id"],
    },
  );

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface EditOptionFormProps {
  etapId: string;
  option: StageOption;
  currency: string;
  onOptionUpdated: (updatedOption: StageOption) => void;
  onCancel: () => void;
}

export default function EditOptionFormWithUnits({
  etapId,
  option,
  currency,
  onOptionUpdated,
  onCancel,
}: EditOptionFormProps) {
  const { toast } = useToast();
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);

  // Загрузка данных из API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Загрузка типов ценообразования
        const pricingResponse = await fetch("/api/pricing-types");
        if (!pricingResponse.ok)
          throw new Error("Не удалось загрузить типы ценообразования");
        const pricingData = await pricingResponse.json();
        setPricingTypes(pricingData);

        // Загрузка единиц измерения
        const unitsResponse = await fetch("/api/settings/units-os");
        if (!unitsResponse.ok)
          throw new Error("Не удалось загрузить единицы измерения");
        const unitsData = await unitsResponse.json();
        setUnits(unitsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить необходимые данные",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Инициализация формы
  const form = useForm<OptionFormValues>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: {
      name: option.name || "",
      description: option.description || "",
      pricing_type_id:
        option.pricing_type_id ||
        (option.pricing_type === "calculable" ? 1 : 2),
      volume_min: option.volume_min || null,
      volume_max: option.volume_max || null,
      volume_unit_id: option.volume_unit_id || null,
      nominal_volume: option.nominal_volume || null,
      price_per_unit: option.price_per_unit || null,
    },
    mode: "onChange",
  });

  // Сброс формы при изменении опции
  useEffect(() => {
    form.reset({
      name: option.name || "",
      description: option.description || "",
      pricing_type_id:
        option.pricing_type_id ||
        (option.pricing_type === "calculable" ? 1 : 2),
      volume_min: option.volume_min || null,
      volume_max: option.volume_max || null,
      volume_unit_id: option.volume_unit_id || null,
      nominal_volume: option.nominal_volume || null,
      price_per_unit: option.price_per_unit || null,
    });
  }, [option, form]);

  // Отслеживание выбранного типа ценообразования
  const selectedPricingTypeId = form.watch("pricing_type_id");
  const isCalculable = selectedPricingTypeId === 1;

  // Обработчик отправки формы
  const onSubmit = async (data: OptionFormValues) => {
    try {
      // Расчет стоимости
      let calculated_price_min = null;
      let calculated_price_max = null;

      if (isCalculable && data.nominal_volume && data.price_per_unit) {
        if (data.volume_min !== null && data.volume_min !== undefined) {
          calculated_price_min =
            (data.volume_min / data.nominal_volume) * data.price_per_unit;
        }

        if (data.volume_max !== null && data.volume_max !== undefined) {
          calculated_price_max =
            (data.volume_max / data.nominal_volume) * data.price_per_unit;
        }
      }

      // Обновление опции через API
      const response = await fetch(
        `/api/orders/${option.order_stage_id.split("/")[0]}/stages/${option.order_stage_id}/options/${option.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            calculated_price_min,
            calculated_price_max,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось обновить опцию");
      }

      // Обновление родительского компонента
      const updatedOption = await response.json();
      onOptionUpdated(updatedOption);

      toast({
        title: "Успех",
        description: "Опция успешно обновлена",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Ошибка при обновлении опции:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить опцию",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form} data-oid="f50-61a">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="zw3me9u"
      >
        {/* Поля формы остаются такими же, как в оригинале */}
        {/* Добавлен выбор единицы измерения */}

        {isCalculable && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md"
            data-oid="g_lf:1k"
          >
            {/* ... другие поля ... */}

            <FormField
              control={form.control}
              name="volume_unit_id"
              render={({ field }) => (
                <FormItem data-oid="ux_h34k">
                  <FormLabel data-oid="tgbvfq4">Единица измерения</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? parseInt(value) : null)
                    }
                    value={field.value?.toString() || ""}
                    data-oid="4y3gtl8"
                  >
                    <FormControl data-oid="3z46a39">
                      <SelectTrigger data-oid="gy7-i-f">
                        <SelectValue
                          placeholder="Выберите единицу"
                          data-oid="zwtgv6v"
                        >
                          {field.value &&
                            units.find((unit) => unit.id === field.value)
                              ?.short_name}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent data-oid="7epuvy3">
                      {units.map((unit) => (
                        <SelectItem
                          key={unit.id}
                          value={unit.id.toString()}
                          data-oid="r1mat_w"
                        >
                          {unit.full_name} ({unit.short_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage data-oid="_jr8upw" />
                </FormItem>
              )}
              data-oid=":8-.b_2"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2" data-oid="ktnu9sz">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            data-oid="kq8qmzb"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            data-oid="4kc93tf"
          >
            {form.formState.isSubmitting
              ? "Сохранение..."
              : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
