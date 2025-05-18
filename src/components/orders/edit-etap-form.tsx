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
    <Form {...form} data-oid="b23vdcr">
      <form
        id={`edit-etap-form-${etap.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="2q:_rfu"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="u.hk5u:">
              <FormLabel data-oid="zfl-6ti">Stage Name</FormLabel>
              <FormControl data-oid="kud.72q">
                <Input
                  placeholder="Enter stage name"
                  {...field}
                  data-oid="h2hr9.o"
                />
              </FormControl>
              <FormMessage data-oid="svsid_2" />
            </FormItem>
          )}
          data-oid="k4u3eg0"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="f7j.e9x">
              <FormLabel data-oid="zakge-:">Description (Optional)</FormLabel>
              <FormControl data-oid="0:n1dta">
                <Textarea
                  placeholder="Describe the stage..."
                  className="min-h-[80px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="8if1:oi"
                />
              </FormControl>
              <FormMessage data-oid="pvlwgdm" />
            </FormItem>
          )}
          data-oid="qje40q:"
        />

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        <div data-oid="8v2hz-y">
          {" "}
          {/* Keep work type in a single column */}
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem data-oid="8jj29qf">
                <FormLabel data-oid="plczbw7">Work Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  data-oid="4ro60kb"
                >
                  <FormControl data-oid="sds1ke4">
                    <SelectTrigger data-oid="02brjlf">
                      <SelectValue
                        placeholder="Select work type"
                        data-oid="bzbelx6"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="4_.vrf8">
                    {etapWorkTypes.map((type) => (
                      <SelectItem key={type} value={type} data-oid="kp952ba">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage data-oid="85sj10i" />
              </FormItem>
            )}
            data-oid="su6.c_i"
          />
          {/* Removed Estimated Price Field */}
        </div>

        <div className="flex justify-end gap-2 pt-4" data-oid="bc93nqu">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid="y8b4w05"
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
            data-oid="hvgh0bc"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        {/* Reminder message */}
        <p
          className="text-xs text-muted-foreground pt-2 text-right"
          data-oid="s5_u.4s"
        >
          Note: Stage price is calculated from options in the right panel.
          Ensure at least one option exists.
        </p>
      </form>
    </Form>
  );
}
