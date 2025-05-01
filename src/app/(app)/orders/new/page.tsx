'use client'; // Add this directive

import React from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderStatus } from "@/lib/types";
import { mockOrders } from '../mockOrders'; // Corrected import path
import { useToast } from "@/hooks/use-toast";
// import { Label } from '@/components/ui/label'; // Not needed for new order form readonly fields

// Define order statuses (might pre-select 'Новый' for a new order)
const orderStatuses: OrderStatus[] = ["Новый", "Сбор ставок", "На паузе", "Сбор Завершен", "Отменен"];

// Define the form schema using Zod - similar to edit but for creation
const orderFormSchema = z.object({
    name: z.string().min(1, { message: "Order name is required." }),
    description: z.string().optional(),
    // Status might default to 'Новый' but can be part of the form
    status: z.enum(orderStatuses, { required_error: "Status is required." }).default('Новый'),
    // Add fields needed for creating an order, e.g., projectId if linking to a project
    // projectId: z.string().min(1, { message: "Project selection is required." }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function NewOrderPage() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            name: "",
            description: "",
            status: 'Новый', // Default status for new orders
            // projectId: "", // Default for project selection if added
        },
        mode: "onChange",
    });

    const onSubmit = (data: OrderFormValues) => {
        console.log("Attempting to create new order with data:", data);

        // --- Simulate creating a new order (replace with API call in real app) ---
        const newOrderId = Date.now().toString(); // Simple unique ID for mock
        const newOrder = {
            id: newOrderId,
            name: data.name,
            description: data.description || '',
            status: data.status,
            createdAt: new Date(),
            updatedAt: new Date(),
            // Add other default fields or fields from form (e.g., projectId)
            projectId: "mock-project-id", // Link to a mock project or make selectable
            projectName: "Mock Project Name", // Add project name or make selectable
            currency: "USD", // Default currency
            totalCalculatedPrice: 0, // Initial price
            // Add other necessary fields based on Order type
            // tasks: [], // Assuming tasks might not be defined here initially
            // bids: [], // Assuming bids might not be defined here initially
            // files: [], // Assuming files might not be defined here initially
            // messages: [], // Assuming messages might not be defined here initially
            // etaps: [], // Assuming etaps might not be defined here initially
            // options: [], // Assuming options might not be defined here initially
        };

        mockOrders.push(newOrder as any); // Add the new order to the mock array (cast to any for mock)

        console.log("Created new mock order:", newOrder);
        console.log("Updated mockOrders:", mockOrders);
        // ----------------------------------------------------------------------

        toast({
            title: "Order Created",
            description: `New order "${data.name}" has been created (mock).`,
        });

        // Redirect to the detail page of the newly created order
        router.push(`/orders/${newOrderId}`);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    {/* Link back to the orders list */}
                    <Link href={'/orders'} passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">Create New Order</h2>
                </div>
                 <Button type="submit" form="new-order-form" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating...' : <><Save className="mr-2 h-4 w-4" /> Create Order</>}
                 </Button>
            </div>

            {/* New Order Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Fill in the details for the new order.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                         <form
                            id="new-order-form"
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

                             {/* Add other fields needed for creating an order, e.g., Project Select */}

                         </form>
                    </Form>
                </CardContent>
            </Card>

             {/* Stages & Options - Typically managed after initial creation */}
             <Card>
                <CardHeader>
                    <CardTitle>Stages & Options</CardTitle>
                    <CardDescription>Stages and options can be managed after the order is created.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Please create the order first to manage stages and options.</p>
                </CardContent>
             </Card>
        </div>
    );
}
