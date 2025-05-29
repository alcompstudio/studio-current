"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stage, WorkTypeOption } from "@/lib/types/stage";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Схема валидации формы
const stageFormSchema = z.object({
  name: z.string().min(1, "Название этапа обязательно"),
  description: z.string().optional(),
  sequence: z.coerce.number().int().positive().optional().nullable(),
  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Неверный формат цвета (например, #FF5733)",
    )
    .optional()
    .nullable(),
  workType: z.coerce.number().optional().nullable(),
  estimatedPrice: z.coerce.number().positive().optional().nullable(),
  status: z.string().optional(),
});

export type StageFormValues = z.infer<typeof stageFormSchema>;

interface StageFormProps {
  orderId: string;
  stageToEdit?: Stage | null;
  onSuccess: () => void;
  onCancel: () => void;
  orderCurrency?: string;
}

const StageForm: React.FC<StageFormProps> = ({
  orderId,
  stageToEdit = null,
  onSuccess,
  onCancel,
  orderCurrency = "руб.",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextSequence, setNextSequence] = useState<number | null>(null);
  const [workTypes, setWorkTypes] = useState<WorkTypeOption[]>([]);
  const [isLoadingWorkTypes, setIsLoadingWorkTypes] = useState(false);
  const { toast } = useToast();

  // Запрос следующего порядкового номера при создании нового этапа
  useEffect(() => {
    if (!stageToEdit && orderId) {
      fetchNextSequence();
    }
  }, [orderId, stageToEdit]);

  // Загрузка типов работы при монтировании компонента
  useEffect(() => {
    fetchWorkTypes();
  }, []);

  // Функция для получения следующего порядкового номера
  const fetchNextSequence = async () => {
    try {
      const response = await fetch(
        `/api/orders/${orderId}/next-stage-sequence`,
      );
      if (response.ok) {
        const data = await response.json();
        setNextSequence(data.nextSequence);
        form.setValue("sequence", data.nextSequence);
      } else {
        console.error("Ошибка при получении следующего номера этапа");
      }
    } catch (error) {
      console.error("Ошибка при получении следующего номера этапа:", error);
    }
  };

  // Функция для загрузки типов работы
  const fetchWorkTypes = async () => {
    setIsLoadingWorkTypes(true);
    try {
      const response = await fetch("/api/stage-work-types-os");
      if (response.ok) {
        const data = await response.json();
        setWorkTypes(data);
      } else {
        console.error("Ошибка при получении типов работы");
      }
    } catch (error) {
      console.error("Ошибка при получении типов работы:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить типы работы",
        variant: "destructive",
      });
    } finally {
      setIsLoadingWorkTypes(false);
    }
  };

  // Инициализация формы
  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      name: stageToEdit?.title || stageToEdit?.name || "",
      description: stageToEdit?.description || "",
      sequence: stageToEdit?.sequence || null,
      color: stageToEdit?.color || null,
      workType: stageToEdit?.workType || null,
      estimatedPrice: stageToEdit?.estimatedPrice || null,
      status: stageToEdit?.status || "active",
    },
  });

  // Отладочная информация
  useEffect(() => {
    if (stageToEdit) {
      console.log("Редактируемый этап:", stageToEdit);
    }
  }, [stageToEdit]);

  // Функция отправки формы
  const onSubmit = async (values: StageFormValues) => {
    setIsSubmitting(true);

    try {
      const isEditing = Boolean(stageToEdit);
      const url = isEditing
        ? `/api/orders/${orderId}/stages/${stageToEdit?.id}`
        : `/api/orders/${orderId}/stages`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error ||
            `Ошибка ${method === "POST" ? "создания" : "обновления"} этапа`,
        );
      }

      toast({
        title: isEditing ? "Этап обновлен" : "Этап создан",
        description: isEditing
          ? "Этап заказа успешно обновлен"
          : "Новый этап заказа успешно создан",
        variant: "default",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Ошибка при сохранении этапа:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Произошла ошибка при сохранении этапа",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-2xl p-4 mb-6 bg-card" data-oid="yq8z4jq">
      <h3 className="text-lg font-semibold mb-4" data-oid="u:11e1k">
        {stageToEdit ? "Редактирование этапа" : "Создание нового этапа"}
      </h3>

      <Form {...form} data-oid="opvgxqy">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          data-oid="h5a84:h"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem data-oid="zsjtets">
                <FormLabel data-oid="vrsohh2">Название*</FormLabel>
                <FormControl data-oid="-vyo-p8">
                  <Input
                    placeholder="Введите название этапа"
                    {...field}
                    data-oid="pzh3-ld"
                  />
                </FormControl>
                <FormMessage data-oid="votbf73" />
              </FormItem>
            )}
            data-oid="xf.uwc1"
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem data-oid="2-7n1ah">
                <FormLabel data-oid="l9vj6us">Описание</FormLabel>
                <FormControl data-oid="dz-v08c">
                  <Textarea
                    placeholder="Введите описание этапа"
                    className="min-h-[80px]"
                    {...field}
                    value={field.value || ""}
                    data-oid="3n49lj-"
                  />
                </FormControl>
                <FormMessage data-oid="gn_j3r6" />
              </FormItem>
            )}
            data-oid="pve55cz"
          />

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-oid="amz_a68"
          >
            <FormField
              control={form.control}
              name="sequence"
              render={({ field }) => (
                <FormItem data-oid="v20svs2">
                  <FormLabel data-oid="bi3.2a-">Порядковый номер</FormLabel>
                  <FormControl data-oid="3zl.9mh">
                    <Input
                      type="number"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value),
                        )
                      }
                      data-oid="fxnasdl"
                    />
                  </FormControl>
                  <FormMessage data-oid="306n-92" />
                </FormItem>
              )}
              data-oid="7dg.h_b"
            />

            <FormField
              control={form.control}
              name="estimatedPrice"
              render={({ field }) => (
                <FormItem data-oid="kaz.uif">
                  <FormLabel data-oid="h120:g7">Оценочная стоимость</FormLabel>
                  <FormControl data-oid=".3_y.nv">
                    <div className="flex items-center gap-2" data-oid="2-ev5xa">
                      <Input
                        type="number"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value),
                          )
                        }
                        data-oid="_:2y.p9"
                      />

                      <div
                        className="text-sm font-medium text-muted-foreground"
                        data-oid="nqyi.pm"
                      >
                        {orderCurrency}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage data-oid="tre-:r." />
                </FormItem>
              )}
              data-oid="fut_-ue"
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem data-oid="fayyp_t">
                  <FormLabel data-oid=".oq7.xn">Цвет</FormLabel>
                  <FormControl data-oid="mpy.r3u">
                    <div className="flex gap-2" data-oid="ek0kzyo">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1"
                        {...field}
                        value={field.value || "#6E56CF"}
                        onChange={(e) => field.onChange(e.target.value)}
                        data-oid="1bq2jdj"
                      />

                      <Input
                        placeholder="Код цвета (например, #FF5733)"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        data-oid="jijyk0x"
                      />
                    </div>
                  </FormControl>
                  <FormMessage data-oid="nct2a87" />
                </FormItem>
              )}
              data-oid=".q2w_x7"
            />

            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem data-oid="d9g.zgm">
                  <FormLabel data-oid="o-s.yh2">Тип работы</FormLabel>
                  <FormControl data-oid="phy20zj">
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || undefined}
                      disabled={isLoadingWorkTypes}
                      data-oid="96ibe08"
                    >
                      <SelectTrigger data-oid="0wwz-ft">
                        {isLoadingWorkTypes ? (
                          <div
                            className="flex items-center gap-2"
                            data-oid="jasytq9"
                          >
                            <Loader2
                              className="h-3 w-3 animate-spin"
                              data-oid=".d8javb"
                            />

                            <span data-oid="avxrom2">
                              Загрузка типов работы...
                            </span>
                          </div>
                        ) : (
                          <SelectValue
                            placeholder="Выберите тип работы"
                            data-oid="2vy2aqt"
                          />
                        )}
                      </SelectTrigger>
                      <SelectContent data-oid="khvfjj0">
                        {workTypes.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id.toString()}
                            data-oid="78fmh5i"
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                        {workTypes.length === 0 && !isLoadingWorkTypes && (
                          <div
                            className="py-2 px-3 text-sm text-muted-foreground"
                            data-oid="ex_8zhq"
                          >
                            Типы работы не найдены
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage data-oid="o41nir9" />
                </FormItem>
              )}
              data-oid="_g4h9up"
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem data-oid="_h8.us5">
                  <FormLabel data-oid="r7hfdu.">Статус</FormLabel>
                  <FormControl data-oid="4rl0y99">
                    <Input
                      placeholder="Например: active, pending, completed"
                      {...field}
                      value={field.value || ""}
                      data-oid="wuwkosq"
                    />
                  </FormControl>
                  <FormMessage data-oid="_g.c1ul" />
                </FormItem>
              )}
              data-oid="tuvb-xf"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6" data-oid=".q577m5">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-oid="wlff0ob"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} data-oid="v_38e66">
              {isSubmitting && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  data-oid="vc_rdlp"
                />
              )}
              {stageToEdit ? "Сохранить изменения" : "Создать этап"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StageForm;
