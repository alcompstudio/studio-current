"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Palette, ShoppingCart, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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

// Тип для статуса заказа (согласно типу OrderStatus в lib/types.ts)
interface OrderStatus {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  allowBids?: boolean;
  isDefault?: boolean;
}

const orderStatusFormSchema = z.object({
  name: z.string().min(1, { message: "Название статуса обязательно" }),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Неверный формат HEX цвета (например, #RRGGBB)" }),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Неверный формат HEX цвета (например, #RRGGBB)" }),
});

type OrderStatusFormValues = z.infer<typeof orderStatusFormSchema>;

export default function EditOrderStatusPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const statusId = params.statusId as string;

  const form = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusFormSchema),
    defaultValues: {
      name: "",
      textColor: "#FFFFFF",
      backgroundColor: "#2563EB",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!statusId) {
      setError("Status ID is missing.");
      setIsFetching(false);
      return;
    }

    const fetchStatusData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        // Запрашиваем данные из БД через API
        const response = await fetch(`/api/settings/order-statuses/${statusId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Ошибка получения статуса: ${response.statusText}`);
        }
        
        // Получаем данные из БД
        const data = await response.json();
        console.log('Получены данные статуса из БД:', data);

        if (data) {
          form.reset({
            name: data.name,
            textColor: data.textColor,
            backgroundColor: data.backgroundColor,
          });
        } else {
          throw new Error("Order status not found.");
        }
      } catch (err) {
        console.error("Failed to fetch order status data:", err);
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setError(message);
        toast({
          title: "Error fetching status data",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchStatusData();
  }, [statusId, form, toast]);

  const onSubmit = async (data: OrderStatusFormValues) => {
    setIsLoading(true);
    console.log("Данные формы для обновления статуса заказа:", data);

    try {
      // Отправляем данные на сервер для сохранения в БД
      const response = await fetch(`/api/settings/order-statuses/${statusId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка обновления статуса: ${response.statusText}`
        );
      }

      const updatedStatus = await response.json();
      console.log("Статус заказа успешно обновлен:", updatedStatus);
      
      // Если возникнут проблемы, можно использовать прямой доступ к БД:
      // await prisma.orderStatus.update({ 
      //   where: { id: parseInt(statusId) }, 
      //   data: {
      //     name: data.name,
      //     textColor: data.textColor,
      //     backgroundColor: data.backgroundColor,
      //     allowBids: data.allowBids
      //   } 
      // })
      
      toast({
        title: "Статус заказа обновлен",
        description: `Статус "${data.name}" успешно обновлен и сохранен в базе данных.`,
      });

      router.push("/settings/order-statuses");
      router.refresh();
    } catch (error) {
      console.error("Не удалось обновить статус заказа:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка обновления статуса заказа",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2 text-muted-foreground">Загрузка деталей статуса...</p>
      </div>
    );
  }

  if (error && !isFetching) {
    return (
      <Card className="shadow-sm border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-destructive py-4">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </CardContent>
        <CardContent>
            <Link href="/settings/order-statuses">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к списку статусов
                </Button>
            </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/settings/order-statuses">
            <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Редактирование статуса заказа</h2>
            <p className="text-sm text-muted-foreground">
              Изменение настроек существующего статуса заказа.  
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading || !form.formState.isValid || isFetching}>
          <Save className="mr-2 h-4 w-4" /> {isLoading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Детали статуса</CardTitle>
          <CardDescription>Измените название и цветовую схему статуса заказа.</CardDescription>
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
                      <Input id="«r10»-form-item" placeholder="например, Новый, Сбор ставок" {...field} />
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
                        <Palette className="mr-2 h-4 w-4" style={{ color: form.watch("textColor") }} /> Цвет текста (HEX)
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
                        <Palette className="mr-2 h-4 w-4" style={{ color: form.watch("backgroundColor") }} /> Цвет фона (HEX)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type="color" {...field} className="p-1 h-10 w-14 block" />
                          <Input placeholder="#2563EB" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormItem>
                <FormLabel>Предпросмотр</FormLabel>
                <div 
                  className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex items-center"
                  style={{
                    color: form.watch("textColor"), 
                    backgroundColor: form.watch("backgroundColor"),
                    borderColor: form.watch("textColor")
                  }}
                >
                  {form.watch("name") || "Пример статуса"}
                </div>
              </FormItem>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}