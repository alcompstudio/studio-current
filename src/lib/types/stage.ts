export type WorkType = 'Параллельный' | 'Последовательный';

export interface Stage {
  id: string;
  order_id: string;
  name: string; // для совместимости с клиентским кодом
  title?: string; // для совместимости с API
  description?: string | null;
  sequence?: number | null;
  color?: string | null;
  workType?: WorkType | null;
  estimatedPrice?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Временно убрано, будет добавлено позже
  // options?: StageOption[];
}

// Оставляем определение типа StageOption, но не используем его пока
export interface StageOption {
  id: string;
  order_stage_id: string;
  name: string;
  description?: string | null;
  isCalculable: boolean;
  includedInPrice: boolean;
  calculationFormula?: string | null;
  planUnits?: number | null;
  unitDivider?: number | null;
  pricePerUnit?: number | null;
  calculatedPlanPrice?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStageDto {
  name: string;
  description?: string;
  sequence?: number;
  color?: string;
  workType?: WorkType;
  estimatedPrice?: number;
}

export interface UpdateStageDto extends Partial<CreateStageDto> {}

// Временно не используется
export interface CreateStageOptionDto {
  name: string;
  description?: string;
  isCalculable?: boolean;
  includedInPrice?: boolean;
  calculationFormula?: string;
  planUnits?: number;
  unitDivider?: number;
  pricePerUnit?: number;
}

// Временно не используется
export interface UpdateStageOptionDto extends Partial<CreateStageOptionDto> {}
