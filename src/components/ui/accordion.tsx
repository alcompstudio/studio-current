

"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    // Removed border-b from here, apply it on the item itself if needed globally, or individually
    className={cn("", className)} // Keep base class empty or add specific structural classes
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    asChild?: boolean; // Added asChild prop type
  }
>(({ className, children, asChild = false, ...props }, ref) => {
  const Comp = asChild ? AccordionPrimitive.Trigger : "button"; // Use button by default
  return (
    <AccordionPrimitive.Header className="flex">
      {/* Use Comp which defaults to button, but can be AccordionPrimitive.Trigger if asChild is true */}
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"} // Explicitly set type="button" when rendering a button
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props} // Pass all props
      >
        {children}
        {/* Conditionally render the chevron only if it's rendered as a button (not asChild) */}
        {!asChild && <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}
      </Comp>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName


const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* Removed pt-0, use padding in the consuming component if needed */}
    <div className={cn("pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

