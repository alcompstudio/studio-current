// src/app/(app)/orders/[orderId]/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Users, FileText, DollarSign, Briefcase, CheckCircle, Clock, ListChecks, Edit, Tag, Calculator, Info, PlusCircle } from "lucide-react"; // Import Edit, Tag, Calculator, Info, PlusCircle icons
import Link from "next/link";
import { useParams } from 'next/navigation';
import type { Order, Etap, EtapOption } from "@/lib/types"; // Import Etap and EtapOption types
import { mockOrders, getOrderStatusVariant } from '../mockOrders'; // Import mock data and helper
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Import Accordion
import { Separator } from '@/components/ui/separator'; // Import Separator
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
  DialogFooter, // Import DialogFooter
} from "@/components/ui/dialog";
import AddEtapForm from '@/components/orders/add-etap-form'; // Import the new form component

// Helper function to get status icon
const getStatusIcon = (status: string) => {
    switch (status) {
        case "Сбор ставок": return <ListChecks className="mr-1 h-3 w-3" />;
        case "Сбор Завершен": return <CheckCircle className="mr-1 h-3 w-3" />;
        case "Новый": return <FileText className="mr-1 h-3 w-3" />;
        case "На паузе": return <Clock className="mr-1 h-3 w-3 text-muted-foreground" />;
         case "Отменен": return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />;
        default: return null;
    }
};

