import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as React from "react";

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: LucideIcon;  // Optional start icon
  endIcon?: LucideIcon;    // Optional end icon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon: StartIcon, endIcon: EndIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
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
            "flex-1 bg-transparent px-3 py-1 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            StartIcon ? "ml-2" : "",
            EndIcon ? "mr-2" : ""
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

export { Input };
