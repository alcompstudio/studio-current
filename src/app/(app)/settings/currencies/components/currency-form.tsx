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
  isoCode: z
    .string()
    .min(2, "Код валюты должен содержать минимум 2 символа")
    .max(3, "Код валюты не должен превышать 3 символа"),
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  symbol: z.string().min(1, "Символ обязателен"),
  exchangeRate: z.coerce
    .number()
    .positive("Курс обмена должен быть положительным числом"),
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

interface CurrencyFormProps {
  initialData?: Currency | null;
  onSave: () => void;
  onCancel: () => void;
}

export function CurrencyForm({
  initialData,
  onSave,
  onCancel,
}: CurrencyFormProps) {
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
        throw new Error(
          errorData.error ||
            `Ошибка ${initialData ? "обновления" : "создания"} валюты: ${response.statusText}`,
        );
      }

      toast({
        title: `Валюта ${initialData ? "обновлена" : "создана"}`,
        description: `Валюта "${values.name}" успешно ${initialData ? "обновлена" : "создана"}.`,
      });

      onSave(); // Вызываем callback для обновления списка и закрытия формы
      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error(
        `Не удалось ${initialData ? "обновить" : "создать"} валюту:`,
        error,
      );
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: `Ошибка ${initialData ? "обновления" : "создания"} валюты`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card data-oid="z_z.827">
      <CardHeader data-oid="5qk6:ny">
        <div className="flex items-center justify-between" data-oid="-np6yn1">
          <div className="flex items-center gap-4" data-oid="3a9tn7-">
            <Button
              variant="outline"
              className="h-10 w-10 p-0 flex items-center justify-center"
              onClick={onCancel}
              data-oid="g2.9x4n"
            >
              <ArrowLeft className="h-5 w-5" data-oid="-gv43of" />
            </Button>
            <div data-oid="j9u1:_q">
              <CardTitle data-oid="8yzq12q">
                {initialData ? "Редактировать валюту" : "Создать новую валюту"}
              </CardTitle>
              <CardDescription data-oid="l1vk.v4">
                {initialData
                  ? `Изменение данных для валюты "${initialData.name}".`
                  : "Добавить новую валюту в систему."}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting || !form.formState.isValid}
            data-oid=".-1946e"
          >
            <Save className="mr-2 h-4 w-4" data-oid="st_oupg" />{" "}
            {isSubmitting
              ? "Сохранение..."
              : initialData
                ? "Сохранить изменения"
                : "Сохранить валюту"}
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="oiyk:cr">
        <Form {...form} data-oid="3ikc75c">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-oid="zj7:0tx"
          >
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-oid="bqwu3gf"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem data-oid="xmohlws">
                    <FormLabel data-oid="n2hty26">Название</FormLabel>
                    <FormControl data-oid="nuqfrsi">
                      <Input placeholder="Евро" {...field} data-oid="y6-dl21" />
                    </FormControl>
                    <FormMessage data-oid="-.pz8pr" />
                  </FormItem>
                )}
                data-oid=".u85tfw"
              />

              <FormField
                control={form.control}
                name="isoCode"
                render={({ field }) => (
                  <FormItem data-oid=".q9ubkt">
                    <FormLabel data-oid="u.yyant">Код валюты (ISO)</FormLabel>
                    <FormControl data-oid="cxt.v3g">
                      <Input placeholder="EUR" {...field} data-oid="2:2.zxf" />
                    </FormControl>
                    <FormMessage data-oid="lh6o:eg" />
                  </FormItem>
                )}
                data-oid="7mekga2"
              />

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem data-oid="t2:yetu">
                    <FormLabel data-oid="xx.o13n">Символ</FormLabel>
                    <FormControl data-oid="kmkcg39">
                      <Input placeholder="€" {...field} data-oid="sal6xzc" />
                    </FormControl>
                    <FormMessage data-oid="-uiwjk8" />
                  </FormItem>
                )}
                data-oid="9-cy08j"
              />

              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem data-oid="s8k5o6d">
                    <FormLabel data-oid="_wy761v">Курс обмена</FormLabel>
                    <FormControl data-oid="60_apgj">
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="1.0"
                        {...field}
                        data-oid="qpmebks"
                      />
                    </FormControl>
                    <FormMessage data-oid="octpu1h" />
                  </FormItem>
                )}
                data-oid="ub8go_e"
              />
            </div>

            <FormItem data-oid="_gqn-.2">
              <FormLabel data-oid="1awulut">Предпросмотр</FormLabel>
              <div
                className="flex items-center gap-2 bg-muted/30 p-3 rounded-md"
                data-oid="608x8sn"
              >
                <CreditCard
                  className="h-5 w-5 text-primary"
                  data-oid="y-554zd"
                />

                <span className="font-medium" data-oid="5pk0w7b">
                  {form.watch("name") || "Название валюты"}
                </span>
                <span className="text-lg font-medium" data-oid=":ea2os4">
                  {form.watch("symbol") || "$"}
                </span>
                <span
                  className="text-sm text-muted-foreground"
                  data-oid="azdxf_a"
                >
                  Код: {form.watch("isoCode") || "USD"}
                </span>
                <span
                  className="text-sm text-muted-foreground"
                  data-oid="3klzv_7"
                >
                  Курс: {form.watch("exchangeRate") || "1.0"}
                </span>
              </div>
            </FormItem>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
