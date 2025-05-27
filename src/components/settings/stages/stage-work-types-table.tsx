"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit3, Trash2 } from "lucide-react";

interface WorkType {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StageWorkTypesTableProps {
  items: WorkType[];
  onEdit: (item: WorkType) => void;
  onDelete: (id: number) => void;
}

export function StageWorkTypesTable({
  items,
  onEdit,
  onDelete,
}: StageWorkTypesTableProps) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Наименование</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((workType) => (
              <TableRow key={workType.id}>
                <TableCell className="font-medium">{workType.id}</TableCell>
                <TableCell>{workType.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(workType)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                      onClick={() => onDelete(workType.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                  Типы работы не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
