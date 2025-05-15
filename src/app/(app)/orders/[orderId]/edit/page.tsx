// src/app/(app)/orders/[orderId]/edit/page.tsx

"use client";

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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Order, OrderStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// Define order statuses (should match backend/types)
const orderStatuses: OrderStatus[] = ["Новый", "Сбор ставок", "На паузе", "Сбор Завершен", "Отменен"];

// Define the form schema using Zod
const orderFormSchema = z.object({
    title: z.string().min(1, { message: "Order title is required." }),
    description: z.string().nullable().optional(),
    project_id: z.coerce.number({ required_error: "Project ID is required." }).positive({ message: "Project ID must be a positive number." }),
    status: z.enum(orderStatuses as [OrderStatus, ...OrderStatus[]], { required_error: "Status is required." }),
    price: z.preprocess(
        (val) => (val === '' ? null : Number(val)),
        z.number().positive({ message: "Price must be a positive number." }).nullable().optional()
    ),
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
            title: "",
            description: "",
            project_id: undefined,
            status: "Новый",
            price: null,
        },
        mode: "onChange",
    });

    const [projects, setProjects] = React.useState<{ id: number; title: string; currency?: string }[]>([]);
    const [loadingProjects, setLoadingProjects] = React.useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch('/api/projects');
                if (!res.ok) throw new Error('Ошибка загрузки проектов');
                const data = await res.json();
                setProjects(Array.isArray(data) ? data.map((p) => ({
                    id: p.id,
                    title: p.title,
                    currency: p.currency
                })) : []);
            } catch (e) {
                setProjects([]);
            } finally {
                setLoadingProjects(false);
            }
        }
        fetchProjects();
    }, []);

    useEffect(() => {
        if (orderId) {
            setIsLoading(true);
            fetch(`/api/orders?id=${orderId}`)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                            throw new Error(errData.message || `Failed to fetch order: ${res.status}`);
                        }).catch(() => {
                            throw new Error(`Failed to fetch order: ${res.status} ${res.statusText}`);
                        });
                    }
                    return res.json();
                })
                .then((data: Order | Order[]) => {
                    const orderData = Array.isArray(data) ? data[0] : data;
                    if (orderData) {
                        setOrder(orderData);
                        const priceValue = (typeof orderData.price === 'string' && !isNaN(parseFloat(orderData.price))) ? parseFloat(orderData.price) : (orderData.price === null || orderData.price === undefined ? null : Number(orderData.price));
                        const projectIdValue = (typeof orderData.project_id === 'string' && !isNaN(parseInt(orderData.project_id, 10))) ? parseInt(orderData.project_id, 10) : (orderData.project_id === null || orderData.project_id === undefined ? undefined : Number(orderData.project_id));
                        form.reset({
                            title: orderData.title || "",
                            description: orderData.description || "",
                            project_id: projectIdValue,
                            status: orderData.status as OrderFormValues['status'] || "Новый",
                            price: priceValue,
                        });
                    } else {
                         throw new Error(`Order with ID ${orderId} not found.`);
                    }
                })
                .catch(error => {
                    console.error("Error fetching order data for edit:", error);
                    toast({
                        title: "Error Loading Order",
                        description: error.message || "Could not load order data.",
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
                description: "Order ID is missing from the URL.",
                variant: "destructive",
            });
            router.replace('/orders');
        }
    }, [orderId, form, router, toast]);

    const onSubmit = async (data: OrderFormValues) => {
        if (!orderId) {
             toast({
                title: "Error Saving",
                description: "Order ID is missing. Cannot save changes.",
                variant: "destructive",
            });
            return;
        }

        const dataToSend = {
            id: orderId,
            ...data,
            price: data.price === undefined || data.price === null || isNaN(Number(data.price)) ? null : Number(data.price),
        };

        try {
            const response = await fetch(`/api/orders`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Failed to update order: ${response.statusText} (${response.status})` }));
                throw new Error(errorData.message || `Failed to update order: ${response.statusText} (${response.status})`);
            }

            const updatedOrder = await response.json();
            toast({
                title: "Order Updated",
                description: `Changes for "${data.title}" have been successfully saved.`,
            });

            router.push(`/orders/${orderId}`);
            router.refresh();

        } catch (error) {
            console.error("Failed to update order:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast({
                title: "Error Saving Order",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
         return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
         return (
            <div className="flex justify-center items-center min-h-[300px]">
                 <p className="text-destructive">Could not load order details.</p>
            </div>
        );
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
                    <h2 className="text-2xl font-bold tracking-tight">Edit Order: {order.title}</h2>
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Order Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter order title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="project_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Проект</FormLabel>
                                        <FormControl>
                                            <Select
                                                disabled={loadingProjects}
                                                onValueChange={value => field.onChange(value === '' ? undefined : Number(value))}
                                                value={field.value ? String(field.value) : ''}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={loadingProjects ? "Загрузка..." : "Выберите проект"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {projects.map((project) => (
                                                        <SelectItem key={project.id} value={String(project.id)}>
                                                            {project.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>Выберите проект, к которому относится заказ.</FormDescription>
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

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                                 <FormField
                                     control={form.control}
                                     name="price"
                                     render={({ field }) => {
                                         const selectedProject = projects.find(p => p.id === form.watch("project_id"));
                                         return (
                                             <FormItem>
                                                 <FormLabel>Price</FormLabel>
                                                 <FormControl>
                                                     <div className="flex items-center gap-2">
                                                         <Input
                                                             type="number"
                                                             placeholder="Enter order price"
                                                             step="0.01"
                                                             {...field}
                                                             value={field.value === null || field.value === undefined ? "" : field.value}
                                                             onChange={e => {
                                                                const value = e.target.value;
                                                                field.onChange(value === '' ? null : parseFloat(value));
                                                              }}
                                                         />
                                                         <span className="text-muted-foreground">
                                                             {selectedProject?.currency ?? ""}
                                                         </span>
                                                     </div>
                                                 </FormControl>
                                                 <FormMessage />
                                             </FormItem>
                                         );
                                     }}
                                 />
                             </div>
                         </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
