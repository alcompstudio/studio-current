

"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"; // Import Slot

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
    asChild?: boolean;
  }
>(({ className, children, asChild = false, ...props }, ref) => {
   const Comp = asChild ? Slot : AccordionPrimitive.Trigger; // Use AccordionPrimitive.Trigger when not asChild
   return (
    <AccordionPrimitive.Header className="flex">
      {/* Use Comp which defaults to AccordionPrimitive.Trigger, but can be Slot if asChild is true */}
      <Comp
        ref={ref}
        // Removed explicit type="button"
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180",
          // Default hover styles (similar to sidebar) and cursor-pointer
           "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline cursor-pointer", // Added cursor-pointer
          className
        )}
        {...props}
      >
        {children}
        {/* Only render the default ChevronDown if not using asChild */}
        {!asChild && <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}
      </Comp>
    </AccordionPrimitive.Header>
   )
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

