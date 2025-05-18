// src/app/(app)/orders/new/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order, OrderStatus } from "@/lib/types"; // Import Order and OrderStatus types
import { useToast } from "@/hooks/use-toast";

// Define order statuses and currencies (should match backend/types)
const orderStatuses: OrderStatus[] = [
  "Новый",
  "Сбор ставок",
  "На паузе",
  "Сбор Завершен",
  "Отменен",
];

const orderFormSchema = z.object({
  title: z.string().min(1, { message: "Order title is required." }),
  description: z.string().optional(),
  project_id: z.coerce
    .number({ required_error: "Project ID is required." })
    .positive({ message: "Project ID must be a positive number." }),
  status: z
    .enum(orderStatuses as [OrderStatus, ...OrderStatus[]], {
      required_error: "Status is required.",
    })
    .default("Новый"),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." })
    .optional(),
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

  const [projects, setProjects] = useState<
    { id: number; title: string; currency?: string }[]
  >([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Ошибка загрузки проектов");
        const data = await res.json();
        setProjects(
          Array.isArray(data)
            ? data.map((p) => ({
                id: p.id,
                title: p.title,
                currency: p.currency,
              }))
            : [],
        );
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to create order: ${response.statusText}`,
        );
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
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error Creating Order",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6" data-oid="-:cn8-a">
      {/* Header */}
      <div className="flex items-center justify-between" data-oid="ow:951u">
        <div className="flex items-center gap-4" data-oid="1-woq.r">
          <Link href="/orders" passHref data-oid="k9utqsa">
            <Button variant="outline" size="icon" data-oid="zr6z6wg">
              <ArrowLeft className="h-4 w-4" data-oid="zpmsd:-" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" data-oid="pqgr_7_">
            Create New Order
          </h2>
        </div>
        <Button
          type="submit"
          form="order-create-form"
          disabled={form.formState.isSubmitting}
          data-oid="zhbnrgv"
        >
          {form.formState.isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" data-oid="a20r170" /> Create Order
            </>
          )}
        </Button>
      </div>

      {/* Create Form Card */}
      <Card data-oid="ichajig">
        <CardHeader data-oid="fc8tg:n">
          <CardTitle data-oid="gos40q6">Order Details</CardTitle>
          <CardDescription data-oid="rj.v4rc">
            Enter the details for the new order.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="35rwgrs">
          <Form {...form} data-oid="k8xu8dm">
            <form
              id="order-create-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid="t20546n"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem data-oid="dh6fdy5">
                    <FormLabel data-oid=".zur8x9">Order Title</FormLabel>
                    <FormControl data-oid="jw0bhs4">
                      <Input
                        placeholder="Enter order title"
                        {...field}
                        data-oid="grvapm6"
                      />
                    </FormControl>
                    <FormMessage data-oid=".tqgf3m" />
                  </FormItem>
                )}
                data-oid="liqrr-n"
              />

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem data-oid="1zl.nv8">
                    <FormLabel data-oid="4yl19et">Проект</FormLabel>
                    <FormControl data-oid="3mysa:a">
                      <Select
                        disabled={loadingProjects}
                        onValueChange={(value) =>
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          )
                        }
                        value={field.value ? String(field.value) : ""}
                        data-oid="01a8ce7"
                      >
                        <SelectTrigger data-oid="xkz:wce">
                          <SelectValue
                            placeholder={
                              loadingProjects
                                ? "Загрузка..."
                                : "Выберите проект"
                            }
                            data-oid="ychcadn"
                          />
                        </SelectTrigger>
                        <SelectContent data-oid="8fn6ejj">
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={String(project.id)}
                              data-oid="i6j6493"
                            >
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription data-oid="9mzrb_.">
                      Выберите проект, к которому относится заказ.
                    </FormDescription>
                    <FormMessage data-oid="2-_tyii" />
                  </FormItem>
                )}
                data-oid="47.3_sx"
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem data-oid="u6-cwdy">
                    <FormLabel data-oid="agd1p1:">Description</FormLabel>
                    <FormControl data-oid=":_sr_l.">
                      <Textarea
                        placeholder="Describe the order..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value ?? ""}
                        data-oid="7y-n2rh"
                      />
                    </FormControl>
                    <FormMessage data-oid="nk_9xgp" />
                  </FormItem>
                )}
                data-oid="4cmn.r8"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                data-oid="0oo1fbw"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem data-oid="fxge0q2">
                      <FormLabel data-oid="d4wu4pa">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        data-oid="l2nh7gd"
                      >
                        <FormControl data-oid="3qj.8qh">
                          <SelectTrigger data-oid="zihwqt3">
                            <SelectValue
                              placeholder="Select status"
                              data-oid="21oybs2"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="gcayxj4">
                          {orderStatuses.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              data-oid="y74mklq"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid="sl.f_p2" />
                    </FormItem>
                  )}
                  data-oid="od:v9m5"
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => {
                    const selectedProject = projects.find(
                      (p) => p.id === form.watch("project_id"),
                    );
                    return (
                      <FormItem data-oid=".wd:w45">
                        <FormLabel data-oid="3270i:q">Price</FormLabel>
                        <FormControl data-oid="ilbff_t">
                          <div
                            className="flex items-center gap-2"
                            data-oid="u0jg9r4"
                          >
                            <Input
                              type="number"
                              placeholder="Enter order price"
                              step="0.01"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : parseFloat(value),
                                );
                              }}
                              data-oid=".s4lgrq"
                            />

                            <span
                              className="text-muted-foreground"
                              data-oid="z:y5k59"
                            >
                              {selectedProject?.currency ?? ""}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage data-oid="y7_ql:5" />
                      </FormItem>
                    );
                  }}
                  data-oid="ap1eljh"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
