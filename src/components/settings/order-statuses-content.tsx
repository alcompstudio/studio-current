"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Edit3,
  Trash2,
  ShoppingCart,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Save,
  Palette,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ViewToggle } from "@/components/status/view-toggle";
import { StatusTable } from "@/components/status/status-table";
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

// Тип для статуса заказа
interface OrderStatus {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  allowBids?: boolean;
  isDefault?: boolean;
}

// Схема валидации для формы статуса заказа
const orderStatusFormSchema = z.object({
  name: z.string().min(1, { message: "Название статуса обязательно" }),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Неверный формат HEX цвета (например, #RRGGBB)" }),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Неверный формат HEX цвета (например, #RRGGBB)" }),
  allowBids: z.boolean().optional().default(false),
});

type OrderStatusFormValues = z.infer<typeof orderStatusFormSchema>;

interface OrderStatusFormProps {
  initialData?: OrderStatus | null;
  onSave: () => void;
  onCancel: () => void;
}

function OrderStatusForm({ initialData, onSave, onCancel }: OrderStatusFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          textColor: initialData.textColor,
          backgroundColor: initialData.backgroundColor,
          allowBids: initialData.allowBids || false,
        }
      : {
          name: "",
          textColor: "#FFFFFF",
          backgroundColor: "#4CAF50",
          allowBids: false,
        },
    mode: "onChange",
  });

  const handleSubmit = async (data: OrderStatusFormValues) => {
    setIsSubmitting(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `/api/settings/order-statuses/${initialData.id}`
      : "/api/settings/order-statuses";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка ${initialData ? 'обновления' : 'создания'} статуса: ${response.statusText}`
        );
      }

      toast({
        title: `Статус заказа ${initialData ? 'обновлен' : 'создан'}`, 
        description: `Статус "${data.name}" успешно ${initialData ? 'обновлен' : 'создан'}.`,
      });
      onSave(); // Вызываем callback для обновления списка и закрытия формы
      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error(`Не удалось ${initialData ? 'обновить' : 'создать'} статус заказа:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: `Ошибка ${initialData ? 'обновления' : 'создания'} статуса заказа`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center" onClick={onCancel}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <CardTitle>{initialData ? "Редактировать статус" : "Создать новый статус"}</CardTitle>
                    <CardDescription>
                    {initialData ? `Изменение данных для статуса "${initialData.name}".` : "Добавить новый статус для заказов."}
                    </CardDescription>
                </div>
            </div>
            <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting || !form.formState.isValid}>
                <Save className="mr-2 h-4 w-4" /> {isSubmitting ? "Сохранение..." : (initialData ? "Сохранить изменения" : "Сохранить статус")}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название статуса</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., В обработке, Выполнен" {...field} />
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
            <FormField
              control={form.control}
              name="allowBids"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Разрешить заявки
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Если включено, пользователи смогут подавать заявки на заказы с этим статусом.
                    </p>
                  </div>
                </FormItem>
              )}
            />
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function OrderStatusesContent() {
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "table">("table"); // По умолчанию - табличный вид
  const [showForm, setShowForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<OrderStatus | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<OrderStatus | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchOrderStatuses = async () => {
    try {
      setIsLoading(true);
      
      // Запрашиваем данные из БД через API
      const response = await fetch("/api/settings/order-statuses");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка получения статусов заказов: ${response.statusText}`,
        );
      }
      
      const data = await response.json();
      setOrderStatuses(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Failed to fetch order statuses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatuses();
  }, []);
  
  // Обработчик открытия диалога подтверждения удаления
  const openDeleteDialog = (status: OrderStatus) => {
    setStatusToDelete(status);
    setDeleteDialogOpen(true);
  };

  // Функция удаления статуса заказа
  const handleDelete = async (statusId: number) => {
    if (!statusId) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/settings/order-statuses/${statusId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка удаления статуса: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Оптимистично удаляем из UI
      setOrderStatuses(orderStatuses.filter(status => status.id !== statusId));
      
      toast({
        title: "Статус удален",
        description: data.message || "Статус заказа успешно удален",
      });
      
      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error("Не удалось удалить статус заказа:", error);
      const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка удаления статуса",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setStatusToDelete(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Статусы заказов</h2>
            <p className="text-sm text-muted-foreground">
              Управление различными статусами для ваших заказов.
            </p>
          </div>
          <div className="flex gap-2">
            {!showForm && <ViewToggle view={view} onViewChange={setView} />}
            {!showForm && (
              <Button onClick={() => { 
                setEditingStatus(null); 
                setShowForm(true); 
              }}>
                <Plus className="w-4 h-4 mr-2" /> Создать статус заказа
              </Button>
            )}
          </div>
        </div>

        {/* Form or Status List Content */}
        <div>
          {showForm ? (
            <OrderStatusForm 
              initialData={editingStatus}
              onSave={() => {
                setShowForm(false);
                setEditingStatus(null);
                fetchOrderStatuses(); // Обновляем список после сохранения
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingStatus(null);
              }}
            />
          ) : isLoading ? (
            <Card className="shadow-sm border-none">
              <CardContent className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Загрузка статусов заказов...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="shadow-sm border-destructive bg-destructive/10">
              <CardContent className="flex items-center gap-2 text-destructive py-4">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-semibold">
                  Ошибка загрузки статусов заказов: {error}
                </p>
              </CardContent>
            </Card>
          ) : (
            view === "table" ? (
              <Card>
                <StatusTable 
                  items={orderStatuses} 
                  basePath="/settings/order-statuses" 
                  onDelete={(id) => {
                    const status = orderStatuses.find(s => s.id === id);
                    if (status) openDeleteDialog(status);
                  }}
                  onEdit={(status) => {
                    setEditingStatus(status as OrderStatus); 
                    setShowForm(true);
                  }}
                />
              </Card>
            ) : ( 
              <div className="space-y-4">
                {orderStatuses.length > 0 ? orderStatuses.map((status) => (
                  <Card
                    key={status.id}
                    className="shadow-sm hover:shadow-md transition-shadow border-none"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <ShoppingCart className="mr-2 h-5 w-5" style={{ color: status.textColor }} />
                          {status.name}
                        </CardTitle>
                        <div
                          className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex items-center"
                          style={{
                            backgroundColor: status.backgroundColor,
                            color: status.textColor,
                            borderColor: status.textColor
                          }}
                        >
                          {status.name}
                        </div>
                      </div>
                      <CardDescription>
                        ID: {status.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingStatus(status);
                            setShowForm(true);
                          }}
                        >
                          <Edit3 className="mr-1 h-3.5 w-3.5" /> Редактировать
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => openDeleteDialog(status)}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
                : (
                  <Card className="shadow-sm border-none">
                    <CardContent>
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        Статусы заказов не найдены. Создайте статус, чтобы начать работу.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удаление статуса заказа</DialogTitle>
            <DialogDescription>
              {statusToDelete ? (
                <>
                  Вы действительно хотите удалить статус "{statusToDelete.name}"? 
                  Это действие нельзя будет отменить.
                </>
              ) : (
                "Вы действительно хотите удалить этот статус заказа? Это действие нельзя будет отменить."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false);
                setStatusToDelete(null);
              }}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => statusToDelete && handleDelete(statusToDelete.id)}
              disabled={isDeleting}
              className="gap-1"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
