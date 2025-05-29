"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteStageButtonProps {
  stageId: string;
  stageName: string;
  orderId: string;
  onSuccess: () => void;
}

export default function DeleteStageButton({
  stageId,
  stageName,
  orderId,
  onSuccess,
}: DeleteStageButtonProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log("Инициализация кнопки удаления для этапа:", stageId);

  const handleDelete = async () => {
    if (!stageId || !orderId) {
      console.error("Не указан ID этапа или заказа", { stageId, orderId });
      return;
    }

    console.log("Начало удаления этапа:", stageId);
    setIsDeleting(true);

    try {
      // Отправка запроса на удаление
      const response = await fetch(`/api/orders/${orderId}/stages/${stageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Ответ на запрос удаления:", response.status);

      if (response.ok) {
        toast({
          title: "Этап удален",
          description: "Этап заказа был успешно удален",
          variant: "default",
        });

        // Закрываем диалог и уведомляем родительский компонент
        setIsOpen(false);
        onSuccess();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Неизвестная ошибка" }));
        throw new Error(errorData.error || "Не удалось удалить этап");
      }
    } catch (error: any) {
      console.error("Ошибка удаления этапа:", error);
      toast({
        title: "Ошибка удаления",
        description: error.message || "Произошла ошибка при удалении этапа",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        className="h-9 w-9"
        onClick={() => {
          console.log("Клик по кнопке удаления этапа:", stageId);
          setIsOpen(true);
        }}
        type="button"
        data-oid="31dn:lc"
      >
        <Trash2 className="h-4 w-4" data-oid="05b2xhe" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen} data-oid="t1nmrj9">
        <AlertDialogContent data-oid="-pxyj7b">
          <AlertDialogHeader data-oid="d4czi4e">
            <AlertDialogTitle data-oid="z5pi542">
              Удаление этапа
            </AlertDialogTitle>
            <AlertDialogDescription data-oid="onpc21g">
              Вы уверены, что хотите удалить этап "
              {stageName || `ID: ${stageId}`}"?
              <br data-oid="q:kw646" />
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-oid="uvtlnki">
            <AlertDialogCancel disabled={isDeleting} data-oid="-_y1c2l">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-oid="05kt-.z"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
