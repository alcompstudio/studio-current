"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Edit3,
  Trash2,
  Palette,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Added for router.refresh
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ViewToggle } from "@/components/status/view-toggle";
import { StatusTable } from "@/components/status/status-table";
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

// Тип для статуса проекта
interface ProjectStatus {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  isDefault?: boolean; // Added from edit page
}

// Схема валидации для формы статуса проекта
const projectStatusFormSchema = z.object({
  name: z.string().min(1, { message: "Название статуса обязательно" }),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Неверный формат HEX цвета (например, #RRGGBB)",
  }),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Неверный формат HEX цвета (например, #RRGGBB)",
  }),
});

type ProjectStatusFormValues = z.infer<typeof projectStatusFormSchema>;

interface ProjectStatusFormProps {
  initialData?: ProjectStatus | null;
  onSave: () => void;
  onCancel: () => void;
}

function ProjectStatusForm({
  initialData,
  onSave,
  onCancel,
}: ProjectStatusFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectStatusFormValues>({
    resolver: zodResolver(projectStatusFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          textColor: initialData.textColor,
          backgroundColor: initialData.backgroundColor,
        }
      : {
          name: "",
          textColor: "#FFFFFF",
          backgroundColor: "#4CAF50",
        },
    mode: "onChange",
  });

  const handleSubmit = async (data: ProjectStatusFormValues) => {
    setIsSubmitting(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `/api/settings/project-statuses/${initialData.id}`
      : "/api/settings/project-statuses";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка ${initialData ? "обновления" : "создания"} статуса: ${response.statusText}`,
        );
      }

      toast({
        title: `Статус проекта ${initialData ? "обновлен" : "создан"}`,
        description: `Статус "${data.name}" успешно ${initialData ? "обновлен" : "создан"}.`,
      });
      onSave(); // Вызываем callback для обновления списка и закрытия формы
      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error(
        `Не удалось ${initialData ? "обновить" : "создать"} статус проекта:`,
        error,
      );
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: `Ошибка ${initialData ? "обновления" : "создания"} статуса проекта`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card data-oid="2o.jtw6">
      <CardHeader data-oid="qj3my_v">
        <div className="flex items-center justify-between" data-oid="zma069m">
          <div className="flex items-center gap-4" data-oid="s9g:dlm">
            <Button
              variant="outline"
              className="h-10 w-10 p-0 flex items-center justify-center"
              onClick={onCancel}
              data-oid="wbui9k3"
            >
              <ArrowLeft className="h-5 w-5" data-oid="_yr:yim" />
            </Button>
            <div data-oid="5cds:_v">
              <CardTitle data-oid="8dajz9e">
                {initialData ? "Редактировать статус" : "Создать новый статус"}
              </CardTitle>
              <CardDescription data-oid=".rd-wgi">
                {initialData
                  ? `Изменение данных для статуса "${initialData.name}".`
                  : "Добавить новый статус для проектов."}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting || !form.formState.isValid}
            data-oid="6:7w22f"
          >
            <Save className="mr-2 h-4 w-4" data-oid="3t.qqyh" />{" "}
            {isSubmitting
              ? "Сохранение..."
              : initialData
                ? "Сохранить изменения"
                : "Сохранить статус"}
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="d7r291q">
        <Form {...form} data-oid="xg5cx5k">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
            data-oid="iiiw-t2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem data-oid="w-s06qv">
                  <FormLabel data-oid="s7japp.">Название статуса</FormLabel>
                  <FormControl data-oid="wf_99t2">
                    <Input
                      placeholder="e.g., In Review, Blocked"
                      {...field}
                      data-oid="vf1eh8x"
                    />
                  </FormControl>
                  <FormMessage data-oid="ykobcgk" />
                </FormItem>
              )}
              data-oid="ovqo3zj"
            />

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-oid="uq6rg3s"
            >
              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem data-oid="_wm.v2-">
                    <FormLabel className="flex items-center" data-oid="::a-ye0">
                      <Palette className="mr-2 h-4 w-4" data-oid="59eqshw" />{" "}
                      Цвет текста (HEX)
                    </FormLabel>
                    <FormControl data-oid="0gnlsft">
                      <div
                        className="flex items-center gap-2"
                        data-oid="wkrq:ti"
                      >
                        <Input
                          type="color"
                          {...field}
                          className="p-1 h-10 w-14 block"
                          data-oid="..139tv"
                        />

                        <Input
                          placeholder="#FFFFFF"
                          {...field}
                          data-oid="oyi0q2o"
                        />
                      </div>
                    </FormControl>
                    <FormMessage data-oid="8fyusn." />
                  </FormItem>
                )}
                data-oid="clpvqcw"
              />

              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem data-oid="8felqn.">
                    <FormLabel className="flex items-center" data-oid="c-hbzaj">
                      <Palette className="mr-2 h-4 w-4" data-oid="six.fwd" />{" "}
                      Цвет фона (HEX)
                    </FormLabel>
                    <FormControl data-oid="80ob:mw">
                      <div
                        className="flex items-center gap-2"
                        data-oid="tg4ye:3"
                      >
                        <Input
                          type="color"
                          {...field}
                          className="p-1 h-10 w-14 block"
                          data-oid="_:q883k"
                        />

                        <Input
                          placeholder="#3B82F6"
                          {...field}
                          data-oid="bvvj-tk"
                        />
                      </div>
                    </FormControl>
                    <FormMessage data-oid="jl28f5v" />
                  </FormItem>
                )}
                data-oid="ctp7nax"
              />
            </div>
            <FormItem data-oid=".anyp8f">
              <FormLabel data-oid="sd_k3i9">Предпросмотр</FormLabel>
              <div
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent"
                style={{
                  color: form.watch("textColor"),
                  backgroundColor: form.watch("backgroundColor"),
                }}
                data-oid="k6tk4ub"
              >
                {form.watch("name") || "Пример статуса"}
              </div>
            </FormItem>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ProjectStatusesContent() {
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "table">("table");
  const [showForm, setShowForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProjectStatus | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<ProjectStatus | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchProjectStatuses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings/project-statuses");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Ошибка получения статусов проектов: ${response.statusText}`,
        );
      }
      const data = await response.json();
      setProjectStatuses(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Failed to fetch project statuses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProjectStatuses = async () => {
      try {
        setIsLoading(true);

        // Запрашиваем данные из БД через API
        const response = await fetch("/api/settings/project-statuses");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Ошибка получения статусов проектов: ${response.statusText}`,
          );
        }

        const data = await response.json();
        setProjectStatuses(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch project statuses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectStatuses();
  }, []);

  // Обработчик открытия диалога подтверждения удаления
  const openDeleteDialog = (status: ProjectStatus) => {
    setStatusToDelete(status);
    setDeleteDialogOpen(true);
  };

  // Функция удаления статуса проекта
  const handleDelete = async (statusId: number) => {
    if (!statusId) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `/api/settings/project-statuses/${statusId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка удаления статуса: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Оптимистично удаляем из UI
      setProjectStatuses(
        projectStatuses.filter((status) => status.id !== statusId),
      );

      toast({
        title: "Статус удален",
        description: data.message || "Статус проекта успешно удален",
      });

      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error("Не удалось удалить статус проекта:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка удаления статуса",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setStatusToDelete(null);
    }
  };

  // Компонент для отображения и управления статусами проектов.
  return (
    <>
      <div className="flex flex-col gap-6" data-oid="o3p.iu_">
        {/* Page Header */}
        <div className="flex items-center justify-between" data-oid=".tpmm26">
          <div data-oid="guz-w29">
            <h2 className="text-lg font-semibold" data-oid="xwb4jgb">
              Статусы проектов
            </h2>
            <p className="text-sm text-muted-foreground" data-oid="2b.m4vu">
              Управление различными статусами для ваших проектов.
            </p>
          </div>
          <div className="flex gap-2" data-oid="ym3h75e">
            {!showForm && (
              <ViewToggle
                view={view}
                onViewChange={setView}
                data-oid="_l4k74:"
              />
            )}
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingStatus(null);
                  setShowForm(true);
                }}
                data-oid="wbl1pv7"
              >
                <Plus className="w-4 h-4 mr-2" data-oid="oki5-98" /> Создать
                статус проекта
              </Button>
            )}
          </div>
        </div>

        {/* Form or Status List Content */}
        <div data-oid="-_p576y">
          {showForm ? (
            <ProjectStatusForm
              initialData={editingStatus}
              onSave={() => {
                setShowForm(false);
                setEditingStatus(null);
                fetchProjectStatuses(); // Refetch after save
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingStatus(null);
              }}
              data-oid="iuf:t6b"
            />
          ) : isLoading ? (
            <Card className="shadow-sm border-none" data-oid="eflxshw">
              <CardContent
                className="flex items-center justify-center gap-2 py-6 text-muted-foreground"
                data-oid="9by95ca"
              >
                <Loader2 className="h-5 w-5 animate-spin" data-oid="2cv:sus" />
                <p data-oid=":lr8-i:">Загрузка статусов проектов...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card
              className="shadow-sm border-destructive bg-destructive/10"
              data-oid="1ym_v5_"
            >
              <CardContent
                className="flex items-center gap-2 text-destructive py-4"
                data-oid="3n5n0bs"
              >
                <AlertTriangle className="h-5 w-5" data-oid="9-.k9yo" />
                <p className="text-sm font-semibold" data-oid="lk7.pxl">
                  Ошибка загрузки статусов проектов: {error}
                </p>
              </CardContent>
            </Card>
          ) : view === "table" ? (
            <Card data-oid="mp6clby">
              <StatusTable
                items={projectStatuses}
                basePath="/settings/project-statuses"
                onDelete={(id) => {
                  const status = projectStatuses.find((s) => s.id === id);
                  if (status) openDeleteDialog(status);
                }}
                onEdit={(status) => {
                  setEditingStatus(status as ProjectStatus);
                  setShowForm(true);
                }}
                data-oid="-pmcgnp"
              />
            </Card>
          ) : (
            <div className="space-y-4" data-oid="mc_zx8n">
              {projectStatuses.length > 0 ? (
                projectStatuses.map((status) => (
                  <Card
                    key={status.id}
                    className="shadow-sm hover:shadow-md transition-shadow border-none"
                    data-oid="j8p25.f"
                  >
                    <CardHeader className="pb-3" data-oid="yto6g04">
                      <div
                        className="flex justify-between items-start"
                        data-oid="y5aw38u"
                      >
                        <CardTitle
                          className="text-lg font-semibold flex items-center"
                          data-oid="n6fomqo"
                        >
                          <Palette
                            className="mr-2 h-5 w-5"
                            style={{ color: status.textColor }}
                            data-oid=":l-hd1-"
                          />

                          {status.name}
                        </CardTitle>
                        <div
                          className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex items-center"
                          style={{
                            backgroundColor: status.backgroundColor,
                            color: status.textColor,
                            borderColor: status.textColor,
                          }}
                          data-oid="ced-tmf"
                        >
                          {status.name}
                        </div>
                      </div>
                      <CardDescription data-oid="ycr-11d">
                        ID: {status.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="vg5ria_">
                      <div
                        className="flex items-center gap-2"
                        data-oid="q4l4rma"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingStatus(status);
                            setShowForm(true);
                          }}
                          data-oid="7ky3fd6"
                        >
                          <Edit3
                            className="mr-1 h-3.5 w-3.5"
                            data-oid="e394p3q"
                          />{" "}
                          Редактировать
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => openDeleteDialog(status)}
                          data-oid="i01jw1p"
                        >
                          <Trash2
                            className="mr-1 h-3.5 w-3.5"
                            data-oid="12_-iee"
                          />{" "}
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-sm border-none" data-oid="dny345f">
                  <CardContent data-oid="auhtagx">
                    <p
                      className="text-sm text-muted-foreground py-4 text-center"
                      data-oid=":jqkqxm"
                    >
                      Статусы проектов не найдены. Создайте статус, чтобы начать
                      работу.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        data-oid="6lxrnkp"
      >
        <DialogContent className="sm:max-w-md" data-oid="2e1rh6_">
          <DialogHeader data-oid=":fwn4wz">
            <DialogTitle data-oid="kvhzjdg">
              Удаление статуса проекта
            </DialogTitle>
            <DialogDescription data-oid="jq196iy">
              {statusToDelete ? (
                <>
                  Вы действительно хотите удалить статус "{statusToDelete.name}
                  "? Это действие нельзя будет отменить.
                </>
              ) : (
                "Вы действительно хотите удалить этот статус проекта? Это действие нельзя будет отменить."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter
            className="flex items-center justify-between sm:justify-between"
            data-oid="9w3rgol"
          >
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setStatusToDelete(null);
              }}
              disabled={isDeleting}
              data-oid="gg2wzdl"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => statusToDelete && handleDelete(statusToDelete.id)}
              disabled={isDeleting}
              className="gap-1"
              data-oid="j-mwzdc"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    data-oid="osed8_0"
                  />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" data-oid="nofc4z4" />
                  Удалить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
