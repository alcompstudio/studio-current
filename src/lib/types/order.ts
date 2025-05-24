export type OrderStatusOS = {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderStatus = string; // For backward compatibility
export type OrderStatusId = number; // New type for status IDs

export interface Order {
  id: number;
  project_id: number;
  title: string;
  description?: string | null;
  status: OrderStatusId; // Changed from string to number
  deadline?: string | null;
  price?: string | number | null;
  createdAt?: string;
  updatedAt?: string;
  orderStatus?: OrderStatusOS; // Added for the relation
}
