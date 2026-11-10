import { memo } from "react";
import { cn } from "@/shared/utils/utils";

const pulse = "animate-pulse bg-slate-200/80";

export const Skeleton = memo(function Skeleton({ className }) {
  return <div className={cn(pulse, "rounded-md", className)} aria-hidden="true" />;
});

export const SkeletonLine = memo(function SkeletonLine({ className }) {
  return <Skeleton className={cn("h-3", className)} />;
});

export const SkeletonCircle = memo(function SkeletonCircle({ className }) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
});

export function SkeletonProductCard() {
  return (
    <div className="flex flex-col gap-[5px] rounded-[10px] border border-slate-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export const SkeletonProductGrid = memo(function SkeletonProductGrid({ count = 8, columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" }) {
  return (
    <div className={`grid gap-3 ${columns}`} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
});

export const SkeletonTable = memo(function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-slate-100" aria-busy="true">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-3 border-b border-slate-50 px-4 py-3.5">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
});

export const SkeletonStatCard = memo(function SkeletonStatCard() {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-slate-100 bg-white p-4">
      <Skeleton className="h-11 w-11 rounded-[10px]" />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonLine className="w-1/2" />
        <SkeletonLine className="w-3/4" />
      </div>
    </div>
  );
});

export const SkeletonStatGrid = memo(function SkeletonStatGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
});

export { pulse };
