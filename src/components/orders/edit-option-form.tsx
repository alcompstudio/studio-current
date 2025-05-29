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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { EtapOption } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define the form schema using Zod for EtapOption (same as add form)
const optionFormSchema = z
  .object({
    name: z.string().min(1, { message: "Option name is required." }),
    description: z.string().optional(),
    isCalculable: z.boolean().default(false),
    includedInPrice: z.boolean().default(true),
    planUnits: z.coerce
      .number()
      .positive({ message: "Plan units must be positive if provided." })
      .optional(),
    unitDivider: z.coerce
      .number()
      .positive({ message: "Unit divider must be positive if provided." })
      .optional(),
    pricePerUnit: z.coerce
      .number()
      .min(0, { message: "Price must be non-negative if provided." })
      .optional(),
  })
  .refine(
    (data) =>
      !data.isCalculable ||
      (data.planUnits && data.unitDivider && data.pricePerUnit !== undefined),
    {
      message:
        "Calculable options require Plan Units, Unit Divider, and Price Per Unit.",
      path: ["isCalculable"],
    },
  );

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface EditOptionFormProps {
  etapId: string;
  option: EtapOption; // The option to edit
  currency: string;
  onOptionUpdated: (updatedOption: EtapOption) => void; // Callback to notify parent
  onCancel: () => void; // Callback to cancel/hide the form
}

export default function EditOptionForm({
  etapId,
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
      isCalculable: option.isCalculable || false,
      includedInPrice:
        option.includedInPrice === undefined ? true : option.includedInPrice, // Default to true if undefined
      planUnits: option.planUnits,
      unitDivider: option.unitDivider,
      pricePerUnit: option.pricePerUnit,
    },
    mode: "onChange",
  });

  // Reset form if the option prop changes
  useEffect(() => {
    form.reset({
      name: option.name || "",
      description: option.description || "",
      isCalculable: option.isCalculable || false,
      includedInPrice:
        option.includedInPrice === undefined ? true : option.includedInPrice,
      planUnits: option.planUnits,
      unitDivider: option.unitDivider,
      pricePerUnit: option.pricePerUnit,
    });
  }, [option, form]);

  const isCalculable = form.watch("isCalculable");

  const onSubmit = (data: OptionFormValues) => {
    console.log("Attempting to update option with data:", data);

    let calculatedPlanPrice: number | undefined = undefined;
    if (
      data.isCalculable &&
      data.planUnits &&
      data.unitDivider &&
      data.pricePerUnit !== undefined
    ) {
      calculatedPlanPrice = parseFloat(
        ((data.planUnits / data.unitDivider) * data.pricePerUnit).toFixed(2),
      );
    }

    const updatedOption: EtapOption = {
      ...option, // Spread existing properties like id, etapId, createdAt
      name: data.name,
      description: data.description || "",
      isCalculable: data.isCalculable,
      includedInPrice: data.includedInPrice,
      planUnits: data.isCalculable ? data.planUnits : undefined,
      unitDivider: data.isCalculable ? data.unitDivider : undefined,
      pricePerUnit: data.isCalculable ? data.pricePerUnit : undefined,
      calculatedPlanPrice: calculatedPlanPrice,
      updatedAt: new Date(),
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

        <div className="flex items-center space-x-2" data-oid="bzbsfx:">
          <FormField
            control={form.control}
            name="isCalculable"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                data-oid="6tpbda2"
              >
                <FormControl data-oid="b4y38pt">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked); // Ensure boolean
                      field.onChange(isChecked);
                      if (!isChecked) {
                        form.reset({
                          ...form.getValues(),
                          planUnits: undefined,
                          unitDivider: undefined,
                          pricePerUnit: undefined,
                        });
                      }
                    }}
                    data-oid="wsvu4gz"
                  />
                </FormControl>
                <div className="space-y-1 leading-none" data-oid="wy1jb-r">
                  <FormLabel data-oid="24i_.fs">Calculable Option</FormLabel>
                  <FormDescription data-oid="qxsvlf1">
                    Does this option affect the price calculation?
                  </FormDescription>
                  <FormMessage data-oid="b1zx:we" />
                </div>
              </FormItem>
            )}
            data-oid="al.i91q"
          />
        </div>

        {isCalculable && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md"
            data-oid="vmo9hrk"
          >
            <FormField
              control={form.control}
              name="planUnits"
              render={({ field }) => (
                <FormItem data-oid="ktji4o4">
                  <FormLabel data-oid="87o3mqo">Plan Units</FormLabel>
                  <FormControl data-oid="uhptouj">
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
              name="unitDivider"
              render={({ field }) => (
                <FormItem data-oid="wxx:gwj">
                  <FormLabel data-oid=":1chket">Unit Divider</FormLabel>
                  <FormControl data-oid="eqbdi86">
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
                      data-oid="t:fi0s2"
                    />
                  </FormControl>
                  <FormMessage data-oid="nykmna:" />
                </FormItem>
              )}
              data-oid="eia4e76"
            />

            <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem data-oid="ug7qp16">
                  <FormLabel data-oid="mn8m_ay">
                    Price / Unit ({currency})
                  </FormLabel>
                  <FormControl data-oid="qtek-44">
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
                      data-oid="h4::l0j"
                    />
                  </FormControl>
                  <FormMessage data-oid="wbpi4-4" />
                </FormItem>
              )}
              data-oid="e1916gl"
            />
          </div>
        )}

        <div className="flex items-center space-x-2" data-oid="duhp7kp">
          <FormField
            control={form.control}
            name="includedInPrice"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-center space-x-2"
                data-oid="rcpyz.l"
              >
                <FormControl data-oid="3efyye2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isCalculable}
                    data-oid="1r1rpi0"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal" data-oid="pwab3ax">
                  Included in Estimated Price
                  {isCalculable && (
                    <span
                      className="text-xs text-muted-foreground"
                      data-oid="ak28eb6"
                    >
                      {" "}
                      (Calculable options always included)
                    </span>
                  )}
                </FormLabel>
                <FormMessage data-oid="k4vtey4" />
              </FormItem>
            )}
            data-oid="ox2ncby"
          />
        </div>

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