export default function OrderDetailPage() {
    const params = useParams<{ orderId: string }>();
    const orderId = params?.orderId; // Get orderId directly from hook

    const [orderData, setOrderData] = React.useState<Order | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddEtapDialogOpen, setIsAddEtapDialogOpen] = React.useState(false); // State for dialog
    const { toast } = useToast();

    React.useEffect(() => {
        if (orderId) {
            // Simulate fetching data
            const foundOrder = mockOrders.find(o => o.id === orderId);
            if (foundOrder) {
                // Ensure etaps is always an array
                setOrderData({ ...foundOrder, etaps: foundOrder.etaps || [] });
            } else {
                toast({
                     title: "Error",
                     description: `Order with ID ${orderId} not found.`,
                     variant: "destructive",
                 });
                // Optionally redirect or show not found message
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            toast({
                 title: "Error",
                 description: "Order ID is missing.",
                 variant: "destructive",
             });
        }
    }, [orderId, toast]); // Re-run if orderId changes

     // Function to update local state when a new etap is added
     const handleEtapAdded = (newEtap: Etap) => {
        if (orderData) {
            setOrderData(prevOrder => ({
                ...prevOrder!,
                etaps: [...(prevOrder?.etaps || []), newEtap], // Add the new etap to the existing array
                updatedAt: new Date(), // Update timestamp
            }));
        }
        setIsAddEtapDialogOpen(false); // Close the dialog
    };


    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading order...</div>;
    }

    if (!orderData) {
        return <div className="flex min-h-screen items-center justify-center">Order not found or ID missing.</div>;
    }

    // Mock user role for conditional rendering
    const userRole = "Заказчик"; // Replace with actual role check

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Link href="/orders" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">{orderData.name}</h2>
                     <Badge variant={getOrderStatusVariant(orderData.status)} className="flex items-center text-sm">
                         {getStatusIcon(orderData.status)}
                         {orderData.status}
                    </Badge>
                </div>
                {/* Change Manage Order to Edit Order */}
                 {userRole === "Заказчик" && (
                    <Link href={`/orders/${orderId}/edit`} passHref>
                         <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Order
                         </Button>
                    </Link>
                 )}
                 {userRole === "Исполнитель" && orderData.status === "Сбор ставок" && (
                    <Button>Place Bid</Button>
                 )}
            </div>

            {/* Order Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Overview</CardTitle>
                    <CardDescription>{orderData.description || "No description provided."}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Project</p>
                         <Link href={`/projects/${orderData.projectId}`} className="text-primary hover:underline">
                            {orderData.projectName || 'View Project'}
                        </Link>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Estimated Price</p>
                        <p>{orderData.currency} {orderData.totalCalculatedPrice?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Created</p>
                        <p>{orderData.createdAt?.toLocaleDateString() || 'N/A'}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                        <p>{orderData.updatedAt?.toLocaleDateString() || 'N/A'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Sections for related entities (Etaps, Work Positions, Bids) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Etaps Section */}
                <Card className="lg:col-span-2"> {/* Span full width */}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Stages (Etaps)</CardTitle>
                         {userRole === "Заказчик" && (
                            <Dialog open={isAddEtapDialogOpen} onOpenChange={setIsAddEtapDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Stage
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Stage to "{orderData.name}"</DialogTitle>
                                        <DialogDescription>
                                            Define a new stage for this order. Options can be added later.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {/* Pass orderId, currency, and the handler function */}
                                    <AddEtapForm
                                        orderId={orderData.id}
                                        currency={orderData.currency}
                                        onEtapAdded={handleEtapAdded}
                                        onOpenChange={setIsAddEtapDialogOpen} // Pass setter to close dialog from form
                                    />
                                    {/* Footer with Close button might be needed if form doesn't handle closing */}
                                    {/*
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">Cancel</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                     */}
                                </DialogContent>
                            </Dialog>
                         )}
                    </CardHeader>
                    <CardContent>
                         {orderData.etaps && orderData.etaps.length > 0 ? (
                            <Accordion type="multiple" className="w-full">
                                {orderData.etaps.map((etap: Etap) => (
                                    <AccordionItem value={etap.id} key={etap.id}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex justify-between items-center w-full pr-4">
                                                <span className="font-semibold">{etap.name}</span>
                                                <div className="flex items-center gap-2">
                                                     <Badge variant="secondary" className="text-xs">
                                                        {etap.workType === "Последовательный" ? "Seq." : "Par."}
                                                     </Badge>
                                                     <Badge variant="outline">
                                                        {orderData.currency} {etap.estimatedPrice?.toLocaleString() ?? '0'}
                                                     </Badge>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-muted-foreground mb-4">{etap.description || "No description."}</p>
                                            <h4 className="text-sm font-semibold mb-2">Options:</h4>
                                            {etap.options && etap.options.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {etap.options.map((option: EtapOption) => (
                                                        <li key={option.id} className="text-sm border-l-2 pl-3 border-muted ml-2">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-medium text-foreground">{option.name}</span>
                                                                 <Badge
                                                                    variant={option.isCalculable ? "default" : "outline"}
                                                                    className={`text-xs ${option.isCalculable ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-muted-foreground'}`}
                                                                 >
                                                                    {option.isCalculable ? <Calculator className="mr-1 h-3 w-3"/> : <Info className="mr-1 h-3 w-3"/>}
                                                                    {option.isCalculable ? 'Calculable' : 'Informational'}
                                                                    {!option.includedInPrice && ' (Not in Price)'}
                                                                 </Badge>
                                                            </div>
                                                            {option.description && <p className="text-xs text-muted-foreground mt-1 mb-1">{option.description}</p>}
                                                            {option.isCalculable && (
                                                                <div className="text-xs text-muted-foreground flex gap-4 mt-1">
                                                                    <span>Plan: {option.planUnits ?? 'N/A'} units</span>
                                                                    <span>Rate: {orderData.currency} {option.pricePerUnit ?? 'N/A'} / {option.unitDivider ?? 'unit'}</span>
                                                                    <span className="font-medium text-foreground">
                                                                        Est: {orderData.currency} {option.calculatedPlanPrice?.toLocaleString() ?? 'N/A'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No options defined for this stage.</p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                         ) : (
                            <p className="text-sm text-muted-foreground">No stages defined for this order yet.</p>
                         )}
                    </CardContent>
                </Card>

                 {/* Bids Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Bids</CardTitle>
                         {/* Button to view bids? */}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Bids submitted by freelancers will appear here.</p>
                        {/* TODO: List Bids */}
                    </CardContent>
                </Card>

                {/* Work Positions Section */}
                <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Work Positions</CardTitle>
                         {userRole === "Заказчик" && (
                            <Button size="sm" variant="outline">Add Work Positions</Button>
                         )}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Individual work items (positions) for this order.</p>
                         {/* TODO: List Work Positions */}
                    </CardContent>
                </Card>

                 {/* Work Assignments Link */}
                 <Card className="lg:col-span-2"> {/* Span full width */}
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Related Work Assignments</CardTitle>
                        <Link href={`/projects/${orderData.projectId}?tab=assignments`} passHref>
                             <Button size="sm" variant="link">View Assignments</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Assignments created based on this order.</p>
                         {/* TODO: List related Work Assignments or provide a direct link */}
                    </CardContent>
                </Card>

                 {/* Communications Section Placeholder */}
                <Card className="lg:col-span-2"> {/* Span full width */}
                     <CardHeader>
                        <CardTitle className="text-lg font-semibold">Communication</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Chat or comments related to this order will be shown here.</p>
                         {/* TODO: Implement communication component */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
