import { memo } from "react";
import { cn } from "@/shared/utils/utils";
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-orange-100 text-orange-700",
        secondary: "bg-gray-100 text-gray-700",
        destructive: "bg-red-100 text-red-700",
        success: "bg-green-100 text-green-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const Badge = memo(function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
});

export { Badge, badgeVariants };
