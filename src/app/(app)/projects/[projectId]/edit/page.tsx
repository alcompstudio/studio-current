// src/app/(app)/projects/[projectId]/edit/page.tsx

"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project, ProjectStatus, Customer, Order, Currency } from "@/types"; 
// REMOVE MOCK DATA IMPORT
// import { mockProjects } from '../../mockProjects';
import { useToast } from "@/hooks/use-toast";

// Статусы и валюты будут загружаться из API

// Define the form schema using Zod - matching API expectations for update
const projectFormSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string().nullable().optional(), // Allow null or undefined
  status: z.coerce.number({ required_error: "Статус обязателен" })
    .min(1, { message: "Выберите допустимый статус" }),
  currency: z.coerce.number({ required_error: "Валюта обязательна" })
    .min(1, { message: "Выберите допустимую валюту" }),
  // budget comes as number or null, form input gives string or ""
  budget: z.preprocess(
    (val) => (val === "" ? null : Number(val)), // Convert "" to null, and string to number
    z
      .number()
      .positive({ message: "Budget must be a positive number." })
      .nullable()
      .optional(), // Then validate as number or null/undefined
  ),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectEditPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;
  const router = useRouter();
  const { toast } = useToast();
  const [availableStatuses, setAvailableStatuses] = React.useState<ProjectStatus[]>([]);
  const [availableCurrencies, setAvailableCurrencies] = React.useState<Currency[]>([]);

  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    // Set defaultValues to match expected empty states for form inputs
    defaultValues: {
      name: "",
      description: "",
      status: undefined, // Будет выбрано через Select, покажет placeholder
      currency: undefined, // Будет выбрано через Select, покажет placeholder
      budget: null, // Use null for optional number field when empty
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      fetch(`/api/projects/${projectId}`)
        .then((res) => {
          if (!res.ok) {
            return res
              .json()
              .then((errData) => {
                throw new Error(
                  errData.message || `Failed to fetch project: ${res.status}`,
                );
              })
              .catch(() => {
                throw new Error(
                  `Failed to fetch project: ${res.status} ${res.statusText}`,
                );
              });
          }
          return res.json();
        })
        .then((data: Project) => {
          setProject(data); // Store fetched data

          // Prepare data for form.reset()
          // Ensure budget is a number or null
          const budgetValue =
            typeof data.budget === "string" && !isNaN(parseFloat(data.budget))
              ? parseFloat(data.budget)
              : data.budget === null || data.budget === undefined
                ? null
                : Number(data.budget);

          console.log("Project Name from API:", data.title);
          form.reset({
            name: data.title || "", // String or empty string
            description: data.description || "", // String or empty string
            status: data.status, // data.status это ID (число), соответствует типу ProjectFormValues.status (number | undefined)
            currency: data.currency || undefined, // Теперь это ID валюты (число)
            budget: budgetValue, // Number or null
          });
        })
        .catch((error) => {
          console.error("Error fetching project data for edit:", error);
          toast({
            title: "Error Loading Project",
            description: error.message || "Could not load project data.",
            variant: "destructive",
          });
          router.replace("/projects");
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
      router.replace("/projects");
    }
  }, [projectId, form, router, toast]); // Added toast to deps

  useEffect(() => {
    // Загрузка статусов и валют
    const fetchData = async () => {
      try {
        // Загрузка статусов
        const statusResponse = await fetch('/api/project-statuses');
        if (!statusResponse.ok) {
          throw new Error('Failed to fetch project statuses');
        }
        const statusData: ProjectStatus[] = await statusResponse.json();
        setAvailableStatuses(statusData);
        
        // Загрузка валют
        const currencyResponse = await fetch('/api/currencies');
        if (!currencyResponse.ok) {
          throw new Error('Failed to fetch currencies');
        }
        const currencyData: Currency[] = await currencyResponse.json();
        setAvailableCurrencies(currencyData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error Loading Data",
          description: error.message || "Could not load necessary data.",
          variant: "destructive",
        });
      }
    };
    
    fetchData();
  }, [toast]);

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
      title: data.name,         // переименовываем name в title для соответствия API
      description: data.description,
      status: data.status,
      currency: data.currency,
      budget:
        data.budget === undefined ||
        data.budget === null ||
        isNaN(Number(data.budget))
          ? null
          : Number(data.budget),
    };

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Failed to update project: ${response.statusText} (${response.status})`,
        }));
        throw new Error(
          errorData.message ||
            `Failed to update project: ${response.statusText} (${response.status})`,
        );
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
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
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
      <div
        className="flex justify-center items-center min-h-[300px]"
        data-oid="7dbx7up"
      >
        <p data-oid="wz7fmw8">Loading project details...</p>
      </div>
    );
  }

  // If project data is null after loading, show an error message
  if (!project) {
    return (
      <div
        className="flex justify-center items-center min-h-[300px]"
        data-oid=":61ppyh"
      >
        <p className="text-destructive" data-oid="7g.bm39">
          Could not load project details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-oid="rh3crit">
      {/* Header */}
      <div className="flex items-center justify-between" data-oid="4-e8m-o">
        <div className="flex items-center gap-4" data-oid="_pyvumt">
          <Link href={`/projects/${projectId}`} passHref data-oid="by9r9-i">
            <Button variant="outline" size="icon" data-oid="yjot_-r">
              <ArrowLeft className="h-4 w-4" data-oid="zej_g_i" />
            </Button>
          </Link>
          {/* Display project name from fetched data */}
          <h2 className="text-2xl font-bold tracking-tight" data-oid="92hyun1">
            Edit Project: {project.title}
          </h2>
        </div>
        <Button
          type="submit"
          form="project-edit-form"
          disabled={form.formState.isSubmitting}
          data-oid="8q8yflh"
        >
          {form.formState.isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" data-oid="6irchpw" /> Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Edit Form Card */}
      <Card data-oid="ix_p7kj">
        <CardHeader data-oid="0dwkq5e">
          <CardTitle data-oid="9gb_7zv">Project Details</CardTitle>
          <CardDescription data-oid="9s4l:.f">
            Update the project information below.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="lzkzsbm">
          <Form {...form} data-oid="f1cjph:">
            <form
              id="project-edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid=".kn3341"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem data-oid="ah-ilf5">
                    <FormLabel data-oid="2.rtf78">Project Name</FormLabel>
                    <FormControl data-oid="b:rpe5f">
                      <Input
                        placeholder="Enter project name"
                        {...field}
                        data-oid="aa_fpki"
                      />
                    </FormControl>
                    <FormMessage data-oid="bpmjwuh" />
                  </FormItem>
                )}
                data-oid="t1q8jd."
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem data-oid="bxbjqyw">
                    <FormLabel data-oid=":9udbdi">Description</FormLabel>
                    <FormControl data-oid=".sb7opo">
                      <Textarea
                        placeholder="Describe the project..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value ?? ""}
                        data-oid="6hq4xho"
                      />
                    </FormControl>
                    <FormMessage data-oid="hs2e_zg" />
                  </FormItem>
                )}
                data-oid="lo2_63y"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                data-oid="5nul-bl"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem data-oid="rnfhdgq">
                      <FormLabel data-oid="8ses6-g">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value !== undefined ? String(field.value) : undefined}
                        data-oid="uqe5cpk"
                      >
                        <FormControl data-oid="_whqop0">
                          <SelectTrigger data-oid="19bm14x">
                            <SelectValue
                              placeholder="Select status"
                              data-oid="gjp1tqx"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="sxb9kk0">
                          {availableStatuses.map((statusItem: ProjectStatus) => (
                            <SelectItem key={statusItem.id} value={String(statusItem.id)}>
                              {statusItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid="d7p0r0q" />
                    </FormItem>
                  )}
                  data-oid="miv-6nl"
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem data-oid="ojscmhj">
                      <FormLabel data-oid="_ogb9iq">Currency</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value !== undefined ? String(field.value) : undefined}
                        data-oid="v9tx3:k"
                      >
                        <FormControl data-oid="vje292j">
                          <SelectTrigger data-oid="dnivyti">
                            <SelectValue
                              placeholder="Select currency"
                              data-oid="3f7k51i"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="z_u_9_:">
                          {availableCurrencies.map((currency) => (
                            <SelectItem
                              key={currency.id}
                              value={String(currency.id)}
                              data-oid="_stvvm2"
                            >
                              {currency.isoCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid="n4gnl7s" />
                    </FormItem>
                  )}
                  data-oid="cry2c7c"
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem data-oid="8rj4g71">
                      <FormLabel data-oid="qnwleif">Budget</FormLabel>
                      <FormControl data-oid="_-y2ob9">
                        <Input
                          type="number"
                          placeholder="Enter budget amount"
                          step="0.01"
                          {...field}
                          value={
                            field.value === null || field.value === undefined
                              ? ""
                              : field.value
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            // Use null when the input is empty, otherwise parse as float
                            field.onChange(
                              value === "" ? null : parseFloat(value),
                            );
                          }}
                          data-oid=".wkjk8:"
                        />
                      </FormControl>
                      <FormMessage data-oid="93bz30g" />
                    </FormItem>
                  )}
                  data-oid="ksj1ng6"
                />
              </div>
              <div data-oid="8md14mf">
                <Label data-oid="l0jydri">Client</Label>
                {/* Access client name from the nested customer object */}
                <p
                  className="text-sm text-muted-foreground mt-1"
                  data-oid="9.97qzg"
                >
                  {project?.customer?.name || "N/A"}
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
