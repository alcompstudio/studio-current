"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// Define a type for the onCheckedChange prop based on Radix's type
type CheckedState = CheckboxPrimitive.CheckedState;
type CheckedChangeCallback = (checked: CheckedState) => void;

// Extend the props interface to include the correctly typed onCheckedChange
interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    "onCheckedChange"
  > {
  onCheckedChange?: CheckedChangeCallback;
}

interface ExtendedCheckboxProps extends CheckboxProps {
  variant?: "default" | "m3";
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  ExtendedCheckboxProps
>(({ className, variant = "default", ...props }, ref) => {
  const base =
    "peer h-4 w-4 shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    default:
      "rounded-sm border border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    m3: "rounded-[var(--md-sys-shape-corner-small)] border border-m3-outline bg-m3-surface data-[state=checked]:bg-m3-primary data-[state=checked]:text-m3-on-primary transition-all shadow-sm",
  };
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(base, variants[variant], className)}
      {...props}
      data-oid="v-s:pht"
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
        data-oid="12ck8c5"
      >
        <Check className="h-4 w-4" data-oid="w3-chxi" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
