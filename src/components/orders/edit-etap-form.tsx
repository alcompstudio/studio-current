"use client";

import React, { useEffect } from "react";
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
import type { Stage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define the form schema using Zod - same as add form
const stageFormSchema = z.object({
  name: z.string().min(1, { message: "Stage name is required." }),
  description: z.string().optional(),
  // estimatedPrice: z.coerce.number().min(0, { message: "Estimated price must be non-negative." }).optional(), // Removed direct price input
});

type StageFormValues = z.infer<typeof stageFormSchema>;

interface EditStageFormProps {
  stage: Stage;
  currency: string;
  onStageUpdated: (updatedStage: Stage) => void;
  onCancel: () => void;
}

export default function EditStageForm({
  stage,
  currency,
  onStageUpdated,
  onCancel,
}: EditStageFormProps) {
  const { toast } = useToast();

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      name: stage.name || "",
      description: stage.description || "",
      // estimatedPrice: stage.estimatedPrice, // Removed
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      name: stage.name || "",
      description: stage.description || "",
      // estimatedPrice: stage.estimatedPrice, // Removed
    });
  }, [stage, form]);

  const onSubmit = (data: StageFormValues) => {
    console.log("Attempting to update stage with data:", data);

    // Validation: Check if the stage (which already exists) still has options
    if (!stage.options || stage.options.length === 0) {
      toast({
        title: "Validation Error",
        description:
          "Stage cannot be saved without at least one option. Please add options first.",
        variant: "destructive",
      });
      return; // Prevent saving
    }

    // Recalculate estimated price based on current options (important if options were edited separately)
    const calculatedPrice = (stage.options || [])
      .filter((opt) => opt.pricing_type === 'calculable')
      .reduce((sum, opt) => sum + (opt.calculated_price_min || 0), 0);

    const updatedStage: Stage = {
      ...stage,
      name: data.name,
      description: data.description || "",
      estimatedPrice: parseFloat(calculatedPrice.toFixed(2)), // Update price based on options
      updatedAt: new Date().toISOString(),
    };

    console.log("Generated updated stage:", updatedStage);
    onStageUpdated(updatedStage); // Call the callback
  };

  return (
    <Form {...form} data-oid="d.0cho8">
      <form
        id={`edit-stage-form-${stage.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="2_kk43k"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid=".rvnt5o">
              <FormLabel data-oid="lbcax4h">Stage Name</FormLabel>
              <FormControl data-oid="q1tjv81">
                <Input
                  placeholder="Enter stage name"
                  {...field}
                  data-oid="96o8gck"
                />
              </FormControl>
              <FormMessage data-oid="n-zbje2" />
            </FormItem>
          )}
          data-oid="89-t-5a"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="gzsjr5x">
              <FormLabel data-oid="ean2kt.">Description (Optional)</FormLabel>
              <FormControl data-oid="m.sj4l1">
                <Textarea
                  placeholder="Describe the stage..."
                  className="min-h-[80px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="6w-_wcr"
                />
              </FormControl>
              <FormMessage data-oid="9pvgn8m" />
            </FormItem>
          )}
          data-oid="5k9kcsd"
        />



        <div className="flex justify-end gap-2 pt-4" data-oid="ynkr5y3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid=".lgi0qr"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              !stage.options ||
              stage.options.length === 0
            }
            data-oid="z6ewu.v"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        {/* Reminder message */}
        <p
          className="text-xs text-muted-foreground pt-2 text-right"
          data-oid="knkkvr-"
        >
          Note: Stage price is calculated from options in the right panel.
          Ensure at least one option exists.
        </p>
      </form>
    </Form>
  );
}
