import { z } from "zod";
import { StageOption } from "@/lib/types/stage";

// Тип для опций из таблицы pricing_type_os
export interface PricingTypeOption {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Тип для единиц измерения
export interface VolumeUnit {
  id: number;
  full_name: string;
  short_name: string;
}

// Схема валидации формы
export const stageOptionFormSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
  description: z.string().optional(),
  pricing_type_id: z.coerce.number().min(1, "Тип ценообразования обязателен"),
  volume_min: z.coerce.number().nullable().optional(),
  volume_max: z.coerce.number().nullable().optional(),
  volume_unit_id: z.coerce.number().nullable().optional(),
  nominal_volume: z.coerce.number().nullable().optional(),
  price_per_unit: z.coerce.number().nullable().optional(),
});

export type StageOptionFormValues = z.infer<typeof stageOptionFormSchema>;

export interface StageOptionFormProps {
  orderId: string;
  stageId: string;
  optionToEdit?: StageOption | null;
  onSuccess: () => void;
  onCancel: () => void;
  orderCurrency?: string;
}

// Тип для расчетных цен
export interface CalculatedPrices {
  min: number | null;
  max: number | null;
}
