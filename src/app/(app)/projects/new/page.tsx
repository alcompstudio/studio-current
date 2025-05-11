// src/app/(app)/projects/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import type { Project } from "@/lib/types"; // Assuming Project type exists
// import { mockProjects } from '../mockProjects'; // Corrected import path - REMOVE MOCK
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Define project statuses and currencies (same as edit page)
const projectStatuses = ["Planning", "In Progress", "On Hold", "Completed", "Archived"] as const;
const projectCurrencies = ["USD", "EUR", "RUB"] as const;

// Define the form schema using Zod (same as edit page, but client might be different)
const projectFormSchema = z.object({
    name: z.string().min(1, { message: "Project name is required." }),
    description: z.string().optional(),
    status: z.enum(projectStatuses, { required_error: "Status is required." }).default("Planning"), // Default to Planning
    currency: z.enum(projectCurrencies, { required_error: "Currency is required." }).default("USD"), // Default to USD
    budget: z.coerce.number().positive({ message: "Budget must be a positive number." }).optional(),
    // clientName: z.string().min(1, { message: "Client name is required." }), // Keep if you want to send it
    // clientId: z.string().min(1, { message: "Client ID is required (mock)" }), // Keep if you want to send it and backend handles it
    // For now, let's assume customerId will be selected or handled differently.
    // If your API expects customerId, you'll need a way to select/input it.
    // For simplicity, I'll remove clientName and clientId from direct form submission for now,
    // assuming the backend might handle customer association differently or it's not a direct creation field.
    // If they ARE required by your POST /api/projects, re-add them and ensure your API handles them.
    // customerId: z.string().min(1, { message: "Customer ID is required." }) // REMOVED: Will be added automatically
});

// Тип данных формы теперь не включает customerId
type ProjectFormValues = Omit<z.infer<typeof projectFormSchema>, 'customerId'>;

export default function ProjectCreatePage() {
    const router = useRouter(); // Initialize useRouter
    const { toast } = useToast(); // Initialize useToast
    // Состояние для хранения customerId (предполагаем, что это число)
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Load user data (including customerId) from localStorage on mount
    useEffect(() => {
        setIsLoadingUser(true);
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            try {
                const userAuthData = JSON.parse(storedUser);
                // Ожидаем, что customerId был сохранен при логине/регистрации
                if (userAuthData && typeof userAuthData.customerId === 'number') {
                    setCustomerId(userAuthData.customerId);
                    console.log(`[ProjectCreatePage] Customer ID loaded from localStorage: ${userAuthData.customerId}`);
                } else {
                     console.error("[ProjectCreatePage] customerId not found or not a number in localStorage.", userAuthData);
                     // Возможно, пользователь - не Заказчик, или произошла ошибка при логине/регистрации
                     toast({ title: "User Profile Error", description: "Could not find necessary customer profile ID.", variant: "destructive" });
                     // Здесь можно перенаправить на дашборд или другую страницу
                     // router.push('/dashboard'); 
                }
            } catch (error) {
                console.error("[ProjectCreatePage] Failed to parse user from localStorage", error);
                toast({ title: "Error", description: "Failed to load user data.", variant: "destructive" });
            }
        } else {
            console.warn("[ProjectCreatePage] No user found in localStorage.");
            toast({ title: "Not Logged In", description: "Please log in to create a project.", variant: "destructive" });
            // Перенаправляем на логин, если пользователь не найден
            router.push('/auth'); 
        }
        setIsLoadingUser(false);
    }, [router, toast]); // Добавили router обратно, так как используем его для редиректа


    // Initialize the form with defaults
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "Planning",
            currency: "USD",
            budget: undefined,
            // clientName: "", 
            // clientId: "",   
            // customerId: "", // REMOVED: No longer part of the form schema/defaults
        },
        mode: "onChange",
    });

    const onSubmit = async (data: ProjectFormValues) => { 
        // Проверяем, загружен ли customerId
        if (customerId === null) {
            toast({ title: "Error", description: "Customer ID not available. Cannot create project.", variant: "destructive" });
            console.error("Submit prevented: customerId is null");
            return; 
        }

        console.log("Form data before adding customerId:", data);

        const dataToSend = {
            ...data,
            // API ожидает customerId, берем его из состояния currentUser
            // *** ВАЖНО: Убедитесь, что тип currentUser.id (string/number) соответствует ожиданиям API! ***
            // customerId теперь берется из состояния, которое уже должно быть числом
            customerId: customerId 
        };

        console.log("Attempting to create project with dataToSend:", dataToSend);
        // form.formState.isSubmitting = true; // REMOVED: react-hook-form handles this automatically

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                 // Отправляем данные с добавленным customerId
                body: JSON.stringify(dataToSend), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create project: ${response.statusText}`);
            }

            const newProject = await response.json();
            console.log("Project created successfully:", newProject);

            toast({
                title: "Project Created",
                description: `Project "${data.name}" has been successfully created.`,
            });

            // Redirect back to the project list page
            router.push(`/projects`);
            router.refresh(); // Refresh to show the new project in the list

        } catch (error) {
            console.error("Failed to create project:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast({
                title: "Error Creating Project",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            // form.formState.isSubmitting = false; // REMOVED: react-hook-form handles this automatically
        }
    };

    // Показываем индикатор загрузки, пока читаем localStorage
    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p>Loading user data...</p> 
            </div>
        );
    }

    // Если customerId не был найден или установлен (ошибка уже была показана через toast)
    if (customerId === null) {
         return (
            <div className="flex justify-center items-center min-h-[300px]">
                 <p className="text-destructive">Could not load customer profile ID. Cannot create project.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Link href="/projects" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">Create New Project</h2>
                </div>
                 <Button type="submit" form="project-create-form" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Create Project</>}
                 </Button>
            </div>

            {/* Create Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Enter the details for the new project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                         <form
                            id="project-create-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                         >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter project name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             {/* Remove Client Name Input if not used or handled by customerId */}
                             {/* <FormField
                                control={form.control}
                                name="clientName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter client name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            {/* Remove Client ID Input if not used or handled by customerId */}
                            {/* <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client ID (Mock)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter client ID (e.g., client_1)" {...field} />
                                        </FormControl>
                                        <FormDescription>For mock data purposes.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            {/* REMOVED Customer ID input field */}
                            {/* <FormField ... name="customerId" ... /> */}

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the project..."
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
                                                    {projectStatuses.map(status => (
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
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Currency</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select currency" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                     {projectCurrencies.map(currency => (
                                                        <SelectItem key={currency} value={currency}>
                                                            {currency}
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
                                     name="budget"
                                     render={({ field }) => (
                                         <FormItem>
                                             <FormLabel>Budget</FormLabel>
                                             <FormControl>
                                                 <Input
                                                     type="number"
                                                     placeholder="Enter budget amount"
                                                     step="0.01"
                                                     {...field}
                                                     value={field.value ?? ''}
                                                     onChange={e => {
                                                        const value = e.target.value;
                                                        field.onChange(value === '' ? undefined : parseFloat(value));
                                                      }}
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                         </FormItem>
                                     )}
                                 />
                             </div>
                            {/* Submit button is now in the header */}
                         </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
