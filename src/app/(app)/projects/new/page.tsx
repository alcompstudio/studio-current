// src/app/(app)/projects/new/page.tsx
'use client';

import React from 'react';
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
import { mockProjects } from '../mockProjects'; // Corrected import path
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
    clientName: z.string().min(1, { message: "Client name is required." }), // Add client name input for creation
    clientId: z.string().min(1, { message: "Client ID is required (mock)" }), // Add client ID input for creation (mock)
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectCreatePage() {
    const router = useRouter(); // Initialize useRouter
    const { toast } = useToast(); // Initialize useToast

    // Initialize the form with defaults
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "Planning",
            currency: "USD",
            budget: undefined,
            clientName: "", // Add default for clientName
            clientId: "", // Add default for clientId
        },
        mode: "onChange",
    });

    const onSubmit = (data: ProjectFormValues) => {
        console.log("Attempting to create project with data:", data);

        // Generate a unique ID for the new project (simple example)
        const newProjectId = `proj_${Date.now()}`;

        // Create the new project object
        const newProject: Project = {
            ...data,
            id: newProjectId,
            createdAt: new Date(),
            updatedAt: new Date(),
            // Ensure budget is number or undefined
            budget: data.budget ? Number(data.budget) : undefined,
        };

        // Add the new project to the mock array (in-memory update)
        mockProjects.push(newProject);

        console.log("Updated mockProjects:", mockProjects);

        toast({
            title: "Project Created",
            description: `Project "${data.name}" has been created (mock).`,
        });

        // Redirect back to the project list page
        router.push(`/projects`); // Redirect to the list
        // Optional: router.refresh() if needed, but might not be necessary for mock data push
    };

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

                             {/* Add Client Name Input */}
                             <FormField
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
                            />

                            {/* Add Client ID Input (for mock) */}
                            <FormField
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
                             />


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
