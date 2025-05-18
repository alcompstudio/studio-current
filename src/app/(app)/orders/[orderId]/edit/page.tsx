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
import type { Order, OrderStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// Define order statuses (should match backend/types)
const orderStatuses: OrderStatus[] = [
  "Новый",
  "Сбор ставок",
  "На паузе",
  "Сбор Завершен",
  "Отменен",
];

// Define the form schema using Zod
const orderFormSchema = z.object({
  title: z.string().min(1, { message: "Order title is required." }),
  description: z.string().nullable().optional(),
  project_id: z.coerce
    .number({ required_error: "Project ID is required." })
    .positive({ message: "Project ID must be a positive number." }),
  status: z.enum(orderStatuses as [OrderStatus, ...OrderStatus[]], {
    required_error: "Status is required.",
  }),
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
      status: "Новый",
      price: null,
    },
    mode: "onChange",
  });

  const [projects, setProjects] = React.useState<
    { id: number; title: string; currency?: string }[]
  >([]);
  const [loadingProjects, setLoadingProjects] = React.useState(true);

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
            form.reset({
              title: orderData.title || "",
              description: orderData.description || "",
              project_id: projectIdValue,
              status:
                (orderData.status as OrderFormValues["status"]) || "Новый",
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

    const dataToSend = {
      id: orderId,
      ...data,
      price:
        data.price === undefined ||
        data.price === null ||
        isNaN(Number(data.price))
          ? null
          : Number(data.price),
    };

    try {
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
      toast({
        title: "Order Updated",
        description: `Changes for "${data.title}" have been successfully saved.`,
      });

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
        data-oid="s:a0ba6"
      >
        <p data-oid="f_03dbh">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="flex justify-center items-center min-h-[300px]"
        data-oid="b7qs5mh"
      >
        <p className="text-destructive" data-oid=".xbb8l3">
          Could not load order details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-oid="8nr1z02">
      {/* Header */}
      <div className="flex items-center justify-between" data-oid="-6ja0kj">
        <div className="flex items-center gap-4" data-oid="v_ma--m">
          <Link href={`/orders/${orderId}`} passHref data-oid="-q3g-ko">
            <Button variant="outline" size="icon" data-oid="69h8ot-">
              <ArrowLeft className="h-4 w-4" data-oid="1vhii35" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" data-oid="z23347-">
            Edit Order: {order.title}
          </h2>
        </div>
        <Button
          type="submit"
          form="order-edit-form"
          disabled={form.formState.isSubmitting}
          data-oid="1elk_qw"
        >
          {form.formState.isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" data-oid="9pou4tf" /> Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Edit Form Card */}
      <Card data-oid="ng6n8gv">
        <CardHeader data-oid="xbcybru">
          <CardTitle data-oid="hbk8ttb">Order Details</CardTitle>
          <CardDescription data-oid="ucl9:iw">
            Update the order information below.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="-0m3.pe">
          <Form {...form} data-oid="0kz_2j0">
            <form
              id="order-edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid="4g2nz06"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem data-oid="gz8at8e">
                    <FormLabel data-oid="ks39mdk">Order Title</FormLabel>
                    <FormControl data-oid="z_kftic">
                      <Input
                        placeholder="Enter order title"
                        {...field}
                        data-oid="u8nkm3d"
                      />
                    </FormControl>
                    <FormMessage data-oid="_osjimt" />
                  </FormItem>
                )}
                data-oid="yskp6zu"
              />

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem data-oid="at6utjf">
                    <FormLabel data-oid="0:eb4lj">Проект</FormLabel>
                    <FormControl data-oid="7yj2134">
                      <Select
                        disabled={loadingProjects}
                        onValueChange={(value) =>
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          )
                        }
                        value={field.value ? String(field.value) : ""}
                        data-oid="rmjlij3"
                      >
                        <SelectTrigger data-oid="j0iz:4e">
                          <SelectValue
                            placeholder={
                              loadingProjects
                                ? "Загрузка..."
                                : "Выберите проект"
                            }
                            data-oid="0pessf6"
                          />
                        </SelectTrigger>
                        <SelectContent data-oid="pw8048:">
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={String(project.id)}
                              data-oid="dkxx1uh"
                            >
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription data-oid="fzxw8y_">
                      Выберите проект, к которому относится заказ.
                    </FormDescription>
                    <FormMessage data-oid="b7-ky-q" />
                  </FormItem>
                )}
                data-oid="x:kak87"
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem data-oid=".2axc.t">
                    <FormLabel data-oid="e3xru:2">Description</FormLabel>
                    <FormControl data-oid="xv8oa7b">
                      <Textarea
                        placeholder="Describe the order..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value ?? ""}
                        data-oid="vap8vu0"
                      />
                    </FormControl>
                    <FormMessage data-oid="2fpt4q7" />
                  </FormItem>
                )}
                data-oid="8vy3z-1"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                data-oid="-0cf.3w"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem data-oid="85q92m7">
                      <FormLabel data-oid="bcdnxiz">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        data-oid="fn9f8f:"
                      >
                        <FormControl data-oid="t_ty822">
                          <SelectTrigger data-oid="3w-973w">
                            <SelectValue
                              placeholder="Select status"
                              data-oid="avz11mz"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="hgsjhpz">
                          {orderStatuses.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              data-oid="c12c_ij"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid="3wd5qhb" />
                    </FormItem>
                  )}
                  data-oid="fk:nscf"
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => {
                    const selectedProject = projects.find(
                      (p) => p.id === form.watch("project_id"),
                    );
                    return (
                      <FormItem data-oid="mjybb59">
                        <FormLabel data-oid="7gun9pw">Price</FormLabel>
                        <FormControl data-oid="akilm-p">
                          <div
                            className="flex items-center gap-2"
                            data-oid="kihv27f"
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
                              data-oid="klcrz-a"
                            />

                            <span
                              className="text-muted-foreground"
                              data-oid="vmzhfg5"
                            >
                              {selectedProject?.currency ?? ""}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage data-oid="wse1xkl" />
                      </FormItem>
                    );
                  }}
                  data-oid="2lr_56q"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
