"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="border-none shadow-none" data-oid="4nkwmdh">
      <CardContent className="p-0" data-oid="jf56kkm">
        <Table data-oid="mu_mugn">
          <TableHeader data-oid="jgdr6ya">
            <TableRow data-oid=".6w2eo7">
              <TableHead data-oid="5.gmzja">ID</TableHead>
              <TableHead data-oid="n7c1sg1">Наименование</TableHead>
              <TableHead className="text-right" data-oid="z:_s-im">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-oid="3ripgfq">
            {items.map((workType) => (
              <TableRow key={workType.id} data-oid="o:4rplk">
                <TableCell className="font-medium" data-oid="wcugljz">
                  {workType.id}
                </TableCell>
                <TableCell data-oid="rc5vukr">{workType.name}</TableCell>
                <TableCell className="text-right" data-oid="7etf6-t">
                  <div className="flex justify-end gap-2" data-oid="23m07.p">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(workType)}
                      data-oid="iymovpi"
                    >
                      <Edit3 className="h-4 w-4" data-oid="or7xfp5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                      onClick={() => onDelete(workType.id)}
                      data-oid="qg.oxh7"
                    >
                      <Trash2 className="h-4 w-4" data-oid="zt_n84j" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow data-oid="pq-yj4b">
                <TableCell
                  colSpan={3}
                  className="text-center h-24 text-muted-foreground"
                  data-oid="up4iemz"
                >
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
