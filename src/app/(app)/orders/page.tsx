"use client";

import { useEffect, useState } from "react"; // Import useEffect and useState
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, Filter } from "lucide-react"; // Import Eye and Filter icons
import type { Order } from "@/lib/types"; 
import type { OrderStatusOS, OrderStatusId } from "@/lib/types/order";
import Link from "next/link";
import { getOrderStatusVariant, getOrderStatusStyle } from "./getOrderStatusVariant"; // Импорт новых функций
import { cn } from "@/lib/utils"; // Import cn for conditional classes
import { DeleteOrderDialog } from "@/components/orders/delete-order-dialog"; // Импорт компонента для удаления заказа

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<{ id: number; title: string; currency?: string }[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusOS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Роль пользователя (в будущем может быть получена из контекста аутентификации)
  type UserRole = "Заказчик" | "Исполнитель";
  const userRole: UserRole = "Заказчик"; // Явно указываем тип
  
  // Строковые константы ролей для сравнения
  const CUSTOMER_ROLE = "Заказчик" as const;
  const FREELANCER_ROLE = "Исполнитель" as const;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем одновременно заказы, проекты и статусы заказов
        const [ordersRes, projectsRes, statusesRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/projects"),
          fetch("/api/order-statuses-os"),
        ]);
        
        if (!ordersRes.ok)
          throw new Error(`Ошибка при загрузке заказов: ${ordersRes.statusText}`);
        if (!projectsRes.ok)
          throw new Error(`Ошибка при загрузке проектов: ${projectsRes.statusText}`);
        if (!statusesRes.ok)
          throw new Error(`Ошибка при загрузке статусов заказов: ${statusesRes.statusText}`);
          
        const ordersData: Order[] = await ordersRes.json();
        const projectsData: { id: number; title: string; currency?: string }[] =
          await projectsRes.json();
        const statusesData: OrderStatusOS[] = await statusesRes.json();
        
        // Форматируем даты для заказов
        const ordersWithFormattedDates = ordersData.map((order) => ({
          ...order,
          createdAt: order.createdAt ? new Date(order.createdAt) : null,
          updatedAt: order.updatedAt ? new Date(order.updatedAt) : null,
        }));
        
        setOrders(ordersWithFormattedDates);
        setProjects(
          Array.isArray(projectsData)
            ? projectsData.map((p) => ({
                id: p.id,
                title: p.title,
                currency: p.currency,
              }))
            : [],
        );
        setOrderStatuses(Array.isArray(statusesData) ? statusesData : []);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить заказы, проекты или статусы.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex flex-col gap-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="flex flex-col gap-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        {/* Используем константы для сравнения */}
        {userRole === CUSTOMER_ROLE && (
          <Link href="/orders/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Order
            </Button>
          </Link>
        )}
        {userRole === FREELANCER_ROLE && (
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter Orders
          </Button>
        )}
      </div>

      {/* Order List Header Info */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold">Order List</h3>
        <p className="text-sm text-muted-foreground">
          View and manage orders associated with your projects.
        </p>
      </div>

      {/* Order List Content - Direct mapping */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.id}
              className="shadow-sm hover:shadow-md transition-shadow border-none"
            >
              {" "}
              {/* Removed border */}
              <CardHeader className="pb-2">
                {" "}
                {/* Reduce padding */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-1">
                      {order.title}
                    </CardTitle>{" "}
                    {/* Use order.title */}
                    <CardDescription>
                      Проект:{" "}
                      {projects.find((p) => p.id === order.project_id)?.title ??
                        `ID: ${order.project_id}`}
                    </CardDescription>
                  </div>
                  {orderStatuses.length > 0 ? (
                    <div
                      className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center"
                      style={{
                        backgroundColor: orderStatuses.find(s => s.id === Number(order.status))?.backgroundColor || '#f4f4f5',
                        color: orderStatuses.find(s => s.id === Number(order.status))?.textColor || '#71717a',
                        borderColor: orderStatuses.find(s => s.id === Number(order.status))?.textColor || '#71717a'
                      }}
                    >
                      <span 
                        className="h-2 w-2 rounded-full mr-1.5" 
                        style={{
                          backgroundColor: orderStatuses.find(s => s.id === Number(order.status))?.textColor || '#71717a'
                        }}
                      />
                      {orderStatuses.find(s => s.id === Number(order.status))?.name || 'Неизвестный'}
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="flex-shrink-0"
                    >
                      Загрузка...
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {order.description}
                </p>{" "}
                {/* Use line-clamp */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">
                    Цена:{" "}
                    {order.price !== null &&
                    order.price !== undefined &&
                    String(order.price).trim() !== ""
                      ? Number(order.price).toLocaleString()
                      : "-"}{" "}
                    {/* Конвертируем project_id в число для сравнения */}
                    {projects.find((p) => 
                      typeof order.project_id === 'string' 
                        ? p.id === Number(order.project_id) 
                        : p.id === order.project_id
                    )?.currency ?? ""}
                  </span>
                  {/* Link to the new order detail page */}
                  <div className="flex items-center gap-2">
                    <Link href={`/orders/${order.id}`} passHref>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> Детали
                      </Button>
                    </Link>
                    <DeleteOrderDialog 
                      orderId={String(order.id)} 
                      size="sm"
                      variant="outline"
                      buttonClassName="text-destructive hover:bg-destructive hover:text-destructive-foreground h-9 px-3"
                      onDeleteSuccess={() => {
                        // Обновляем список заказов после удаления
                        setOrders(orders.filter(o => o.id !== order.id));
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Created:{" "}
                  {order.createdAt instanceof Date
                    ? order.createdAt.toLocaleDateString()
                    : "N/A"}{" "}
                  {/* Check if Date object */}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-sm border-none">
            {" "}
            {/* Removed border */}
            <CardContent>
              <p className="text-sm text-muted-foreground py-4 text-center">
                No orders found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
