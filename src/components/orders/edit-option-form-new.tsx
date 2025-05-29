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

// Интерфейс для типа ценообразования из БД
interface PricingType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
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
    volume_unit: z.string().optional().nullable(),
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
      // Если выбран тип "Калькулируемая" (id: 1), проверяем наличие необходимых полей
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

export default function EditOptionForm({
  etapId,
  option,
  currency,
  onOptionUpdated,
  onCancel,
}: EditOptionFormProps) {
  const { toast } = useToast();
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);
  const [loading, setLoading] = useState(false);

  // Загрузка типов ценообразования из API
  useEffect(() => {
    const fetchPricingTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pricing-types");

        if (!response.ok) {
          throw new Error("Не удалось загрузить типы ценообразования");
        }

        const data = await response.json();
        setPricingTypes(data);
      } catch (error) {
        console.error("Ошибка при загрузке типов ценообразования:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить типы ценообразования",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricingTypes();
  }, [toast]);

  // Инициализация формы с данными опции
  const form = useForm<OptionFormValues>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: {
      name: option.name || "",
      description: option.description || "",
      pricing_type_id:
        option.pricing_type_id ||
        (option.pricing_type === "calculable" ? 1 : 2), // Поддержка обратной совместимости
      volume_min: option.volume_min || null,
      volume_max: option.volume_max || null,
      volume_unit: option.volume_unit || null,
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
        (option.pricing_type === "calculable" ? 1 : 2), // Поддержка обратной совместимости
      volume_min: option.volume_min || null,
      volume_max: option.volume_max || null,
      volume_unit: option.volume_unit || null,
      nominal_volume: option.nominal_volume || null,
      price_per_unit: option.price_per_unit || null,
    });
  }, [option, form]);

  // Отслеживание выбранного типа ценообразования для условного отображения полей
  const selectedPricingTypeId = form.watch("pricing_type_id");
  const isCalculable = selectedPricingTypeId === 1; // ID 1 соответствует "Калькулируемая"

  // Обработчик отправки формы
  const onSubmit = async (data: OptionFormValues) => {
    try {
      console.log("Отправка данных формы:", data);

      // Расчет цены на основе указанных параметров
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
          headers: {
            "Content-Type": "application/json",
          },
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

      // Получение обновленной опции
      const updatedOption = await response.json();

      toast({
        title: "Успех",
        description: "Опция успешно обновлена",
        variant: "default",
      });

      // Обратный вызов для обновления родительского компонента
      onOptionUpdated(updatedOption);
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
    <Form {...form} data-oid="8xbyaps">
      <form
        id={`edit-option-form-${option.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="8tcpl58"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="o93kh-u">
              <FormLabel data-oid="n9ut8ck">Название опции</FormLabel>
              <FormControl data-oid="k8n1jtm">
                <Input
                  placeholder="Введите название опции"
                  {...field}
                  data-oid="uep8cji"
                />
              </FormControl>
              <FormMessage data-oid="9w-hi5e" />
            </FormItem>
          )}
          data-oid="b2szk1x"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="oan5voh">
              <FormLabel data-oid="7ze5r-8">Описание (опционально)</FormLabel>
              <FormControl data-oid="-io9-iu">
                <Textarea
                  placeholder="Описание опции..."
                  className="min-h-[60px]"
                  {...field}
                  value={field.value || ""}
                  data-oid="913.cpm"
                />
              </FormControl>
              <FormMessage data-oid="gkmwse." />
            </FormItem>
          )}
          data-oid="enw8n7_"
        />

        <FormField
          control={form.control}
          name="pricing_type_id"
          render={({ field }) => (
            <FormItem data-oid="ug3tliv">
              <FormLabel data-oid="wmk:cqw">Тип ценообразования</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
                value={field.value?.toString()}
                data-oid="qorlf-:"
              >
                <FormControl data-oid="9tvcz54">
                  <SelectTrigger data-oid="3e5d.je">
                    <SelectValue
                      placeholder="Выберите тип ценообразования"
                      data-oid="3jf4mzr"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-oid="dhxw_ca">
                  {loading ? (
                    <SelectItem value="loading" disabled data-oid="oq4_8qn">
                      Загрузка...
                    </SelectItem>
                  ) : pricingTypes.length === 0 ? (
                    <SelectItem value="empty" disabled data-oid="ou.r3iq">
                      Нет доступных типов
                    </SelectItem>
                  ) : (
                    pricingTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                        data-oid="24iwk69"
                      >
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription data-oid="rmk2fys">
                {isCalculable
                  ? "Калькулируемая опция влияет на расчет стоимости"
                  : "Опция включена в общую стоимость этапа"}
              </FormDescription>
              <FormMessage data-oid="xlo.f6j" />
            </FormItem>
          )}
          data-oid="lvqlqza"
        />

        {isCalculable && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md"
            data-oid="fetooxo"
          >
            <FormField
              control={form.control}
              name="nominal_volume"
              render={({ field }) => (
                <FormItem data-oid="flkq447">
                  <FormLabel data-oid="64pvxhb">Номинальный объем</FormLabel>
                  <FormControl data-oid="6o1cjr_">
                    <Input
                      type="number"
                      placeholder="например, 1000"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                      data-oid=":2o:xz9"
                    />
                  </FormControl>
                  <FormMessage data-oid="efv59nu" />
                </FormItem>
              )}
              data-oid="660xrlb"
            />

            <FormField
              control={form.control}
              name="price_per_unit"
              render={({ field }) => (
                <FormItem data-oid="50l48ku">
                  <FormLabel data-oid="849lx14">
                    Цена за единицу ({currency})
                  </FormLabel>
                  <FormControl data-oid="ua6tomg">
                    <Input
                      type="number"
                      placeholder="например, 2.5"
                      step="0.01"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                      data-oid="nw--d83"
                    />
                  </FormControl>
                  <FormMessage data-oid="h1-t3_7" />
                </FormItem>
              )}
              data-oid="a-by.bq"
            />

            <FormField
              control={form.control}
              name="volume_unit"
              render={({ field }) => (
                <FormItem data-oid="vf-l7u.">
                  <FormLabel data-oid="ed8:8se">Единица измерения</FormLabel>
                  <FormControl data-oid="6d:yxvj">
                    <Input
                      placeholder="например, слов, шт, и т.д."
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.value,
                        )
                      }
                      data-oid="z3k8lzt"
                    />
                  </FormControl>
                  <FormMessage data-oid="zxpq8db" />
                </FormItem>
              )}
              data-oid="hgr3wr2"
            />

            <FormField
              control={form.control}
              name="volume_min"
              render={({ field }) => (
                <FormItem data-oid=".on2ry5">
                  <FormLabel data-oid=".jlq-5d">Минимальный объем</FormLabel>
                  <FormControl data-oid="x11nem7">
                    <Input
                      type="number"
                      placeholder="например, 500"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                      data-oid="eziv98_"
                    />
                  </FormControl>
                  <FormMessage data-oid="qhx.d6b" />
                </FormItem>
              )}
              data-oid="oeiqslh"
            />

            <FormField
              control={form.control}
              name="volume_max"
              render={({ field }) => (
                <FormItem data-oid="x5shsbg">
                  <FormLabel data-oid="6656odb">Максимальный объем</FormLabel>
                  <FormControl data-oid="fwhdsyv">
                    <Input
                      type="number"
                      placeholder="например, 2000"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                      data-oid="e11467y"
                    />
                  </FormControl>
                  <FormMessage data-oid="yq1d.7d" />
                </FormItem>
              )}
              data-oid="vezgb5y"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2" data-oid="o2190.1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive"
            data-oid="1rx0yo_"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            data-oid="_-cu_0b"
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
