
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Users, FileText, DollarSign, Briefcase, CheckCircle, Clock, ListChecks, Edit, Tag, Calculator, Info, PlusCircle, MinusCircle, Pencil } from "lucide-react"; // Added Pencil icon
import Link from "next/link";
import { useParams } from 'next/navigation';
import type { Order, Etap, EtapOption } from "@/lib/types"; // Import Etap and EtapOption types
import { mockOrders, getOrderStatusVariant } from '../mockOrders'; // Import mock data and helper
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Import Accordion
import { Separator } from '@/components/ui/separator'; // Import Separator
import AddEtapForm from '@/components/orders/add-etap-form'; // Import the Add form component
import EditEtapForm from '@/components/orders/edit-etap-form'; // Import the Edit form component

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
    // Use React.use for server-side or Suspense-enabled rendering
    // Use useParams directly for client-side only components like this one
    const params = useParams<{ orderId: string }>();
    const orderId = params?.orderId; // Get orderId directly from hook

    // State holds the specific order being viewed. Initialize from mock data.
    const [orderData, setOrderData] = React.useState<Order | null>(null);
    const [isLoading, setIsLoading] = React.useState(true); // Start loading true
    const [isAddingEtap, setIsAddingEtap] = React.useState(false); // State for inline Add form visibility
    const [editingEtapId, setEditingEtapId] = React.useState<string | null>(null); // State for inline Edit form visibility
    const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>([]); // State for controlled accordion
    const { toast } = useToast();

    React.useEffect(() => {
        // Only run fetching logic once or when orderId changes
        if (orderId) {
             console.log(`Effect: Attempting to find order ${orderId}`);
             const foundOrder = mockOrders.find(o => o.id === orderId);
             if (foundOrder) {
                 console.log(`Effect: Found order ${orderId}`);
                 setOrderData({ ...foundOrder, etaps: foundOrder.etaps || [] });
             } else {
                 console.log(`Effect: Order ${orderId} not found in mock data.`);
                 toast({
                     title: "Error",
                     description: `Order with ID ${orderId} not found.`,
                     variant: "destructive",
                 });
                 // Optionally redirect or show a 'not found' state in the UI
             }
             setIsLoading(false);
        } else if (!isLoading) { // Only show error if not already loading and no orderId
             console.log(`Effect: Order ID missing.`);
             toast({
                 title: "Error",
                 description: "Order ID is missing.",
                 variant: "destructive",
             });
             setIsLoading(false);
        }
     }, [orderId, toast, isLoading]); // Include isLoading to prevent redundant runs


     // Function to update local state AND mock data when a new etap is added
     const handleEtapAdded = (newEtap: Etap) => {
        if (orderData) {
             // Add new etap to the existing list
             const updatedEtaps = [...(orderData.etaps || []), newEtap];
             const updatedOrderData = {
                ...orderData,
                etaps: updatedEtaps,
                updatedAt: new Date(),
            };

            // Update local state for immediate UI feedback
            setOrderData(updatedOrderData);

            // Update the mockOrders array (IN-PLACE MUTATION)
            const orderIndex = mockOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                 if (!mockOrders[orderIndex].etaps) {
                     mockOrders[orderIndex].etaps = [];
                 }
                 // Ensure etaps is treated as an array before pushing
                 const currentEtaps = mockOrders[orderIndex].etaps || [];
                 // Make sure not to add duplicate keys if the ID generation is not robust
                 if (!currentEtaps.some(e => e.id === newEtap.id)) {
                    mockOrders[orderIndex].etaps = [...currentEtaps, newEtap];
                    mockOrders[orderIndex].updatedAt = new Date();
                    console.log("Updated mockOrders array item with new etap:", mockOrders[orderIndex]);

                     toast({
                        title: "Stage Added",
                        description: `New stage "${newEtap.name}" added to the order.`,
                    });
                 } else {
                     console.warn(`Attempted to add etap with duplicate ID: ${newEtap.id}`);
                     toast({
                        title: "Warning",
                        description: `Stage with ID ${newEtap.id} might already exist.`,
                        variant: "destructive"
                     });
                 }


             } else {
                 console.warn(`Order ID ${orderId} not found in mockOrders during add.`);
            }

        } else {
             console.error("Cannot add etap: orderData is null.");
             toast({
                title: "Error",
                description: "Could not add stage because order data is missing.",
                 variant: "destructive",
            });
        }
        setIsAddingEtap(false); // Close the inline form
    };

    // Function to update local state AND mock data when an etap is updated
    const handleEtapUpdated = (updatedEtap: Etap) => {
        if (orderData) {
             // Update the etap in the local state's etaps list
            const updatedEtaps = (orderData.etaps || []).map(etap =>
                etap.id === updatedEtap.id ? updatedEtap : etap
            );
            const updatedOrderData = {
                ...orderData,
                etaps: updatedEtaps,
                updatedAt: new Date(), // Also update the order's updatedAt timestamp
            };

            // Update local state for immediate UI feedback
            setOrderData(updatedOrderData);

            // Update the mockOrders array (IN-PLACE MUTATION)
            const orderIndex = mockOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                const etapIndex = (mockOrders[orderIndex].etaps || []).findIndex(e => e.id === updatedEtap.id);
                if (etapIndex !== -1 && mockOrders[orderIndex].etaps) {
                    // Ensure etaps is treated as an array before updating
                    const currentEtaps = mockOrders[orderIndex].etaps || [];
                    currentEtaps[etapIndex] = updatedEtap; // Update the specific etap
                    mockOrders[orderIndex].etaps = [...currentEtaps]; // Assign new array to trigger updates if needed
                    mockOrders[orderIndex].updatedAt = new Date(); // Update order timestamp
                    console.log("Updated mockOrders array item with updated etap:", mockOrders[orderIndex]);
                } else {
                     console.warn(`Etap ID ${updatedEtap.id} not found in mockOrders order ${orderId} during update.`);
                }
             } else {
                 console.warn(`Order ID ${orderId} not found in mockOrders during etap update.`);
            }

            toast({
                title: "Stage Updated",
                description: `Stage "${updatedEtap.name}" has been updated.`,
            });

        } else {
             console.error("Cannot update etap: orderData is null.");
             toast({
                title: "Error",
                description: "Could not update stage because order data is missing.",
                 variant: "destructive",
            });
        }
        setEditingEtapId(null); // Close the inline edit form
    };

     // Updated handler: Toggles accordion and sets editing state
    const handleEditClick = (etapId: string) => {
         setOpenAccordionItems(prev => {
            if (prev.includes(etapId)) {
                // If already open, just set editing ID
                setEditingEtapId(etapId);
                setIsAddingEtap(false); // Close add form if open
                return prev; // Keep it open
            } else {
                 // If closed, open it and set editing ID
                 setEditingEtapId(etapId);
                 setIsAddingEtap(false); // Close add form if open
                 return [...prev, etapId]; // Add to open items
            }
        });
    };


    const handleCancelEdit = () => {
        setEditingEtapId(null);
    };

    const handleToggleAddForm = () => {
        setIsAddingEtap(!isAddingEtap);
        setEditingEtapId(null); // Close edit form if open
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
                            <Button size="sm" variant="outline" onClick={handleToggleAddForm} disabled={!!editingEtapId}>
                                {isAddingEtap ? (
                                    <>
                                        <MinusCircle className="mr-2 h-4 w-4" /> Cancel Add
                                    </>
                                ) : (
                                     <>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Stage
                                     </>
                                )}
                            </Button>
                         )}
                    </CardHeader>
                    <CardContent>
                        {/* Inline Add Etap Form */}
                        {isAddingEtap && (
                            <div className="mb-6 p-4 border rounded-md bg-card">
                                <h4 className="text-md font-semibold mb-3">Add New Stage</h4>
                                <AddEtapForm
                                    orderId={orderData.id}
                                    currency={orderData.currency}
                                    onEtapAdded={handleEtapAdded}
                                    onCancel={handleToggleAddForm} // Use toggle function
                                />
                             </div>
                        )}

                         {/* Existing Etaps List */}
                         {orderData.etaps && orderData.etaps.length > 0 ? (
                            <Accordion
                                type="multiple"
                                className="w-full"
                                // Use JSON stringify as key to force re-render on deep changes
                                key={JSON.stringify(orderData.etaps)}
                                value={openAccordionItems} // Controlled component value
                                onValueChange={setOpenAccordionItems} // Controlled component change handler
                            >
                                {orderData.etaps.map((etap: Etap) => (
                                     <AccordionItem value={etap.id} key={etap.id}>
                                        {/* Wrap trigger and edit button */}
                                        <div className="flex items-center justify-between pr-4 hover:bg-accent/50 rounded-t-md border-b">
                                            <AccordionTrigger className="flex-1 text-left px-4 py-4 font-semibold hover:no-underline border-b-0">
                                                 {etap.name}
                                            </AccordionTrigger>
                                             <div className="flex items-center gap-2 flex-shrink-0 pr-2"> {/* Adjusted padding right */}
                                                 <Badge variant="secondary" className="text-xs">
                                                     {etap.workType === "Последовательный" ? "Seq." : "Par."}
                                                 </Badge>
                                                 <Badge variant="outline">
                                                     {orderData.currency} {etap.estimatedPrice?.toLocaleString() ?? '0'}
                                                 </Badge>
                                                 {userRole === "Заказчик" && (
                                                     <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent accordion trigger if clicking button
                                                            handleEditClick(etap.id);
                                                        }}
                                                        className="h-6 w-6 p-1"
                                                        disabled={isAddingEtap || (!!editingEtapId && editingEtapId !== etap.id)} // Disable if adding or editing another item
                                                     >
                                                         <Pencil className="h-4 w-4" />
                                                         <span className="sr-only">Edit Stage</span>
                                                     </Button>
                                                 )}
                                             </div>
                                         </div>
                                        <AccordionContent>
                                             {/* Inline Edit Etap Form */}
                                            {editingEtapId === etap.id ? (
                                                <div className="mb-4 p-4 border rounded-md bg-card">
                                                    <h4 className="text-md font-semibold mb-3">Edit Stage: {etap.name}</h4>
                                                    <EditEtapForm
                                                        etap={etap}
                                                        currency={orderData.currency}
                                                        onEtapUpdated={handleEtapUpdated}
                                                        onCancel={handleCancelEdit}
                                                    />
                                                </div>
                                            ) : (
                                                // Use Grid for two columns
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4">
                                                    {/* Left Column: Description */}
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Description</h4>
                                                        <p className="text-sm text-foreground">{etap.description || "No description."}</p>
                                                    </div>
                                                    {/* Right Column: Options */}
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Options</h4>
                                                        {etap.options && etap.options.length > 0 ? (
                                                            <ul className="space-y-3">
                                                                {etap.options.map((option: EtapOption) => (
                                                                    <li key={option.id} className="text-sm border-l-2 pl-3 border-muted">
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
                                                                            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1"> {/* Allow wrapping */}
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
                                                     </div>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                         ) : (
                            !(isAddingEtap || editingEtapId) && <p className="text-sm text-muted-foreground">No stages defined for this order yet.</p>
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
