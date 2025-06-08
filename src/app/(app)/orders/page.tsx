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
import {
  getOrderStatusVariant,
  getOrderStatusStyle,
} from "./getOrderStatusVariant"; // Импорт новых функций
import { cn } from "@/lib/utils"; // Import cn for conditional classes
import { DeleteOrderDialog } from "@/components/orders/delete-order-dialog"; // Импорт компонента для удаления заказа
import type { UserRole as AppUserRole } from "@/lib/types"; // Импортируем UserRole

// Определяем интерфейс AuthUser здесь или импортируем, если он уже есть в types
interface AuthUser {
  email: string;
  role: AppUserRole; // Используем импортированный UserRole
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<
    { id: number; title: string; currency?: string }[]
  >([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusOS[]>([]);
  const [loadingData, setLoadingData] = useState(true); // Переименовано для ясности (было loading)
  const [error, setError] = useState<string | null>(null);

  // Состояние для проверки аутентификации на уровне страницы
  const [pageAuthUser, setPageAuthUser] = useState<AuthUser | null>(null);
  const [isPageAuthLoading, setIsPageAuthLoading] = useState(true);

  // Роль пользователя (в будущем может быть получена из контекста аутентификации)
  // Эта логика userRole остается, если она нужна для UI до полной загрузки authUser
  const CUSTOMER_ROLE = "Заказчик" as const;
  const FREELANCER_ROLE = "Исполнитель" as const;
  type UserRoleType = typeof CUSTOMER_ROLE | typeof FREELANCER_ROLE; // Переименовано, чтобы не конфликтовать с импортом
  const userRole: UserRoleType = CUSTOMER_ROLE; // Это значение может быть временным или заменено на pageAuthUser.role

  // Первоначальная проверка аутентификации на уровне страницы
  useEffect(() => {
    console.log("OrdersPage: Initial auth check...");
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        if (user && user.email && user.role) {
          console.log("OrdersPage: User found in localStorage", user);
          setPageAuthUser(user);
        } else {
          console.log("OrdersPage: Invalid user data in localStorage on page.");
          setPageAuthUser(null);
        }
      } catch (e) {
        console.error("OrdersPage: Error parsing authUser from localStorage on page", e);
        setPageAuthUser(null);
      }
    } else {
      console.log("OrdersPage: No user in localStorage on page.");
      setPageAuthUser(null);
    }
    setIsPageAuthLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isPageAuthLoading) {
        console.log("OrdersPage: Waiting for page-level auth check to complete before fetching data.");
        return;
      }

      if (!pageAuthUser) {
        console.log("OrdersPage: No authenticated user found at page level. Skipping data fetch.");
        setLoadingData(false);
        setError("Пользователь не аутентифицирован. Данные не могут быть загружены.");
        return;
      }
      
      console.log("OrdersPage: Page-level auth check complete and user found. Fetching data...");
      setLoadingData(true); // Убедимся, что setLoadingData(true) вызывается перед fetch
      setError(null); // Сбрасываем предыдущие ошибки перед новой попыткой

      try {
        const [ordersRes, projectsRes, statusesRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/projects"),
          fetch("/api/order-statuses-os"),
        ]);

        if (!ordersRes.ok) throw new Error(`Ошибка при загрузке заказов: ${ordersRes.statusText} (${ordersRes.status})`);
        if (!projectsRes.ok) throw new Error(`Ошибка при загрузке проектов: ${projectsRes.statusText} (${projectsRes.status})`);
        if (!statusesRes.ok) throw new Error(`Ошибка при загрузке статусов заказов: ${statusesRes.statusText} (${statusesRes.status})`);

        const ordersData: Order[] = await ordersRes.json();
        const projectsData: { id: number; title: string; currency?: string }[] = await projectsRes.json();
        const statusesData: OrderStatusOS[] = await statusesRes.json();

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
        if (err instanceof Error) {
            setError(`Не удалось загрузить данные: ${err.message}`);
        } else {
            setError("Не удалось загрузить данные: произошла неизвестная ошибка.");
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isPageAuthLoading, pageAuthUser]);

