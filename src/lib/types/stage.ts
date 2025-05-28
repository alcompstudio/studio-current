export interface WorkTypeOption {
  id: number;
  name: string;
}

export interface Stage {
  id: string;
  order_id: string;
  name: string; // для совместимости с клиентским кодом
  title?: string; // для совместимости с API
  description?: string | null;
  sequence?: number | null;
  color?: string | null;
  workType?: number | null;
  workTypeDetails?: WorkTypeOption;
  estimatedPrice?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  options?: StageOption[]; // Теперь включено
}

export interface StageOption {
  id: string;
  order_stage_id: string;
  name: string;
  description?: string | null;
  pricing_type?: 'calculable' | 'included'; // Устаревшее: Тип ценообразования (для обратной совместимости)
  pricing_type_id?: number; // Новое: ID типа ценообразования из таблицы pricing_type_os
  // Поля для диапазона объема
  volume_min?: number | null;
  volume_max?: number | null;
  volume_unit?: string | null; // Единица измерения объема (шт., симв., %, слов, ч и т.д.)
  nominal_volume?: number | null; // Номинальный объем для расчета
  price_per_unit?: number | null; // Цена за единицу объема
  // Рассчитанная стоимость (мин и макс)
  calculated_price_min?: number | null;
  calculated_price_max?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStageDto {
  name: string;
  description?: string;
  sequence?: number;
  color?: string;
  workType?: number;
  estimatedPrice?: number;
}

export interface UpdateStageDto extends Partial<CreateStageDto> {}

export interface CreateStageOptionDto {
  name: string;
  description?: string;
  pricing_type?: 'calculable' | 'included';
  volume_min?: number;
  volume_max?: number;
  volume_unit?: string;
  nominal_volume?: number;
  price_per_unit?: number;
}

// Временно не используется
export interface UpdateStageOptionDto extends Partial<CreateStageOptionDto> {}
