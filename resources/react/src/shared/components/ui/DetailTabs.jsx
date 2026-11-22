import { memo, useState } from "react";
import { cn } from "@/shared/utils/utils";

export const DetailTabs = memo(function DetailTabs({ tabs, defaultTab, className }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-1 border-b border-slate-200" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            {tab.icon && <span className="material-symbols-outlined text-[16px] mr-1.5">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tabs.map((tab) =>
          activeTab === tab.id ? (
            <div key={tab.id}>{tab.content}</div>
          ) : null
        )}
      </div>
    </div>
  );
});

export const TabPanel = memo(function TabPanel({ label, icon, children, id, active, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] transition-colors border-b-2 -mb-px",
        active
          ? "border-emerald-600 text-emerald-700"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
      )}
    >
      {icon && <span className="material-symbols-outlined text-[16px] mr-1.5">{icon}</span>}
      {label}
    </button>
  );
});