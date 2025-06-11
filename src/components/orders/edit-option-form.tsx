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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { StageOption } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define the form schema using Zod for StageOption (same as add form)
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
      path: ["nominal_volume"],
    },
  );

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface EditOptionFormProps {
  stageId: string;
  option: StageOption; // The option to edit
  currency: string;
  onOptionUpdated: (updatedOption: StageOption) => void; // Callback to notify parent
  onCancel: () => void; // Callback to cancel/hide the form
}

export default function EditOptionForm({
  stageId,
  option,
  currency,
  onOptionUpdated,
  onCancel,
}: EditOptionFormProps) {
  const { toast } = useToast();

  const form = useForm<OptionFormValues>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: {
      name: option.name || "",
      description: option.description || "",
      pricing_type: option.pricing_type || 'included',
      volume_min: option.volume_min || undefined,
      volume_max: option.volume_max || undefined,
      nominal_volume: option.nominal_volume || undefined,
      price_per_unit: option.price_per_unit || undefined,
    },
    mode: "onChange",
  });

  // Reset form if the option prop changes
  useEffect(() => {
    form.reset({
      name: option.name || "",
      description: option.description || "",
      pricing_type: option.pricing_type || 'included',
      volume_min: option.volume_min || undefined,
      volume_max: option.volume_max || undefined,
      nominal_volume: option.nominal_volume || undefined,
      price_per_unit: option.price_per_unit || undefined,
    });
  }, [option, form]);

  const pricingType = form.watch("pricing_type");

  const onSubmit = (data: OptionFormValues) => {
    console.log("Attempting to update option with data:", data);

    let calculatedPriceMin: number | undefined = undefined;
    let calculatedPriceMax: number | undefined = undefined;

    if (
      data.pricing_type === 'calculable' &&
      data.nominal_volume &&
      data.price_per_unit !== undefined
    ) {
      calculatedPriceMin = parseFloat((data.nominal_volume * data.price_per_unit).toFixed(2));
      calculatedPriceMax = calculatedPriceMin; // For now, min and max are the same
    }

    const updatedOption: StageOption = {
      ...option, // Spread existing properties like id, order_stage_id, createdAt
      name: data.name,
      description: data.description || "",
      pricing_type: data.pricing_type,
      volume_min: data.volume_min,
      volume_max: data.volume_max,
      nominal_volume: data.pricing_type === 'calculable' ? data.nominal_volume : undefined,
      price_per_unit: data.pricing_type === 'calculable' ? data.price_per_unit : undefined,
      calculated_price_min: calculatedPriceMin,
      calculated_price_max: calculatedPriceMax,
      updatedAt: new Date().toISOString(),
    };

    // --- Simulate successful update ---
    console.log("Generated updated option:", updatedOption);
    onOptionUpdated(updatedOption); // Call parent callback
    // Form reset/closing is handled by the parent component
    // --- End Simulation ---
  };

  return (
    <Form {...form} data-oid=":.eqmpu">
      <form
        id={`edit-option-form-${option.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="wdj-c36"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="7mkzt-k">
              <FormLabel data-oid="m3mtx0.">Option Name</FormLabel>
              <FormControl data-oid="g_75byy">
                <Input
                  placeholder="Enter option name"
                  {...field}
                  data-oid="momykke"
                />
              </FormControl>
              <FormMessage data-oid="4awm4il" />
            </FormItem>
          )}
          data-oid="k3s:mzz"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="0b9-690">
              <FormLabel data-oid="2.451ar">Description (Optional)</FormLabel>
              <FormControl data-oid="dlbys-y">
                <Textarea
                  placeholder="Describe the option..."
                  className="min-h-[60px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="xdhm4u2"
                />
              </FormControl>
              <FormMessage data-oid="4hrur5l" />
            </FormItem>
          )}
          data-oid="0iaoqeb"
        />

        <FormField
          control={form.control}
          name="pricing_type"
          render={({ field }) => (
            <FormItem data-oid="6tpbda2">
              <FormLabel data-oid="24i_.fs">Pricing Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} data-oid="bzbsfx:">
                <FormControl data-oid="b4y38pt">
                  <SelectTrigger data-oid="wsvu4gz">
                    <SelectValue placeholder="Select pricing type" data-oid="wy1jb-r" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-oid="qxsvlf1">
                  <SelectItem value="included" data-oid="b1zx:we">Included in Price</SelectItem>
                  <SelectItem value="calculable" data-oid="al.i91q">Calculable</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription data-oid="qxsvlf1">
                Choose whether this option is included in the base price or calculated separately.
              </FormDescription>
              <FormMessage data-oid="b1zx:we" />
            </FormItem>
          )}
          data-oid="al.i91q"
        />

        {/* Volume range fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="vmo9hrk">
          <FormField
            control={form.control}
            name="volume_min"
            render={({ field }) => (
              <FormItem data-oid="ktji4o4">
                <FormLabel data-oid="87o3mqo">Volume Min</FormLabel>
                <FormControl data-oid="uhptouj">
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
                    data-oid=":vw17g-"
                  />
                </FormControl>
                <FormMessage data-oid="8fzgbj7" />
              </FormItem>
            )}
            data-oid="vub2f.f"
          />

          <FormField
            control={form.control}
            name="volume_max"
            render={({ field }) => (
              <FormItem data-oid="wxx:gwj">
                <FormLabel data-oid=":1chket">Volume Max</FormLabel>
                <FormControl data-oid="eqbdi86">
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
                    data-oid="t:fi0s2"
                  />
                </FormControl>
                <FormMessage data-oid="nykmna:" />
              </FormItem>
            )}
            data-oid="eia4e76"
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
                <FormItem data-oid="ug7qp16">
                  <FormLabel data-oid="mn8m_ay">Nominal Volume</FormLabel>
                  <FormControl data-oid="qtek-44">
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
                      data-oid="h4::l0j"
                    />
                  </FormControl>
                  <FormMessage data-oid="wbpi4-4" />
                </FormItem>
              )}
              data-oid="e1916gl"
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
        <div className="flex justify-end gap-2 pt-2" data-oid="0ysz3g1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid="mdaxu_e"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            data-oid="3mptan5"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
