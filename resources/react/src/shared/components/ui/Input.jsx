import * as React from "react";
import { memo } from "react";
import { inputClassName } from "@/shared/components/form/FormField";
import { cn } from "@/shared/utils/utils";

const Input = memo(
  React.forwardRef(({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputClassName, "placeholder:text-slate-400 disabled:cursor-not-allowed", className)}
      ref={ref}
      {...props}
    />
  ))
);

Input.displayName = "Input";

export { Input };
