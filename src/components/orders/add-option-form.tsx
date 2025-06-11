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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Button } from "@/components/ui/button";
import type { StageOption } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define the form schema using Zod for StageOption
const optionFormSchema = z
  .object({
    name: z.string().min(1, { message: "Option name is required." }),
    description: z.string().optional(),
    pricing_type: z.enum(['calculable', 'included']).default('included'),
    volume_min: z.coerce
      .number()
      .min(0, { message: "Volume min must be non-negative." })
      .optional(),
    volume_max: z.coerce
      .number()
      .min(0, { message: "Volume max must be non-negative." })
      .optional(),
    nominal_volume: z.coerce
      .number()
      .min(0, { message: "Nominal volume must be non-negative." })
      .optional(),
    price_per_unit: z.coerce
      .number()
      .min(0, { message: "Price per unit must be non-negative." })
      .optional(),
  })
  .refine(
    (data) =>
      data.pricing_type !== 'calculable' ||
      (data.nominal_volume !== undefined && data.price_per_unit !== undefined),
    {
      message:
        "Calculable options require Nominal Volume and Price Per Unit.",
      path: ["nominal_volume"], // Attach error to a relevant field or a general path
    },
  );

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface AddOptionFormProps {
  etapId: string; // Can be 'new' for the temporary stage
  currency: string;
  // Update callback to accept partial data, parent will complete it
  onOptionAdded: (
    newOptionData: Omit<
      StageOption,
      "id" | "order_stage_id" | "createdAt" | "updatedAt" | "calculated_price_min" | "calculated_price_max"
    >,
  ) => void;
  onCancel: () => void; // Callback to cancel/hide the form
}

export default function AddOptionForm({
  etapId,
  currency,
  onOptionAdded,
  onCancel,
}: AddOptionFormProps) {
  const { toast } = useToast();

  const form = useForm<OptionFormValues>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      pricing_type: 'included',
      volume_min: undefined,
      volume_max: undefined,
      nominal_volume: undefined,
      price_per_unit: undefined,
    },
    mode: "onChange",
  });

  // Watch the value of pricing_type to conditionally render fields
  const pricingType = form.watch("pricing_type");

  const onSubmit = (data: OptionFormValues) => {
    console.log("Attempting to add new option with data:", data);

    // Pass partial data up to the parent handler
    onOptionAdded({
      name: data.name,
      description: data.description || "",
      pricing_type: data.pricing_type,
      volume_min: data.volume_min,
      volume_max: data.volume_max,
      nominal_volume: data.pricing_type === 'calculable' ? data.nominal_volume : undefined,
      price_per_unit: data.pricing_type === 'calculable' ? data.price_per_unit : undefined,
    });

    form.reset(); // Reset form after passing data up
    // Toast/closing logic handled in parent
  };

  return (
    <Form {...form} data-oid="z9brpq5">
      <form
        id={`add-option-form-${etapId}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="c9zr2is"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="2xieyem">
              <FormLabel data-oid="u8i82d.">Option Name</FormLabel>
              <FormControl data-oid="061p9-c">
                <Input
                  placeholder="Enter option name"
                  {...field}
                  data-oid="d.k4z9r"
                />
              </FormControl>
              <FormMessage data-oid="qxzklo8" />
            </FormItem>
          )}
          data-oid="pmni5-e"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="yj4llhe">
              <FormLabel data-oid="9zonch8">Description (Optional)</FormLabel>
              <FormControl data-oid="38dp9rx">
                <Textarea
                  placeholder="Describe the option..."
                  className="min-h-[60px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="dugg6-:"
                />
              </FormControl>
              <FormMessage data-oid="38slyzu" />
            </FormItem>
          )}
          data-oid="5db148j"
        />

        <FormField
          control={form.control}
          name="pricing_type"
          render={({ field }) => (
            <FormItem data-oid="xag1nw3">
              <FormLabel data-oid="x76a5a1">Pricing Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} data-oid="7w98u6d">
                <FormControl data-oid="1a:ta5x">
                  <SelectTrigger data-oid="vobs1ts">
                    <SelectValue placeholder="Select pricing type" data-oid="duq0y-c" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-oid="_fgnsfc">
                  <SelectItem value="included" data-oid="kn6y48f">Included in Price</SelectItem>
                  <SelectItem value="calculable" data-oid="jdrdvdy">Calculable</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription data-oid="_fgnsfc">
                Choose whether this option is included in the base price or calculated separately.
              </FormDescription>
              <FormMessage data-oid="kn6y48f" />
            </FormItem>
          )}
          data-oid="jdrdvdy"
        />

        {/* Volume range fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="dtylp:z">
          <FormField
            control={form.control}
            name="volume_min"
            render={({ field }) => (
              <FormItem data-oid="6xdid_5">
                <FormLabel data-oid="19lrda:">Volume Min</FormLabel>
                <FormControl data-oid=":78vx5p">
                  <Input
                    type="number"
                    placeholder="e.g., 1000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : parseFloat(e.target.value),
                      )
                    }
                    data-oid="bpj.fjn"
                  />
                </FormControl>
                <FormMessage data-oid="4xbhr79" />
              </FormItem>
            )}
            data-oid="nyi2mkt"
          />

          <FormField
            control={form.control}
            name="volume_max"
            render={({ field }) => (
              <FormItem data-oid="xtlz1lv">
                <FormLabel data-oid="_moq:7n">Volume Max</FormLabel>
                <FormControl data-oid="7.6rycr">
                  <Input
                    type="number"
                    placeholder="e.g., 5000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : parseFloat(e.target.value),
                      )
                    }
                    data-oid="p14en-k"
                  />
                </FormControl>
                <FormMessage data-oid="blkj6:." />
              </FormItem>
            )}
            data-oid="p0_mglv"
          />
        </div>

        {/* Conditionally render calculable fields */}
        {pricingType === 'calculable' && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-md"
            data-oid="calc_fields"
          >
            <FormField
              control={form.control}
              name="nominal_volume"
              render={({ field }) => (
                <FormItem data-oid="mncfzci">
                  <FormLabel data-oid="80sfquy">Nominal Volume</FormLabel>
                  <FormControl data-oid="q660sq0">
                    <Input
                      type="number"
                      placeholder="e.g., 2500"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value),
                        )
                      }
                      data-oid="8cvvuq4"
                    />
                  </FormControl>
                  <FormMessage data-oid="9vxpq25" />
                </FormItem>
              )}
              data-oid="jzqyk3_"
            />

            <FormField
              control={form.control}
              name="price_per_unit"
              render={({ field }) => (
                <FormItem data-oid="price_per_unit">
                  <FormLabel data-oid="price_label">
                    Price per Unit ({currency})
                  </FormLabel>
                  <FormControl data-oid="price_control">
                    <Input
                      type="number"
                      placeholder="e.g., 2.5"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value),
                        )
                      }
                      data-oid="price_input"
                    />
                  </FormControl>
                  <FormMessage data-oid="price_message" />
                </FormItem>
              )}
              data-oid="price_field"
            />
          </div>
        )}



        {/* Form Action Buttons */}
        <div className="flex justify-end gap-2 pt-2" data-oid="yu_bm9g">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid="vef7zdc"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            data-oid="phofiv5"
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Option"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
