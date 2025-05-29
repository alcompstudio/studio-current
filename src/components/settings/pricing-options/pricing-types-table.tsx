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
import { Edit, Trash2 } from "lucide-react";
import { PricingType } from "@/types/pricing";

interface PricingTypesTableProps {
  items: PricingType[];
  onEdit: (item: PricingType) => void;
  onDelete: (id: number) => void;
}

export function PricingTypesTable({
  items,
  onEdit,
  onDelete,
}: PricingTypesTableProps) {
  return (
    <Card className="border-none shadow-none" data-oid="g2s4_2g">
      <CardContent className="p-0" data-oid="jm7_0wr">
        <div
          className="relative w-full overflow-auto shadow-none border-0 rounded-t-2xl"
          data-oid="74_ak7a"
        >
          <Table
            className="w-full caption-bottom text-sm border-none shadow-none"
            data-oid="bdsfv_9"
          >
            <TableHeader
              className="[&_tr]:border-b-[3px] [&_tr]:border-[#f9fafb] bg-sidebar-accent"
              data-oid="mi8mvne"
            >
              <TableRow data-oid="nyb5:2g">
                <TableHead
                  className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0"
                  data-oid="s_ad7vq"
                >
                  Код
                </TableHead>
                <TableHead
                  className="h-12 px-4 text-left align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0"
                  data-oid="z6g8q2j"
                >
                  Наименование
                </TableHead>
                <TableHead
                  className="h-12 px-4 align-middle font-medium text-sidebar-accent-foreground [&:has([role=checkbox])]:pr-0 text-right"
                  data-oid="ogt:q-2"
                >
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              className="[&_tr:last-child]:border-0"
              data-oid="hb..y-x"
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b-[3px] border-[#f9fafb] transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    data-oid="sr0t0lz"
                  >
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium"
                      data-oid="3sqd9od"
                    >
                      {item.id}
                    </TableCell>
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      data-oid="0fp8aad"
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right"
                      data-oid="f5xshlb"
                    >
                      <div
                        className="flex justify-end gap-2"
                        data-oid="-h4ct62"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0 rounded-l-full rounded-r-full"
                          data-oid="7ip5sol"
                        >
                          <Edit className="h-4 w-4" data-oid="5b82u6m" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            item.id ? onDelete(item.id) : undefined
                          }
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 rounded-l-full rounded-r-full"
                          data-oid="ufsz0jq"
                        >
                          <Trash2 className="h-4 w-4" data-oid="vqkwubl" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow data-oid="im4l8ry">
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center"
                    data-oid="i11vwld"
                  >
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
