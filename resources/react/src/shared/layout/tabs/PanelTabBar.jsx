import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/utils";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";

function TabDropdown({ tabs, activeId, onActivate, onClose, onCloseAll, closeAllLabel = "Tutup Semua", label, accent = "slate", dirtyTabIds }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-9 min-w-12 items-center justify-center gap-0.5 px-2 text-slate-600 transition-colors",
          accent === "parent" ? "bg-slate-300 hover:bg-slate-400/70" : "bg-slate-200 hover:bg-slate-300",
        )}
        aria-label={label}
      >
        <span className="text-[11px] font-extrabold tabular-nums">{tabs.length}</span>
        <span className="material-symbols-outlined text-[19px]">keyboard_arrow_down</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 overflow-hidden bg-white py-1 ring-1 ring-slate-200">
          <div className="max-h-80 overflow-y-auto">
            {tabs.map((tab) => {
              const list = tab.type === "list";
              const dirty = !list && Boolean(dirtyTabIds?.[tab.id]);
              return (
                <div key={tab.id} className={cn("flex items-center gap-1 px-2 py-1", activeId === tab.id ? "bg-emerald-50" : "hover:bg-slate-50")}>
                  <button
                    type="button"
                    onClick={() => {
                      onActivate(tab.id);
                      setOpen(false);
                    }}
                    className={cn("flex min-w-0 flex-1 items-center gap-[5px] px-2 py-2 text-left text-sm", activeId === tab.id ? "font-extrabold text-emerald-800" : "text-slate-700")}
                    title={tab.label}
                  >
                    {dirty ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> : null}
                    <span className="min-w-0 truncate">{tab.label}</span>
                  </button>
                  {tab.closable ? (
                    <button type="button" onClick={() => onClose(tab.id)} className="flex h-7 w-7 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Tutup ${tab.label}`}>
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
          {onCloseAll && tabs.some((tab) => tab.closable) ? (
            <div className="border-t border-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => {
                  onCloseAll();
                  setOpen(false);
                }}
                className="flex h-9 w-full items-center justify-center gap-[5px] bg-slate-800 px-3 text-xs font-extrabold text-white transition-colors hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">close_fullscreen</span>
                {closeAllLabel}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ScrollableTabs({ tabs, activeId, onActivate, onClose, variant, dirtyTabIds }) {
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [activeId]);

  return (
    <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-full flex-nowrap items-end gap-1 whitespace-nowrap">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          const parent = variant === "parent";
          const list = !parent && tab.type === "list";
          const dirty = !parent && !list && Boolean(dirtyTabIds?.[tab.id]);
          return (
            <button
              key={tab.id}
              ref={active ? activeRef : null}
              type="button"
              onClick={() => onActivate(tab.id)}
              className={cn(
                "group flex h-9 max-w-[220px] items-center gap-[5px] overflow-hidden px-3 text-xs font-extrabold transition-colors",
                list ? "mb-0.5 min-w-11 flex-none justify-center px-2" : "min-w-[100px] flex-[1_1_160px]",
                parent && "rounded-t-md",
                parent && active && "bg-rose-500 text-white",
                parent && !active && "bg-slate-300 text-slate-700 hover:bg-slate-400/70",
                !parent && "rounded-sm",
                list && active && "bg-emerald-600 text-white",
                list && !active && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
                !parent && !list && active && "bg-slate-700 text-white",
                !parent && !list && !active && "bg-slate-200 text-slate-700 hover:bg-slate-300",
              )}
              title={dirty ? `${tab.label} (perubahan belum disimpan)` : tab.label}
            >
              {parent || list ? <span className="material-symbols-outlined shrink-0 text-[16px]">{parent ? tab.icon : "list_alt"}</span> : null}
              {dirty ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" /> : null}
              {list ? null : <span className="min-w-0 flex-1 truncate text-left">{tab.label}</span>}
              {tab.closable ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose(tab.id);
                  }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center text-current opacity-70 hover:opacity-100"
                  aria-label={`Tutup ${tab.label}`}
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const PanelTabBar = memo(function PanelTabBar() {
  const context = usePanelTabs();
  if (!context) return null;

  return (
    <div className="sticky top-16 z-30 bg-slate-100">
      <div className="flex min-w-0 items-end gap-1 bg-slate-200 px-1 pt-1.5">
        <ScrollableTabs tabs={context.parentTabs} activeId={context.activeParentId} onActivate={context.activateParent} onClose={context.closeParent} variant="parent" dirtyTabIds={context.dirtyTabIds} />
        <TabDropdown tabs={context.parentTabs} activeId={context.activeParentId} onActivate={context.activateParent} onClose={context.closeParent} onCloseAll={context.closeAllParents} dirtyTabIds={context.dirtyTabIds} closeAllLabel="Tutup Semua Menu" label="Semua menu terbuka" accent="parent" />
      </div>
      {context.tabs.length ? (
        <div className="flex min-w-0 items-center gap-1 bg-slate-50 px-1 pt-0.5">
          <ScrollableTabs tabs={context.tabs} activeId={context.activeTabId} onActivate={context.activateTab} onClose={context.closeTab} variant="child" dirtyTabIds={context.dirtyTabIds} />
          <TabDropdown tabs={context.tabs} activeId={context.activeTabId} onActivate={context.activateTab} onClose={context.closeTab} onCloseAll={context.closeAllChildren} dirtyTabIds={context.dirtyTabIds} closeAllLabel="Tutup Semua Halaman" label="Semua halaman data" accent="child" />
        </div>
      ) : null}
    </div>
  );
});
