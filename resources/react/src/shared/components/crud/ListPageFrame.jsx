import { cn } from "@/shared/utils/utils";

export function ListPageFrame({ toolbar, children, className = "" }) {
  return (
    <div className={cn("flex h-full min-h-0 w-full min-w-0 flex-col gap-0.5", className)}>
      {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}