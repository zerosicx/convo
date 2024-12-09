import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
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
        "flex flex-1 items-center h-fit justify-between py-1 text-md font-medium transition-all hover:bg-zinc-200 text-left [&[data-state=open]>svg]:rotate-180 ring-0 outline-none focus:outline-none focus-visible:outline-none border-0 bg-transparent px-2 [&[data-state=open]]:bg-zinc-300",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
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
    className="overflow-hidden text-md data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("py-2", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
NavGroup.displayName = AccordionPrimitive.Content.displayName

export { NavGroup, NavGroupContent, NavGroupItem, NavGroupTrigger }

