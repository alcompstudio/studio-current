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
const optionFormSchema = z.object({
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
});

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface EditOptionFormProps {
  etapId: string;
  option: StageOption;
  currency: string;
  onOptionUpdated: (updatedOption: StageOption) => void;
  onCancel: () => void;
}

export default function EditOptionFormSimple({
  etapId,
  option,
  currency,
  onOptionUpdated,
  onCancel,
}: EditOptionFormProps) {
  const { toast } = useToast();
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculableFieldsVisible, setCalculableFieldsVisible] = useState(false);

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
        (option.pricing_type === "calculable" ? 1 : 2),
      volume_min: option.volume_min || null,
      volume_max: option.volume_max || null,
      volume_unit: option.volume_unit || null,
      nominal_volume: option.nominal_volume || null,
      price_per_unit: option.price_per_unit || null,
    },
    mode: "onChange",
  });

  // Устанавливаем начальную видимость калькулируемых полей на основе начальных данных
  useEffect(() => {
    const initialPricingTypeId =
      option.pricing_type_id || (option.pricing_type === "calculable" ? 1 : 2);
    setCalculableFieldsVisible(initialPricingTypeId === 1);
  }, [option]);

  // Отслеживаем изменение типа ценообразования
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "pricing_type_id" || !name) {
        const pricingTypeId = value.pricing_type_id;
        console.log(
          "Изменение типа ценообразования:",
          pricingTypeId,
          typeof pricingTypeId,
        );
        setCalculableFieldsVisible(Number(pricingTypeId) === 1);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Обработчик отправки формы
  const onSubmit = async (data: OptionFormValues) => {
    try {
      console.log("Отправка данных формы:", data);

      // Расчет цены на основе указанных параметров
      let calculated_price_min = null;
      let calculated_price_max = null;

      if (
        calculableFieldsVisible &&
        data.nominal_volume &&
        data.price_per_unit
      ) {
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
    <Form {...form} data-oid="4qjw5m2">
      <form
        id={`edit-option-form-${option.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="c9lgfjt"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="tdiplc4">
              <FormLabel data-oid=":38oh0j">Название опции</FormLabel>
              <FormControl data-oid="n8rygjz">
                <Input
                  placeholder="Введите название опции"
                  {...field}
                  data-oid="bvazaar"
                />
              </FormControl>
              <FormMessage data-oid="kvam6sv" />
            </FormItem>
          )}
          data-oid="_6_fx:a"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="czhjxw2">
              <FormLabel data-oid="lqs65oz">Описание (опционально)</FormLabel>
              <FormControl data-oid="mn9jcr5">
                <Textarea
                  placeholder="Описание опции..."
                  className="min-h-[60px]"
                  {...field}
                  value={field.value || ""}
                  data-oid="-0f93_6"
                />
              </FormControl>
              <FormMessage data-oid="fs1hy:0" />
            </FormItem>
          )}
          data-oid="a_2e9u_"
        />

        <FormField
          control={form.control}
          name="pricing_type_id"
          render={({ field }) => (
            <FormItem data-oid="jh.dl2u">
              <FormLabel data-oid="hfrr33m">Тип ценообразования</FormLabel>
              <Select
                onValueChange={(value) => {
                  const numValue = parseInt(value);
                  console.log("Выбран тип ценообразования:", numValue);
                  setCalculableFieldsVisible(numValue === 1);
                  field.onChange(numValue);
                }}
                defaultValue={field.value?.toString()}
                value={field.value?.toString()}
                data-oid="t63i.l3"
              >
                <FormControl data-oid="eacdtyn">
                  <SelectTrigger data-oid="cm.uozv">
                    <SelectValue
                      placeholder="Выберите тип ценообразования"
                      data-oid="bxp7fe8"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-oid="c7vvn.b">
                  {loading ? (
                    <SelectItem value="loading" disabled data-oid="39b7f0o">
                      Загрузка...
                    </SelectItem>
                  ) : pricingTypes.length === 0 ? (
                    <SelectItem value="empty" disabled data-oid="n_z0y_d">
                      Нет доступных типов
                    </SelectItem>
                  ) : (
                    pricingTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                        data-oid="-ls0gc1"
                      >
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription data-oid="213kl_n">
                {calculableFieldsVisible
                  ? "Калькулируемая опция влияет на расчет стоимости"
                  : "Опция включена в общую стоимость этапа"}
              </FormDescription>
              <FormMessage data-oid="-4-uqe2" />
            </FormItem>
          )}
          data-oid="rq9z7ti"
        />

        {/* Блок полей для калькулируемого типа */}
        {calculableFieldsVisible && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md"
            data-oid="tlc._9_"
          >
            <FormField
              control={form.control}
              name="nominal_volume"
              render={({ field }) => (
                <FormItem data-oid="6d1w.sd">
                  <FormLabel data-oid="dtbziqo">Номинальный объем</FormLabel>
                  <FormControl data-oid="..s3t6g">
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
                      data-oid="5t0qsxd"
                    />
                  </FormControl>
                  <FormMessage data-oid="hy:y2e7" />
                </FormItem>
              )}
              data-oid="zgb9:64"
            />

            <FormField
              control={form.control}
              name="price_per_unit"
              render={({ field }) => (
                <FormItem data-oid="n5h4tob">
                  <FormLabel data-oid="d0kya0d">
                    Цена за единицу ({currency})
                  </FormLabel>
                  <FormControl data-oid="w24edsw">
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
                      data-oid="nd9igz9"
                    />
                  </FormControl>
                  <FormMessage data-oid="2:5z3fg" />
                </FormItem>
              )}
              data-oid="yh:3fpy"
            />

            <FormField
              control={form.control}
              name="volume_unit"
              render={({ field }) => (
                <FormItem data-oid="30kg7qo">
                  <FormLabel data-oid="ci89_6u">Единица измерения</FormLabel>
                  <FormControl data-oid="qocfsb:">
                    <Input
                      placeholder="например, слов, шт, и т.д."
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.value,
                        )
                      }
                      data-oid="eah:j:n"
                    />
                  </FormControl>
                  <FormMessage data-oid="9s4:p6w" />
                </FormItem>
              )}
              data-oid="ay_v8dj"
            />

            <FormField
              control={form.control}
              name="volume_min"
              render={({ field }) => (
                <FormItem data-oid="hl_hpik">
                  <FormLabel data-oid="1zc1mxv">Минимальный объем</FormLabel>
                  <FormControl data-oid="a13.7.6">
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
                      data-oid="f-.yviw"
                    />
                  </FormControl>
                  <FormMessage data-oid="w8nfqi4" />
                </FormItem>
              )}
              data-oid="qbksicn"
            />

            <FormField
              control={form.control}
              name="volume_max"
              render={({ field }) => (
                <FormItem data-oid="er68ag8">
                  <FormLabel data-oid="-vlcuh3">Максимальный объем</FormLabel>
                  <FormControl data-oid="nc_pm47">
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
                      data-oid="zgaa_6x"
                    />
                  </FormControl>
                  <FormMessage data-oid="t.8-z_9" />
                </FormItem>
              )}
              data-oid="gt9nicx"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2" data-oid="o8nhndr">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive"
            data-oid="w80.d.3"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            data-oid="ev3ebpl"
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
