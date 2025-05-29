"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { PricingType, PricingTypeFormData } from "@/types/pricing";

// Схема валидации для формы типа ценообразования
const pricingTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Название типа ценообразования обязательно" }),
});

type PricingTypeFormValues = z.infer<typeof pricingTypeFormSchema>;

interface PricingTypeFormProps {
  initialData?: PricingType | null;
  onSave: () => void;
  onCancel: () => void;
}

export function PricingTypeForm({
  initialData,
  onSave,
  onCancel,
}: PricingTypeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация формы с использованием react-hook-form
  const form = useForm<PricingTypeFormValues>({
    resolver: zodResolver(pricingTypeFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  // Функция для обработки отправки формы
  const handleSubmit = async (values: PricingTypeFormValues) => {
    setIsSubmitting(true);
    try {
      // Формируем данные для отправки на сервер
      const formData = {
        name: values.name,
      };

      // Отправляем запрос к API
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/settings/pricing-types-os/${initialData.id}`
        : "/api/settings/pricing-types-os";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Проверяем успешность ответа
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка сохранения: ${response.statusText}`,
        );
      }

      // Если запрос успешен

      toast({
        title: initialData
          ? "Тип ценообразования обновлен"
          : "Тип ценообразования создан",
        description: `Тип ценообразования "${values.name}" успешно ${initialData ? "обновлен" : "создан"}.`,
      });

      // Вызываем функцию для обновления списка типов
      onSave();
    } catch (error) {
      console.error("Ошибка при сохранении типа ценообразования:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить тип ценообразования.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border-none" data-oid="qf5i876">
      <CardHeader data-oid="ce8aaev">
        <CardTitle data-oid="vn0yphy">
          {initialData ? "Редактирование" : "Создание"} типа ценообразования
        </CardTitle>
        <CardDescription data-oid="pb-8:10">
          {initialData
            ? "Измените данные типа ценообразования и сохраните изменения"
            : "Заполните форму для создания нового типа ценообразования"}
        </CardDescription>
      </CardHeader>
      <Form {...form} data-oid="_yym4fa">
        <form onSubmit={form.handleSubmit(handleSubmit)} data-oid="jh7.08m">
          <CardContent className="space-y-4" data-oid="l_pxbx3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid=":wq-9rc">
                  <FormLabel data-oid="f1wfxy:">
                    Название типа ценообразования
                  </FormLabel>
                  <FormControl data-oid="r12gyse">
                    <Input
                      placeholder="Введите название типа ценообразования"
                      {...field}
                      data-oid="27d41qp"
                    />
                  </FormControl>
                  <FormMessage data-oid=".5vosj6" />
                </FormItem>
              )}
              data-oid="usq.mt9"
            />
          </CardContent>
          <CardFooter className="flex justify-between" data-oid="h1go_4a">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-oid="qhm309t"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="imd0ub8">
              {isSubmitting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="1jz4c89"
                  />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" data-oid=":cm9wq8" />
                  Сохранить
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
