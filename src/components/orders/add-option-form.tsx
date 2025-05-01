
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Button } from "@/components/ui/button";
import type { EtapOption } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// Define the form schema using Zod for EtapOption
const optionFormSchema = z.object({
    name: z.string().min(1, { message: "Option name is required." }),
    description: z.string().optional(),
    isCalculable: z.boolean().default(false),
    includedInPrice: z.boolean().default(true),
    planUnits: z.coerce.number().positive({ message: "Plan units must be positive if provided." }).optional(),
    unitDivider: z.coerce.number().positive({ message: "Unit divider must be positive if provided." }).optional(),
    pricePerUnit: z.coerce.number().min(0, { message: "Price must be non-negative if provided." }).optional(),
})
.refine(data => !data.isCalculable || (data.planUnits && data.unitDivider && data.pricePerUnit !== undefined), {
    message: "Calculable options require Plan Units, Unit Divider, and Price Per Unit.",
    path: ["isCalculable"], // Attach error to a relevant field or a general path
});

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface AddOptionFormProps {
    etapId: string;
    currency: string;
    onOptionAdded: (newOption: EtapOption) => void; // Callback to notify parent
    onCancel: () => void; // Callback to cancel/hide the form
}

export default function AddOptionForm({ etapId, currency, onOptionAdded, onCancel }: AddOptionFormProps) {
    const { toast } = useToast();

    const form = useForm<OptionFormValues>({
        resolver: zodResolver(optionFormSchema),
        defaultValues: {
            name: "",
            description: "",
            isCalculable: false,
            includedInPrice: true,
            planUnits: undefined,
            unitDivider: undefined,
            pricePerUnit: undefined,
        },
        mode: "onChange",
    });

     // Watch the value of isCalculable to conditionally render fields
     const isCalculable = form.watch('isCalculable');

    const onSubmit = (data: OptionFormValues) => {
        console.log("Attempting to add new option with data:", data);

        const newOptionId = `${etapId}_option_${Date.now()}`; // Simple unique ID

        let calculatedPlanPrice: number | undefined = undefined;
        if (data.isCalculable && data.planUnits && data.unitDivider && data.pricePerUnit !== undefined) {
            calculatedPlanPrice = parseFloat(((data.planUnits / data.unitDivider) * data.pricePerUnit).toFixed(2));
        }

        const newOption: EtapOption = {
            id: newOptionId,
            etapId: etapId,
            name: data.name,
            description: data.description || "",
            isCalculable: data.isCalculable,
            includedInPrice: data.includedInPrice,
            planUnits: data.isCalculable ? data.planUnits : undefined,
            unitDivider: data.isCalculable ? data.unitDivider : undefined,
            pricePerUnit: data.isCalculable ? data.pricePerUnit : undefined,
            calculatedPlanPrice: calculatedPlanPrice,
            createdAt: new Date(),
            updatedAt: new Date(),
            // calculationFormula could be added here if needed
        };

        // --- Simulate successful addition ---
        console.log("Generated new option:", newOption);
        onOptionAdded(newOption); // Call parent callback
        form.reset(); // Reset form
        // Optionally show toast in parent component after state update
        // --- End Simulation ---
    };

    return (
        <Form {...form}>
             <form
                id={`add-option-form-${etapId}`}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
             >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Option Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter option name" {...field} />
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
                                    placeholder="Describe the option..."
                                    className="min-h-[60px]"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                 <div className="flex items-center space-x-2">
                    <FormField
                        control={form.control}
                        name="isCalculable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        // Reset calculable fields if unchecked
                                        if (!checked) {
                                            form.reset({
                                                ...form.getValues(), // keep other values
                                                planUnits: undefined,
                                                unitDivider: undefined,
                                                pricePerUnit: undefined,
                                            });
                                        }
                                    }}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Calculable Option
                                </FormLabel>
                                <FormDescription>
                                    Does this option affect the price calculation?
                                </FormDescription>
                                <FormMessage />
                            </div>
                            </FormItem>
                        )}
                    />
                 </div>

                 {/* Conditionally render calculable fields */}
                 {isCalculable && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md">
                         <FormField
                            control={form.control}
                            name="planUnits"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan Units</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 2500" {...field}
                                            value={field.value ?? ''}
                                            onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="unitDivider"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit Divider</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 1000" {...field}
                                            value={field.value ?? ''}
                                            onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="pricePerUnit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price / Unit ({currency})</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 2.5" step="0.01" {...field}
                                            value={field.value ?? ''}
                                            onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                 )}

                {/* Included in Price Checkbox - Always show, but its meaning differs */}
                 <div className="flex items-center space-x-2">
                     <FormField
                         control={form.control}
                         name="includedInPrice"
                         render={({ field }) => (
                             <FormItem className="flex flex-row items-center space-x-2">
                                 <FormControl>
                                     <Checkbox
                                         checked={field.value}
                                         onCheckedChange={field.onChange}
                                         // Calculable options are typically included by default
                                         disabled={isCalculable}
                                     />
                                 </FormControl>
                                 <FormLabel className="text-sm font-normal">
                                      Included in Estimated Price
                                      {isCalculable && <span className="text-xs text-muted-foreground"> (Calculable options always included)</span>}
                                 </FormLabel>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />
                 </div>


                 {/* Form Action Buttons */}
                <div className="flex justify-end gap-2 pt-2">
                     <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                         Cancel
                     </Button>
                     <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                         {form.formState.isSubmitting ? 'Adding...' : 'Add Option'}
                     </Button>
                 </div>
             </form>
        </Form>
    );
}
