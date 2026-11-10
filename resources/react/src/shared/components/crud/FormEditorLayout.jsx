import { cn } from "@/shared/utils/utils";

export function FormEditorLayout({ actions, className = "", contentClassName = "", children }) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start", className)}>
      <div className={cn("w-full min-w-0 flex-1", contentClassName)}>{children}</div>
      {actions ? (
        <aside className="hidden w-40 shrink-0 flex-col gap-3 lg:sticky lg:top-4 lg:flex">{actions}</aside>
      ) : null}
    </div>
  );
}
