

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, FileText, DollarSign, Briefcase, CheckCircle, Clock, ListChecks, Edit, Tag, Calculator, Info, PlusCircle, MinusCircle, Pencil, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import type { Order, Etap, EtapOption } from "@/lib/types";
import { mockOrders, getOrderStatusVariant } from '../mockOrders';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import AddEtapForm from '@/components/orders/add-etap-form';
import EditEtapForm from '@/components/orders/edit-etap-form';
import AddOptionForm from '@/components/orders/add-option-form';
import EditOptionForm from '@/components/orders/edit-option-form';
import { cn } from '@/lib/utils';

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
    // Use client-side hooks
    const params = useParams<{ orderId: string }>();
    const orderId = params?.orderId;

    const [orderData, setOrderData] = React.useState<Order | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddingEtap, setIsAddingEtap] = React.useState(false);
    const [editingEtapId, setEditingEtapId] = React.useState<string | null>(null);
    const [addingOptionToEtapId, setAddingOptionToEtapId] = React.useState<string | null>(null);
    const [editingOptionId, setEditingOptionId] = React.useState<string | null>(null);
    const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>([]);
    const { toast } = useToast();

    React.useEffect(() => {
        if (orderId) {
             const foundOrder = mockOrders.find(o => o.id === orderId);
             if (foundOrder) {
                 setOrderData({ ...foundOrder, etaps: foundOrder.etaps || [] });
             } else {
                 toast({
                     title: "Error",
                     description: `Order with ID ${orderId} not found.`,
                     variant: "destructive",
                 });
             }
             setIsLoading(false);
        } else if (!isLoading) {
             toast({
                 title: "Error",
                 description: "Order ID is missing.",
                 variant: "destructive",
             });
             setIsLoading(false);
        }
     }, [orderId, toast, isLoading]);


     const handleEtapAdded = (newEtap: Etap) => {
        if (orderData) {
             const updatedEtaps = [...(orderData.etaps || []), newEtap];
             const updatedOrderData = {
                ...orderData,
                etaps: updatedEtaps,
                updatedAt: new Date(),
            };

            setOrderData(updatedOrderData);

            const orderIndex = mockOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                 if (!mockOrders[orderIndex].etaps) {
                     mockOrders[orderIndex].etaps = [];
                 }
                 const currentEtaps = mockOrders[orderIndex].etaps || [];
                 if (!currentEtaps.some(e => e.id === newEtap.id)) {
                    mockOrders[orderIndex].etaps = [...currentEtaps, newEtap];
                    mockOrders[orderIndex].updatedAt = new Date();

                     toast({
                        title: "Stage Added",
                        description: `New stage "${newEtap.name}" added. Remember to add options to it.`,
                    });
                 } else {
                     toast({
                        title: "Warning",
                        description: `Stage with ID ${newEtap.id} might already exist.`,
                        variant: "destructive"
                     });
                 }
             }

            setOpenAccordionItems(prev => [...prev, newEtap.id]);
            // Keep forms potentially open if user wants to add options immediately
            // setEditingEtapId(null);
            // setAddingOptionToEtapId(null);
            // setEditingOptionId(null);
            setIsAddingEtap(false); // Close the add etap form itself

        } else {
             toast({
                title: "Error",
                description: "Could not add stage because order data is missing.",
                 variant: "destructive",
            });
            setIsAddingEtap(false);
        }
    };

    const handleEtapUpdated = (updatedEtap: Etap) => {
        // Basic Validation: Check if etap has options before saving (only on update)
        if (!updatedEtap.options || updatedEtap.options.length === 0) {
            toast({
                title: "Validation Error",
                description: "A stage must have at least one option.",
                variant: "destructive",
            });
            return; // Prevent update
        }

        if (orderData) {
            const updatedEtaps = (orderData.etaps || []).map(etap =>
                etap.id === updatedEtap.id ? updatedEtap : etap
            );
            const updatedOrderData = {
                ...orderData,
                etaps: updatedEtaps,
                updatedAt: new Date(),
            };

            setOrderData(updatedOrderData);

            const orderIndex = mockOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                const etapIndex = (mockOrders[orderIndex].etaps || []).findIndex(e => e.id === updatedEtap.id);
                if (etapIndex !== -1 && mockOrders[orderIndex].etaps) {
                    const currentEtaps = mockOrders[orderIndex].etaps || [];
                    currentEtaps[etapIndex] = updatedEtap;
                    mockOrders[orderIndex].etaps = [...currentEtaps];
                    mockOrders[orderIndex].updatedAt = new Date();
                }
             }

            toast({
                title: "Stage Updated",
                description: `Stage "${updatedEtap.name}" has been updated.`,
            });
            setEditingEtapId(null); // Close edit form on successful update

        } else {
             toast({
                title: "Error",
                description: "Could not update stage because order data is missing.",
                 variant: "destructive",
            });
             setEditingEtapId(null); // Close edit form even on error
        }
    };

     const handleOptionAdded = (etapId: string, newOption: EtapOption) => {
        if (orderData) {
            const updatedEtaps = (orderData.etaps || []).map(etap => {
                if (etap.id === etapId) {
                     const currentOptions = etap.options || [];
                     if (!currentOptions.some(o => o.id === newOption.id)) {
                        return {
                            ...etap,
                            options: [...currentOptions, newOption]
                        };
                     } else {
                         console.warn(`Attempted to add option with duplicate ID: ${newOption.id} to etap ${etapId}`);
                         toast({
                            title: "Warning",
                            description: `Option with ID ${newOption.id} might already exist in this stage.`,
                            variant: "destructive"
                         });
                         return etap;
                     }
                }
                return etap;
            });

            const updatedOrderData = {
                ...orderData,
                etaps: updatedEtaps,
                updatedAt: new Date(),
            };

            setOrderData(updatedOrderData);

            const orderIndex = mockOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                const etapIndex = (mockOrders[orderIndex].etaps || []).findIndex(e => e.id === etapId);
                if (etapIndex !== -1 && mockOrders[orderIndex].etaps) {
                     const currentOptions = mockOrders[orderIndex].etaps![etapIndex].options || [];
                     if (!currentOptions.some(o => o.id === newOption.id)) {
                        mockOrders[orderIndex].etaps![etapIndex].options = [...currentOptions, newOption];
                        mockOrders[orderIndex].updatedAt = new Date();

                        toast({
                            title: "Option Added",
                            description: `New option "${newOption.name}" added to stage.`, // Simplified message
                        });
                     }
                }
            }
        } else {
            toast({
                title: "Error",
                description: "Could not add option because order data is missing.",
                variant: "destructive",
            });
        }
        setAddingOptionToEtapId(null); // Close add option form
    };

     const handleOptionUpdated = (etapId: string, updatedOption: EtapOption) => {
         if (orderData) {
            const updatedEtaps = (orderData.etaps || []).map(etap => {
                if (etap.id === etapId) {
                    const updatedOptions = (etap.options || []).map(option =>
                        option.id === updatedOption.id ? updatedOption : option
                    );
                    return { ...etap, options: updatedOptions };
                }
                return etap;
            });

            const updatedOrderData = {
                ...orderData,
                etaps: updatedEtaps,
                updatedAt: new Date(),
            };

             setOrderData(updatedOrderData);

            const orderIndex = mockOrders.findIndex(o => o.id === orderId);
             if (orderIndex !== -1) {
                 const etapIndex = (mockOrders[orderIndex].etaps || []).findIndex(e => e.id === etapId);
                 if (etapIndex !== -1 && mockOrders[orderIndex].etaps) {
                     const optionIndex = (mockOrders[orderIndex].etaps![etapIndex].options || []).findIndex(o => o.id === updatedOption.id);
                     if (optionIndex !== -1 && mockOrders[orderIndex].etaps![etapIndex].options) {
                         mockOrders[orderIndex].etaps![etapIndex].options![optionIndex] = updatedOption;
                         mockOrders[orderIndex].updatedAt = new Date();
                     }
                 }
             }

            toast({
                title: "Option Updated",
                description: `Option "${updatedOption.name}" has been updated.`,
            });

        } else {
             toast({
                title: "Error",
                description: "Could not update option because order data is missing.",
                variant: "destructive",
            });
        }
         setEditingOptionId(null); // Close the edit option form
     };


     const handleEditEtapClick = (etapId: string) => {
         setEditingEtapId(prev => (prev === etapId ? null : etapId)); // Toggle edit form
         setIsAddingEtap(false); // Ensure add form is closed
         // Keep option forms potentially open
         // Ensure the accordion item is open when editing starts
         if (!openAccordionItems.includes(etapId)) {
             setOpenAccordionItems(prev => [...prev, etapId]);
         }
    };

    const handleCancelEditEtap = () => {
        setEditingEtapId(null);
    };

    const handleToggleAddForm = () => {
        setIsAddingEtap(!isAddingEtap);
        setEditingEtapId(null); // Ensure edit form is closed
        // Keep option forms potentially open
    };

     const handleToggleAddOptionForm = (etapId: string) => {
        setAddingOptionToEtapId(prev => (prev === etapId ? null : etapId)); // Toggle add option form
        setEditingOptionId(null); // Close option edit form if open
        // Keep etap forms potentially open
        if (!openAccordionItems.includes(etapId)) {
            setOpenAccordionItems(prev => [...prev, etapId]);
        }
    };

     const handleCancelAddOption = () => {
         setAddingOptionToEtapId(null);
     };

     const handleEditOptionClick = (optionId: string, etapId: string) => {
         setEditingOptionId(prev => (prev === optionId ? null : optionId)); // Toggle edit option form
         setAddingOptionToEtapId(null); // Close add option form if open
         // Keep etap forms potentially open
         if (!openAccordionItems.includes(etapId)) {
            setOpenAccordionItems(prev => [...prev, etapId]);
         }
     };

     const handleCancelEditOption = () => {
         setEditingOptionId(null);
     };


     const handleAccordionChange = (value: string[]) => {
        setOpenAccordionItems(value);
        // Close forms only if the user explicitly closes the accordion item
        const closingItems = openAccordionItems.filter(item => !value.includes(item));
        closingItems.forEach(closingItemId => {
            if (editingEtapId === closingItemId) setEditingEtapId(null);
            if (addingOptionToEtapId === closingItemId) setAddingOptionToEtapId(null);
            // Find if any option being edited belongs to the closing accordion
             const closingEtap = orderData?.etaps?.find(etap =>
                 etap.id === closingItemId && etap.options?.some(opt => opt.id === editingOptionId)
             );
             if (closingEtap) setEditingOptionId(null);
        });
    };


    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading order...</div>;
    }

    if (!orderData) {
        return <div className="flex min-h-screen items-center justify-center">Order not found or ID missing.</div>;
    }

    const userRole = "Заказчик"; // Mock role

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
                            <Edit className="mr-2 h-4 w-4" /> Edit Order Details
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

            {/* Sections for related entities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Stages (Etaps)</CardTitle>
                         {userRole === "Заказчик" && (
                            <Button size="sm" variant="outline" onClick={handleToggleAddForm} disabled={!!editingEtapId}>
                                {isAddingEtap ? (
                                    <><MinusCircle className="mr-2 h-4 w-4" /> Cancel Add</>
                                ) : (
                                    <><PlusCircle className="mr-2 h-4 w-4" /> Add Stage</>
                                )}
                            </Button>
                         )}
                    </CardHeader>
                    <CardContent>
                        {isAddingEtap && (
                            <div className="mb-6 p-4 border rounded-md bg-card">
                                <h4 className="text-md font-semibold mb-3">Add New Stage</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {/* Left Column: Add Etap Form */}
                                     <div className="border-r pr-6 border-border">
                                        <AddEtapForm
                                            orderId={orderData.id}
                                            currency={orderData.currency}
                                            onEtapAdded={handleEtapAdded} // Validation handled in AddEtapForm now
                                            onCancel={handleToggleAddForm}
                                        />
                                     </div>
                                      {/* Right Column: Placeholder for options (none yet for new etap) */}
                                      <div>
                                          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Options</h4>
                                          <p className="text-sm text-muted-foreground italic text-center py-4">Add options after saving the stage.</p>
                                      </div>
                                 </div>
                             </div>
                        )}
                         {orderData.etaps && orderData.etaps.length > 0 ? (
                            <Accordion
                                type="multiple"
                                className="w-full"
                                key={JSON.stringify(orderData.etaps)}
                                value={openAccordionItems}
                                onValueChange={handleAccordionChange}
                            >
                                {orderData.etaps.map((etap: Etap) => (
                                     <AccordionItem value={etap.id} key={etap.id} className="border rounded-md mb-2 overflow-hidden">
                                          <AccordionTrigger
                                              className={cn(
                                                "flex items-center w-full bg-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors hover:no-underline cursor-pointer px-4 py-3",
                                                openAccordionItems.includes(etap.id) && "rounded-b-none" // Remove bottom rounding if open
                                              )}
                                              asChild // Use asChild to allow custom content
                                              onClick={(e) => {
                                                  // Prevent accordion toggle if clicking the edit button
                                                  const target = e.target as HTMLElement;
                                                  if (target.closest('[data-edit-etap-button]')) {
                                                      e.preventDefault(); // Stop propagation and default behavior
                                                  }
                                              }}
                                            >
                                              <div className="flex-1 flex items-center justify-between w-full">
                                                  <span className="font-semibold text-left mr-2">{etap.name}</span>
                                                  {/* Chevon icon for accordion toggle */}
                                                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                              </div>
                                          </AccordionTrigger>
                                        <AccordionContent className="border-t">
                                             {/* Two-column layout inside content */}
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4">

                                                 {/* Left Column: Etap Info / Edit Form */}
                                                 <div className="border-r pr-6 border-border">
                                                    {editingEtapId === etap.id ? (
                                                        <div>
                                                            <h4 className="text-md font-semibold mb-3">Edit Stage: {etap.name}</h4>
                                                            <EditEtapForm
                                                                etap={etap}
                                                                currency={orderData.currency}
                                                                onEtapUpdated={handleEtapUpdated}
                                                                onCancel={handleCancelEditEtap}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {etap.workType === "Последовательный" ? "Seq." : "Par."}
                                                                </Badge>
                                                                <Badge variant="outline">
                                                                    {orderData.currency} {etap.estimatedPrice?.toLocaleString() ?? '0'}
                                                                </Badge>
                                                                 {userRole === "Заказчик" && (
                                                                     <Button
                                                                         data-edit-etap-button // Add data attribute
                                                                         size="icon"
                                                                         variant="ghost"
                                                                         onClick={() => handleEditEtapClick(etap.id)}
                                                                         className="h-6 w-6 p-1 text-muted-foreground hover:text-primary"
                                                                         disabled={isAddingEtap}
                                                                         aria-label="Edit Stage"
                                                                     >
                                                                         <Pencil className="h-4 w-4" />
                                                                     </Button>
                                                                 )}
                                                            </div>
                                                            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Description</h4>
                                                            <p className="text-sm text-foreground">{etap.description || "No description."}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                 {/* Right Column: Options List / Add/Edit Option Forms */}
                                                 <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                         <h4 className="text-sm font-semibold text-muted-foreground">Options</h4>
                                                          {userRole === "Заказчик" && (
                                                              <Button
                                                                  size="sm"
                                                                  variant="ghost"
                                                                  onClick={() => handleToggleAddOptionForm(etap.id)}
                                                                  disabled={!!editingOptionId} // Disable if editing another option
                                                                  className="h-auto p-1 text-xs text-primary hover:text-primary"
                                                              >
                                                                  {addingOptionToEtapId === etap.id ? (
                                                                     <><MinusCircle className="mr-1 h-3 w-3" /> Cancel Add</>
                                                                  ) : (
                                                                      <><PlusCircle className="mr-1 h-3 w-3" /> Add Option</>
                                                                  )}
                                                              </Button>
                                                          )}
                                                    </div>

                                                    {addingOptionToEtapId === etap.id && (
                                                        <div className="mb-4 p-4 border rounded-md bg-card">
                                                            <h5 className="text-md font-semibold mb-3">Add New Option</h5>
                                                            <AddOptionForm
                                                                etapId={etap.id}
                                                                currency={orderData.currency}
                                                                onOptionAdded={(newOption) => handleOptionAdded(etap.id, newOption)}
                                                                onCancel={handleCancelAddOption}
                                                            />
                                                        </div>
                                                    )}

                                                    {etap.options && etap.options.length > 0 ? (
                                                        <ul className="space-y-3">
                                                            {etap.options.map((option: EtapOption) => (
                                                                 <li key={option.id} className="text-sm border-l-2 pl-3 border-muted">
                                                                     {editingOptionId === option.id ? (
                                                                        <div className="mb-4 p-3 border rounded-md bg-card">
                                                                            <h5 className="text-md font-semibold mb-3">Edit Option: {option.name}</h5>
                                                                            <EditOptionForm
                                                                                etapId={etap.id}
                                                                                option={option}
                                                                                currency={orderData.currency}
                                                                                onOptionUpdated={(updatedOpt) => handleOptionUpdated(etap.id, updatedOpt)}
                                                                                onCancel={handleCancelEditOption}
                                                                            />
                                                                        </div>
                                                                     ) : (
                                                                        <>
                                                                            <div className="flex justify-between items-start">
                                                                                 <span className="font-medium text-foreground flex-1 mr-2">{option.name}</span>
                                                                                 <div className="flex items-center gap-1 flex-shrink-0">
                                                                                    <Badge
                                                                                        variant={option.isCalculable ? "default" : "outline"}
                                                                                        className={`text-xs ${option.isCalculable ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-muted-foreground'}`}
                                                                                    >
                                                                                        {option.isCalculable ? <Calculator className="mr-1 h-3 w-3"/> : <Info className="mr-1 h-3 w-3"/>}
                                                                                        {option.isCalculable ? 'Calculable' : 'Informational'}
                                                                                        {!option.includedInPrice && ' (Not in Price)'}
                                                                                    </Badge>
                                                                                     {userRole === "Заказчик" && (
                                                                                         <Button
                                                                                            size="icon"
                                                                                            variant="ghost"
                                                                                            onClick={() => handleEditOptionClick(option.id, etap.id)}
                                                                                            className="h-5 w-5 p-0.5 text-muted-foreground hover:text-primary"
                                                                                            disabled={!!addingOptionToEtapId} // Disable if adding another option
                                                                                            aria-label="Edit Option"
                                                                                         >
                                                                                            <Pencil className="h-3 w-3" />
                                                                                         </Button>
                                                                                     )}
                                                                                 </div>
                                                                            </div>
                                                                            {option.description && <p className="text-xs text-muted-foreground mt-1 mb-1">{option.description}</p>}
                                                                            {option.isCalculable && (
                                                                                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                                                    <span>Plan: {option.planUnits ?? 'N/A'} units</span>
                                                                                    <span>Rate: {orderData.currency} {option.pricePerUnit ?? 'N/A'} / {option.unitDivider ?? 'unit'}</span>
                                                                                    <span className="font-medium text-foreground">
                                                                                        Est: {orderData.currency} {option.calculatedPlanPrice?.toLocaleString() ?? 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                     )}
                                                                 </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        !(addingOptionToEtapId === etap.id || etap.options?.some(opt => opt.id === editingOptionId)) &&
                                                        <p className="text-sm text-muted-foreground italic text-center py-4">No options defined for this stage yet.</p>
                                                    )}
                                                 </div>
                                             </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                         ) : (
                            !(isAddingEtap || editingEtapId) && <p className="text-sm text-muted-foreground text-center py-4">No stages defined for this order yet.</p>
                         )}
                    </CardContent>
                </Card>

                 {/* Bids Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Bids</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Bids submitted by freelancers will appear here.</p>
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
                    </CardContent>
                </Card>

                 {/* Work Assignments Link */}
                 <Card className="lg:col-span-2">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Related Work Assignments</CardTitle>
                        <Link href={`/projects/${orderData.projectId}?tab=assignments`} passHref>
                             <Button size="sm" variant="link">View Assignments</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Assignments created based on this order.</p>
                    </CardContent>
                </Card>

                 {/* Communications Section Placeholder */}
                <Card className="lg:col-span-2">
                     <CardHeader>
                        <CardTitle className="text-lg font-semibold">Communication</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Chat or comments related to this order will be shown here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

