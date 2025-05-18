// src/app/(app)/orders/[orderId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Clock,
  CheckCircle,
  Briefcase,
} from "lucide-react"; // Add icons relevant to orders
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/types"; // Import Order and OrderStatus types
import { useToast } from "@/hooks/use-toast";
import { getOrderStatusVariant } from "../mockOrders"; // Assuming this helper is still useful

// Helper function to get status icon (adapted for OrderStatus)
const getOrderStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "Новый":
      return <Clock className="mr-1 h-3 w-3" data-oid="71cnqv:" />;
    case "Сбор ставок":
      return <Briefcase className="mr-1 h-3 w-3" data-oid="mzm25ud" />;
    case "На паузе":
      return (
        <Clock
          className="mr-1 h-3 w-3 text-destructive-foreground"
          data-oid="q1mg5w."
        />
      );

    case "Сбор Завершен":
      return <CheckCircle className="mr-1 h-3 w-3" data-oid="q1rf9nk" />;
    case "Отменен":
      return (
        <Clock
          className="mr-1 h-3 w-3 text-destructive-foreground"
          data-oid="6w2ffx1"
        />
      );

    // Or a different icon for cancelled
    default:
      return null;
  }
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  const [orderData, setOrderData] = useState<Order | null>(null);
  const [projects, setProjects] = useState<
    { id: number; title: string; currency?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      Promise.all([fetch(`/api/orders?id=${orderId}`), fetch("/api/projects")])
        .then(async ([orderRes, projectsRes]) => {
          if (!orderRes.ok)
            throw new Error(
              `Failed to fetch order: ${orderRes.status} ${orderRes.statusText}`,
            );
          if (!projectsRes.ok)
            throw new Error(
              `Failed to fetch projects: ${projectsRes.status} ${projectsRes.statusText}`,
            );
          const orderDataRaw: Order | Order[] = await orderRes.json();
          const projectsData: {
            id: number;
            title: string;
            currency?: string;
          }[] = await projectsRes.json();
          setProjects(
            Array.isArray(projectsData)
              ? projectsData.map((p) => ({
                  id: p.id,
                  title: p.title,
                  currency: p.currency,
                }))
              : [],
          );
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
            throw new Error(`Order with ID ${orderId} not found.`);
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
          <Badge
            variant={getOrderStatusVariant(orderData.status)}
            className="flex items-center text-sm"
            data-oid="7hts4wk"
          >
            {getOrderStatusIcon(orderData.status)}
            {orderData.status}
          </Badge>
        </div>
        {userRole === "Заказчик" && ( // Assuming only Заказчик can edit for now
          <Link href={`/orders/${orderId}/edit`} passHref data-oid="vbixani">
            <Button variant="outline" data-oid="_xw12sk">
              <Edit className="mr-2 h-4 w-4" data-oid="-x11k8d" /> Edit Order
            </Button>
          </Link>
        )}
      </div>

      {/* Order Details Card */}
      <Card className="shadow-sm border-none" data-oid="0wb7znn">
        <CardHeader data-oid="b8tfn1u">
          <CardTitle data-oid="s4u7v5d">Order Overview</CardTitle>
          <CardDescription data-oid="aq.:wi-">
            {orderData.description}
          </CardDescription>
        </CardHeader>
        <CardContent
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          data-oid="zwb.:v0"
        >
          <div data-oid="gmy70.t">
            <p
              className="text-sm font-medium text-muted-foreground"
              data-oid="-yglas7"
            >
              Проект
            </p>
            <p data-oid="8:cai4q">
              {projects.find((p) => p.id === orderData.project_id)?.title ??
                `ID: ${orderData.project_id}`}
            </p>
          </div>
          <div data-oid="kklsxmj">
            <p
              className="text-sm font-medium text-muted-foreground"
              data-oid="suux2o3"
            >
              Валюта
            </p>
            <p data-oid=".:24aur">
              {projects.find((p) => p.id === orderData.project_id)?.currency ??
                "-"}
            </p>
          </div>
          <div data-oid="r2x41:3">
            <p
              className="text-sm font-medium text-muted-foreground"
              data-oid="va59_zt"
            >
              Price
            </p>
            <p data-oid="-k2erul">
              {orderData.price !== null &&
              orderData.price !== undefined &&
              orderData.price !== ""
                ? Number(orderData.price).toLocaleString()
                : "N/A"}{" "}
              {projects.find((p) => p.id === orderData.project_id)?.currency ??
                ""}
            </p>
          </div>
          <div data-oid="3wkew4-">
            <p
              className="text-sm font-medium text-muted-foreground"
              data-oid="q2paceb"
            >
              Created
            </p>
            {/* Use optional chaining and check if createdAt is a Date object */}
            <p data-oid="mcwdmav">
              {orderData.createdAt instanceof Date
                ? orderData.createdAt.toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div data-oid="065kwli">
            <p
              className="text-sm font-medium text-muted-foreground"
              data-oid=".a01w4x"
            >
              Last Updated
            </p>
            {/* Use optional chaining and check if updatedAt is a Date object */}
            <p data-oid="1rn:rpa">
              {orderData.updatedAt instanceof Date
                ? orderData.updatedAt.toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          {/* Add other relevant order details here */}
        </CardContent>
      </Card>

      {/* TODO: Add sections for Etaps, Work Positions, Bids, etc. */}
      {/* For now, just a placeholder */}
      <Card className="shadow-sm border-none" data-oid="7zhplcr">
        <CardHeader data-oid="823m6_2">
          <CardTitle data-oid="k12p:xf">Order Components</CardTitle>
          <CardDescription data-oid="_xiw1.k">
            Details about Etaps, Work Positions, and Bids will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="n:e.veb">
          <p className="text-sm text-muted-foreground" data-oid="tkbu50e">
            This section is under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
