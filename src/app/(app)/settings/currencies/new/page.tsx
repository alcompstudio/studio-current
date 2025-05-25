"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import type { CurrencyFormData } from "@/types/currency";

// Схема валидации для формы валюты
const currencyFormSchema = z.object({
  name: z.string().min(1, { message: "Название валюты обязательно" }),
  isoCode: z.string().min(3, { message: "Код валюты должен состоять минимум из 3 символов (например, USD)" }).max(5, { message: "Код валюты не должен превышать 5 символов"}),
  symbol: z.string().min(1, { message: "Символ валюты обязателен (например, $)" }).max(5, { message: "Символ валюты не должен превышать 5 символов"}),
  exchangeRate: z.coerce.number().min(0.0001, { message: "Курс обмена должен быть положительным числом" }).default(1),
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

export default function CreateCurrencyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      name: "",
      isoCode: "",
      symbol: "",
      exchangeRate: 1,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CurrencyFormValues) => {
    setIsLoading(true);
    console.log("Данные формы для создания валюты:", data);

    try {
      // Отправляем данные в API для создания новой валюты
      const response = await fetch("/api/settings/currencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка создания валюты: ${response.statusText}`
        );
      }

      const newCurrency = await response.json();
      console.log("Валюта успешно создана:", newCurrency);
      
      toast({
        title: "Валюта создана",
        description: `Валюта "${data.name} (${data.isoCode})" успешно создана.`,
      });

      // Перенаправляем на страницу списка валют и обновляем данные
      router.push("/settings/currencies");
      router.refresh();
    } catch (error) {
      console.error("Не удалось создать валюту:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка создания валюты",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/settings/currencies">
            <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Создание новой валюты
            </h2>
            <p className="text-sm text-muted-foreground">
              Добавление новой валюты в систему.
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading || !form.formState.isValid}>
          <Save className="mr-2 h-4 w-4" /> {isLoading ? "Сохранение..." : "Сохранить валюту"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Детали валюты</CardTitle>
          <CardDescription>Укажите название, код и символ для новой валюты.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название валюты</FormLabel>
                    <FormControl>
                      <Input placeholder="например, Японская йена, Британский фунт" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="isoCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Код валюты (ISO)</FormLabel>
                      <FormControl>
                        <Input placeholder="например, JPY, GBP" {...field} />
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
                      <FormLabel>Символ валюты</FormLabel>
                      <FormControl>
                        <Input placeholder="например, ¥, £" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Курс обмена (относительно базовой валюты учета)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.0001"
                        placeholder="например, 0.011 для доллара США" 
                        {...field} 
                        onChange={e => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}