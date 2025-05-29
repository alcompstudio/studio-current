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
import type { Order } from "@/lib/types";
import type { OrderStatusOS } from "@/lib/types/order"; // Импорт типа статуса заказа
import { useToast } from "@/hooks/use-toast";

// Статусы заказов будут загружены из базы данных через API

const orderFormSchema = z.object({
  title: z.string().min(1, { message: "Order title is required." }),
  description: z.string().optional(),
  project_id: z.coerce
    .number({ required_error: "Project ID is required." })
    .positive({ message: "Project ID must be a positive number." }),
  status: z.coerce
    .number({ required_error: "Status is required." })
    .positive({ message: "Status ID must be a positive number." })
    .default(1), // Устанавливаем значение по умолчанию 1 (первый статус)
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
      status: 1, // Устанавливаем значение по умолчанию на первый статус (id=1)
      price: undefined,
    },
    mode: "onChange",
  });

  const [projects, setProjects] = useState<
    { id: number; title: string; currency?: string }[]
  >([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusOS[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingStatuses, setLoadingStatuses] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Загружаем проекты
        const projectsRes = await fetch("/api/projects");
        if (!projectsRes.ok) throw new Error("Ошибка загрузки проектов");
        const projectsData = await projectsRes.json();
        setProjects(
          Array.isArray(projectsData)
            ? projectsData.map((p) => ({
                id: p.id,
                title: p.title,
                currency: p.currency,
              }))
            : [],
        );
        setLoadingProjects(false);

        // Загружаем статусы заказов
        const statusesRes = await fetch("/api/order-statuses-os");
        if (!statusesRes.ok)
          throw new Error("Ошибка загрузки статусов заказов");
        const statusesData = await statusesRes.json();
        setOrderStatuses(Array.isArray(statusesData) ? statusesData : []);
        setLoadingStatuses(false);

        // Не устанавливаем значение статуса, т.к. оно уже установлено по умолчанию
        setLoadingStatuses(false);
      } catch (e) {
        console.error("Ошибка при загрузке данных:", e);
        setProjects([]);
        setOrderStatuses([]);
        setLoadingProjects(false);
        setLoadingStatuses(false);
      }
    }
    fetchData();
  }, [form]);

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

      // Перенаправляем на страницу созданного заказа
      if (newOrder && newOrder.id) {
        router.push(`/orders/${newOrder.id}`);
      } else {
        router.push("/orders");
      }
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
    <div className="flex flex-col gap-6" data-oid="zozmjyj">
      {/* Header */}
      <div className="flex items-center justify-between" data-oid=".1poamf">
        <div className="flex items-center gap-4" data-oid="uv:brwc">
          <Link href="/orders" passHref data-oid="0hfhb5m">
            <Button variant="outline" size="icon" data-oid="-3pp:6t">
              <ArrowLeft className="h-4 w-4" data-oid="x4q--g5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" data-oid="hcla76z">
            Create New Order
          </h2>
        </div>
        <Button
          type="submit"
          form="order-create-form"
          disabled={form.formState.isSubmitting}
          data-oid="b1giyyy"
        >
          {form.formState.isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" data-oid="q57fzdu" /> Create Order
            </>
          )}
        </Button>
      </div>

      {/* Create Form Card */}
      <Card data-oid="r8q7fs3">
        <CardHeader data-oid="ki-q.n8">
          <CardTitle data-oid="iod_dk0">Order Details</CardTitle>
          <CardDescription data-oid="yys9ly6">
            Enter the details for the new order.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="_le.h79">
          <Form {...form} data-oid="y9d8hf8">
            <form
              id="order-create-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid="zf5749g"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem data-oid="z7ohe9:">
                    <FormLabel data-oid="ftcph90">Order Title</FormLabel>
                    <FormControl data-oid="i1ap--s">
                      <Input
                        placeholder="Enter order title"
                        {...field}
                        data-oid="t0ra..2"
                      />
                    </FormControl>
                    <FormMessage data-oid="fq7mu12" />
                  </FormItem>
                )}
                data-oid="2a3fm7_"
              />

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem data-oid="g9luby3">
                    <FormLabel data-oid="0y2buiq">Проект</FormLabel>
                    <FormControl data-oid="ol03jjk">
                      <Select
                        disabled={loadingProjects}
                        onValueChange={(value) =>
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          )
                        }
                        value={field.value ? String(field.value) : ""}
                        data-oid="thfj3-_"
                      >
                        <SelectTrigger data-oid="xqnd0.5">
                          <SelectValue
                            placeholder={
                              loadingProjects
                                ? "Загрузка..."
                                : "Выберите проект"
                            }
                            data-oid="bjk-v9j"
                          />
                        </SelectTrigger>
                        <SelectContent data-oid="cwkgkg.">
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={String(project.id)}
                              data-oid="ia4mmlt"
                            >
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription data-oid="-2vi3n:">
                      Выберите проект, к которому относится заказ.
                    </FormDescription>
                    <FormMessage data-oid="nvcwynr" />
                  </FormItem>
                )}
                data-oid="3s7cj48"
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem data-oid="6icca1o">
                    <FormLabel data-oid="g:e1vmv">Description</FormLabel>
                    <FormControl data-oid="3ije5np">
                      <Textarea
                        placeholder="Describe the order..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value ?? ""}
                        data-oid="pjlvsk."
                      />
                    </FormControl>
                    <FormMessage data-oid="k-nv2g3" />
                  </FormItem>
                )}
                data-oid="dx-j9io"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                data-oid="qmkf:1g"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem data-oid="ivmvisz">
                      <FormLabel data-oid="86za:w.">Status</FormLabel>
                      <Select
                        disabled={loadingStatuses}
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : undefined}
                        data-oid="m:a6x3w"
                      >
                        <FormControl data-oid="soe.h06">
                          <SelectTrigger data-oid="56how37">
                            <SelectValue
                              placeholder={
                                loadingStatuses
                                  ? "Загрузка..."
                                  : "Выберите статус"
                              }
                              data-oid="zu.86u_"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="fs.-tlt">
                          {orderStatuses.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={String(status.id)}
                              data-oid="tz3de:7"
                            >
                              <div
                                className="flex items-center gap-2"
                                data-oid="zsnp4v6"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: status.backgroundColor,
                                  }}
                                  data-oid="z9k-oa1"
                                />

                                {status.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid=".fh-17_" />
                    </FormItem>
                  )}
                  data-oid="5.i0jy2"
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => {
                    const selectedProject = projects.find(
                      (p) => p.id === form.watch("project_id"),
                    );
                    return (
                      <FormItem data-oid="h08izs7">
                        <FormLabel data-oid="c04d.5f">Price</FormLabel>
                        <FormControl data-oid="u_epjk3">
                          <div
                            className="flex items-center gap-2"
                            data-oid="pbm:fj8"
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
                              data-oid="26lg07t"
                            />

                            <span
                              className="text-muted-foreground"
                              data-oid="hh2:2ao"
                            >
                              {selectedProject?.currency ?? ""}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage data-oid="usl_bjl" />
                      </FormItem>
                    );
                  }}
                  data-oid="fmv3_fj"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
