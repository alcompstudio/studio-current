// src/app/(app)/projects/[projectId]/edit/page.tsx

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from "@/lib/types";
// REMOVE MOCK DATA IMPORT
// import { mockProjects } from '../../mockProjects';
import { useToast } from "@/hooks/use-toast";


// Define project statuses and currencies
const projectStatuses = ["Planning", "In Progress", "On Hold", "Completed", "Archived"] as const;
const projectCurrencies = ["USD", "EUR", "RUB"] as const;

// Define the form schema using Zod - matching API expectations for update
const projectFormSchema = z.object({
    name: z.string().min(1, { message: "Project name is required." }),
    description: z.string().nullable().optional(), // Allow null or undefined
    status: z.enum(projectStatuses, { required_error: "Status is required." }),
    currency: z.enum(projectCurrencies, { required_error: "Currency is required." }),
    // budget comes as number or null, form input gives string or ""
    budget: z.preprocess(
        (val) => (val === '' ? null : Number(val)), // Convert "" to null, and string to number
        z.number().positive({ message: "Budget must be a positive number." }).nullable().optional() // Then validate as number or null/undefined
    ),
});


type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectEditPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId;
    const router = useRouter();
    const { toast } = useToast();

    const [project, setProject] = React.useState<Project | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        // Set defaultValues to match expected empty states for form inputs
        defaultValues: {
            name: "",
            description: "",
            status: "Planning", // Or undefined if placeholder preferred
            currency: "USD", // Or undefined if placeholder preferred
            budget: null, // Use null for optional number field when empty
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (projectId) {
            setIsLoading(true);
            fetch(`/api/projects/${projectId}`)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                            throw new Error(errData.message || `Failed to fetch project: ${res.status}`);
                        }).catch(() => {
                            throw new Error(`Failed to fetch project: ${res.status} ${res.statusText}`);
                        });
                    }
                    return res.json();
                })
                .then((data: Project) => {
                    setProject(data); // Store fetched data

                    // Prepare data for form.reset()
                    // Ensure budget is a number or null
                    const budgetValue = (typeof data.budget === 'string' && !isNaN(parseFloat(data.budget))) ? parseFloat(data.budget) : (data.budget === null || data.budget === undefined ? null : Number(data.budget));


                    console.log("Project Name from API:", data.title);
                    form.reset({
                        name: data.title || "", // String or empty string
                        description: data.description || "", // String or empty string
                        status: data.status as ProjectFormValues['status'] || "Planning",
                        currency: data.currency as ProjectFormValues['currency'] || "USD",
                        budget: budgetValue, // Number or null
                    });
                })
                .catch(error => {
                    console.error("Error fetching project data for edit:", error);
                    toast({
                        title: "Error Loading Project",
                        description: error.message || "Could not load project data.",
                        variant: "destructive",
                    });
                    router.replace('/projects');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            toast({
                title: "Error",
                description: "Project ID is missing from the URL.",
                variant: "destructive",
            });
            router.replace('/projects');
        }
    }, [projectId, form, router, toast]); // Added toast to deps

    const onSubmit = async (data: ProjectFormValues) => {
        if (!projectId) {
             toast({
                title: "Error Saving",
                description: "Project ID is missing. Cannot save changes.",
                variant: "destructive",
            });
            return;
        }

        console.log("Attempting to save changes for project:", projectId, data);

        // Data is already validated by Zod schema with preprocess
        // Ensure budget is null if it's NaN after preprocess (e.g., user typed non-numeric)
        const dataToSend = {
            ...data,
             budget: data.budget === undefined || data.budget === null || isNaN(Number(data.budget)) ? null : Number(data.budget),
        };


        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Failed to update project: ${response.statusText} (${response.status})` }));
                throw new Error(errorData.message || `Failed to update project: ${response.statusText} (${response.status})`);
            }

            const updatedProject = await response.json();
            console.log("Project updated successfully via API:", updatedProject);

            toast({
                title: "Project Updated",
                description: `Changes for "${data.name}" have been successfully saved.`,
            });

            // Redirect back to the project detail page
            router.push(`/projects/${projectId}`);
            router.refresh(); // Ensure data is fresh on the detail page

        } catch (error) {
            console.error("Failed to update project:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast({
                title: "Error Saving Project",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    // Display loading state or error messages if project data couldn't be loaded
    if (isLoading) {
         return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p>Loading project details...</p>
            </div>
        );
    }

    // If project data is null after loading, show an error message
    if (!project) {
         return (
            <div className="flex justify-center items-center min-h-[300px]">
                 <p className="text-destructive">Could not load project details.</p>
            </div>
        );
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
                    {/* Display project name from fetched data */}
                    <h2 className="text-2xl font-bold tracking-tight">Edit Project: {project.name}</h2>
                </div>
                 <Button type="submit" form="project-edit-form" disabled={form.formState.isSubmitting}>
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
                                                     value={field.value === null || field.value === undefined ? "" : field.value}
                                                     onChange={e => {
                                                        const value = e.target.value;
                                                        // Use null when the input is empty, otherwise parse as float
                                                        field.onChange(value === '' ? null : parseFloat(value));
                                                      }}
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                         </FormItem>
                                     )}
                                 />
                             </div>
                             <div>
                                <Label>Client</Label>
                                {/* Access client name from the nested customer object */}
                                <p className="text-sm text-muted-foreground mt-1">{project?.customer?.name || 'N/A'}</p>
                            </div>
                         </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
