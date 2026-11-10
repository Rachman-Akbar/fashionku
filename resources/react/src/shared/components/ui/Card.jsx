import { memo } from "react";
import { cn } from "@/shared/utils/utils";

const Card = memo(({ className, ...props }) => (
  <div className={cn("rounded-[10px] border border-gray-200 bg-white shadow-sm", className)} {...props} />
));

const CardHeader = memo(({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));

const CardTitle = memo(({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));

const CardContent = memo(({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
));

const CardFooter = memo(({ className, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
));

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
