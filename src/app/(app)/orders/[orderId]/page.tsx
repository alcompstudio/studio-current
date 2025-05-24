// src/app/(app)/orders/[orderId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Order } from "@/lib/types"; 
import type { OrderStatusOS } from "@/lib/types/order";
import { useToast } from "@/hooks/use-toast";
import { DeleteOrderDialog } from "@/components/orders/delete-order-dialog";
import OrderDetailsTabs from "./order-details-tabs"; // Импортируем компонент с вкладками

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  const [orderData, setOrderData] = useState<Order | null>(null);
  const [projects, setProjects] = useState<
    { id: number; title: string; currency?: string }[]
  >([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusOS[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      Promise.all([
        fetch(`/api/orders?id=${orderId}`), 
        fetch("/api/projects"),
        fetch("/api/order-statuses-os")
      ])
        .then(async ([orderRes, projectsRes, statusesRes]) => {
          if (!orderRes.ok)
            throw new Error(
              `Ошибка загрузки заказа: ${orderRes.status} ${orderRes.statusText}`,
            );
          if (!projectsRes.ok)
            throw new Error(
              `Ошибка загрузки проектов: ${projectsRes.status} ${projectsRes.statusText}`,
            );
          if (!statusesRes.ok)
            throw new Error(
              `Ошибка загрузки статусов: ${statusesRes.status} ${statusesRes.statusText}`,
            );
            
          const orderDataRaw: Order | Order[] = await orderRes.json();
          const projectsData: {
            id: number;
            title: string;
            currency?: string;
          }[] = await projectsRes.json();
          const statusesData: OrderStatusOS[] = await statusesRes.json();
          
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
          
          const order = Array.isArray(orderDataRaw)
            ? orderDataRaw[0]
            : orderDataRaw;
          if (order) {
            const orderWithFormattedDates = {
              ...order,
              createdAt: order.createdAt ? new Date(order.createdAt) : null,
              updatedAt: order.updatedAt ? new Date(order.updatedAt) : null,
            };
            setOrderData(orderWithFormattedDates as Order);
          } else {
            throw new Error(`Заказ с ID ${orderId} не найден.`);
          }
        })
        .catch((error) => {
          console.error("Error fetching order data or projects:", error);
          toast({
            title: "Error",
            description: `Could not load order with ID ${orderId}. ${error.message}`,
            variant: "destructive",
          });
          router.replace("/orders");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Order ID is missing.",
        variant: "destructive",
      });
      router.replace("/orders");
    }
  }, [orderId, toast, router]);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        data-oid="rklyqub"
      >
        Loading order...
      </div>
    );
  }

  if (!orderData) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        data-oid="4v7sl.m"
      >
        Order not found or ID missing. Redirecting...
      </div>
    );
  }

  const userRole = "Заказчик"; // Mock role

  return (
    <div className="flex flex-col gap-6" data-oid="piqkv00">
      {/* Header */}
      <div className="flex items-center justify-between" data-oid="4.wd1k5">
        <div className="flex items-center gap-4" data-oid="rkzi4-2">
          <Link href="/orders" passHref data-oid="91byhoh">
            <Button variant="outline" size="icon" data-oid="rtwq3cg">
              <ArrowLeft className="h-4 w-4" data-oid="hhbpn_f" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" data-oid="nw.7b:-">
            {orderData.title}
          </h2>
        </div>
        {userRole === "Заказчик" && (
          <div className="flex items-center gap-2">
            <Link href={`/orders/${orderId}/edit`} passHref data-oid="vbixani">
              <Button variant="outline" data-oid="_xw12sk">
                <Edit className="mr-2 h-4 w-4" data-oid="-x11k8d" /> Редактировать
              </Button>
            </Link>
            <DeleteOrderDialog 
              orderId={orderId} 
              size="icon"
              buttonClassName="h-10 w-10 rounded-full border border-input bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors"
            />
          </div>
        )}
      </div>

      {/* Компонент с вкладками */}
      <OrderDetailsTabs 
        order={orderData} 
        orderStatuses={orderStatuses} 
        projects={projects} 
      />
    </div>
  );
}
