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
import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";

interface StatusItem {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
}

interface StatusTableProps {
  items: StatusItem[];
  basePath: string; // Например: "/settings/project-statuses" или "/settings/order-statuses"
  onDelete: (id: number) => void;
}

export function StatusTable({ items, basePath, onDelete }: StatusTableProps) {
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
                    asChild
                  >
                    <Link href={`${basePath}/${status.id}/edit`} title="Редактировать">
                      <SquarePen className="h-4 w-4" />
                    </Link>
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
