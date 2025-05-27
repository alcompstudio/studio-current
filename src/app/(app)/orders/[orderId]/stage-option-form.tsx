"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { StageOption } from '@/lib/types/stage';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Схема валидации формы
const stageOptionFormSchema = z.object({
  name: z.string().min(1, 'Название опции обязательно'),
  description: z.string().optional(),
  pricing_type: z.enum(['calculable', 'included']),
  volume_min: z.coerce.number().nullable().optional(),
  volume_max: z.coerce.number().nullable().optional(),
  volume_unit: z.string().nullable().optional(),
  nominal_volume: z.coerce.number().nullable().optional(),
  price_per_unit: z.coerce.number().nullable().optional(),
}).refine(data => {
  // Если выбран тип 'calculable', то номинальный объем и цена должны быть указаны
  if (data.pricing_type === 'calculable') {
    return data.nominal_volume != null && data.price_per_unit != null;
  }
  return true;
}, {
  message: 'Для калькулируемой опции необходимо указать номинальный объем и цену за единицу',
  path: ['pricing_type']
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
  orderCurrency = 'руб.' 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedPrices, setCalculatedPrices] = useState<{min: number | null, max: number | null}>({min: null, max: null});
  const { toast } = useToast();
  
  // Инициализация формы
  const form = useForm<StageOptionFormValues>({
    resolver: zodResolver(stageOptionFormSchema),
    defaultValues: {
      name: optionToEdit?.name || '',
      description: optionToEdit?.description || '',
      pricing_type: optionToEdit?.pricing_type || 'included',
      volume_min: optionToEdit?.volume_min || null,
      volume_max: optionToEdit?.volume_max || null,
      volume_unit: optionToEdit?.volume_unit || null,
      nominal_volume: optionToEdit?.nominal_volume || null,
      price_per_unit: optionToEdit?.price_per_unit || null,
    }
  });
  
  // Следим за типом ценообразования, чтобы показывать/скрывать поля
  const pricingType = form.watch('pricing_type');
  
  // Функция для расчета стоимости
  const calculatePrices = useCallback(() => {
    const values = form.getValues();
    
    // Если тип ценообразования не "calculable", то не рассчитываем
    if (values.pricing_type !== 'calculable') {
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
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Ошибка ${method === 'POST' ? 'создания' : 'обновления'} опции`);
      }
      
      toast({
        title: isEditing ? 'Опция обновлена' : 'Опция создана',
        description: isEditing 
          ? 'Опция этапа успешно обновлена' 
          : 'Новая опция этапа успешно создана',
        variant: 'default'
      });
      
      onSuccess();
      
    } catch (error: any) {
      console.error('Ошибка при сохранении опции:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Произошла ошибка при сохранении опции',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="border rounded-lg p-4 mb-4 bg-card">
      <h4 className="text-base font-semibold mb-3">
        {optionToEdit ? 'Редактирование опции' : 'Создание новой опции'}
      </h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название*</FormLabel>
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
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Введите описание опции" 
                    className="min-h-[80px]" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pricing_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип ценообразования*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип ценообразования" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="included">Входит в стоимость</SelectItem>
                    <SelectItem value="calculable">Калькулируемая</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Калькулируемая опция позволяет рассчитать стоимость на основе объема и цены за единицу. 
                  "Входит в стоимость" просто добавляет опцию без отдельного расчета цены.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {pricingType === 'calculable' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="volume_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Минимальный объем</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.0001"
                          placeholder="Мин. объем" 
                          {...field} 
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
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
                          step="0.0001"
                          placeholder="Макс. объем" 
                          {...field} 
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="volume_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица измерения объема</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите единицу измерения" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="шт.">шт.</SelectItem>
                        <SelectItem value="симв.">симв.</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="слов">слов</SelectItem>
                        <SelectItem value="ч">ч</SelectItem>
                        <SelectItem value="мин">мин</SelectItem>
                        <SelectItem value="дн">дн</SelectItem>
                        <SelectItem value="кг">кг</SelectItem>
                        <SelectItem value="л">л</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nominal_volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номинальный объем*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.0001"
                        placeholder="Номинальный объем (например, 1000)" 
                        {...field} 
                        value={field.value === null ? '' : field.value}
                        onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Объем, на который установлена цена (например, 1000 символов)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена за единицу номинального объема*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Цена за единицу" 
                          {...field} 
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <span className="text-muted-foreground">{orderCurrency}</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Цена за номинальный объем (например, 2 {orderCurrency} за 1000 символов)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="p-3 border rounded-md bg-muted/30">
                <h5 className="text-sm font-semibold mb-2">Предварительный расчет:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Мин. стоимость: </span>
                    {calculatedPrices.min !== null ? (
                      <span className="font-medium">
                        {calculatedPrices.min.toFixed(2)} {orderCurrency}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Не указано</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Макс. стоимость: </span>
                    {calculatedPrices.max !== null ? (
                      <span className="font-medium">
                        {calculatedPrices.max.toFixed(2)} {orderCurrency}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Не указано</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                optionToEdit ? 'Сохранить изменения' : 'Создать опцию'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StageOptionForm;
