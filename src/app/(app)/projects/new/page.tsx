// src/app/(app)/projects/new/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import type { ProjectStatus, Currency } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Валюты будут загружаться из API

// Определяем схему формы с помощью Zod
const projectFormSchema = z.object({
  name: z.string().min(1, { message: "Название проекта обязательно" }),
  description: z.string().optional(),
  status: z.coerce
    .number({ required_error: "Статус обязателен" })
    .min(1, { message: "Выберите допустимый статус" }),
  currency: z.coerce
    .number({ required_error: "Валюта обязательна" })
    .min(1, { message: "Выберите допустимую валюту" }),
  budget: z.coerce
    .number()
    .positive({ message: "Бюджет должен быть положительным числом" })
    .optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectCreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  // Используем фиксированное значение для customerId (1) вместо чтения из localStorage
  // В реальном приложении здесь должен быть код получения ID из сессии/контекста авторизации
  const fixedCustomerId = 1;

  // Инициализируем форму с значениями по умолчанию
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

  // Загрузка статусов проектов и валют при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Загрузка статусов
        const statusResponse = await fetch("/api/project-statuses");
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json().catch(() => ({
            message: "Не удалось загрузить статусы проектов",
          }));
          throw new Error(
            errorData.message || "Не удалось загрузить статусы проектов",
          );
        }
        const statusData: ProjectStatus[] = await statusResponse.json();
        setProjectStatuses(statusData);

        // Устанавливаем статус "Новый" по умолчанию или первый доступный статус
        if (statusData.length > 0) {
          const defaultStatus =
            statusData.find((s) => s.name === "Новый") || statusData[0];
          if (defaultStatus && form.setValue) {
            form.setValue("status", defaultStatus.id, { shouldValidate: true });
          }
        }

        // Загрузка валют
        const currencyResponse = await fetch("/api/currencies");
        if (!currencyResponse.ok) {
          const errorData = await currencyResponse
            .json()
            .catch(() => ({ message: "Не удалось загрузить валюты" }));
          throw new Error(errorData.message || "Не удалось загрузить валюты");
        }
        const currencyData: Currency[] = await currencyResponse.json();
        setCurrencies(currencyData);

        // Устанавливаем USD по умолчанию или первую доступную валюту
        if (currencyData.length > 0) {
          const defaultCurrency =
            currencyData.find((c) => c.isoCode === "USD") || currencyData[0];
          if (defaultCurrency && form.setValue) {
            form.setValue("currency", defaultCurrency.id, {
              shouldValidate: true,
            });
          }
        }
      } catch (error: any) {
        console.error("Ошибка при загрузке данных:", error);
        toast({
          title: "Ошибка загрузки данных",
          description:
            error.message || "Не удалось загрузить необходимые данные.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, form.setValue]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);

    console.log("Данные формы перед отправкой:", data);

    const dataToSend = {
      ...data,
      // Используем фиксированное значение для customerId
      customerId: fixedCustomerId,
    };

    console.log("Отправка данных для создания проекта:", dataToSend);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка создания проекта: ${response.statusText}`,
        );
      }

      const newProject = await response.json();
      console.log("Проект успешно создан:", newProject);

      toast({
        title: "Проект создан",
        description: `Проект "${data.name}" успешно создан.`,
      });

      // Перенаправляем на страницу созданного проекта
      if (newProject && newProject.id) {
        router.push(`/projects/${newProject.id}`);
      } else {
        router.push("/projects");
      }
      router.refresh();
    } catch (error) {
      console.error("Не удалось создать проект:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка создания проекта",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" data-oid="7nqd..3">
      {/* Заголовок и кнопки на прозрачном фоне над карточкой */}
      <div
        className="flex items-center justify-between"
        data-component-name="ProjectCreatePage"
        data-oid="vwhkw4e"
      >
        <div className="flex items-center gap-4" data-oid="amv6m4y">
          <Link href="/projects" data-oid="wjfr_c1">
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full"
              data-oid="84ismfs"
            >
              <ArrowLeft className="h-4 w-4" data-oid="qjdl.gu" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" data-oid="xp_qexi">
            Создание нового проекта
          </h2>
        </div>
        <Button
          type="submit"
          form="new-project-form"
          disabled={isLoading}
          className="rounded-full"
          data-oid="hsl6068"
        >
          <Save className="mr-2 h-4 w-4" data-oid="jyrbxe9" /> Сохранить
        </Button>
      </div>

      {/* Карточка с формой */}
      <Card data-oid="9b55034">
        <CardHeader data-oid="1i43kb0">
          <CardTitle data-oid="99950ea">Детали проекта</CardTitle>
          <CardDescription data-oid="e:aqqjn">
            Введите информацию о новом проекте
          </CardDescription>
        </CardHeader>

        <CardContent data-oid="h6x._pp">
          <Form {...form} data-oid="ya:axo1">
            <form
              id="new-project-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              data-oid="hcer-ja"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem data-oid="dy8z6xc">
                    <FormLabel data-oid="h8b7:ft">Название проекта</FormLabel>
                    <FormControl data-oid="f4073-y">
                      <Input
                        placeholder="Введите название проекта"
                        {...field}
                        data-oid="s24q8-_"
                      />
                    </FormControl>
                    <FormMessage data-oid=".0dyx2y" />
                  </FormItem>
                )}
                data-oid="v9y3lkv"
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem data-oid="4eekjp.">
                    <FormLabel data-oid="px5mjee">Описание</FormLabel>
                    <FormControl data-oid="78pexbt">
                      <Textarea
                        placeholder="Введите описание проекта"
                        className="min-h-32"
                        {...field}
                        value={field.value || ""}
                        data-oid="9_wrtwp"
                      />
                    </FormControl>
                    <FormMessage data-oid="zdxe.wo" />
                  </FormItem>
                )}
                data-oid=".w_tl8o"
              />

              <div className="flex gap-6" data-oid="y8d3tzb">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="flex-1" data-oid="jhbm7zn">
                      <FormLabel data-oid="sa.p7yj">Бюджет</FormLabel>
                      <FormControl data-oid="wras8xf">
                        <Input
                          type="number"
                          placeholder="Введите бюджет"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value),
                            );
                          }}
                          data-oid=":wezycm"
                        />
                      </FormControl>
                      <FormMessage data-oid="hlyealw" />
                    </FormItem>
                  )}
                  data-oid="ajuimeq"
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="flex-1" data-oid="l84cj0.">
                      <FormLabel data-oid="v:b612f">Валюта</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                        data-oid=":-44e4g"
                      >
                        <FormControl data-oid="he0lgq_">
                          <SelectTrigger data-oid="-65z8wn">
                            <SelectValue
                              placeholder="Выберите валюту"
                              data-oid="_4pzje5"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="v0nikuz">
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.id}
                              value={currency.id.toString()}
                              data-oid="y5yz4vm"
                            >
                              {currency.isoCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid="mitw89a" />
                    </FormItem>
                  )}
                  data-oid="1l5v-yo"
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex-1" data-oid=".2o0g24">
                      <FormLabel data-oid="sygsw1b">Статус</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                        data-oid="t2qaeeg"
                      >
                        <FormControl data-oid="7:w_qkz">
                          <SelectTrigger data-oid="m3c0q.x">
                            <SelectValue
                              placeholder="Выберите статус"
                              data-oid="m7rn:_5"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-oid="2h-aw4c">
                          {projectStatuses.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={status.id.toString()}
                              data-oid="4z-apze"
                            >
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-oid="kafe016" />
                    </FormItem>
                  )}
                  data-oid="om1fa_7"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
