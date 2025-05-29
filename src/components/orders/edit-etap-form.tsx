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
import type { Etap, EtapWorkType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

export default function EditEtapForm({
  etap,
  currency,
  onEtapUpdated,
  onCancel,
}: EditEtapFormProps) {
  const { toast } = useToast();

  const form = useForm<EtapFormValues>({
    resolver: zodResolver(etapFormSchema),
    defaultValues: {
      name: etap.name || "",
      description: etap.description || "",
      workType: etap.workType || "Параллельный",
      // estimatedPrice: etap.estimatedPrice, // Removed
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      name: etap.name || "",
      description: etap.description || "",
      workType: etap.workType || "Параллельный",
      // estimatedPrice: etap.estimatedPrice, // Removed
    });
  }, [etap, form]);

  const onSubmit = (data: EtapFormValues) => {
    console.log("Attempting to update stage with data:", data);

    // Validation: Check if the etap (which already exists) still has options
    if (!etap.options || etap.options.length === 0) {
      toast({
        title: "Validation Error",
        description:
          "Stage cannot be saved without at least one option. Please add options first.",
        variant: "destructive",
      });
      return; // Prevent saving
    }

    // Recalculate estimated price based on current options (important if options were edited separately)
    const calculatedPrice = (etap.options || [])
      .filter((opt) => opt.isCalculable && opt.includedInPrice)
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
    <Form {...form} data-oid="d.0cho8">
      <form
        id={`edit-etap-form-${etap.id}`}
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

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        <div data-oid="d:zckcg">
          {" "}
          {/* Keep work type in a single column */}
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem data-oid="azl_j6n">
                <FormLabel data-oid="yv0xdq9">Work Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  data-oid="dl-rcve"
                >
                  <FormControl data-oid="oes41:w">
                    <SelectTrigger data-oid=":wns-.z">
                      <SelectValue
                        placeholder="Select work type"
                        data-oid="ude_56r"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="zwj8k:o">
                    {etapWorkTypes.map((type) => (
                      <SelectItem key={type} value={type} data-oid=".2:ob4v">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage data-oid="czb0oo8" />
              </FormItem>
            )}
            data-oid="u8bac65"
          />
          {/* Removed Estimated Price Field */}
        </div>

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
              !etap.options ||
              etap.options.length === 0
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
