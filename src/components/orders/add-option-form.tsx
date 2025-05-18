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
    <Form {...form} data-oid=":lxxxdk">
      <form
        id={`add-option-form-${etapId}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="46h-c0a"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="lp04dy8">
              <FormLabel data-oid="2n1bsr5">Option Name</FormLabel>
              <FormControl data-oid="-d4qr.y">
                <Input
                  placeholder="Enter option name"
                  {...field}
                  data-oid=":oy119j"
                />
              </FormControl>
              <FormMessage data-oid="qcjofs0" />
            </FormItem>
          )}
          data-oid="jm5krnp"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="3kjw9m:">
              <FormLabel data-oid="g9lug1w">Description (Optional)</FormLabel>
              <FormControl data-oid="is140dy">
                <Textarea
                  placeholder="Describe the option..."
                  className="min-h-[60px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="7-fa2tq"
                />
              </FormControl>
              <FormMessage data-oid="o3xn:oi" />
            </FormItem>
          )}
          data-oid="u_9iv.r"
        />

        <div className="flex items-center space-x-2" data-oid="y_kxuae">
          <FormField
            control={form.control}
            name="isCalculable"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                data-oid="ie4vua3"
              >
                <FormControl data-oid="z7u-9n0">
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
                    data-oid="vfkory3"
                  />
                </FormControl>
                <div className="space-y-1 leading-none" data-oid="5f2tv4.">
                  <FormLabel data-oid="syb0kan">Calculable Option</FormLabel>
                  <FormDescription data-oid="8uw9n4q">
                    Does this option affect the price calculation?
                  </FormDescription>
                  <FormMessage data-oid=".b2nlax" />
                </div>
              </FormItem>
            )}
            data-oid="ckpgvr4"
          />
        </div>

        {/* Conditionally render calculable fields */}
        {isCalculable && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md"
            data-oid="w5.h3:r"
          >
            <FormField
              control={form.control}
              name="planUnits"
              render={({ field }) => (
                <FormItem data-oid="dbx3o-j">
                  <FormLabel data-oid="gfv2sp8">Plan Units</FormLabel>
                  <FormControl data-oid="ey:bms3">
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
                      data-oid="7yqu10s"
                    />
                  </FormControl>
                  <FormMessage data-oid="nyb-v66" />
                </FormItem>
              )}
              data-oid="r224j6x"
            />

            <FormField
              control={form.control}
              name="unitDivider"
              render={({ field }) => (
                <FormItem data-oid="ks5zgmz">
                  <FormLabel data-oid="ujpyr22">Unit Divider</FormLabel>
                  <FormControl data-oid="u.ok_v3">
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
                      data-oid="t7z4jm2"
                    />
                  </FormControl>
                  <FormMessage data-oid="n_:r488" />
                </FormItem>
              )}
              data-oid="0x65kxf"
            />

            <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem data-oid="d2t-pu5">
                  <FormLabel data-oid="dzk1c9_">
                    Price / Unit ({currency})
                  </FormLabel>
                  <FormControl data-oid="7px51hg">
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
                      data-oid="mjl.wlg"
                    />
                  </FormControl>
                  <FormMessage data-oid="xkl_1ug" />
                </FormItem>
              )}
              data-oid="owp3h6q"
            />
          </div>
        )}

        {/* Included in Price Checkbox - Always show, but its meaning differs */}
        <div className="flex items-center space-x-2" data-oid="rb68u-c">
          <FormField
            control={form.control}
            name="includedInPrice"
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-center space-x-2"
                data-oid="v10_y0:"
              >
                <FormControl data-oid="lwugz2f">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    // Calculable options are typically included by default
                    // Allow unchecking only if NOT calculable
                    disabled={isCalculable}
                    data-oid="y6jgwmj"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal" data-oid="9ldpe6w">
                  Included in Estimated Price
                  {isCalculable && (
                    <span
                      className="text-xs text-muted-foreground"
                      data-oid="4xuxnwi"
                    >
                      {" "}
                      (Calculable options always included)
                    </span>
                  )}
                </FormLabel>
                <FormMessage data-oid="7swsv6q" />
              </FormItem>
            )}
            data-oid="jupis:."
          />
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-2 pt-2" data-oid="_ag.8.a">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid="m_pgrmy"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
            data-oid="ujzq.tr"
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Option"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
