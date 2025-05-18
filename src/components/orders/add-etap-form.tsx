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
import type { Etap, EtapWorkType, EtapOption } from "@/lib/types"; // Import EtapOption
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const etapWorkTypes: EtapWorkType[] = ["Параллельный", "Последовательный"];

// Define the form schema using Zod
const etapFormSchema = z.object({
    name: z.string().min(1, { message: "Stage name is required." }),
    description: z.string().optional(),
    workType: z.enum(etapWorkTypes, { required_error: "Work type is required." }).default('Параллельный'),
    // estimatedPrice: z.coerce.number().min(0, { message: "Estimated price must be non-negative." }).optional(), // Removed direct price input
});

type EtapFormValues = z.infer<typeof etapFormSchema>;

interface AddEtapFormProps {
    orderId: string;
    currency: string;
    onEtapAdded: (newEtapData: Omit<Etap, 'id' | 'createdAt' | 'updatedAt' | 'options'>) => void; // Pass data up
    onCancel: () => void;
    isSaveDisabled: boolean; // Control save button from parent
}

export default function AddEtapForm({ orderId, currency, onEtapAdded, onCancel, isSaveDisabled }: AddEtapFormProps) {
    const { toast } = useToast();

    const form = useForm<EtapFormValues>({
        resolver: zodResolver(etapFormSchema),
        defaultValues: {
            name: "",
            description: "",
            workType: 'Параллельный',
        },
        mode: "onChange",
    });

    const onSubmit = (data: EtapFormValues) => {
        console.log("Attempting to add new stage with data:", data);

        // Validation is now handled by the parent via isSaveDisabled prop

        // Pass the form data up, parent will create the full Etap object
        onEtapAdded({
            orderId: orderId, // Parent already knows this, but can be redundant
            name: data.name,
            description: data.description || "",
            workType: data.workType,
            estimatedPrice: 0, // Initial price is 0, calculated from options later
            sequence: 0, // Parent will determine sequence
        });

        // Reset and closing logic is handled in the parent's `handleEtapAdded`
        form.reset(); // Reset form after passing data up
    };

    return (
        <Form {...form}>
             <form
                id="add-etap-form"
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

                <div>
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
                </div>

                <div className="flex justify-end gap-2 pt-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
                     >
                         Cancel
                     </Button>
                     <Button type="submit" disabled={form.formState.isSubmitting || isSaveDisabled}>
                         {form.formState.isSubmitting ? 'Adding...' : 'Add Stage'}
                     </Button>
                 </div>
                  <p className="text-xs text-muted-foreground pt-2 text-right">
                      Note: Add options in the right panel. Save is enabled once options are added.
                 </p>
             </form>
        </Form>
    );
}
