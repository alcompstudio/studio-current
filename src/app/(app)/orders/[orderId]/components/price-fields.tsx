"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { StageOptionFormValues, VolumeUnit } from "./types";

interface PriceFieldsProps {
  form: UseFormReturn<StageOptionFormValues>;
  units: VolumeUnit[];
  orderCurrency: string;
}

export const PriceFields: React.FC<PriceFieldsProps> = ({
  form,
  units,
  orderCurrency,
}) => {
  return (
    <div className="mt-6">
      <h5 className="text-sm font-semibold mb-3">Параметры цены</h5>
      <div className="flex items-center space-x-2">
        <div className="relative" style={{ width: '30%' }}>
          <Input
            type="number"
            step="0.01"
            placeholder="Цена за единицу"
            {...form.register("price_per_unit", {
              setValueAs: (v) => v === "" ? null : parseFloat(v),
            })}
            value={form.watch("price_per_unit") == null ? "" : String(form.watch("price_per_unit"))}
            data-oid="8e8cd9z"
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
            data-oid="fxa07zq"
          >
            <span
              className="text-muted-foreground"
              data-oid="4r-gue7"
            >
              {orderCurrency}
            </span>
          </div>
        </div>
        <span className="text-sm">за</span>
        <div style={{ width: '30%' }}>
          <Input
            type="number"
            step="0.0001"
            placeholder="Номинальный объем"
            {...form.register("nominal_volume", {
              setValueAs: (v) => v === "" ? null : parseFloat(v),
            })}
            value={form.watch("nominal_volume") == null ? "" : String(form.watch("nominal_volume"))}
            data-oid="vp5r.9d"
          />
        </div>
        <span className="text-sm">
          {form.watch("volume_unit_id") ? 
            units.find((unit) => unit.id === form.watch("volume_unit_id"))?.short_name : 
            ""}
        </span>
      </div>
      <div data-oid="eprznof" className="text-sm text-destructive mt-1">
        {form.formState.errors.price_per_unit?.message}
      </div>
      <div data-oid="xyxrnss" className="text-sm text-destructive mt-1">
        {form.formState.errors.nominal_volume?.message}
      </div>
    </div>
  );
};

export default PriceFields;
