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

export function PricingTypeCard({ item, onEdit, onDelete }: PricingTypeCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-none">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {item.name}
          </CardTitle>
        </div>
        <CardDescription>
          ID: {item.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {item.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(item)}
          >
            <Edit className="mr-1 h-3.5 w-3.5" /> Редактировать
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
