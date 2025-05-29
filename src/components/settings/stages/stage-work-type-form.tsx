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

// Тип для типа работы
interface WorkType {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Схема валидации для формы типа работы
const workTypeFormSchema = z.object({
  name: z.string().min(1, { message: "Название типа работы обязательно" }),
});

type WorkTypeFormValues = z.infer<typeof workTypeFormSchema>;

interface WorkTypeFormProps {
  initialData?: WorkType | null;
  onSave: () => void;
  onCancel: () => void;
}

export function StageWorkTypeForm({
  initialData,
  onSave,
  onCancel,
}: WorkTypeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkTypeFormValues>({
    resolver: zodResolver(workTypeFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
        }
      : {
          name: "",
        },
    mode: "onChange",
  });

  const handleSubmit = async (data: WorkTypeFormValues) => {
    setIsSubmitting(true);
    const method = initialData ? "PATCH" : "POST";
    const url = "/api/stage-work-types-os";
    const body = initialData
      ? { id: initialData.id, name: data.name }
      : { name: data.name };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка сохранения типа работы: ${response.statusText}`,
        );
      }

      const responseData = await response.json();

      toast({
        title: initialData ? "Тип работы обновлен" : "Тип работы создан",
        description: initialData
          ? `Тип работы "${data.name}" успешно обновлен`
          : `Тип работы "${data.name}" успешно создан`,
      });

      onSave();
    } catch (error) {
      console.error("Не удалось сохранить тип работы:", error);
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Произошла неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border-none" data-oid=":zqb-3l">
      <CardHeader data-oid="kk2nk1c">
        <CardTitle data-oid="f19.wi2">
          {initialData ? "Редактирование типа работы" : "Создание типа работы"}
        </CardTitle>
        <CardDescription data-oid="ycd.8hk">
          {initialData
            ? "Измените данные типа работы и сохраните изменения"
            : "Заполните форму для создания нового типа работы"}
        </CardDescription>
      </CardHeader>
      <Form {...form} data-oid="s_nverx">
        <form onSubmit={form.handleSubmit(handleSubmit)} data-oid="3clxs61">
          <CardContent className="space-y-4" data-oid="7_18f8s">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="q.i.7j9">
                  <FormLabel data-oid="sb-y9mf">Название типа работы</FormLabel>
                  <FormControl data-oid="58lvy60">
                    <Input
                      {...field}
                      placeholder="Введите название типа работы"
                      data-oid="meuu5j8"
                    />
                  </FormControl>
                  <FormMessage data-oid="yf01lk7" />
                </FormItem>
              )}
              data-oid="ek.zr1r"
            />
          </CardContent>
          <CardFooter className="flex justify-between" data-oid="yxljbr5">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-oid="8slmc2d"
            >
              <ArrowLeft className="mr-2 h-4 w-4" data-oid="wbt.2c5" />
              Назад
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="qtng:2d">
              {isSubmitting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="a:_7t:k"
                  />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" data-oid="_f84.i0" />
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
