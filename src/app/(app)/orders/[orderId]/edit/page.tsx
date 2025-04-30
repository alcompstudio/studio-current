// src/app/(app)/orders/[orderId]/edit/page.tsx
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order, OrderStatus } from "@/lib/types";
import { mockOrders } from '../../mockOrders'; // Import mock order data
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label'; // Import Label

// Define order statuses
const orderStatuses: OrderStatus[] = ["Новый", "Сбор ставок", "На паузе", "Сбор Завершен", "Отменен"];

// Define the form schema using Zod
const orderFormSchema = z.object({
    name: z.string().min(1, { message: "Order name is required." }),
    description: z.string().optional(),
    status: z.enum(orderStatuses, { required_error: "Status is required." }),
    // Add other editable fields if needed, e.g., budget, currency if they are order-specific
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function OrderEditPage() {
    const params = useParams<{ orderId: string }>();
    const orderId = params?.orderId;
    const router = useRouter();
    const { toast } = useToast();

    const [order, setOrder] = React.useState<Order | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            name: "",
            description: "",
            status: undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (orderId) {
            // Simulate fetching order data
            const foundOrder = mockOrders.find(o => o.id === orderId);
            if (foundOrder) {
                setOrder(foundOrder);
                form.reset({
                    name: foundOrder.name,
                    description: foundOrder.description || "",
                    status: foundOrder.status,
                });
            } else {
                 console.error(`Order with ID ${orderId} not found in mock data.`);
                 toast({
                     title: "Error",
                     description: `Order with ID ${orderId} not found.`,
                     variant: "destructive",
                 });
                 router.replace('/orders');
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            console.error("Order ID is missing.");
             toast({
                 title: "Error",
                 description: "Order ID is missing from the URL.",
                 variant: "destructive",
             });
            router.replace('/orders');
        }
    }, [orderId, form, router, toast]);

    const onSubmit = (data: OrderFormValues) => {
        if (!orderId || !order) {
             toast({
                title: "Error Saving",
                description: "Cannot save changes. Order ID or data is missing.",
                variant: "destructive",
            });
            return;
        }

        console.log("Attempting to save changes for order:", orderId, data);

        const orderIndex = mockOrders.findIndex(o => o.id === orderId);

        if (orderIndex !== -1) {
            // Update the order in the mock array
            mockOrders[orderIndex] = {
                ...mockOrders[orderIndex],
                ...data,
                updatedAt: new Date(),
            };

            console.log("Updated mockOrders:", mockOrders);

            toast({
                title: "Order Updated",
                description: `Changes for "${data.name}" have been saved (mock).`,
            });

            router.push(`/orders/${orderId}`); // Redirect back to detail page
        } else {
             toast({
                title: "Error Saving",
                description: `Could not find order with ID ${orderId} to update.`,
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading order details...</div>;
    }

    if (!order) {
        return <div className="flex min-h-screen items-center justify-center">Order not found or ID missing. Redirecting...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Link href={`/orders/${orderId}`} passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Order: {form.watch('name') || order.name}</h2>
                </div>
                 <Button type="submit" form="order-edit-form" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                 </Button>
            </div>

            {/* Edit Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Update the order information below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                         <form
                            id="order-edit-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                         >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Order Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter order name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the order..."
                                                className="min-h-[100px]"
                                                {...field}
                                                value={field.value ?? ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {orderStatuses.map(status => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             {/* Read-only fields */}
                             <div>
                                <Label>Project</Label>
                                <Link href={`/projects/${order.projectId}`} className="text-sm text-primary hover:underline block mt-1">
                                    {order.projectName || 'View Project'}
                                </Link>
                            </div>
                             <div>
                                <Label>Estimated Price</Label>
                                <p className="text-sm text-muted-foreground mt-1">{order.currency} {order.totalCalculatedPrice?.toLocaleString() || 'N/A'}</p>
                            </div>
                         </form>
                    </Form>
                </CardContent>
            </Card>

             {/* TODO: Add sections for managing Etaps and Options if needed */}
             <Card>
                <CardHeader>
                    <CardTitle>Stages & Options</CardTitle>
                    <CardDescription>Manage stages (etaps) and options for this order.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Stage and option management UI goes here.</p>
                    {/* Add components to list, add, edit, delete Etaps and Options */}
                </CardContent>
             </Card>
        </div>
    );
}
