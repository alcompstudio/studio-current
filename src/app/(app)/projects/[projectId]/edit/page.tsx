// src/app/(app)/projects/[projectId]/edit/page.tsx
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
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
import { Label } from "@/components/ui/label"; // Import Label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import type { Project } from "@/lib/types"; // Assuming Project type exists
import { mockProjects } from '../../mockProjects'; // Corrected import path
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Define project statuses and currencies
const projectStatuses = ["Planning", "In Progress", "On Hold", "Completed", "Archived"] as const;
const projectCurrencies = ["USD", "EUR", "RUB"] as const;

// Define the form schema using Zod
const projectFormSchema = z.object({
    name: z.string().min(1, { message: "Project name is required." }),
    description: z.string().optional(),
    status: z.enum(projectStatuses, { required_error: "Status is required." }),
    currency: z.enum(projectCurrencies, { required_error: "Currency is required." }),
    budget: z.coerce.number().positive({ message: "Budget must be a positive number." }).optional(), // Coerce to number, allow optional
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectEditPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId;
    const router = useRouter(); // Initialize useRouter
    const { toast } = useToast(); // Initialize useToast

    // Fetch project data (using mock data for now)
    const [project, setProject] = React.useState<Project | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // Initialize the form
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: "",
            description: "",
            status: undefined,
            currency: undefined,
            budget: undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (projectId) {
            // Simulate fetching project data
            // Find the project from the potentially modified mockProjects array
            const foundProject = mockProjects.find(p => p.id === projectId);
            if (foundProject) {
                setProject(foundProject);
                // Reset form with fetched data
                form.reset({
                    name: foundProject.name,
                    description: foundProject.description || "",
                    status: foundProject.status as ProjectFormValues['status'], // Assert type
                    currency: foundProject.currency as ProjectFormValues['currency'], // Assert type
                    budget: foundProject.budget,
                });
            } else {
                 // Handle case where project ID exists but project not found in mock data
                 console.error(`Project with ID ${projectId} not found in mock data.`);
                 toast({
                     title: "Error",
                     description: `Project with ID ${projectId} not found.`,
                     variant: "destructive",
                 });
                 // Optionally redirect to projects list
                 router.replace('/projects');
            }
            setIsLoading(false);
        } else {
            // Handle the case where projectId is not available
            setIsLoading(false);
            console.error("Project ID is missing.");
             toast({
                 title: "Error",
                 description: "Project ID is missing from the URL.",
                 variant: "destructive",
             });
            // Redirect to projects list
            router.replace('/projects');
        }
    }, [projectId, form, router, toast]); // Add router and toast to dependency array

    const onSubmit = (data: ProjectFormValues) => {
        if (!projectId || !project) {
             toast({
                title: "Error Saving",
                description: "Cannot save changes. Project ID or data is missing.",
                variant: "destructive",
            });
            return;
        }

        console.log("Attempting to save changes for project:", projectId, data);

        // Find the index of the project in the mock array
        const projectIndex = mockProjects.findIndex(p => p.id === projectId);

        if (projectIndex !== -1) {
            // Update the project in the mock array (in-memory update)
            mockProjects[projectIndex] = {
                ...mockProjects[projectIndex], // Keep existing properties like id, clientName, etc.
                ...data, // Update with form data
                updatedAt: new Date(), // Update the updatedAt timestamp
            };

            console.log("Updated mockProjects:", mockProjects);

            toast({
                title: "Project Updated",
                description: `Changes for "${data.name}" have been saved (mock).`,
            });

            // Redirect back to the project detail page
            router.push(`/projects/${projectId}`);
            // Optional: router.refresh() if you need to force a server data refetch on the detail page,
            // but for mock data, a simple push is often sufficient.

        } else {
             toast({
                title: "Error Saving",
                description: `Could not find project with ID ${projectId} to update.`,
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading project details...</div>;
    }

    if (!project) {
        // Message already shown in useEffect, this is a fallback
        return <div className="flex min-h-screen items-center justify-center">Project not found or ID missing. Redirecting...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Link href={`/projects/${projectId}`} passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    {/* Ensure project.name is displayed correctly */}
                    <h2 className="text-2xl font-bold tracking-tight">Edit Project: {form.watch('name') || project.name}</h2>
                </div>
                 <Button type="submit" form="project-edit-form" disabled={form.formState.isSubmitting}> {/* Disable button while submitting */}
                    {form.formState.isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                 </Button>
            </div>

            {/* Edit Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Update the project information below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                         <form
                            id="project-edit-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6" // Increased spacing
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

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the project..."
                                                className="min-h-[100px]" // Set min height
                                                {...field}
                                                value={field.value ?? ''} // Ensure value is never null/undefined for textarea
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grid for status, currency, budget */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}> {/* Use value prop */}
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
                                            <Select onValueChange={field.onChange} value={field.value}> {/* Use value prop */}
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
                                                     step="0.01" // Allow decimals
                                                     {...field}
                                                     // Handle controlled component value for number input
                                                     value={field.value ?? ''}
                                                     onChange={e => {
                                                        const value = e.target.value;
                                                        // Allow empty string for optional, otherwise parse as float
                                                        field.onChange(value === '' ? undefined : parseFloat(value));
                                                      }}
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                         </FormItem>
                                     )}
                                 />
                             </div>
                            {/* Read-only field for Client Name */}
                             <div>
                                <Label>Client</Label>
                                <p className="text-sm text-muted-foreground mt-1">{project.clientName || 'N/A'}</p>
                            </div>
                             {/* Submit button is now in the header, linked by form ID */}
                         </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
