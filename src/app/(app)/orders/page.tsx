
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { PlusCircle, FileText, Eye } from "lucide-react"; // Import Eye icon
import type { Order, OrderStatus } from "@/lib/types"; // Import Order type
import Link from "next/link";
import { mockProjects } from "../projects/mockProjects"; // Import mock projects to link orders

// Helper function to get status badge variant for Orders
const getOrderStatusVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Новый": return "outline";
    case "Сбор ставок": return "default"; // Blue/Primary
    case "На паузе": return "secondary"; // Gray
    case "Сбор Завершен": return "success" as any; // Green (need to ensure 'success' variant exists or customize)
    case "Отменен": return "destructive"; // Red
    default: return "secondary";
  }
};

// Generate mock order data linked to mock projects
const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => {
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


export default function OrdersPage() {
    // TODO: Fetch and display orders based on user role and context
    const userRole = "Заказчик"; // Mock role

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                {userRole === "Заказчик" && (
                    // TODO: Link to actual create order page when available
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Order
                    </Button>
                )}
                 {userRole === "Исполнитель" && (
                    <Button variant="outline">
                       Filter Orders
                    </Button>
                )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                    <CardDescription>View and manage orders associated with your projects.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {mockOrders.length > 0 ? (
                        mockOrders.map((order) => (
                            <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold mb-1">{order.name}</CardTitle>
                                            <CardDescription>
                                                Project: <Link href={`/projects/${order.projectId}`} className="text-primary hover:underline">{order.projectName}</Link>
                                            </CardDescription>
                                        </div>
                                         <Badge variant={getOrderStatusVariant(order.status)} className="flex-shrink-0">
                                            {order.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">{order.description?.substring(0, 150)}...</p>
                                    <div className="flex justify-between items-center">
                                         <span className="text-sm font-semibold">
                                            Est. Price: {order.currency} {order.totalCalculatedPrice?.toLocaleString() ?? 'N/A'}
                                         </span>
                                         {/* TODO: Link to actual order detail page */}
                                         <Button variant="outline" size="sm">
                                             <Eye className="mr-2 h-4 w-4" /> View Details
                                         </Button>
                                    </div>
                                     <p className="text-xs text-muted-foreground mt-2">
                                        Created: {order.createdAt.toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No orders found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
