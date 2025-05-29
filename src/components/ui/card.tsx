import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl bg-card text-card-foreground border-0 shadow-none",
      className,
    )}
    {...props}
    data-oid="..t61r."
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
    data-oid="a22dp4e"
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement, // Changed from HTMLParagraphElement to HTMLDivElement for semantic correctness
  React.HTMLAttributes<HTMLHeadingElement> // Changed from HTMLHeadingElement to match typical usage
>(({ className, children, ...props }, ref) => (
  // Use h3 for better semantics, but keep div wrapper for flexibility if needed
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight", // Adjusted size to lg from 2xl
      className,
    )}
    {...props}
    data-oid="nfmit-t"
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Changed from HTMLDivElement
  React.HTMLAttributes<HTMLParagraphElement> // Use HTMLParagraphElement attributes
>(({ className, ...props }, ref) => (
  <p // Use p tag for description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
    data-oid="qhd6rmg"
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
    data-oid="mey3b3m"
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
    data-oid="iv1dob8"
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
