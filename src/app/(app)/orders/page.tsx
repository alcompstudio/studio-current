
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, Filter } from "lucide-react"; // Import Eye and Filter icons
import type { Order } from "@/lib/types"; // Import Order type
import Link from "next/link";
import { mockOrders, getOrderStatusVariant } from './mockOrders'; // Import mock data and helper from the new file

export default function OrdersPage() {
    // TODO: Fetch and display orders based on user role and context
    const userRole = "Заказчик"; // Mock role

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                {userRole === "Заказчик" && (
                    <Link href="/orders/new" passHref>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Create New Order
                        </Button>
                    </Link>
                )}
                 {userRole === "Исполнитель" && (
                    <Button variant="outline">
                       <Filter className="mr-2 h-4 w-4" /> Filter Orders
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
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{order.description}</p> {/* Use line-clamp */}
                                    <div className="flex justify-between items-center">
                                         <span className="text-sm font-semibold">
                                            Est. Price: {order.currency} {order.totalCalculatedPrice?.toLocaleString() ?? 'N/A'}
                                         </span>
                                         {/* Link to the new order detail page */}
                                         <Link href={`/orders/${order.id}`} passHref>
                                            <Button variant="outline" size="sm">
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </Button>
                                         </Link>
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
