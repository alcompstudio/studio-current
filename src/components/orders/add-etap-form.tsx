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
    onEtapAdded: (newEtap: Etap) => void;
    onCancel: () => void;
    // No need to pass options here, validation happens on submit based on internal state/logic
}

export default function AddEtapForm({ orderId, currency, onEtapAdded, onCancel }: AddEtapFormProps) {
    const { toast } = useToast();
    // In a real app, you might manage temporary options added to this new stage here
    // For this example, we'll simulate the check during submission logic

    const form = useForm<EtapFormValues>({
        resolver: zodResolver(etapFormSchema),
        defaultValues: {
            name: "",
            description: "",
            workType: 'Параллельный',
            // estimatedPrice: undefined, // Removed
        },
        mode: "onChange",
    });

    const onSubmit = (data: EtapFormValues) => {
        console.log("Attempting to add new stage with data:", data);

        // --- VALIDATION: Simulate checking if options exist ---
        // In a real scenario, you would check if the user has added at least one option
        // to this stage *before* allowing the save. Since options are added separately now,
        // this validation needs to be handled differently, potentially by disabling the save button
        // until an option is added, or showing a persistent message.
        // For now, we just add a toast reminder in the parent component upon successful add.
        // We *cannot* prevent saving based on options in *this* form alone anymore.

        const newEtapId = `${orderId}_etap_${Date.now()}`; // Simple unique ID

        const newEtap: Etap = {
            id: newEtapId,
            orderId: orderId,
            name: data.name,
            description: data.description || "",
            workType: data.workType,
            estimatedPrice: 0, // Initial price is 0, calculated from options later
            options: [], // Start with empty options - User must add them
            createdAt: new Date(),
            updatedAt: new Date(),
            sequence: 0, // Needs logic to determine sequence if relevant
        };

        console.log("Generated new stage:", newEtap);
        onEtapAdded(newEtap); // Call the callback

        // Toast message updated in parent component

        form.reset();
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
                     <Button type="submit" disabled={form.formState.isSubmitting /* || !hasOptions */}>
                         {form.formState.isSubmitting ? 'Adding...' : 'Add Stage'}
                     </Button>
                 </div>
                  {/* Reminder message */}
                  <p className="text-xs text-muted-foreground pt-2 text-right">
                      Note: Add options in the right panel after saving the stage. Stage price is calculated from options.
                 </p>
             </form>
        </Form>
    );
}
