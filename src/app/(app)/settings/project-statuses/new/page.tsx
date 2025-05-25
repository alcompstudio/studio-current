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
import { ArrowLeft, Save, Palette } from "lucide-react";
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

// Схема валидации для формы статуса проекта
const projectStatusFormSchema = z.object({
  name: z.string().min(1, { message: "Название статуса обязательно" }),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Неверный формат HEX цвета (например, #RRGGBB)" }),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Неверный формат HEX цвета (например, #RRGGBB)" }),
});

type ProjectStatusFormValues = z.infer<typeof projectStatusFormSchema>;

export default function CreateProjectStatusPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProjectStatusFormValues>({
    resolver: zodResolver(projectStatusFormSchema),
    defaultValues: {
      name: "",
      textColor: "#FFFFFF",
      backgroundColor: "#4CAF50", // Цвет соответствует статусу "Новый"
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ProjectStatusFormValues) => {
    setIsLoading(true);
    console.log("Данные формы для создания статуса проекта:", data);

    try {
      // TODO: Заменить на реальный API endpoint, когда он будет готов
      // const response = await fetch("/api/settings/project-statuses", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(
      //     errorData.error || `Ошибка создания статуса: ${response.statusText}`
      //   );
      // }

      // const newStatus = await response.json();
      // console.log("Статус успешно создан:", newStatus);

      // Здесь в реальном приложении будет актуальное сохранение в БД
      // Например: await prisma.projectStatus.create({ data: { ...data, isDefault: false } })
      
      toast({
        title: "Статус проекта создан",
        description: `Статус "${data.name}" успешно создан.`,
      });

      // Перенаправляем на страницу списка статусов
      router.push("/settings/project-statuses");
      router.refresh();
    } catch (error) {
      console.error("Не удалось создать статус проекта:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка создания статуса проекта",
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
          <Link href="/settings/project-statuses">
            <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Создание нового статуса проекта</h2>
            <p className="text-sm text-muted-foreground">
              Добавить новый статус для проектов.
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading || !form.formState.isValid}>
          <Save className="mr-2 h-4 w-4" /> {isLoading ? "Сохранение..." : "Сохранить статус"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Детали статуса</CardTitle>
          <CardDescription>Укажите название и цветовую схему для нового статуса проекта.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название статуса</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., In Review, Blocked" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Palette className="mr-2 h-4 w-4" /> Цвет текста (HEX)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type="color" {...field} className="p-1 h-10 w-14 block" />
                          <Input placeholder="#FFFFFF" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Palette className="mr-2 h-4 w-4" /> Цвет фона (HEX)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type="color" {...field} className="p-1 h-10 w-14 block" />
                          <Input placeholder="#3B82F6" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Preview of the badge */}
              <FormItem>
                <FormLabel>Предпросмотр</FormLabel>
                <div 
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent"
                  style={{
                    color: form.watch("textColor"), 
                    backgroundColor: form.watch("backgroundColor"),
                  }}
                >
                  {form.watch("name") || "Пример статуса"}
                </div>
              </FormItem>

              {/* Кнопка сохранения дублируется в шапке, здесь можно убрать или оставить для удобства */}
              {/* <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save Status"}
              </Button> */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}