  if (isPageAuthLoading || loadingData) {
    return (
      <div className="flex flex-col gap-6" data-oid="8q8y.oc">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 text-red-500" data-oid="whz-ylp">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-oid="r.x82n-">
      {/* Page Header */}
      <div className="flex items-center justify-between" data-oid="79wy5._">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="3kdpc2:">
          Orders
        </h2>
        {/* Используем pageAuthUser.role для определения роли, если пользователь загружен */}
        {pageAuthUser?.role === CUSTOMER_ROLE && (
          <Link href="/orders/new" passHref data-oid="mg.7v6r">
            <Button data-oid="f-d67r5">
              <PlusCircle className="mr-2 h-4 w-4" data-oid="nrmngwu" /> Create
              New Order
            </Button>
          </Link>
        )}
        {pageAuthUser?.role === FREELANCER_ROLE && (
          <Button variant="outline" data-oid="yye8ayt">
            <Filter className="mr-2 h-4 w-4" data-oid="h3.8ed9" /> Filter Orders
          </Button>
        )}
      </div>

      {/* Order List Header Info */}
      <div className="mb-2" data-oid="m:_31d:">
        <h3 className="text-lg font-semibold" data-oid="02u_bp.">
          Order List
        </h3>
        <p className="text-sm text-muted-foreground" data-oid="d5_fajm">
          View and manage orders associated with your projects.
        </p>
      </div>

      {/* Order List Content - Direct mapping */}
      <div className="space-y-4" data-oid="64sbawo">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.id}
              className="shadow-sm hover:shadow-md transition-shadow border-none"
              data-oid="du9kgwc"
            >
              {/* Removed border */}
              <CardHeader className="pb-2" data-oid="63qtl7u">
                {/* Reduce padding */}
                <div
                  className="flex justify-between items-start gap-2"
                  data-oid="7euw-i-"
                >
                  <div className="flex-1" data-oid="cm5cil.">
                    <CardTitle
                      className="text-lg font-semibold mb-1"
                      data-oid="qzvj:pn"
                    >
                      {order.title}
                    </CardTitle>
                    {/* Use order.title */}
                    <CardDescription data-oid="q9igrnh">
                      Проект:{" "}
                      {projects.find((p) => p.id === order.project_id)?.title ??
                        `ID: ${order.project_id}`}
                    </CardDescription>
                  </div>
                  {orderStatuses.length > 0 ? (
                    <div
                      className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center"
                      style={{
                        backgroundColor:
                          orderStatuses.find(
                            (s) => s.id === Number(order.status),
                          )?.backgroundColor || "#f4f4f5",
                        color:
                          orderStatuses.find(
                            (s) => s.id === Number(order.status),
                          )?.textColor || "#71717a",
                        borderColor:
                          orderStatuses.find(
                            (s) => s.id === Number(order.status),
                          )?.textColor || "#71717a",
                      }}
                      data-oid="ud10pnl"
                    >
                      <span
                        className="h-2 w-2 rounded-full mr-1.5"
                        style={{
                          backgroundColor:
                            orderStatuses.find(
                              (s) => s.id === Number(order.status),
                            )?.textColor || "#71717a",
                        }}
                        data-oid="eop8k5u"
                      />

                      {orderStatuses.find((s) => s.id === Number(order.status))
                        ?.name || "Неизвестный"}
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="flex-shrink-0"
                      data-oid="ygn2lnu"
                    >
                      Загрузка...
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent data-oid="6ci8p4m">
                {order.description ? (
                  <div
                    className="text-sm text-muted-foreground mb-4 line-clamp-2 quill-content"
                    data-oid="gjdtqxl"
                    dangerouslySetInnerHTML={{ __html: order.description }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    Описание не указано
                  </p>
                )}
                <div
                  className="flex justify-between items-center"
                  data-oid="nbxrlj2"
                >
                  <span className="text-sm font-semibold" data-oid="mpy0lw4">
                    Цена:{" "}
                    {order.price !== null &&
                    order.price !== undefined &&
                    String(order.price).trim() !== ""
                      ? Number(order.price).toLocaleString()
                      : "-"}{" "}
                    {/* Преобразуем ID валюты в её код */}
                    {(() => {
                      const project = projects.find((p) =>
                        typeof order.project_id === "string"
                          ? p.id === Number(order.project_id)
                          : p.id === order.project_id,
                      );

                      if (!project?.currency) return "";

                      // Если это число, получаем код валюты по ID
                      if (
                        typeof project.currency === "number" ||
                        !isNaN(Number(project.currency))
                      ) {
                        const currencyMap: Record<string, string> = {
                          "1": "USD",
                          "2": "EUR",
                          "3": "RUB",
                        };
                        const id = String(project.currency);
                        return currencyMap[id] || `Валюта ${id}`;
                      }

                      // Если это строка, преобразуем в верхний регистр
                      return String(project.currency).toUpperCase();
                    })()}
                  </span>
                  {/* Link to the new order detail page */}
                  <div className="flex items-center gap-2" data-oid="p4usj8o">
                    <Link
                      href={`/orders/${order.id}`}
                      passHref
                      data-oid="cr04r40"
                    >
                      <Button variant="outline" size="sm" data-oid="30wcg1w">
                        <Eye className="mr-2 h-4 w-4" data-oid="8cd005:" />{" "}
                        Детали
                      </Button>
                    </Link>
                    <DeleteOrderDialog
                      orderId={String(order.id)}
                      size="sm"
                      variant="outline"
                      buttonClassName="text-destructive hover:bg-destructive hover:text-destructive-foreground h-9 px-3"
                      onDeleteSuccess={() => {
                        // Обновляем список заказов после удаления
                        setOrders(orders.filter((o) => o.id !== order.id));
                      }}
                      data-oid="xauz5r-"
                    />
                  </div>
                </div>
                <p
                  className="text-xs text-muted-foreground mt-2"
                  data-oid="qkkqygq"
                >
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
          <Card className="shadow-sm border-none" data-oid="vbp_u-a">
            {" "}
            {/* Removed border */}
            <CardContent data-oid="rlpohol">
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-oid="d..ofba"
              >
                No orders found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
