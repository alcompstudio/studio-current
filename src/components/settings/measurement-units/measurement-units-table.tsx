"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { MeasurementUnit } from "./measurement-units-content";

interface MeasurementUnitsTableProps {
  items: MeasurementUnit[];
  onEdit: (unit: MeasurementUnit) => void;
  onDelete: (id: number) => void;
}

export function MeasurementUnitsTable({
  items,
  onEdit,
  onDelete,
}: MeasurementUnitsTableProps) {
  // Форматирование даты и времени в удобочитаемый формат
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
  };

  return (
    <Card className="border-none shadow-none" data-oid="2na:x4p">
      <CardContent className="p-0" data-oid="jemqlii">
        <div
          className="relative w-full overflow-auto shadow-none border-0 rounded-t-2xl"
          data-oid="a3n40_z"
        >
          <Table
            className="w-full caption-bottom text-sm border-none shadow-none"
            data-oid="h4-__ac"
          >
            <TableHeader
              className="[&_tr]:border-b-[3px] [&_tr]:border-[#f9fafb] bg-sidebar-accent"
              data-oid=":sbj4-w"
            >
              <TableRow data-oid="sotxzpe">
                <TableHead
                  className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0 w-[50px]"
                  data-oid="jpl0ix2"
                >
                  ID
                </TableHead>
                <TableHead
                  className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0"
                  data-oid="0suiufm"
                >
                  Полное название
                </TableHead>
                <TableHead
                  className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0"
                  data-oid="rkf53sh"
                >
                  Краткое название
                </TableHead>
                <TableHead
                  className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0"
                  data-oid="1cp-kmf"
                >
                  Дата создания
                </TableHead>
                <TableHead
                  className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0"
                  data-oid="afi006e"
                >
                  Дата обновления
                </TableHead>
                <TableHead
                  className="h-12 px-4 align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0 text-right"
                  data-oid="r-.tsqy"
                >
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              className="[&_tr:last-child]:border-0"
              data-oid="v2tenn."
            >
              {items.length === 0 ? (
                <TableRow data-oid="7r65rvz">
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center"
                    data-oid="nebtyn4"
                  >
                    Единицы измерения не найдены
                  </TableCell>
                </TableRow>
              ) : (
                items.map((unit) => (
                  <TableRow
                    key={unit.id}
                    className="border-b-[3px] border-[#f9fafb] transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    data-oid="rc2lsg0"
                  >
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium"
                      data-oid="g-sgfm3"
                    >
                      {unit.id}
                    </TableCell>
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      data-oid="a.hhspo"
                    >
                      {unit.full_name}
                    </TableCell>
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      data-oid="rur6-pb"
                    >
                      {unit.short_name}
                    </TableCell>
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      data-oid="5_l90hf"
                    >
                      {formatDate(unit.created_at)}
                    </TableCell>
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      data-oid="0_roxgc"
                    >
                      {formatDate(unit.updated_at)}
                    </TableCell>
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right"
                      data-oid="yo8j_sz"
                    >
                      <div
                        className="flex justify-end gap-2"
                        data-oid="u8affm9"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(unit)}
                          className="h-8 w-8 p-0 rounded-l-full rounded-r-full"
                          title="Редактировать"
                          data-oid="0f4.769"
                        >
                          <Edit className="h-4 w-4" data-oid="83d7w8j" />
                          <span className="sr-only" data-oid="4ms_:6v">
                            Редактировать
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(unit.id)}
                          title="Удалить"
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          data-oid="-ac:2im"
                        >
                          <Trash2 className="h-4 w-4" data-oid=":uv_g9s" />
                          <span className="sr-only" data-oid="-yd0ifg">
                            Удалить
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
