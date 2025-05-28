export interface PricingType {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Схема валидации формы типа ценообразования с использованием zod
import { z } from 'zod';

export const pricingTypeFormSchema = z.object({
  name: z.string().min(1, { message: 'Название типа обязательно' }),
});

export type PricingTypeFormValues = z.infer<typeof pricingTypeFormSchema>;

export interface PricingTypeFormData {
  name: string;
  description?: string;
}
