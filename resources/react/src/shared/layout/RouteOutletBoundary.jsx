import { memo, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/shared/utils/utils";

export const RouteOutletBoundary = memo(function RouteOutletBoundary({ className }) {
  return <div className={cn("min-w-0 max-w-full", className)}><Suspense fallback={null}><Outlet /></Suspense></div>;
});
