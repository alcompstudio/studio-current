// src/app/(app)/orders/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order, OrderStatus } from "@/lib/types"; // Import Order and OrderStatus types
import { useToast } from "@/hooks/use-toast";

// Define order statuses and currencies (should match backend/types)
const orderStatuses: OrderStatus[] = ["Новый", "Сбор ставок", "На паузе", "Сбор Завершен", "Отменен"];
const orderFormSchema = z.object({
    title: z.string().min(1, { message: "Order title is required." }),
    description: z.string().optional(),
    project_id: z.coerce.number({ required_error: "Project ID is required." }).positive({ message: "Project ID must be a positive number." }),
    status: z.enum(orderStatuses as [OrderStatus, ...OrderStatus[]], { required_error: "Status is required." }).default("Новый"),
    price: z.coerce.number().positive({ message: "Price must be a positive number." }).optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function OrderCreatePage() {
    const router = useRouter();
    const { toast } = useToast();

    // Initialize the form with defaults
    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            title: "",
            description: "",
            project_id: undefined,
            status: "Новый",
            price: undefined,
        },
        mode: "onChange",
    });

    const [projects, setProjects] = useState<{ id: number; title: string; currency?: string }[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

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

    const onSubmit = async (data: OrderFormValues) => {
        console.log("Form data:", data);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create order: ${response.statusText}`);
            }

            const newOrder = await response.json();
            console.log("Order created successfully:", newOrder);

            toast({
                title: "Order Created",
                description: `Order "${data.title}" has been successfully created.`,
            });

            router.push(`/orders`);
            router.refresh();
        } catch (error) {
            console.error("Failed to create order:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast({
                title: "Error Creating Order",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

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
                    <h2 className="text-2xl font-bold tracking-tight">Create New Order</h2>
                </div>
                 <Button type="submit" form="order-create-form" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Create Order</>}
                 </Button>
            </div>

            {/* Create Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Enter the details for the new order.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                         <form
                            id="order-create-form"
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
                                                             value={field.value ?? ''}
                                                             onChange={e => {
                                                                const value = e.target.value;
                                                                field.onChange(value === '' ? undefined : parseFloat(value));
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
