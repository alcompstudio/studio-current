// src/app/(app)/orders/[orderId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, DollarSign, Clock, CheckCircle, Briefcase } from "lucide-react"; // Add icons relevant to orders
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import type { Order, OrderStatus } from "@/lib/types"; // Import Order and OrderStatus types
import { useToast } from "@/hooks/use-toast";
import { getOrderStatusVariant } from '../mockOrders'; // Assuming this helper is still useful

// Helper function to get status icon (adapted for OrderStatus)
const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case "Новый": return <Clock className="mr-1 h-3 w-3" />;
        case "Сбор ставок": return <Briefcase className="mr-1 h-3 w-3" />;
        case "На паузе": return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />;
        case "Сбор Завершен": return <CheckCircle className="mr-1 h-3 w-3" />;
        case "Отменен": return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />; // Or a different icon for cancelled
        default: return null;
    }
};


export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams<{ orderId: string }>();
    const orderId = params?.orderId;

    const [orderData, setOrderData] = useState<Order | null>(null);
    const [projects, setProjects] = useState<{ id: number; title: string; currency?: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (orderId) {
            setIsLoading(true);
            Promise.all([
                fetch(`/api/orders?id=${orderId}`),
                fetch('/api/projects')
            ])
                .then(async ([orderRes, projectsRes]) => {
                    if (!orderRes.ok) throw new Error(`Failed to fetch order: ${orderRes.status} ${orderRes.statusText}`);
                    if (!projectsRes.ok) throw new Error(`Failed to fetch projects: ${projectsRes.status} ${projectsRes.statusText}`);
                    const orderDataRaw: Order | Order[] = await orderRes.json();
                    const projectsData: { id: number; title: string; currency?: string }[] = await projectsRes.json();
                    setProjects(Array.isArray(projectsData) ? projectsData.map(p => ({ id: p.id, title: p.title, currency: p.currency })) : []);
                    const order = Array.isArray(orderDataRaw) ? orderDataRaw[0] : orderDataRaw;
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
                .catch(error => {
                    console.error("Error fetching order data or projects:", error);
                    toast({
                        title: "Error",
                        description: `Could not load order with ID ${orderId}. ${error.message}`,
                        variant: "destructive",
                    });
                    router.replace('/orders');
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
            router.replace('/orders');
        }
    }, [orderId, toast, router]);

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading order...</div>;
    }

    if (!orderData) {
        return <div className="flex min-h-screen items-center justify-center">Order not found or ID missing. Redirecting...</div>;
    }

    const userRole = "Заказчик"; // Mock role

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Link href="/orders" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">{orderData.title}</h2>
                     <Badge variant={getOrderStatusVariant(orderData.status)} className="flex items-center text-sm">
                         {getOrderStatusIcon(orderData.status)}
                         {orderData.status}
                    </Badge>
                </div>
                {userRole === "Заказчик" && ( // Assuming only Заказчик can edit for now
                    <Link href={`/orders/${orderId}/edit`} passHref>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Order
                        </Button>
                    </Link>
                )}
            </div>

            {/* Order Details Card */}
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle>Order Overview</CardTitle>
                    <CardDescription>{orderData.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Проект</p>
                        <p>
                            {projects.find(p => p.id === orderData.project_id)?.title ?? `ID: ${orderData.project_id}`}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Валюта</p>
                        <p>
                            {projects.find(p => p.id === orderData.project_id)?.currency ?? '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Price</p>
                        <p>
                            {orderData.price !== null && orderData.price !== undefined && orderData.price !== ''
                                ? Number(orderData.price).toLocaleString()
                                : "N/A"} {projects.find(p => p.id === orderData.project_id)?.currency ?? ''}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Created</p>
                        {/* Use optional chaining and check if createdAt is a Date object */}
                        <p>{orderData.createdAt instanceof Date ? orderData.createdAt.toLocaleDateString() : 'N/A'}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                         {/* Use optional chaining and check if updatedAt is a Date object */}
                        <p>{orderData.updatedAt instanceof Date ? orderData.updatedAt.toLocaleDateString() : 'N/A'}</p>
                    </div>
                    {/* Add other relevant order details here */}
                </CardContent>
            </Card>

            {/* TODO: Add sections for Etaps, Work Positions, Bids, etc. */}
            {/* For now, just a placeholder */}
             <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle>Order Components</CardTitle>
                    <CardDescription>Details about Etaps, Work Positions, and Bids will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This section is under development.</p>
                </CardContent>
            </Card>

        </div>
    );
}
