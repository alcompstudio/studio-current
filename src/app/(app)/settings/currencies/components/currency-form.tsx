"use client";

import React from "react";
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
import { toast } from "@/components/ui/use-toast";
import type { Currency } from "@/types/currency";

// Схема валидации формы валюты
const currencyFormSchema = z.object({
  isoCode: z.string().min(2, "Код валюты должен содержать минимум 2 символа").max(3, "Код валюты не должен превышать 3 символа"),
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  symbol: z.string().min(1, "Символ обязателен"),
  exchangeRate: z.coerce.number().positive("Курс обмена должен быть положительным числом"),
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

interface CurrencyFormProps {
  currency?: Currency;
  isEditing?: boolean;
}

export function CurrencyForm({ currency, isEditing = false }: CurrencyFormProps) {
  const router = useRouter();

  // Инициализация формы с начальными значениями
  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      isoCode: currency?.isoCode || "",
      name: currency?.name || "",
      symbol: currency?.symbol || "",
      exchangeRate: currency?.exchangeRate || 1,
    },
  });

  // Обработчик отправки формы
  async function onSubmit(values: CurrencyFormValues) {
    try {
      // Если редактируем существующую валюту
      if (isEditing && currency?.id) {
        const response = await fetch(`/api/settings/currencies/${currency.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Не удалось обновить валюту");
        }

        toast({
          title: "Валюта обновлена",
          description: "Информация о валюте успешно обновлена",
        });
      } else {
        // Для создания новой валюты (может быть реализовано позже)
        toast({
          title: "Функция в разработке",
          description: "Создание новой валюты пока не реализовано",
          variant: "destructive",
        });
      }

      // Перенаправляем на страницу списка валют
      router.push("/settings/currencies");
      router.refresh();
    } catch (error) {
      console.error("Ошибка при сохранении валюты:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  }

  return (
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

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/settings/currencies")}
          >
            Отмена
          </Button>
          <Button type="submit">
            {isEditing ? "Сохранить изменения" : "Создать валюту"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
