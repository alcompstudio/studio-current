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

export function StatusTable({ items, basePath, onDelete, onEdit }: StatusTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Пример</TableHead>
          <TableHead className="w-[150px]">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((status) => (
            <TableRow key={status.id}>
              <TableCell>{status.id}</TableCell>
              <TableCell>{status.name}</TableCell>
              <TableCell>
                <div
                  className="rounded-full border px-2.5 py-0.5 text-xs font-semibold inline-block"
                  style={{
                    backgroundColor: status.backgroundColor,
                    color: status.textColor,
                    borderColor: status.textColor,
                  }}
                >
                  {status.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(status)}
                    title="Редактировать"
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(status.id)}
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              Статусы не найдены
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
