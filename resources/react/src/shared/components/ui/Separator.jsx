import { memo } from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/shared/utils/utils";

const Separator = memo(function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      className={cn(
        "shrink-0 bg-gray-200",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
});

export { Separator };
