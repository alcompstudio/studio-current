

// Basic User Role Definition
export type UserRole = "Заказчик" | "Исполнитель" | "Администратор" | "Модератор";

// Base Interface for common fields
interface BaseEntity {
  id: string;
  name: string;
  description?: string; // Using Rich Text Editor implies potentially complex string/HTML
  createdAt: Date;
  updatedAt: Date;
}

// Status Types
export type OrderStatus = "Новый" | "Сбор ставок" | "На паузе" | "Сбор Завершен" | "Отменен";
export type BidStatus = "Черновик" | "Отправлено" | "Отозвано" | "Утверждено" | "Отказано";
export type WorkItemStatus = "Новое" | "В работе" | "Проверка" | "Исправление" | "Завершено" | "Отменено";
export type PaymentStatus = "Ожидание" | "Оплачен" | "Подтвержден" | "Отменен";
export type EtapWorkType = "Параллельный" | "Последовательный";

// User Interface
export interface User extends BaseEntity {
  email: string;
  role: UserRole;
  profile?: UserProfile;
  balance?: Record<string, number>; // Currency code -> amount
}

// User Profile (can be extended)
export interface UserProfile {
  avatarUrl?: string;
  skills?: string[];
  categories?: string[]; // For filtering
  // Add other profile fields as needed
}

// Customer Interface
export interface Customer extends BaseEntity {
  userId: string;
  email: string;
  phone?: string;
  address?: string;
}

// Project Interface
export interface Project extends BaseEntity {
  clientId: string; // Link to Заказчик User ID
  title: string;
  clientName?: string; // Optional: Denormalized client name for display
  status: string; // e.g., "Active", "Completed", "Archived" - Define specific statuses later
  currency: string; // e.g., "USD", "EUR", "RUB"
  budget?: number; // Optional: Provided budget
  totalBudget?: number; // Optional: Calculated total budget from orders/etaps
  freelancerIds?: string[]; // List of approved Исполнитель IDs for the project
  customer?: Customer;
}

// Order Interface (Заказ)
export interface Order {
  id: string;
  project_id: number;
  title: string;
  description?: string;
  status: OrderStatus;
  price?: number;
  currency?: string;
  createdAt: string | Date | null; // Allow string, Date, or null
  updatedAt: string | Date | null; // Allow string, Date, or null
  // Add other fields from DB schema if needed
  // etaps?: Etap[];
  // workPositions?: WorkPosition[];
}

// Etap Interface (Этап Заказа)
export interface Etap extends BaseEntity {
  orderId: string;
  options?: EtapOption[];
  sequence?: number; // For sequential work
  color?: string; // For visualization
  workType: EtapWorkType; // Parallel or Sequential
  estimatedPrice?: number; // Price set by Заказчик
}

// Etap Option Interface (Опция Этапа)
export interface EtapOption extends BaseEntity {
  etapId: string;
  name: string; // Ensure name is mandatory
  description?: string;
  isCalculable: boolean; // Калькулируемая опция
  includedInPrice: boolean; // Включена в цену (informational, or if calculable)
  calculationFormula?: string; // e.g., "units / unitDivider * pricePerUnit"
  planUnits?: number; // e.g., 2500 (characters)
  unitDivider?: number; // e.g., 1000
  pricePerUnit?: number; // e.g., 2 (USD per 1000 characters)
  calculatedPlanPrice?: number; // (planUnits / unitDivider) * pricePerUnit = 5 USD
}

// Bid Interface (Ставка-предложение)
export interface Bid extends BaseEntity {
  orderId: string;
  freelancerId: string;
  status: BidStatus;
  etapBids?: EtapBid[]; // Bids per Etap
  totalBidPrice?: number; // Calculated from EtapBids
  comments?: string;
}

// Etap Bid Interface (Ставка на Этап)
export interface EtapBid {
  etapId: string;
  optionBids?: OptionBid[];
  calculatedEtapPrice?: number; // Calculated from OptionBids
}

// Option Bid Interface (Ценовое предложение по Опции)
export interface OptionBid {
  optionId: string;
  bidPricePerUnit?: number; // Freelancer's price (e.g., 2.5 USD / 1000 characters)
  calculatedBidPrice?: number; // Calculated based on plan units and bid price
}

// Work Assignment Interface (Рабочее Задание)
export interface WorkAssignment extends BaseEntity {
  orderId: string;
  status: WorkItemStatus;
  assignedWorkEtaps?: AssignedWorkEtap[];
  linkedWorkPositionIds?: string[]; // IDs of Рабочие Позиции included
  dueDate?: Date;
}

// Assigned Work Etap (Рабочий Этап in Рабочее Задание - Linking)
export interface AssignedWorkEtap {
  id: string;
  workAssignmentId: string;
  originalEtapId: string; // Link to Etap in Order
  freelancerId: string; // Assigned Исполнитель
  status: WorkItemStatus; // Status specific to this freelancer's work on this etap within the assignment
  // Calculated totals for this assignment/freelancer based on completed positions
  totalActualUnits?: number;
  totalActualPrice?: number;
}

// Work Position Interface (Рабочая Позиция)
export interface WorkPosition extends BaseEntity {
  orderId: string;
  status: WorkItemStatus; // Overall status of the position
  workAssignmentId?: string; // Link when assigned
  positionWorkEtaps?: PositionWorkEtap[];
}

// Position Work Etap Interface (Рабочий Этап Позиции)
export interface PositionWorkEtap {
  id: string;
  workPositionId: string;
  assignedWorkEtapId: string; // Link back to the assignment/freelancer link
  originalEtapId: string; // Link to Etap in Order
  freelancerId: string; // Denormalized for easier access
  status: WorkItemStatus;
  workOptions?: PositionWorkOption[];
  // Potentially add sequence if needed within a position
}

// Position Work Option Interface (Рабочая Опция Этапа Позиции)
export interface PositionWorkOption {
  id: string;
  positionWorkEtapId: string;
  originalOptionId: string; // Link to EtapOption in Order's Etap
  planUnits?: number; // Copied from original Option
  pricePerUnit?: number; // Copied/Calculated from Bid or original Option
  actualUnits?: number; // Filled by Исполнитель
  calculatedActualPrice?: number; // Calculated based on actualUnits and pricePerUnit
}

// Invoice Interface (Счет)
export interface Invoice extends BaseEntity {
  clientId: string;
  freelancerId: string;
  workAssignmentId?: string; // Link to the assignment being billed
  relatedItemIds: string[]; // e.g., PositionWorkEtap IDs or WorkAssignment ID
  totalAmount: number;
  currency: string;
  status: PaymentStatus;
  issueDate: Date;
  paymentDate?: Date;
}

// Communication/Chat Message Interface
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string; // Optional if it's a general comment on an entity
  relatedEntityType: string; // e.g., "Order", "WorkPosition", "PositionWorkEtap"
  relatedEntityId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

// Currency Rate Interface
export interface CurrencyRate {
    code: string; // e.g., "EUR"
    name: string; // e.g., "Euro"
    rateToUsd: number; // Exchange rate relative to USD
    addedByAdminId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Platform Transaction Log (for manual balance adjustments)
export interface PlatformTransaction {
  id: string;
  adminId: string;
  userId: string; // User whose balance is adjusted
  amount: number;
  currency: string; // Currency of the transaction
  type: "Deposit" | "Withdrawal" | "Fee" | "Adjustment"; // Type of transaction
  paymentMethod?: string; // e.g., "Bank Transfer", "Card", "Crypto"
  notes?: string;
  timestamp: Date;
}
