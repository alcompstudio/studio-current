"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Palette, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";

// Схема валидации для формы статуса заказа
const orderStatusFormSchema = z.object({
  name: z.string().min(1, { message: "Название статуса обязательно" }),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Неверный формат HEX цвета (например, #RRGGBB)",
  }),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Неверный формат HEX цвета (например, #RRGGBB)",
  }),
});

type OrderStatusFormValues = z.infer<typeof orderStatusFormSchema>;

export default function CreateOrderStatusPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusFormSchema),
    defaultValues: {
      name: "",
      textColor: "#FFFFFF",
      backgroundColor: "#4CAF50", // Цвет соответствует статусу "Новый"
    },
    mode: "onChange",
  });

  const onSubmit = async (data: OrderStatusFormValues) => {
    setIsLoading(true);
    console.log("Данные формы для создания статуса заказа:", data);

    try {
      // TODO: Заменить на реальный API endpoint, когда он будет готов
      // const response = await fetch("/api/settings/order-statuses", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(
      //     errorData.error || `Ошибка создания статуса: ${response.statusText}`
      //   );
      // }

      // const newStatus = await response.json();
      // console.log("Статус заказа успешно создан:", newStatus);

      // Здесь в реальном приложении будет актуальное сохранение в БД
      // Например: await prisma.orderStatus.create({ data: { ...data, allowBids: false, isDefault: false } })

      toast({
        title: "Статус заказа создан",
        description: `Статус "${data.name}" успешно создан.`,
      });

      router.push("/settings/order-statuses");
      router.refresh();
    } catch (error) {
      console.error("Не удалось создать статус заказа:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка создания статуса заказа",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" data-oid="8rg.5n1">
      <div className="flex items-center justify-between" data-oid="o9t0b-q">
        <div className="flex items-center gap-4" data-oid="9.6b_m9">
          <Link href="/settings/order-statuses" data-oid="f5-o2xe">
            <Button
              variant="outline"
              className="h-10 w-10 p-0 flex items-center justify-center"
              data-oid="dwp7:_c"
            >
              <ArrowLeft className="h-5 w-5" data-oid="vl3zz8t" />
            </Button>
          </Link>
          <div data-oid="3fylllt">
            <h2
              className="text-2xl font-bold tracking-tight"
              data-oid="2gg1xhu"
            >
              Создание нового статуса заказа
            </h2>
            <p className="text-sm text-muted-foreground" data-oid="1170-w:">
              Добавление нового статуса для заказов.
            </p>
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading || !form.formState.isValid}
          data-oid="z3iwucn"
        >
          <Save className="mr-2 h-4 w-4" data-oid="spl0zhc" />{" "}
          {isLoading ? "Сохранение..." : "Сохранить статус"}
        </Button>
      </div>

      <Card data-oid="xkj1oh-">
        <CardHeader data-oid="tlxhg:x">
          <CardTitle data-oid=".xh7f9v">Детали статуса</CardTitle>
          <CardDescription data-oid="8nj9lqd">
            Укажите название и цветовую схему для нового статуса заказа.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid=":lzj3oy">
          <Form {...form} data-oid="51772jn">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid="3sfm3i2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem data-oid="f2l0cpa">
                    <FormLabel data-oid="7t1_l31">Название статуса</FormLabel>
                    <FormControl data-oid="s0yws4x">
                      <Input
                        placeholder="например, Ожидание оплаты, Отправлен"
                        {...field}
                        data-oid="ukor5le"
                      />
                    </FormControl>
                    <FormMessage data-oid="xvn87.o" />
                  </FormItem>
                )}
                data-oid="sfjzp.u"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                data-oid="9d-4f9g"
              >
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem data-oid="2o0pmzs">
                      <FormLabel
                        className="flex items-center"
                        data-oid="ftt6z:0"
                      >
                        <Palette className="mr-2 h-4 w-4" data-oid="1ymtp3-" />{" "}
                        Цвет текста (HEX)
                      </FormLabel>
                      <FormControl data-oid="_sgc-qj">
                        <div
                          className="flex items-center gap-2"
                          data-oid="bvwvh1f"
                        >
                          <Input
                            type="color"
                            {...field}
                            className="p-1 h-10 w-14 block"
                            data-oid="u_tddso"
                          />

                          <Input
                            placeholder="#FFFFFF"
                            {...field}
                            data-oid="z1jjssm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage data-oid="08omtd-" />
                    </FormItem>
                  )}
                  data-oid="dr:u257"
                />

                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem data-oid="ke0kwie">
                      <FormLabel
                        className="flex items-center"
                        data-oid="fq1y3xv"
                      >
                        <Palette className="mr-2 h-4 w-4" data-oid=":mmy5qt" />{" "}
                        Цвет фона (HEX)
                      </FormLabel>
                      <FormControl data-oid=":ljpaey">
                        <div
                          className="flex items-center gap-2"
                          data-oid="d7z-c6b"
                        >
                          <Input
                            type="color"
                            {...field}
                            className="p-1 h-10 w-14 block"
                            data-oid="124mh60"
                          />

                          <Input
                            placeholder="#2563EB"
                            {...field}
                            data-oid="zj-2n2r"
                          />
                        </div>
                      </FormControl>
                      <FormMessage data-oid="2lc:j-l" />
                    </FormItem>
                  )}
                  data-oid="ncz2nb5"
                />
              </div>

              <FormItem data-oid="os:wp5p">
                <FormLabel data-oid="-tknb3r">Предпросмотр</FormLabel>
                <div
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent"
                  style={{
                    color: form.watch("textColor"),
                    backgroundColor: form.watch("backgroundColor"),
                  }}
                  data-oid="w5_aey1"
                >
                  {form.watch("name") || "Пример статуса"}
                </div>
              </FormItem>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
