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
import { Edit, Trash2 } from "lucide-react";
import { PricingType } from "@/types/pricing";

interface PricingTypesTableProps {
  items: PricingType[];
  onEdit: (item: PricingType) => void;
  onDelete: (id: number) => void;
}

export function PricingTypesTable({ items, onEdit, onDelete }: PricingTypesTableProps) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto shadow-none border-0 rounded-t-2xl">
          <Table className="w-full caption-bottom text-sm border-none shadow-none">
            <TableHeader className="[&_tr]:border-b-[3px] [&_tr]:border-[#f9fafb] bg-sidebar-accent">
              <TableRow>
                <TableHead className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0">Код</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0">Наименование</TableHead>
                <TableHead className="h-12 px-4 align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-0">
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id} className="border-b-[3px] border-[#f9fafb] transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">{item.id}</TableCell>
                    <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{item.name}</TableCell>
                    <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0 rounded-l-full rounded-r-full"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => item.id ? onDelete(item.id) : undefined}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 rounded-l-full rounded-r-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Типы ценообразования не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
