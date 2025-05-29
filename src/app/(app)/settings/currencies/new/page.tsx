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
  isoCode: z
    .string()
    .min(3, {
      message:
        "Код валюты должен состоять минимум из 3 символов (например, USD)",
    })
    .max(5, { message: "Код валюты не должен превышать 5 символов" }),
  symbol: z
    .string()
    .min(1, { message: "Символ валюты обязателен (например, $)" })
    .max(5, { message: "Символ валюты не должен превышать 5 символов" }),
  exchangeRate: z.coerce
    .number()
    .min(0.0001, { message: "Курс обмена должен быть положительным числом" })
    .default(1),
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
          errorData.error || `Ошибка создания валюты: ${response.statusText}`,
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
    <div className="flex flex-col gap-6" data-oid="gv77qly">
      <div className="flex items-center justify-between" data-oid="chu0-d.">
        <div className="flex items-center gap-4" data-oid="36w7i2-">
          <Link href="/settings/currencies" data-oid="zacdskc">
            <Button
              variant="outline"
              className="h-10 w-10 p-0 flex items-center justify-center"
              data-oid="r03p3ew"
            >
              <ArrowLeft className="h-5 w-5" data-oid="mk-ab7v" />
            </Button>
          </Link>
          <div data-oid="w69j0ci">
            <h2
              className="text-2xl font-bold tracking-tight"
              data-oid="1jflu2w"
            >
              Создание новой валюты
            </h2>
            <p className="text-sm text-muted-foreground" data-oid="aso6a.8">
              Добавление новой валюты в систему.
            </p>
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading || !form.formState.isValid}
          data-oid="ni9ph:q"
        >
          <Save className="mr-2 h-4 w-4" data-oid="p3w13w4" />{" "}
          {isLoading ? "Сохранение..." : "Сохранить валюту"}
        </Button>
      </div>

      <Card data-oid="f25-sm1">
        <CardHeader data-oid="wlbe-a8">
          <CardTitle data-oid="uca8z4m">Детали валюты</CardTitle>
          <CardDescription data-oid="veg_h-d">
            Укажите название, код и символ для новой валюты.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="10qa-7:">
          <Form {...form} data-oid="oe8tfve">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid="e-x5sw9"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem data-oid="0:8.kff">
                    <FormLabel data-oid="bpvaafs">Название валюты</FormLabel>
                    <FormControl data-oid="0qxo8ll">
                      <Input
                        placeholder="например, Японская йена, Британский фунт"
                        {...field}
                        data-oid="t6hkjsz"
                      />
                    </FormControl>
                    <FormMessage data-oid="_bl.lr1" />
                  </FormItem>
                )}
                data-oid="y:510io"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                data-oid="-lr9:yb"
              >
                <FormField
                  control={form.control}
                  name="isoCode"
                  render={({ field }) => (
                    <FormItem data-oid="4c0chen">
                      <FormLabel data-oid="6ulm1t1">Код валюты (ISO)</FormLabel>
                      <FormControl data-oid="xhkrr4h">
                        <Input
                          placeholder="например, JPY, GBP"
                          {...field}
                          data-oid="b0nmqo3"
                        />
                      </FormControl>
                      <FormMessage data-oid="ulzv.xo" />
                    </FormItem>
                  )}
                  data-oid="fini7h6"
                />

                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem data-oid="orqilz4">
                      <FormLabel data-oid="o8gkkgq">Символ валюты</FormLabel>
                      <FormControl data-oid="2ds0xnq">
                        <Input
                          placeholder="например, ¥, £"
                          {...field}
                          data-oid="oapvkjn"
                        />
                      </FormControl>
                      <FormMessage data-oid="z.hyze." />
                    </FormItem>
                  )}
                  data-oid="2.x4n3k"
                />
              </div>

              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem data-oid="vwc0uv7">
                    <FormLabel data-oid="2d0:bfl">
                      Курс обмена (относительно базовой валюты учета)
                    </FormLabel>
                    <FormControl data-oid="xz1q9rh">
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="например, 0.011 для доллара США"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : parseFloat(value),
                          );
                        }}
                        data-oid="f_ee:x2"
                      />
                    </FormControl>
                    <FormMessage data-oid="cb5hij." />
                  </FormItem>
                )}
                data-oid=".gd8k4w"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
