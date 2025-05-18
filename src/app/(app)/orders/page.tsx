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
import type { Order } from "@/lib/types"; // Import Order type
import Link from "next/link";
import { getOrderStatusVariant } from "./mockOrders"; // Import only the helper
import { cn } from "@/lib/utils"; // Import cn for conditional classes

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRole = "Заказчик";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, projectsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/projects"),
        ]);
        if (!ordersRes.ok)
          throw new Error(`Error fetching orders: ${ordersRes.statusText}`);
        if (!projectsRes.ok)
          throw new Error(`Error fetching projects: ${projectsRes.statusText}`);
        const ordersData: Order[] = await ordersRes.json();
        const projectsData: { id: number; title: string; currency?: string }[] =
          await projectsRes.json();
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
      } catch (err) {
        console.error("Failed to fetch orders or projects:", err);
        setError("Failed to load orders or projects.");
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
        {userRole === "Заказчик" && (
          <Link href="/orders/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Order
            </Button>
          </Link>
        )}
        {userRole === "Исполнитель" && (
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
                  <Badge
                    variant={getOrderStatusVariant(order.status)}
                    className="flex-shrink-0"
                  >
                    {order.status}
                  </Badge>
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
                    order.price !== ""
                      ? Number(order.price).toLocaleString()
                      : "-"}{" "}
                    {projects.find((p) => p.id === order.project_id)
                      ?.currency ?? ""}
                  </span>
                  {/* Link to the new order detail page */}
                  <Link href={`/orders/${order.id}`} passHref>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </Link>
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
