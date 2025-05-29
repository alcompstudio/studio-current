// src/app/(app)/orders/[orderId]/edit/page.tsx

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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Order } from "@/lib/types";
import type { OrderStatusOS } from "@/lib/types/order"; // Импорт типа статуса заказа
import { useToast } from "@/hooks/use-toast";

// Статусы заказов будут загружены из базы данных через API

// Define the form schema using Zod
const orderFormSchema = z.object({
  title: z.string().min(1, { message: "Order title is required." }),
  description: z.string().nullable().optional(),
  project_id: z.coerce
    .number({ required_error: "Project ID is required." })
    .positive({ message: "Project ID must be a positive number." }),
  status: z.coerce
    .number({ required_error: "Status is required." })
    .positive({ message: "Status ID must be a positive number." })
    .default(1), // Устанавливаем значение по умолчанию 1 (первый статус),
  price: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z
      .number()
      .positive({ message: "Price must be a positive number." })
      .nullable()
      .optional(),
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
      status: 1, // Значение по умолчанию, будет переопределено при загрузке заказа
      price: null,
    },
    mode: "onChange",
  });

  const [projects, setProjects] = React.useState<
    { id: number; title: string; currency?: string }[]
  >([]);
  const [orderStatuses, setOrderStatuses] = React.useState<OrderStatusOS[]>([]);
  const [loadingProjects, setLoadingProjects] = React.useState(true);
  const [loadingStatuses, setLoadingStatuses] = React.useState(true);

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
      } catch (e) {
        console.error("Ошибка при загрузке данных:", e);
        setProjects([]);
        setOrderStatuses([]);
        setLoadingProjects(false);
        setLoadingStatuses(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      fetch(`/api/orders?id=${orderId}`)
        .then((res) => {
          if (!res.ok) {
            return res
              .json()
              .then((errData) => {
                throw new Error(
                  errData.message || `Failed to fetch order: ${res.status}`,
                );
              })
              .catch(() => {
                throw new Error(
                  `Failed to fetch order: ${res.status} ${res.statusText}`,
                );
              });
          }
          return res.json();
        })
        .then((data: Order | Order[]) => {
          const orderData = Array.isArray(data) ? data[0] : data;
          if (orderData) {
            setOrder(orderData);
            const priceValue =
              typeof orderData.price === "string" &&
              !isNaN(parseFloat(orderData.price))
                ? parseFloat(orderData.price)
                : orderData.price === null || orderData.price === undefined
                  ? null
                  : Number(orderData.price);
            const projectIdValue =
              typeof orderData.project_id === "string" &&
              !isNaN(parseInt(orderData.project_id, 10))
                ? parseInt(orderData.project_id, 10)
                : orderData.project_id === null ||
                    orderData.project_id === undefined
                  ? undefined
                  : Number(orderData.project_id);

            // Обработка статуса как числа вместо строки
            const statusValue =
              typeof orderData.status === "string" &&
              !isNaN(parseInt(orderData.status, 10))
                ? parseInt(orderData.status, 10)
                : typeof orderData.status === "number"
                  ? orderData.status
                  : 1; // Используем 1 как значение по умолчанию вместо undefined

            form.reset({
              title: orderData.title || "",
              description: orderData.description || "",
              project_id: projectIdValue,
              status: statusValue,
              price: priceValue,
            });
          } else {
            throw new Error(`Order with ID ${orderId} not found.`);
          }
        })
        .catch((error) => {
          console.error("Error fetching order data for edit:", error);
          toast({
            title: "Error Loading Order",
            description: error.message || "Could not load order data.",
            variant: "destructive",
          });
          router.replace("/orders");
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
      router.replace("/orders");
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

    // Гарантируем, что ID заказа — это число
    const numericOrderId = parseInt(orderId, 10);
    if (isNaN(numericOrderId)) {
      toast({
        title: "Error Saving",
        description: "Invalid Order ID format. Cannot save changes.",
        variant: "destructive",
      });
      return;
    }

    const dataToSend = {
      id: numericOrderId, // Используем числовой ID
      ...data,
      price:
        data.price === undefined ||
        data.price === null ||
        isNaN(Number(data.price))
          ? null
          : Number(data.price),
    };

    try {
      console.log("Sending update request for order ID:", numericOrderId);
      console.log("Data to send:", dataToSend);

      const response = await fetch(`/api/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Failed to update order: ${response.statusText} (${response.status})`,
        }));
        throw new Error(
          errorData.message ||
            `Failed to update order: ${response.statusText} (${response.status})`,
        );
      }

      const updatedOrder = await response.json();
      console.log("Updated order:", updatedOrder);

      toast({
        title: "Order Updated",
        description: `Changes for "${data.title}" have been successfully saved.`,
      });

      // Явно сохраняем orderId в строковом формате для маршрутизации
      router.push(`/orders/${orderId}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to update order:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error Saving Order",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-[300px]"
        data-oid="l7:mltm"
      >
        <p data-oid="jthivxp">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="flex justify-center items-center min-h-[300px]"
        data-oid="5j-e91g"
      >
        <p className="text-destructive" data-oid="68qq_9v">
          Could not load order details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-oid="ptdb27q">
      {/* Header */}
      <div className="flex items-center justify-between" data-oid="6mpt:n8">
        <div className="flex items-center gap-4" data-oid="f0nxmer">
          <Link href={`/orders/${orderId}`} passHref data-oid=":p7yqw8">
            <Button variant="outline" size="icon" data-oid="of9733t">
              <ArrowLeft className="h-4 w-4" data-oid=":9drns4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" data-oid="7m0rhv2">
            Edit Order: {order.title}
          </h2>
        </div>
        <Button
          type="submit"
          form="order-edit-form"
          disabled={form.formState.isSubmitting}
          data-oid="7rokb5:"
        >
          {form.formState.isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" data-oid="yreqnj6" /> Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Edit Form Card */}
      <Card data-oid="x-yscg9">
        <CardHeader data-oid="bi96r.v">
          <CardTitle data-oid="36tje:i">Order Details</CardTitle>
          <CardDescription data-oid="znu_wu2">
            Update the order information below.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="goi5g5_">
          <Form {...form} data-oid="tpgzt_3">
            <form
              id="order-edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid="ykpib_6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem data-oid="jf-mbf2">
                    <FormLabel data-oid="xdm_88s">Order Title</FormLabel>
                    <FormControl data-oid="a00yd1-">
                      <Input
                        placeholder="Enter order title"
                        {...field}
                        data-oid="s_gg5m9"
                      />
                    </FormControl>
                    <FormMessage data-oid="fe.dvbn" />
                  </FormItem>
                )}
                data-oid="zkyxkm8"
              />

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem data-oid="jl33jr9">
                    <FormLabel data-oid="n24ubao">Проект</FormLabel>
                    <FormControl data-oid="c-v69a7">
                      <Select
                        disabled={loadingProjects}
                        onValueChange={(value) =>
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          )
                        }
                        value={field.value ? String(field.value) : ""}
                        data-oid="b0tt2ct"
                      >
                        <SelectTrigger data-oid="zcx:3z.">
                          <SelectValue
                            placeholder={
                              loadingProjects
                                ? "Загрузка..."
                                : "Выберите проект"
                            }
                            data-oid="85323kh"
                          />
                        </SelectTrigger>
                        <SelectContent data-oid="t04:g6d">
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={String(project.id)}
                              data-oid=":gy8:61"
                            >
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription data-oid="vj0cc6q">
                      Выберите проект, к которому относится заказ.
                    </FormDescription>
                    <FormMessage data-oid="pbhhst:" />
                  </FormItem>
                )}
                data-oid="t02wcz3"
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem data-oid="_6q1jio">
                    <FormLabel data-oid="35iw77r">Description</FormLabel>
                    <FormControl data-oid="5:dyh0-">
                      <Textarea
                        placeholder="Describe the order..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value ?? ""}
                        data-oid="3i05izm"
                      />
                    </FormControl>
                    <FormMessage data-oid="k_5fzhn" />
                  </FormItem>
                )}
                data-oid="89c4o_g"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                data-oid="fqrxha2"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem data-oid="3r9oui9">
                      <FormLabel data-oid="ojr2fco">Status</FormLabel>
                      <Select
                        disabled={loadingStatuses}
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : undefined}
                        data-oid="88cqft1"
                      >
                        <FormControl data-oid=".6e4u06">
                          <SelectTrigger data-oid="46admx2">
                            <SelectValue
                              placeholder={
                                loadingStatuses
                                  ? "Загрузка..."
                                  : "Выберите статус"
                              }
                              data-oid="p2balrc"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid=".xhez7y">
                          {orderStatuses.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={String(status.id)}
                              data-oid="-gye89i"
                            >
                              <div
                                className="flex items-center gap-2"
                                data-oid="i-yyvqi"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: status.backgroundColor,
                                  }}
                                  data-oid="t:lm41k"
                                />

                                {status.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid="g_6szl8" />
                    </FormItem>
                  )}
                  data-oid="s9w1zdh"
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => {
                    const selectedProject = projects.find(
                      (p) => p.id === form.watch("project_id"),
                    );
                    return (
                      <FormItem data-oid="jt-6hpi">
                        <FormLabel data-oid="v6b.y8t">Price</FormLabel>
                        <FormControl data-oid=".fzb775">
                          <div
                            className="flex items-center gap-2"
                            data-oid="fur5m6g"
                          >
                            <Input
                              type="number"
                              placeholder="Enter order price"
                              step="0.01"
                              {...field}
                              value={
                                field.value === null ||
                                field.value === undefined
                                  ? ""
                                  : field.value
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? null : parseFloat(value),
                                );
                              }}
                              data-oid="__st-pg"
                            />

                            <span
                              className="text-muted-foreground"
                              data-oid="h:3p9lb"
                            >
                              {selectedProject?.currency ?? ""}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage data-oid=":dfmnjy" />
                      </FormItem>
                    );
                  }}
                  data-oid="_o3dx61"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
