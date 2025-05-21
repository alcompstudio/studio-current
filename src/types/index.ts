// src/types/index.ts

// Интерфейс для статуса проекта
export interface ProjectStatus {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  createdAt: string; // или Date, если вы будете преобразовывать
  updatedAt: string; // или Date
}

// Интерфейс для заказчика
export interface Customer {
  id: number;
  name: string;
  // добавьте другие поля заказчика, если они есть и нужны
  // createdAt?: string; 
  // updatedAt?: string;
}

// Интерфейс для заказа
export interface Order {
  id: number;
  // добавьте другие поля заказа, если они есть и нужны
  // createdAt?: string;
  // updatedAt?: string;
}

// Основной интерфейс для проекта
export interface Project {
  id: number;
  customer_id: number; // ID заказчика
  title: string;
  description?: string | null;
  status: number; // ID статуса (число)
  budget?: number | null;
  currency?: string | null;
  createdAt: string; // или Date
  updatedAt: string; // или Date

  // Связанные данные (для eager loading из API)
  customer?: Customer;          // Связанный объект заказчика
  orders?: Order[];             // Массив связанных заказов
  projectStatus?: ProjectStatus; // Связанный объект статуса проекта
}
