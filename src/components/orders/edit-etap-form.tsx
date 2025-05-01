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
    // estimatedPrice: z.coerce.number().min(0, { message: "Estimated price must be non-negative." }).optional(), // Removed direct price input
});

type EtapFormValues = z.infer<typeof etapFormSchema>;

interface EditEtapFormProps {
    etap: Etap;
    currency: string;
    onEtapUpdated: (updatedEtap: Etap) => void;
    onCancel: () => void;
}

export default function EditEtapForm({ etap, currency, onEtapUpdated, onCancel }: EditEtapFormProps) {
    const { toast } = useToast();

    const form = useForm<EtapFormValues>({
        resolver: zodResolver(etapFormSchema),
        defaultValues: {
            name: etap.name || "",
            description: etap.description || "",
            workType: etap.workType || 'Параллельный',
            // estimatedPrice: etap.estimatedPrice, // Removed
        },
        mode: "onChange",
    });

    useEffect(() => {
        form.reset({
            name: etap.name || "",
            description: etap.description || "",
            workType: etap.workType || 'Параллельный',
            // estimatedPrice: etap.estimatedPrice, // Removed
        });
    }, [etap, form]);


    const onSubmit = (data: EtapFormValues) => {
        console.log("Attempting to update stage with data:", data);

        // Validation: Check if the etap (which already exists) still has options
        if (!etap.options || etap.options.length === 0) {
            toast({
                title: "Validation Error",
                description: "Stage cannot be saved without at least one option. Please add options first.",
                variant: "destructive",
            });
            return; // Prevent saving
        }

        // Recalculate estimated price based on current options (important if options were edited separately)
        const calculatedPrice = (etap.options || [])
            .filter(opt => opt.isCalculable && opt.includedInPrice)
            .reduce((sum, opt) => sum + (opt.calculatedPlanPrice || 0), 0);


        const updatedEtap: Etap = {
            ...etap,
            name: data.name,
            description: data.description || "",
            workType: data.workType,
            estimatedPrice: parseFloat(calculatedPrice.toFixed(2)), // Update price based on options
            updatedAt: new Date(),
        };

        console.log("Generated updated stage:", updatedEtap);
        onEtapUpdated(updatedEtap); // Call the callback
    };

    return (
        <Form {...form}>
             <form
                id={`edit-etap-form-${etap.id}`}
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

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                <div> {/* Keep work type in a single column */}
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

                   {/* Removed Estimated Price Field */}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                     <Button type="button" variant="outline" onClick={onCancel}>
                         Cancel
                     </Button>
                     <Button type="submit" disabled={form.formState.isSubmitting || !etap.options || etap.options.length === 0}>
                         {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                     </Button>
                 </div>
                  {/* Reminder message */}
                  <p className="text-xs text-muted-foreground pt-2 text-right">
                      Note: Stage price is calculated from options in the right panel. Ensure at least one option exists.
                 </p>
             </form>
        </Form>
    );
}
