"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MeasurementUnit } from "./measurement-units-content";

// Схема валидации
const formSchema = z.object({
  full_name: z.string().min(1, {
    message: "Полное название обязательно",
  }),
  short_name: z.string().min(1, {
    message: "Краткое название обязательно",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface MeasurementUnitFormProps {
  initialData: MeasurementUnit | null;
  onSave: () => void;
  onCancel: () => void;
}

export function MeasurementUnitForm({
  initialData,
  onSave,
  onCancel,
}: MeasurementUnitFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Формирование заголовка формы
  const title = initialData
    ? "Редактирование единицы измерения"
    : "Добавление новой единицы измерения";

  // Настройка формы
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: initialData?.full_name || "",
      short_name: initialData?.short_name || "",
    },
  });

  // Обработчик отправки формы
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/settings/units-os/${initialData.id}`
        : "/api/settings/units-os";

      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Произошла ошибка при сохранении");
      }

      toast({
        title: initialData
          ? "Единица измерения обновлена"
          : "Единица измерения создана",
        description: initialData
          ? `Единица измерения "${values.full_name}" успешно обновлена`
          : `Единица измерения "${values.full_name}" успешно создана`,
      });

      onSave();
    } catch (error) {
      console.error("Ошибка при сохранении единицы измерения:", error);
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Произошла неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm" data-oid="g0z4c5z">
      <CardHeader data-oid="md5kjtn">
        <CardTitle data-oid="3bw8xmj">{title}</CardTitle>
      </CardHeader>
      <Form {...form} data-oid="5:bar4k">
        <form onSubmit={form.handleSubmit(onSubmit)} data-oid="e_6yg5g">
          <CardContent className="space-y-4" data-oid="8442dmd">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem data-oid="7h5_aed">
                  <FormLabel data-oid="vtqiv47">Полное название</FormLabel>
                  <FormControl data-oid="bl6kac7">
                    <Input
                      placeholder="Например: Штуки"
                      {...field}
                      data-oid="jgx.fi7"
                    />
                  </FormControl>
                  <FormDescription data-oid="-br1v20">
                    Полное название единицы измерения
                  </FormDescription>
                  <FormMessage data-oid="gay62t." />
                </FormItem>
              )}
              data-oid="jy88m50"
            />

            <FormField
              control={form.control}
              name="short_name"
              render={({ field }) => (
                <FormItem data-oid="4.3ft0m">
                  <FormLabel data-oid="pzh0lm4">Краткое название</FormLabel>
                  <FormControl data-oid="9tk_jeh">
                    <Input
                      placeholder="Например: шт."
                      {...field}
                      data-oid="b6a5wb1"
                    />
                  </FormControl>
                  <FormDescription data-oid="ernp_2:">
                    Краткое обозначение единицы измерения (например: шт., м²,
                    кг)
                  </FormDescription>
                  <FormMessage data-oid="mw7vr8_" />
                </FormItem>
              )}
              data-oid="3rm-t6l"
            />
          </CardContent>
          <CardFooter className="flex justify-between" data-oid="45vd84_">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-oid="f95y90a"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="6x2:mgy">
              {isSubmitting ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-oid="vc_-rm_"
                  />

                  {initialData ? "Обновление..." : "Создание..."}
                </>
              ) : initialData ? (
                "Обновить"
              ) : (
                "Создать"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
