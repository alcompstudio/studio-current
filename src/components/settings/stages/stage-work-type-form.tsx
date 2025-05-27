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

export function StageWorkTypeForm({ initialData, onSave, onCancel }: WorkTypeFormProps) {
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
          errorData.error || `Ошибка сохранения типа работы: ${response.statusText}`
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
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border-none">
      <CardHeader>
        <CardTitle>{initialData ? "Редактирование типа работы" : "Создание типа работы"}</CardTitle>
        <CardDescription>
          {initialData
            ? "Измените данные типа работы и сохраните изменения"
            : "Заполните форму для создания нового типа работы"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название типа работы</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Введите название типа работы" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
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
