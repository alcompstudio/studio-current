import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "m3";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const base =
      "flex h-10 w-full px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
    const variants = {
      default:
        "rounded-md border border-input bg-background",
      m3:
        "rounded-[var(--md-sys-shape-corner-medium)] border border-m3-outline bg-m3-surface text-m3-on-surface placeholder:text-m3-on-surface-variant focus-visible:ring-m3-primary transition-all shadow-sm",
    };
    return (
      <input
        type={type}
        className={cn(base, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input }
