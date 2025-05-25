"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant={view === "table" ? "default" : "outline"}
        className="h-10 w-10 rounded-full p-0"
        onClick={() => onViewChange("table")}
        aria-label="Вид таблицей"
        title="Вид таблицей"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "grid" ? "default" : "outline"}
        className="h-10 w-10 rounded-full p-0"
        onClick={() => onViewChange("grid")}
        aria-label="Вид карточками"
        title="Вид карточками"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
