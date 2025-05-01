'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// Removed Dialog imports: DialogFooter, DialogClose
import type { Etap, EtapWorkType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { mockOrders } from '@/app/(app)/orders/mockOrders'; // Import mockOrders to update

const etapWorkTypes: EtapWorkType[] = ["Параллельный", "Последовательный"];

// Define the form schema using Zod
const etapFormSchema = z.object({
    name: z.string().min(1, { message: "Stage name is required." }),
    description: z.string().optional(),
    workType: z.enum(etapWorkTypes, { required_error: "Work type is required." }).default('Параллельный'),
    estimatedPrice: z.coerce.number().min(0, { message: "Estimated price must be non-negative." }).optional(), // Optional price input
});

type EtapFormValues = z.infer<typeof etapFormSchema>;

interface AddEtapFormProps {
    orderId: string;
    currency: string;
    onEtapAdded: (newEtap: Etap) => void; // Callback to notify parent
    onCancel: () => void; // Callback to cancel/hide the form
}

export default function AddEtapForm({ orderId, currency, onEtapAdded, onCancel }: AddEtapFormProps) {
    const { toast } = useToast();

    const form = useForm<EtapFormValues>({
        resolver: zodResolver(etapFormSchema),
        defaultValues: {
            name: "",
            description: "",
            workType: 'Параллельный',
            estimatedPrice: undefined,
        },
        mode: "onChange",
    });

    const onSubmit = (data: EtapFormValues) => {
        console.log("Attempting to add new stage with data:", data);

        const newEtapId = `${orderId}_etap_${Date.now()}`; // Simple unique ID

        const newEtap: Etap = {
            id: newEtapId,
            orderId: orderId,
            name: data.name,
            description: data.description || "",
            workType: data.workType,
            estimatedPrice: data.estimatedPrice, // Use the value from form
            options: [], // Start with empty options
            createdAt: new Date(),
            updatedAt: new Date(),
            sequence: 0, // Default sequence, maybe calculate later based on count
        };

        // --- Simulate updating the mock order ---
        const orderIndex = mockOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            // Ensure etaps array exists
            if (!mockOrders[orderIndex].etaps) {
                mockOrders[orderIndex].etaps = [];
            }
            mockOrders[orderIndex].etaps!.push(newEtap); // Add the new etap
            mockOrders[orderIndex].updatedAt = new Date(); // Update order timestamp

            console.log("Added new stage to mock order:", newEtap);
            console.log("Updated mockOrders:", mockOrders);

            // Call the callback function to update the parent component's state
            onEtapAdded(newEtap);

            toast({
                title: "Stage Added",
                description: `New stage "${data.name}" added to the order (mock).`,
            });

            form.reset(); // Reset form after successful submission

        } else {
            toast({
                title: "Error Adding Stage",
                description: `Could not find order with ID ${orderId} to add stage.`,
                variant: "destructive",
            });
        }
        // -----------------------------------------
    };

    return (
        <Form {...form}>
             <form
                id="add-etap-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4" // Removed px/py, handled by parent container
             >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stage Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter stage name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the stage..."
                                    className="min-h-[80px]"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="workType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Work Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select work type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {etapWorkTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="estimatedPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estimated Price ({currency}) (Optional)</FormLabel>
                                <FormControl>
                                     <Input
                                        type="number"
                                        placeholder="Enter estimated price"
                                        step="0.01"
                                        {...field}
                                        value={field.value ?? ''}
                                         onChange={e => {
                                            const value = e.target.value;
                                            field.onChange(value === '' ? undefined : parseFloat(value));
                                          }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                 {/* Form Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                     <Button type="button" variant="outline" onClick={onCancel}>
                         Cancel
                     </Button>
                     <Button type="submit" disabled={form.formState.isSubmitting}>
                         {form.formState.isSubmitting ? 'Adding...' : 'Add Stage'}
                     </Button>
                 </div>
             </form>
        </Form>
    );
}
