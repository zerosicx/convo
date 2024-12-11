import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronRight } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const NavGroup = AccordionPrimitive.Root

const NavGroupItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
NavGroupItem.displayName = "AccordionItem"

const NavGroupTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center h-8 gap-2 p-1 text-sm font-medium transition-all hover:bg-neutral-100 text-left [&[data-state=open]>svg]:rotate-90 ring-0 outline-none focus:outline-none focus-visible:outline-none border-0 bg-transparent [&[data-state=open]]:bg-neutral-200 rounded-sm",
        className
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      {children}

    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
NavGroupTrigger.displayName = AccordionPrimitive.Trigger.displayName

const NavGroupContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("py-2", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
NavGroup.displayName = AccordionPrimitive.Content.displayName

export { NavGroup, NavGroupContent, NavGroupItem, NavGroupTrigger }

