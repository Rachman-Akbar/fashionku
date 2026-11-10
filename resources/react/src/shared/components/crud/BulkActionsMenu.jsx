import { memo, useEffect, useRef, useState } from "react";
import { ActionIconButton } from "@/shared/components/crud/ActionIconButton";

export const BulkActionsMenu = memo(function BulkActionsMenu({ selectedCount = 0, actions = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const availableActions = actions.filter((action) => !action.hidden);
  const canOpenWithoutSelection = availableActions.some((action) => action.requiresSelection === false);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!availableActions.length) return null;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <ActionIconButton
        icon="checklist"
        title="Bulk Action"
        tooltip={false}
        badge={selectedCount > 0 ? selectedCount : undefined}
        active={open}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled || (!selectedCount && !canOpenWithoutSelection)}
      />
      {open ? (
        <div className="absolute right-0 top-full z-[110] mt-1 min-w-60 overflow-hidden rounded-[10px] bg-white py-1 shadow-xl ring-1 ring-slate-200">
          {availableActions.map((action) => {
            const actionDisabled = action.disabled || (action.requiresSelection !== false && selectedCount === 0);
            return (
              <button
                key={action.key}
                type="button"
                disabled={actionDisabled}
                onClick={() => {
                  if (actionDisabled) return;
                  setOpen(false);
                  action.onClick?.();
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40 ${action.danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <span className="material-symbols-outlined text-[18px]">{action.icon || "bolt"}</span>
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
});
