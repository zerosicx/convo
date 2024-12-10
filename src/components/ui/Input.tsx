import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import * as React from "react";

const inputVariants = cva(
  "flex-1 bg-transparent px-3 py-1 placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-base md:text-sm",
        title: "placeholder:text-4xl text-4xl border-0 border-b-2 border-blue-300 text-blue animate-pulse focus:animate-none",
        smallUnderline: "text-xs border-b-[1px] border-blue-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)


interface InputProps extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  asChild?: boolean;
  startIcon?: LucideIcon;  // Optional start icon
  endIcon?: LucideIcon;    // Optional end icon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, startIcon: StartIcon, endIcon: EndIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex h-9 w-full items-center",
          variant === "default" && "rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
          className
        )}
      >
        {/* Start Icon */}
        {StartIcon && (
          <div className="ml-2 text-muted-foreground">
            <StartIcon size={16} />
          </div>
        )}

        {/* Input Element */}
        <input
          type={type}
          className={cn(
            StartIcon ? "ml-2" : "",
            EndIcon ? "mr-2" : "",
            inputVariants({ variant }),
          )}
          ref={ref}
          {...props}
        />

        {/* End Icon */}
        {EndIcon && (
          <div className="mr-2 text-muted-foreground">
            <EndIcon size={16} />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };

