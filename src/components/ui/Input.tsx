import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import * as React from "react";

// Define Input Variants
const inputVariants = cva(
  "w-full appearance-none bg-transparent text-base md:text-sm focus:outline-none",
  {
    variants: {
      variant: {
        default: "p-2 rounded-md border border-input shadow-sm transition-colors",
        title: "border-0 border-b-4 border-blue-300 animate-pulse focus:animate-none pb-2 !placeholder:text-4xl !text-4xl",
        transparent: "border-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Define Input Props
interface InputProps extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  startIcon?: LucideIcon;  // Optional Start Icon
  endIcon?: LucideIcon;    // Optional End Icon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, startIcon: StartIcon, endIcon: EndIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center w-full p-0",
          variant === "default" && "border border-input rounded-md shadow-sm",
          className
        )}
      >
        {/* Start Icon */}
        {StartIcon && (
          <div className="absolute left-3 text-muted-foreground">
            <StartIcon size={20} />
          </div>
        )}

        {/* Input Element */}
        <input
          type={type}
          className={cn(
            inputVariants({ variant }),
            "w-full",
            StartIcon && "pl-10",  // Add left padding if StartIcon exists
            EndIcon && "pr-10",    // Add right padding if EndIcon exists
            className
          )}
          ref={ref}
          {...props}
        />

        {/* End Icon */}
        {EndIcon && (
          <div className="absolute right-3 text-muted-foreground">
            <EndIcon size={20} />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };

