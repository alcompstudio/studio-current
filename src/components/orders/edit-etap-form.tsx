
'use client';

import React, { useEffect } from 'react';
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
import type { Etap, EtapWorkType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const etapWorkTypes: EtapWorkType[] = ["Параллельный", "Последовательный"];

// Define the form schema using Zod - same as add form
const etapFormSchema = z.object({
    name: z.string().min(1, { message: "Stage name is required." }),
    description: z.string().optional(),
    workType: z.enum(etapWorkTypes, { required_error: "Work type is required." }),
    estimatedPrice: z.coerce.number().min(0, { message: "Estimated price must be non-negative." }).optional(),
});

type EtapFormValues = z.infer<typeof etapFormSchema>;

interface EditEtapFormProps {
    etap: Etap; // The etap to edit
    currency: string;
    onEtapUpdated: (updatedEtap: Etap) => void; // Callback to notify parent
    onCancel: () => void; // Callback to cancel/hide the form
}

export default function EditEtapForm({ etap, currency, onEtapUpdated, onCancel }: EditEtapFormProps) {
    const { toast } = useToast();

    const form = useForm<EtapFormValues>({
        resolver: zodResolver(etapFormSchema),
        defaultValues: {
            name: etap.name || "",
            description: etap.description || "",
            workType: etap.workType || 'Параллельный',
            estimatedPrice: etap.estimatedPrice,
        },
        mode: "onChange",
    });

    // Reset form if the etap prop changes
    useEffect(() => {
        form.reset({
            name: etap.name || "",
            description: etap.description || "",
            workType: etap.workType || 'Параллельный',
            estimatedPrice: etap.estimatedPrice,
        });
    }, [etap, form]);


    const onSubmit = (data: EtapFormValues) => {
        console.log("Attempting to update stage with data:", data);

        const updatedEtap: Etap = {
            ...etap, // Spread existing etap properties (like id, orderId, options, createdAt)
            name: data.name,
            description: data.description || "",
            workType: data.workType,
            estimatedPrice: data.estimatedPrice,
            updatedAt: new Date(), // Update timestamp
        };

        // --- Simulate successful update ---
        console.log("Generated updated stage:", updatedEtap);

        // Call the callback function to update the parent component's state
        onEtapUpdated(updatedEtap);

        // Optionally show toast
        // toast({
        //     title: "Stage Updated",
        //     description: `Stage "${data.name}" has been updated (simulated).`,
        // });

        // Form reset is handled by the parent closing the form or by useEffect if needed
        // --- End Simulation ---
    };

    return (
        <Form {...form}>
             <form
                id={`edit-etap-form-${etap.id}`} // Unique ID for the form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
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
                         {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                     </Button>
                 </div>
             </form>
        </Form>
    );
}
