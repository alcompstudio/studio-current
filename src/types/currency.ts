/**
 * Интерфейс для сущности Валюта (Currency) в системе
 * Соответствует модели БД CurrencyOS
 */
export interface Currency {
  /** Уникальный идентификатор валюты */
  id: number;
  /** ISO-код валюты (например, USD, EUR, RUB) */
  isoCode: string; // в БД это поле называется iso_code
  /** Название валюты */
  name: string;
  /** Символ валюты (например, $, €, ₽) */
  symbol: string;
  /** Курс обмена относительно базовой валюты */
  exchangeRate: number; // в БД это поле называется exchange_rate
  /** Признак валюты по умолчанию */
  isDefault?: boolean;
  /** Дата создания записи */
  createdAt?: string;
  /** Дата последнего обновления записи */
  updatedAt?: string;
}

export interface CurrencyFormData {
  isoCode: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}
