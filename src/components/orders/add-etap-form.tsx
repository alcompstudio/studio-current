"use client";

import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Stage, StageOption } from "@/lib/types"; // Import StageOption
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const stageWorkTypes = ["Параллельный", "Последовательный"];

// Define the form schema using Zod
const stageFormSchema = z.object({
  name: z.string().min(1, { message: "Stage name is required." }),
  description: z.string().optional(),
  // workType: z
  //   .enum(stageWorkTypes, { required_error: "Work type is required." })
  //   .default("Параллельный"),
  // estimatedPrice: z.coerce.number().min(0, { message: "Estimated price must be non-negative." }).optional(), // Removed direct price input
});

type StageFormValues = z.infer<typeof stageFormSchema>;

interface AddStageFormProps {
  orderId: string;
  currency: string;
  onStageAdded: (
    newStageData: Omit<Stage, "id" | "createdAt" | "updatedAt" | "options">,
  ) => void; // Pass data up
  onCancel: () => void;
  isSaveDisabled: boolean; // Control save button from parent
}

export default function AddStageForm({
  orderId,
  currency,
  onStageAdded,
  onCancel,
  isSaveDisabled,
}: AddStageFormProps) {
  const { toast } = useToast();

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: StageFormValues) => {
    console.log("Attempting to add new stage with data:", data);

    // Validation is now handled by the parent via isSaveDisabled prop

    // Pass the form data up, parent will create the full Stage object
    onStageAdded({
      order_id: orderId, // Parent already knows this, but can be redundant
      name: data.name,
      description: data.description || "",
      estimatedPrice: 0, // Initial price is 0, calculated from options later
      sequence: 0, // Parent will determine sequence
    });

    // Reset and closing logic is handled in the parent's `handleStageAdded`
    form.reset(); // Reset form after passing data up
  };

  return (
    <Form {...form} data-oid="2qvv8.a">
      <form
        id="add-stage-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="q.mi69e"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="0y6udn6">
              <FormLabel data-oid="u08lgra">Stage Name</FormLabel>
              <FormControl data-oid="rxcjp-1">
                <Input
                  placeholder="Enter stage name"
                  {...field}
                  data-oid="nrext6h"
                />
              </FormControl>
              <FormMessage data-oid="qfa.c8g" />
            </FormItem>
          )}
          data-oid=".0kjm1r"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="m8ln07q">
              <FormLabel data-oid="hy0uwyf">Description (Optional)</FormLabel>
              <FormControl data-oid="d965jrg">
                <Textarea
                  placeholder="Describe the stage..."
                  className="min-h-[80px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="uae6x2:"
                />
              </FormControl>
              <FormMessage data-oid="hfdzlhf" />
            </FormItem>
          )}
          data-oid="lz:fgsx"
        />



        <div className="flex justify-end gap-2 pt-4" data-oid="qzwza:d">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid="mhbekl."
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isSaveDisabled}
            data-oid="-n9-mfq"
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Stage"}
          </Button>
        </div>
        <p
          className="text-xs text-muted-foreground pt-2 text-right"
          data-oid="z1r8gi7"
        >
          Note: Add options in the right panel. Save is enabled once options are
          added.
        </p>
      </form>
    </Form>
  );
}
