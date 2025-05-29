"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MeasurementUnit } from "./measurement-units-content";

interface MeasurementUnitCardProps {
  item: MeasurementUnit;
  onEdit: (unit: MeasurementUnit) => void;
  onDelete: (id: number) => void;
}

export function MeasurementUnitCard({
  item,
  onEdit,
  onDelete,
}: MeasurementUnitCardProps) {
  // Форматирование даты и времени в удобочитаемый формат
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
  };

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow border-none"
      data-oid="tmg1_bh"
    >
      <CardHeader className="pb-3" data-oid="mh:rxxw">
        <div className="flex justify-between items-start" data-oid="ax-7a41">
          <CardTitle className="text-lg font-semibold" data-oid=".bkcpg4">
            {item.full_name}
          </CardTitle>
        </div>
        <CardDescription data-oid="rqtwebk">ID: {item.id}</CardDescription>
      </CardHeader>
      <CardContent data-oid="ncufyna">
        <p className="text-sm text-muted-foreground mb-4" data-oid="ik:3kxr">
          Краткое название:{" "}
          <span className="font-medium" data-oid="uq5-_ut">
            {item.short_name}
          </span>
        </p>
        <div className="text-xs text-muted-foreground mb-1" data-oid="8q95772">
          Создано: {formatDate(item.created_at)}
        </div>
        <div className="text-xs text-muted-foreground mb-4" data-oid="lgbuyi_">
          Обновлено: {formatDate(item.updated_at)}
        </div>
        <div className="flex items-center gap-2" data-oid=":ue3aw.">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            data-oid="l2c.ft4"
          >
            <Edit className="mr-1 h-3.5 w-3.5" data-oid="rwyw-qj" />{" "}
            Редактировать
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(item.id)}
            data-oid="gxfeqo9"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" data-oid=":49.zy1" /> Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
