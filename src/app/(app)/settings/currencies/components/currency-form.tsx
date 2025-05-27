"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Currency } from "@/types/currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, CreditCard } from "lucide-react";

// Схема валидации формы валюты
const currencyFormSchema = z.object({
  isoCode: z.string().min(2, "Код валюты должен содержать минимум 2 символа").max(3, "Код валюты не должен превышать 3 символа"),
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  symbol: z.string().min(1, "Символ обязателен"),
  exchangeRate: z.coerce.number().positive("Курс обмена должен быть положительным числом"),
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

interface CurrencyFormProps {
  initialData?: Currency | null;
  onSave: () => void;
  onCancel: () => void;
}

export function CurrencyForm({ initialData, onSave, onCancel }: CurrencyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация формы с начальными значениями
  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: initialData
      ? {
          isoCode: initialData.isoCode,
          name: initialData.name,
          symbol: initialData.symbol,
          exchangeRate: initialData.exchangeRate,
        }
      : {
          isoCode: "",
          name: "",
          symbol: "",
          exchangeRate: 1,
        },
    mode: "onChange",
  });

  // Обработчик отправки формы
  async function onSubmit(values: CurrencyFormValues) {
    setIsSubmitting(true);
    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/settings/currencies/${initialData.id}`
        : "/api/settings/currencies";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка ${initialData ? 'обновления' : 'создания'} валюты: ${response.statusText}`);
      }

      toast({
        title: `Валюта ${initialData ? 'обновлена' : 'создана'}`,
        description: `Валюта "${values.name}" успешно ${initialData ? 'обновлена' : 'создана'}.`,
      });
      
      onSave(); // Вызываем callback для обновления списка и закрытия формы
      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error(`Не удалось ${initialData ? 'обновить' : 'создать'} валюту:`, error);
      const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: `Ошибка ${initialData ? 'обновления' : 'создания'} валюты`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center" onClick={onCancel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle>{initialData ? "Редактировать валюту" : "Создать новую валюту"}</CardTitle>
              <CardDescription>
                {initialData ? `Изменение данных для валюты "${initialData.name}".` : "Добавить новую валюту в систему."}
              </CardDescription>
            </div>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || !form.formState.isValid}>
            <Save className="mr-2 h-4 w-4" /> {isSubmitting ? "Сохранение..." : (initialData ? "Сохранить изменения" : "Сохранить валюту")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Евро" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код валюты (ISO)</FormLabel>
                    <FormControl>
                      <Input placeholder="EUR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Символ</FormLabel>
                    <FormControl>
                      <Input placeholder="€" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Курс обмена</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="1.0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem>
              <FormLabel>Предпросмотр</FormLabel>
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-medium">{form.watch("name") || "Название валюты"}</span>
                <span className="text-lg font-medium">{form.watch("symbol") || "$"}</span>
                <span className="text-sm text-muted-foreground">Код: {form.watch("isoCode") || "USD"}</span>
                <span className="text-sm text-muted-foreground">Курс: {form.watch("exchangeRate") || "1.0"}</span>
              </div>
            </FormItem>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
