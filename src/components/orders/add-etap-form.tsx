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
import type { Etap, EtapWorkType, EtapOption } from "@/lib/types"; // Import EtapOption
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const etapWorkTypes: EtapWorkType[] = ["Параллельный", "Последовательный"];

// Define the form schema using Zod
const etapFormSchema = z.object({
  name: z.string().min(1, { message: "Stage name is required." }),
  description: z.string().optional(),
  workType: z
    .enum(etapWorkTypes, { required_error: "Work type is required." })
    .default("Параллельный"),
  // estimatedPrice: z.coerce.number().min(0, { message: "Estimated price must be non-negative." }).optional(), // Removed direct price input
});

type EtapFormValues = z.infer<typeof etapFormSchema>;

interface AddEtapFormProps {
  orderId: string;
  currency: string;
  onEtapAdded: (
    newEtapData: Omit<Etap, "id" | "createdAt" | "updatedAt" | "options">,
  ) => void; // Pass data up
  onCancel: () => void;
  isSaveDisabled: boolean; // Control save button from parent
}

export default function AddEtapForm({
  orderId,
  currency,
  onEtapAdded,
  onCancel,
  isSaveDisabled,
}: AddEtapFormProps) {
  const { toast } = useToast();

  const form = useForm<EtapFormValues>({
    resolver: zodResolver(etapFormSchema),
    defaultValues: {
      name: "",
      description: "",
      workType: "Параллельный",
    },
    mode: "onChange",
  });

  const onSubmit = (data: EtapFormValues) => {
    console.log("Attempting to add new stage with data:", data);

    // Validation is now handled by the parent via isSaveDisabled prop

    // Pass the form data up, parent will create the full Etap object
    onEtapAdded({
      orderId: orderId, // Parent already knows this, but can be redundant
      name: data.name,
      description: data.description || "",
      workType: data.workType,
      estimatedPrice: 0, // Initial price is 0, calculated from options later
      sequence: 0, // Parent will determine sequence
    });

    // Reset and closing logic is handled in the parent's `handleEtapAdded`
    form.reset(); // Reset form after passing data up
  };

  return (
    <Form {...form} data-oid="s_:t71g">
      <form
        id="add-etap-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="rwghdbw"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-oid="3t-:k30">
              <FormLabel data-oid=":1tx:jl">Stage Name</FormLabel>
              <FormControl data-oid="uy7hhr-">
                <Input
                  placeholder="Enter stage name"
                  {...field}
                  data-oid="7dc0jf4"
                />
              </FormControl>
              <FormMessage data-oid="vpndhnb" />
            </FormItem>
          )}
          data-oid="cqobb39"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem data-oid="1nglqsw">
              <FormLabel data-oid="_rm9eit">Description (Optional)</FormLabel>
              <FormControl data-oid="4:3s-yf">
                <Textarea
                  placeholder="Describe the stage..."
                  className="min-h-[80px]"
                  {...field}
                  value={field.value ?? ""}
                  data-oid="_kphrvl"
                />
              </FormControl>
              <FormMessage data-oid="nmu51jh" />
            </FormItem>
          )}
          data-oid="i3vp:iu"
        />

        <div data-oid="35_g7_k">
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem data-oid="-uerovq">
                <FormLabel data-oid="d907h52">Work Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  data-oid="mt0vtb1"
                >
                  <FormControl data-oid="p:gslky">
                    <SelectTrigger data-oid="sni18uv">
                      <SelectValue
                        placeholder="Select work type"
                        data-oid="9f1d2pd"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent data-oid="qbq3vh3">
                    {etapWorkTypes.map((type) => (
                      <SelectItem key={type} value={type} data-oid="sb1nkm_">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage data-oid="oh2:702" />
              </FormItem>
            )}
            data-oid="lq7col7"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4" data-oid="ysfsx3q">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive" // Added destructive hover
            data-oid="siammhs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isSaveDisabled}
            data-oid="wui8j-n"
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Stage"}
          </Button>
        </div>
        <p
          className="text-xs text-muted-foreground pt-2 text-right"
          data-oid="d8gpqxz"
        >
          Note: Add options in the right panel. Save is enabled once options are
          added.
        </p>
      </form>
    </Form>
  );
}
