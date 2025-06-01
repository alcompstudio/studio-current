"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CalculatedPrices, StageOptionFormValues, VolumeUnit } from "./types";

interface PriceCalculationProps {
  calculatedPrices: CalculatedPrices;
  form: UseFormReturn<StageOptionFormValues>;
  units: VolumeUnit[];
  orderCurrency: string;
}

export const PriceCalculation: React.FC<PriceCalculationProps> = ({
  calculatedPrices,
  form,
  units,
  orderCurrency
}) => {
  return (
    <div
      className="p-3 border rounded-md bg-muted/30 mt-4"
      data-oid="1_77acg"
    >
      <div className="text-sm" data-oid="_:.hge:">
        <span className="text-sm font-semibold" data-oid="3ucvz19">Предварительный расчет: </span>
        {calculatedPrices.min !== null && calculatedPrices.max !== null ? (
          <span className="font-medium" data-oid="ji21gn-">
            {calculatedPrices.min.toFixed(2)} - {calculatedPrices.max.toFixed(2)} {orderCurrency}
            {form.watch("volume_min") != null && 
              form.watch("volume_max") != null && 
              form.watch("volume_unit_id") != null && (
              <> за {parseFloat(String(form.watch("volume_min"))).toFixed(4).replace(".", ",")} - {parseFloat(String(form.watch("volume_max"))).toFixed(4).replace(".", ",")} {units.find((unit) => unit.id === form.watch("volume_unit_id"))?.short_name || ""}</>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground" data-oid="ltixe1t">
            Не указано
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceCalculation;
