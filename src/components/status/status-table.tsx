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
import { SquarePen, Trash2, Palette, Plus, Edit3 } from "lucide-react"; // Добавлены Palette, Plus, Edit3
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Импортируем компоненты Card

interface StatusItem {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  isDefault?: boolean; // Добавлено для соответствия ProjectStatus
}

interface StatusTableProps {
  items: StatusItem[];
  basePath: string; // Например: "/settings/project-statuses" или "/settings/order-statuses"
  onDelete: (id: number) => void;
  onEdit: (item: StatusItem) => void; // Добавляем onEdit prop
}

export function StatusTable({
  items,
  basePath,
  onDelete,
  onEdit,
}: StatusTableProps) {
  return (
    <Table data-oid="l4bof0a">
      <TableHeader data-oid="pcak6fr">
        <TableRow data-oid="n875u4p">
          <TableHead data-oid="v-z4gba">ID</TableHead>
          <TableHead data-oid="mixk1zv">Название</TableHead>
          <TableHead data-oid="hd6ux2v">Пример</TableHead>
          <TableHead className="w-[150px]" data-oid="-p993ga">
            Действия
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody data-oid="ektqtyy">
        {items.length > 0 ? (
          items.map((status) => (
            <TableRow key={status.id} data-oid="21jze-l">
              <TableCell data-oid="pp1j25a">{status.id}</TableCell>
              <TableCell data-oid="fnowj_k">{status.name}</TableCell>
              <TableCell data-oid="p:7.k-b">
                <div
                  className="rounded-full border px-2.5 py-0.5 text-xs font-semibold inline-block"
                  style={{
                    backgroundColor: status.backgroundColor,
                    color: status.textColor,
                    borderColor: status.textColor,
                  }}
                  data-oid="7o4.fih"
                >
                  {status.name}
                </div>
              </TableCell>
              <TableCell data-oid="l.dln2w">
                <div className="flex items-center gap-2" data-oid="o5fyfv8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(status)}
                    title="Редактировать"
                    data-oid="733ye:h"
                  >
                    <SquarePen className="h-4 w-4" data-oid="q9now.6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(status.id)}
                    title="Удалить"
                    data-oid="agx-f.n"
                  >
                    <Trash2 className="h-4 w-4" data-oid="86tv:i-" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow data-oid="ffemfy0">
            <TableCell
              colSpan={4}
              className="text-center py-4"
              data-oid="p1-tvs."
            >
              Статусы не найдены
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
