// src/app/(app)/orders/mockOrders.ts
import type { Order, OrderStatus, Etap, EtapOption, EtapWorkType } from "@/lib/types";
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

// Generate mock Etaps and Options for an order
const generateMockEtaps = (orderId: string, orderPrice: number): Etap[] => {
    const etaps: Etap[] = [];
    const numEtaps = Math.floor(Math.random() * 3) + 1; // 1 to 3 etaps per order
    const workTypes: EtapWorkType[] = ["Параллельный", "Последовательный"];

    for (let j = 0; j < numEtaps; j++) {
        const etapId = `${orderId}_etap_${j + 1}`;
        const options: EtapOption[] = [];
        const numOptions = Math.floor(Math.random() * 4) + 1; // 1 to 4 options per etap
        let etapEstimatedPrice = 0;

        for (let k = 0; k < numOptions; k++) {
            const optionId = `${etapId}_option_${k + 1}`;
            const isCalculable = Math.random() > 0.3; // 70% chance calculable
            const includedInPrice = !isCalculable ? Math.random() > 0.5 : true; // Non-calc can be informational, calculable must be included
            const planUnits = isCalculable ? Math.floor(Math.random() * 5000) + 1000 : undefined;
            const unitDivider = isCalculable ? 1000 : undefined;
            const pricePerUnit = isCalculable ? parseFloat((Math.random() * 5 + 1).toFixed(2)) : undefined; // $1-$6 per 1000 units
            const calculatedPlanPrice = isCalculable && planUnits && unitDivider && pricePerUnit
                ? parseFloat(((planUnits / unitDivider) * pricePerUnit).toFixed(2))
                : undefined;

            if (calculatedPlanPrice && includedInPrice) {
                etapEstimatedPrice += calculatedPlanPrice;
            }

            options.push({
                id: optionId,
                etapId: etapId,
                name: `Option ${k + 1} for Etap ${j + 1}`,
                description: `Details about option ${k + 1}`,
                isCalculable: isCalculable,
                includedInPrice: includedInPrice,
                planUnits: planUnits,
                unitDivider: unitDivider,
                pricePerUnit: pricePerUnit,
                calculatedPlanPrice: calculatedPlanPrice,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        etaps.push({
            id: etapId,
            orderId: orderId,
            name: `Stage ${j + 1}`,
            description: `Description for stage ${j + 1}`,
            options: options,
            sequence: j + 1,
            workType: workTypes[j % workTypes.length],
            estimatedPrice: parseFloat(etapEstimatedPrice.toFixed(2)), // Sum of included calculable options
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    return etaps;
};


// Generate mock order data linked to mock projects
export const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => {
    const projectIndex = i % mockProjects.length; // Cycle through projects
    const project = mockProjects[projectIndex];
    const statuses: OrderStatus[] = ["Новый", "Сбор ставок", "На паузе", "Сбор Завершен", "Отменен"];
    const status = statuses[i % statuses.length];
    const orderId = `order_${i + 1}`;
    const basePrice = (Math.random() * (project.budget ?? 5000) / 3); // Random base price
    const etaps = generateMockEtaps(orderId, basePrice);
    const totalCalculatedPrice = etaps.reduce((sum, etap) => sum + (etap.estimatedPrice || 0), 0);


    return {
        id: orderId,
        name: `Order ${i + 1} for ${project.name.substring(0,15)}...`,
        description: `This is order number ${i + 1} related to the project "${project.name}". It involves several stages and options. Status is currently ${status}.`,
        projectId: project.id,
        projectName: project.name, // Add projectName for easy display
        status: status,
        totalCalculatedPrice: parseFloat(totalCalculatedPrice.toFixed(2)), // Sum of etap estimated prices
        currency: project.currency, // Use project currency
        createdAt: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000), // Spread creation dates
        updatedAt: new Date(Date.now() - (i % 5) * 24 * 60 * 60 * 1000), // Vary update dates
        etaps: etaps, // Add generated etaps
    };
});
