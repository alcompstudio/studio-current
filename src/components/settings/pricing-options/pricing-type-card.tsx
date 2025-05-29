"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { PricingType } from "@/types/pricing";

interface PricingTypeCardProps {
  item: PricingType;
  onEdit: (item: PricingType) => void;
  onDelete: (id: number) => void;
}

export function PricingTypeCard({
  item,
  onEdit,
  onDelete,
}: PricingTypeCardProps) {
  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow border-none"
      data-oid="akqzo87"
    >
      <CardHeader className="pb-3" data-oid="aavolry">
        <div className="flex justify-between items-start" data-oid="j.484fg">
          <CardTitle className="text-lg font-semibold" data-oid="8g13b2n">
            {item.name}
          </CardTitle>
        </div>
        <CardDescription data-oid="qp1dwi_">ID: {item.id}</CardDescription>
      </CardHeader>
      <CardContent data-oid=":jx-1rm">
        {item.description && (
          <p className="text-sm text-muted-foreground mb-4" data-oid="dklb:zq">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2" data-oid="yw3d2c-">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            data-oid="11rr_h5"
          >
            <Edit className="mr-1 h-3.5 w-3.5" data-oid="ihc::6i" />{" "}
            Редактировать
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(item.id)}
            data-oid="5mr0ln_"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" data-oid="qkcr1b1" /> Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
