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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Button } from "@/components/ui/button";
import type { EtapOption } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define the form schema using Zod for EtapOption
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
      path: ["isCalculable"], // Attach error to a relevant field or a general path
    },
  );

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface AddOptionFormProps {
  etapId: string; // Can be 'new' for the temporary stage
  currency: string;
  // Update callback to accept partial data, parent will complete it
  onOptionAdded: (
    newOptionData: Omit<
      EtapOption,
      "id" | "etapId" | "createdAt" | "updatedAt" | "calculatedPlanPrice"
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
      isCalculable: false,
      includedInPrice: true,
      planUnits: undefined,
      unitDivider: undefined,
      pricePerUnit: undefined,
    },
    mode: "onChange",
  });

  // Watch the value of isCalculable to conditionally render fields
  const isCalculable = form.watch("isCalculable");

  const onSubmit = (data: OptionFormValues) => {
    console.log("Attempting to add new option with data:", data);

    // Pass partial data up to the parent handler
    onOptionAdded({
      name: data.name,
      description: data.description || "",
      isCalculable: data.isCalculable,
      includedInPrice: data.includedInPrice,
      planUnits: data.isCalculable ? data.planUnits : undefined,
      unitDivider: data.isCalculable ? data.unitDivider : undefined,
      pricePerUnit: data.isCalculable ? data.pricePerUnit : undefined,
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

        <div className="flex items-center space-x-2" data-oid="7w98u6d">
          <FormField
            control={form.control}
            name="isCalculable"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                data-oid="xag1nw3"
              >
                <FormControl data-oid="1a:ta5x">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked); // Ensure boolean type
                      field.onChange(isChecked);
                      // Reset calculable fields if unchecked
                      if (!isChecked) {
                        form.reset({
                          ...form.getValues(), // keep other values
                          planUnits: undefined,
                          unitDivider: undefined,
                          pricePerUnit: undefined,
                        });
                      }
                    }}
                    data-oid="vobs1ts"
                  />
                </FormControl>
                <div className="space-y-1 leading-none" data-oid="duq0y-c">
                  <FormLabel data-oid="x76a5a1">Calculable Option</FormLabel>
                  <FormDescription data-oid="_fgnsfc">
                    Does this option affect the price calculation?
                  </FormDescription>
                  <FormMessage data-oid="kn6y48f" />
                </div>
              </FormItem>
            )}
            data-oid="jdrdvdy"
          />
        </div>

        {/* Conditionally render calculable fields */}
        {isCalculable && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md"
            data-oid="dtylp:z"
          >
            <FormField
              control={form.control}
              name="planUnits"
              render={({ field }) => (
                <FormItem data-oid="6xdid_5">
                  <FormLabel data-oid="19lrda:">Plan Units</FormLabel>
                  <FormControl data-oid=":78vx5p">
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
              name="unitDivider"
              render={({ field }) => (
                <FormItem data-oid="xtlz1lv">
                  <FormLabel data-oid="_moq:7n">Unit Divider</FormLabel>
                  <FormControl data-oid="7.6rycr">
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
                      data-oid="p14en-k"
                    />
                  </FormControl>
                  <FormMessage data-oid="blkj6:." />
                </FormItem>
              )}
              data-oid="p0_mglv"
            />

            <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem data-oid="mncfzci">
                  <FormLabel data-oid="80sfquy">
                    Price / Unit ({currency})
                  </FormLabel>
                  <FormControl data-oid="q660sq0">
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
                      data-oid="8cvvuq4"
                    />
                  </FormControl>
                  <FormMessage data-oid="9vxpq25" />
                </FormItem>
              )}
              data-oid="jzqyk3_"
            />
          </div>
        )}

        {/* Included in Price Checkbox - Always show, but its meaning differs */}
        <div className="flex items-center space-x-2" data-oid="y-mzo80">
          <FormField
            control={form.control}
            name="includedInPrice"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-center space-x-2"
                data-oid="gjuglxl"
              >
                <FormControl data-oid="46ei1j:">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    // Calculable options are typically included by default
                    // Allow unchecking only if NOT calculable
                    disabled={isCalculable}
                    data-oid="1.x0x:p"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal" data-oid="4ao263f">
                  Included in Estimated Price
                  {isCalculable && (
                    <span
                      className="text-xs text-muted-foreground"
                      data-oid=":_c:z8-"
                    >
                      {" "}
                      (Calculable options always included)
                    </span>
                  )}
                </FormLabel>
                <FormMessage data-oid="ojfowlz" />
              </FormItem>
            )}
            data-oid="28y8i67"
          />
        </div>

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
