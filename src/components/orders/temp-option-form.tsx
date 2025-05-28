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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  pricing_type_id: z.coerce.number({ required_error: "Выберите тип ценообразования" }),
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
        const response = await fetch('/api/pricing-types');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить типы ценообразования');
        }
        
        const data = await response.json();
        setPricingTypes(data);
      } catch (error) {
        console.error('Ошибка при загрузке типов ценообразования:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить типы ценообразования',
          variant: 'destructive',
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
      pricing_type_id: option.pricing_type_id || (option.pricing_type === 'calculable' ? 1 : 2),
      volume_min: option.volume_min || null,
      volume_max: option.volume_max || null,
      volume_unit: option.volume_unit || null,
      nominal_volume: option.nominal_volume || null,
      price_per_unit: option.price_per_unit || null,
    },
    mode: "onChange",
  });
  
  // Явно отслеживаем значение pricing_type_id для условного отображения
  const watchPricingTypeId = form.watch("pricing_type_id");
  
  // Определяем, является ли тип калькулируемым (id=1)
  const shouldShowCalculableFields = watchPricingTypeId === 1;

  // Обработчик отправки формы
  const onSubmit = async (data: OptionFormValues) => {
    try {
      console.log("Отправка данных формы:", data);

      // Расчет цены на основе указанных параметров
      let calculated_price_min = null;
      let calculated_price_max = null;
      
      if (shouldShowCalculableFields && data.nominal_volume && data.price_per_unit) {
        if (data.volume_min !== null && data.volume_min !== undefined) {
          calculated_price_min = (data.volume_min / data.nominal_volume) * data.price_per_unit;
        }
        
        if (data.volume_max !== null && data.volume_max !== undefined) {
          calculated_price_max = (data.volume_max / data.nominal_volume) * data.price_per_unit;
        }
      }

      // Обновление опции через API
      const response = await fetch(`/api/orders/${option.order_stage_id.split('/')[0]}/stages/${option.order_stage_id}/options/${option.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          calculated_price_min,
          calculated_price_max
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить опцию');
      }
      
      // Получение обновленной опции
      const updatedOption = await response.json();
      
      toast({
        title: 'Успех',
        description: 'Опция успешно обновлена',
        variant: 'default',
      });
      
      // Обратный вызов для обновления родительского компонента
      onOptionUpdated(updatedOption);
    } catch (error: any) {
      console.error('Ошибка при обновлении опции:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить опцию',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        id={`edit-option-form-${option.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название опции</FormLabel>
              <FormControl>
                <Input placeholder="Введите название опции" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание (опционально)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Описание опции..."
                  className="min-h-[60px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип ценообразования</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const numValue = parseInt(value);
                  console.log('Выбран тип ценообразования:', numValue);
                  field.onChange(numValue);
                }}
                defaultValue={field.value?.toString()}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип ценообразования" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>Загрузка...</SelectItem>
                  ) : pricingTypes.length === 0 ? (
                    <SelectItem value="empty" disabled>Нет доступных типов</SelectItem>
                  ) : (
                    pricingTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                {shouldShowCalculableFields 
                  ? "Калькулируемая опция влияет на расчет стоимости"
                  : "Опция включена в общую стоимость этапа"
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Блок полей для калькулируемого типа */}
        {shouldShowCalculableFields && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md">
            <FormField
              control={form.control}
              name="nominal_volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номинальный объем</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="например, 1000"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_per_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена за единицу ({currency})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="например, 2.5"
                      step="0.01"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volume_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Единица измерения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="например, слов, шт, и т.д."
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volume_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Минимальный объем</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="например, 500"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volume_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Максимальный объем</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="например, 2000"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
