"use client";

import { useState, ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteOrderDialogProps {
  orderId: string | number;
  className?: string;
  variant?:
    | "outline"
    | "ghost"
    | "link"
    | "default"
    | "destructive"
    | "secondary"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  children?: ReactNode;
  buttonClassName?: string;
  onDeleteSuccess?: () => void;
}

export function DeleteOrderDialog({
  orderId,
  className,
  variant = "outline",
  size,
  children,
  buttonClassName,
  onDeleteSuccess,
}: DeleteOrderDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при удалении заказа");
      }

      // Обновляем страницу или перенаправляем
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        router.push("/orders");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при удалении заказа",
      );
      console.error("Ошибка при удалении заказа:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog data-oid="_6_2h2c">
      <AlertDialogTrigger asChild data-oid="usl8wp4">
        <Button
          variant={variant}
          size={size}
          className={
            buttonClassName ||
            `text-destructive hover:bg-destructive hover:text-destructive-foreground ${className || ""}`
          }
          data-oid="_u8t2-f"
        >
          {children || <Trash2 className="h-4 w-4" data-oid="1fhy4gn" />}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent data-oid=".ff1du2">
        <AlertDialogHeader data-oid="l-:3wvl">
          <AlertDialogTitle data-oid="c8452bx">
            Подтверждение удаления
          </AlertDialogTitle>
          <AlertDialogDescription data-oid="36jly0g">
            Вы действительно хотите удалить этот заказ? Это действие невозможно
            отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div
            className="bg-destructive/10 text-destructive text-sm p-3 rounded-md"
            data-oid="2dqp3:k"
          >
            {error}
          </div>
        )}

        <AlertDialogFooter data-oid="j_k3xn.">
          <AlertDialogCancel disabled={isDeleting} data-oid="j0bq6u:">
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Предотвращаем автоматическое закрытие диалога
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-oid="-23-6g6"
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
