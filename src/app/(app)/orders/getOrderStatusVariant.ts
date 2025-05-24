// src/app/(app)/orders/getOrderStatusVariant.ts
import type { OrderStatusOS } from "@/lib/types/order";

// Функция для получения варианта бейджа в зависимости от статуса заказа
export const getOrderStatusVariant = (
  statusId: number | undefined | null,
  statuses: OrderStatusOS[]
): "default" | "secondary" | "destructive" | "outline" | "success" => {
  // Если статусы не загружены или статус не определен, вернем вариант по умолчанию
  if (!statuses.length || statusId === undefined || statusId === null) {
    return "secondary";
  }

  // Найдем статус по ID
  const status = statuses.find(s => s.id === statusId);
  if (!status) return "secondary";

  // Определим вариант в зависимости от имени статуса
  switch (status.name) {
    case "Новый": return "outline";
    case "Сбор ставок": return "default"; // Blue/Primary
    case "На паузе": return "secondary"; // Gray
    case "Сбор завершен": return "success"; // Green
    case "Отменен": return "destructive"; // Red
    default: return "secondary";
  }
};

// Функция для получения стилей CSS на основе цветов статуса
export const getOrderStatusStyle = (
  statusId: number | undefined | null,
  statuses: OrderStatusOS[]
): { color: string; backgroundColor: string } => {
  // Если статусы не загружены или статус не определен, вернем стандартные цвета
  if (!statuses.length || statusId === undefined || statusId === null) {
    return { color: "#71717a", backgroundColor: "#f4f4f5" };
  }

  // Найдем статус по ID
  const status = statuses.find(s => s.id === statusId);
  if (!status) return { color: "#71717a", backgroundColor: "#f4f4f5" };

  // Вернем цвета из базы данных
  return { 
    color: status.textColor,
    backgroundColor: status.backgroundColor 
  };
};
