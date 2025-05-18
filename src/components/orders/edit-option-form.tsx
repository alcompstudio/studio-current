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
    <Form {...form} data-oid="dz10.e:">
      <form
        id={`edit-option-form-${option.id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="a7kt-y0"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="76_w_dq">
              <FormLabel data-oid="ni-nc7n">Option Name</FormLabel>
              <FormControl data-oid="l_fwhwx">
                <Input
                  placeholder="Enter option name"
                  {...field}
                  data-oid="8.5b1.w"
                />
              </FormControl>
              <FormMessage data-oid="7w40h3y" />
            </FormItem>
          )}
          data-oid="w6-cv-h"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="pwa0t_7">
              <FormLabel data-oid="ezyedk4">Description (Optional)</FormLabel>
              <FormControl data-oid=".2i_1yb">
                <Textarea
                  placeholder="Describe the option..."
                  className="min-h-[60px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="12xh-2y"
                />
              </FormControl>
              <FormMessage data-oid="x1qv_3t" />
            </FormItem>
          )}
          data-oid="516-qcf"
        />

        <div className="flex items-center space-x-2" data-oid="6m-4rcq">
          <FormField
            control={form.control}
            name="isCalculable"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                data-oid="65:kbns"
              >
                <FormControl data-oid="csza4m:">
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
                    data-oid="07u_o0a"
                  />
                </FormControl>
                <div className="space-y-1 leading-none" data-oid="o9roens">
                  <FormLabel data-oid="a.qi9mu">Calculable Option</FormLabel>
                  <FormDescription data-oid="prxrqn2">
                    Does this option affect the price calculation?
                  </FormDescription>
                  <FormMessage data-oid="-:2e-uw" />
                </div>
              </FormItem>
            )}
            data-oid="mjsw98:"
          />
        </div>

        {isCalculable && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md"
            data-oid="e3v-emi"
          >
            <FormField
              control={form.control}
              name="planUnits"
              render={({ field }) => (
                <FormItem data-oid=":.jvjx0">
                  <FormLabel data-oid="l8l0bx0">Plan Units</FormLabel>
                  <FormControl data-oid="hk4yscb">
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
                      data-oid="1:umy:s"
                    />
                  </FormControl>
                  <FormMessage data-oid="-0_cniz" />
                </FormItem>
              )}
              data-oid="9fu3jsf"
            />

            <FormField
              control={form.control}
              name="unitDivider"
              render={({ field }) => (
                <FormItem data-oid="hqcp7ef">
                  <FormLabel data-oid="t1_gvzr">Unit Divider</FormLabel>
                  <FormControl data-oid="74pz06w">
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
                      data-oid="jskw_yd"
                    />
                  </FormControl>
                  <FormMessage data-oid="7_c.koi" />
                </FormItem>
              )}
              data-oid="ci2ba2h"
            />

            <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem data-oid="r3-q9hl">
                  <FormLabel data-oid="9-3yez1">
                    Price / Unit ({currency})
                  </FormLabel>
                  <FormControl data-oid="8qvurf-">
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
                      data-oid="_wa:3bd"
                    />
                  </FormControl>
                  <FormMessage data-oid="oijh.28" />
                </FormItem>
              )}
              data-oid="a2ic4ea"
            />
          </div>
        )}

        <div className="flex items-center space-x-2" data-oid="lqtnf5q">
          <FormField
            control={form.control}
            name="includedInPrice"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-center space-x-2"
                data-oid="q0uhyts"
              >
                <FormControl data-oid="2_iu7ql">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isCalculable}
                    data-oid="cr7xthp"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal" data-oid="9p_9rmk">
                  Included in Estimated Price
                  {isCalculable && (
                    <span
                      className="text-xs text-muted-foreground"
                      data-oid="k-8:0o."
                    >
                      {" "}
                      (Calculable options always included)
                    </span>
                  )}
                </FormLabel>
                <FormMessage data-oid="u0r5tf8" />
              </FormItem>
            )}
            data-oid="i0pxsp3"
          />
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-2 pt-2" data-oid="r8-9j9-">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid="h_08et2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            data-oid="_8p5zyi"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
