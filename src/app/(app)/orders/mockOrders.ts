// src/app/(app)/orders/mockOrders.ts
import type { Order, OrderStatus } from "@/lib/types";
import { mockProjects } from "../projects/mockProjects"; // Ensure mockProjects is correctly imported

// Helper function to get status badge variant for Orders
export const getOrderStatusVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" | "success" => {
  switch (status) {
    case "Новый": return "outline";
    case "Сбор ставок": return "default"; // Blue/Primary
    case "На паузе": return "secondary"; // Gray
    case "Сбор Завершен": return "success"; // Green
    case "Отменен": return "destructive"; // Red
    default: return "secondary";
  }
};

// Generate mock order data linked to mock projects
export const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => {
    const projectIndex = i % mockProjects.length; // Cycle through projects
    const project = mockProjects[projectIndex];
    const statuses: OrderStatus[] = ["Новый", "Сбор ставок", "На паузе", "Сбор Завершен", "Отменен"];
    const status = statuses[i % statuses.length];
    const price = (Math.random() * (project.budget ?? 5000) / 3).toFixed(0); // Random price based on project budget

    return {
        id: `order_${i + 1}`,
        name: `Order ${i + 1} for ${project.name.substring(0,15)}...`,
        description: `This is order number ${i + 1} related to the project "${project.name}". It involves several stages and options. Status is currently ${status}.`,
        projectId: project.id,
        projectName: project.name, // Add projectName for easy display
        status: status,
        totalCalculatedPrice: Number(price), // Example price
        currency: project.currency, // Use project currency
        createdAt: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000), // Spread creation dates
        updatedAt: new Date(Date.now() - (i % 5) * 24 * 60 * 60 * 1000), // Vary update dates
    };
});