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
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ViewToggle } from "@/components/status/view-toggle";
import { StatusTable } from "@/components/status/status-table";

// Тип для статуса заказа
interface OrderStatus {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  // Возможно, другие поля, такие как порядок сортировки, описание и т.д.
}

export default function OrderStatusesPage() {
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "table">("table"); // По умолчанию - табличный вид

  useEffect(() => {
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

    fetchOrderStatuses();
  }, []);

  // TODO: Implement delete functionality
  const handleDelete = async (statusId: number) => {
    console.log(`Delete order status with id: ${statusId}`);
    // Optimistically remove from UI or refetch
    // setOrderStatuses(orderStatuses.filter(status => status.id !== statusId));
  };

  return (
    <div className="flex flex-col gap-6" data-oid="mg6magh">
      {/* Page Header */}
      <div className="flex items-center justify-between" data-oid="21wiymb">
        <div data-oid="d8h80s-">
          <h1 className="text-xl font-semibold" data-oid="5su6mx4">
            Статусы заказов
          </h1>
          <p className="text-sm text-muted-foreground" data-oid="i8hrstp">
            Управление различными статусами для ваших заказов.
          </p>
        </div>
        <div className="flex gap-2" data-oid="mng55ra">
          <ViewToggle view={view} onViewChange={setView} data-oid="i1pl00k" />
          <Button asChild data-oid="2eglgpl">
            <Link href="/settings/order-statuses/new" data-oid="-8no3vk">
              <Plus className="w-4 h-4 mr-2" data-oid="eb.xevq" /> Создать
              статус заказа
            </Link>
          </Button>
        </div>
      </div>

      {/* Status List Content */}
      <div data-oid="99oe5ad">
        {isLoading && (
          <Card className="shadow-sm border-none" data-oid="t8z45gb">
            <CardContent
              className="flex items-center justify-center gap-2 py-6 text-muted-foreground"
              data-oid="3tptpnu"
            >
              <Loader2 className="h-5 w-5 animate-spin" data-oid="w3y44k3" />
              <p data-oid="nxp1vos">Загрузка статусов заказов...</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card
            className="shadow-sm border-destructive bg-destructive/10"
            data-oid="-oarw7s"
          >
            <CardContent
              className="flex items-center gap-2 text-destructive py-4"
              data-oid="qs7a7fj"
            >
              <AlertTriangle className="h-5 w-5" data-oid="y.iulym" />
              <p className="text-sm font-semibold" data-oid="_-ykxra">
                Ошибка загрузки статусов заказов: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          !error &&
          (view === "table" ? (
            <Card data-oid="7b07v36">
              <StatusTable
                items={orderStatuses}
                basePath="/settings/order-statuses"
                onDelete={handleDelete}
                data-oid="oznwbcs"
              />
            </Card>
          ) : (
            <div className="space-y-4" data-oid="0oa9rjx">
              {orderStatuses.length > 0 ? (
                orderStatuses.map((status) => (
                  <Card
                    key={status.id}
                    className="shadow-sm hover:shadow-md transition-shadow border-none"
                    data-oid="1khgdol"
                  >
                    <CardHeader className="pb-3" data-oid="0qj4ufe">
                      <div
                        className="flex justify-between items-start"
                        data-oid="i1qjh8v"
                      >
                        <CardTitle
                          className="text-lg font-semibold flex items-center"
                          data-oid="let.49h"
                        >
                          <ShoppingCart
                            className="mr-2 h-5 w-5"
                            style={{ color: status.textColor }}
                            data-oid="h2_ufpv"
                          />

                          {status.name}
                        </CardTitle>
                        <div
                          className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex items-center"
                          style={{
                            backgroundColor: status.backgroundColor,
                            color: status.textColor,
                            borderColor: status.textColor,
                          }}
                          data-oid="hfpr-gx"
                        >
                          {status.name}
                        </div>
                      </div>
                      <CardDescription data-oid="88bdboa">
                        ID: {status.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="r:2iplb">
                      <div
                        className="flex items-center gap-2"
                        data-oid="dazjw56"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          data-oid="e67abog"
                        >
                          <Link
                            href={`/settings/order-statuses/${status.id}/edit`}
                            data-oid="tv8qvmk"
                          >
                            <Edit3
                              className="mr-1 h-3.5 w-3.5"
                              data-oid="yav:crm"
                            />{" "}
                            Редактировать
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(status.id)}
                          data-oid="hauwvb9"
                        >
                          <Trash2
                            className="mr-1 h-3.5 w-3.5"
                            data-oid="wyein.-"
                          />{" "}
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-sm border-none" data-oid=":-bz85j">
                  <CardContent data-oid="vr0kka9">
                    <p
                      className="text-sm text-muted-foreground py-4 text-center"
                      data-oid=":632evh"
                    >
                      Статусы заказов не найдены. Создайте статус, чтобы начать
                      работу.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
