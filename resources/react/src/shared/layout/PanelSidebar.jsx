import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { usePanelTabs } from "@/shared/layout/tabs";

const GROUP_ICONS = {
  Persediaan: "inventory_2",
  Penjualan: "point_of_sale",
  Finance: "account_balance_wallet",
  Toko: "store",
  Operasional: "event_note",
  "Master Data": "database",
  Bantuan: "support_agent",
  Manajemen: "admin_panel_settings",
};

const GROUP_THEMES = {
  Persediaan: { color: "#f43f5e" },
  Penjualan: { color: "#f97316" },
  Finance: { color: "#eab308" },
  Toko: { color: "#10b981" },
  Operasional: { color: "#06b6d4" },
  "Master Data": { color: "#3b82f6" },
  Manajemen: { color: "#8b5cf6" },
  Bantuan: { color: "#ec4899" },
};

const DEFAULT_THEME = { color: "#94a3b8" };

function rgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function themeFor(name) {
  return GROUP_THEMES[name] || DEFAULT_THEME;
}

export const PanelSidebar = memo(function PanelSidebar({
  items,
  homeHref,
  title,
  sidebarClassName,
  showHomeLink = true,
  showMarketplaceLink = true,
  badges = {},
  activeClassName = "bg-slate-500 text-white",
}) {
  const tabs = usePanelTabs();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [hoveredHref, setHoveredHref] = useState(null);
  const railRef = useRef(null);
  const panelRef = useRef(null);
  const groupButtonRefs = useRef(new Map());
  const tooltipAnchorRef = useRef(null);

  const dashboard = items.find((item) => item.href === homeHref);
  const groups = useMemo(() => {
    const grouped = new Map();

    items
      .filter((item) => !item.hiddenInSidebar && !item.bottom)
      .forEach((item) => {
        const groupName = item.group || "Menu";
        if (!grouped.has(groupName)) grouped.set(groupName, []);
        grouped.get(groupName).push(item);
      });

    return Array.from(grouped, ([name, groupItems]) => ({ name, items: groupItems }));
  }, [items]);

  const pinnedItems = useMemo(() => items.filter((item) => !item.hiddenInSidebar && item.bottom), [items]);
  const topItems = useMemo(() => items.filter((item) => item.pinTop), [items]);

  useEffect(() => {
    setOpenGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!openGroup) return;
    const handler = (event) => {
      if (event.key === "Escape") {
        setOpenGroup(null);
        return;
      }
    };
    const pointer = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      if (railRef.current?.contains(event.target)) return;
      setOpenGroup(null);
    };
    window.addEventListener("keydown", handler);
    document.addEventListener("pointerdown", pointer);
    return () => {
      window.removeEventListener("keydown", handler);
      document.removeEventListener("pointerdown", pointer);
    };
  }, [openGroup]);

  const openMenu = (event, item) => {
    if (event) event.preventDefault();
    if (!tabs) return;
    tabs.openParent(item, { openCreate: false });
    setOpenGroup(null);
  };

  const tooltipFromAnchor = useCallback((anchor, label, color) => {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setTooltip({ label, color, left: rect.right + 10, top: Math.max(16, Math.min(window.innerHeight - 24, rect.top + rect.height / 2)) });
  }, []);

  const showTip = (event, label, color) => {
    tooltipAnchorRef.current = event.currentTarget;
    tooltipFromAnchor(event.currentTarget, label, color);
  };

  const showGroupTip = (event, group) => {
    const color = themeFor(group.name).color;
    tooltipAnchorRef.current = event.currentTarget;
    tooltipFromAnchor(event.currentTarget, group.name, color);
  };

  const clearTip = () => {
    tooltipAnchorRef.current = null;
    setTooltip(null);
  };

  useEffect(() => {
    if (!tooltip) return undefined;
    const reposition = () => {
      const anchor = tooltipAnchorRef.current;
      if (anchor) tooltipFromAnchor(anchor, tooltip.label, tooltip.color);
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [tooltip, tooltipFromAnchor]);

  const railButtonClassName = (active) => cn(
    "relative flex h-11 w-11 items-center justify-center rounded-[10px] transition-all",
    active ? "text-white" : "text-slate-400 hover:bg-white/10 hover:text-white",
  );

  const activeParentId = tabs?.activeParentId || "";
  const groupActive = (item) => activeParentId === item.href;
  const groupBadge = (groupItems) => groupItems.reduce((sum, item) => sum + Math.max(0, Number(badges[item.href] || 0)), 0);

  const openGroupEntry = openGroup ? groups.find((entry) => entry.name === openGroup) : null;
  const panelTop = (() => {
    if (!openGroup || !railRef.current) return 0;
    const button = groupButtonRefs.current.get(openGroup);
    if (!button) return 0;
    const relativeTop = button.getBoundingClientRect().top - railRef.current.getBoundingClientRect().top;
    return Math.max(0, Math.min(relativeTop, window.innerHeight - 460));
  })();

  return (
    <aside ref={railRef} className={cn("relative hidden text-white lg:block", sidebarClassName)} aria-label={title}>
      <div className="sticky top-0 relative flex h-screen w-[76px] flex-col overflow-hidden border-r border-white/10">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(70% 28% at 50% 0%, rgba(255,255,255,0.16), transparent 72%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent 28%)",
          }}
        />

        {topItems.length ? (
          <div className="relative flex h-[77px] shrink-0 items-center justify-center border-b border-white/10">
            {topItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onMouseEnter={(event) => showTip(event, item.label, item.iconColor)}
                onMouseLeave={clearTip}
                onClick={(event) => openMenu(event, item)}
                className={cn(railButtonClassName(activeParentId === item.href), "text-base")}
                style={activeParentId === item.href ? { backgroundColor: "rgba(255,255,255,0.14)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)" } : undefined}
                aria-label={item.label}
                aria-current={activeParentId === item.href ? "page" : undefined}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon || "settings"}</span>
              </button>
            ))}
          </div>
        ) : (
          <div aria-hidden className="h-[77px] shrink-0 border-b border-white/10" />
        )}

        <nav className="relative flex-1 space-y-1.5 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
          {showHomeLink && dashboard ? (
            <button
              type="button"
              onMouseEnter={(event) => showTip(event, "Dashboard")}
              onMouseLeave={clearTip}
              onClick={(event) => openMenu(event, dashboard)}
              className={railButtonClassName(activeParentId === homeHref)}
              aria-current={activeParentId === homeHref ? "page" : undefined}
            >
              <span className="material-symbols-outlined text-[22px]">dashboard</span>
              {groupBadge([dashboard]) > 0 ? <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{Math.min(99, groupBadge([dashboard]))}</span> : null}
            </button>
          ) : null}

          {groups.map((group) => {
            const icon = GROUP_ICONS[group.name] || group.items[0]?.icon || "menu";
            const theme = themeFor(group.name);
            const active = group.items.some(groupActive);
            const badge = groupBadge(group.items);

            return (
              <button
                key={group.name}
                type="button"
                ref={(element) => {
                  if (element) groupButtonRefs.current.set(group.name, element);
                  else groupButtonRefs.current.delete(group.name);
                }}
                onMouseEnter={(event) => showGroupTip(event, group)}
                onMouseLeave={clearTip}
                onClick={() => setOpenGroup((current) => (current === group.name ? null : group.name))}
                className={railButtonClassName(active)}
                style={active ? { backgroundColor: theme.color, boxShadow: `0 8px 20px -4px ${rgba(theme.color, 0.6)}, inset 0 1px 0 rgba(255,255,255,0.3)` } : undefined}
                aria-label={group.name}
                aria-expanded={openGroup === group.name}
              >
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
                {badge > 0 ? <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{Math.min(99, badge)}</span> : null}
              </button>
            );
          })}
        </nav>

        {pinnedItems.length ? (
          <div className="relative border-t border-white/10 px-3 py-3">
            <div className="space-y-1.5">
              {pinnedItems.map((item) => (
                <Fragment key={item.href}>
                  {item.dividerBefore ? <div className="mx-2 my-2 h-px bg-white/10" /> : null}
                  <button
                    type="button"
                    onMouseEnter={(event) => showTip(event, item.label, item.iconColor)}
                    onMouseLeave={clearTip}
                    onClick={(event) => openMenu(event, item)}
                    className={cn(
                      "relative flex h-11 w-11 items-center justify-center rounded-[10px] transition-all",
                      activeParentId === item.href
                        ? item.iconColor
                          ? "text-white"
                          : activeClassName
                        : "text-slate-400 hover:bg-white/10 hover:text-white",
                    )}
                    style={
                      activeParentId === item.href && item.iconColor
                        ? { backgroundColor: item.iconColor, boxShadow: `0 8px 20px -4px ${rgba(item.iconColor, 0.6)}, inset 0 1px 0 rgba(255,255,255,0.3)` }
                        : undefined
                    }
                    aria-label={item.label}
                    aria-current={activeParentId === item.href ? "page" : undefined}
                  >
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    {groupBadge([item]) > 0 ? <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{Math.min(99, groupBadge([item]))}</span> : null}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        ) : null}

        {showMarketplaceLink ? (
          <div className="relative border-t border-white/10 p-2">
            <Link
              to="/"
              onMouseEnter={(event) => showTip(event, "Kembali ke Marketplace")}
              onMouseLeave={clearTip}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </Link>
          </div>
        ) : null}
      </div>

      {openGroupEntry ? (
        <div
          ref={panelRef}
          onMouseLeave={clearTip}
          className="absolute left-full ml-2 z-[70]"
          style={{ top: panelTop }}
        >
          {(() => {
            const group = openGroupEntry;
            const icon = GROUP_ICONS[group.name] || group.items[0]?.icon || "menu";
            const theme = themeFor(group.name);
            const softBackground = rgba(theme.color, 0.13);

            return (
              <div
                className="w-[340px] max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[10px] border bg-white p-2 shadow-2xl ring-1 ring-slate-900/5"
                style={{
                  borderColor: rgba(theme.color, 0.3),
                  boxShadow: `0 24px 56px -12px ${rgba(theme.color, 0.28)}, 0 8px 24px -12px rgba(15, 23, 42, 0.45)`,
                }}
              >
                <div className="flex items-center gap-[5px] px-2 pb-2 pt-1.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: softBackground }}>
                    <span className="material-symbols-outlined text-[15px]" style={{ color: theme.color }}>{icon}</span>
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: theme.color }}>{group.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {group.items.map((item) => {
                    const active = activeParentId === item.href;
                    const itemBadge = Math.max(0, Number(badges[item.href] || 0));
                    const hovered = hoveredHref === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={(event) => openMenu(event, item)}
                        onMouseEnter={() => setHoveredHref(item.href)}
                        onMouseLeave={() => setHoveredHref(null)}
                        className={cn(
                          "relative flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-[10px] px-1.5 py-3 text-center transition-shadow",
                          active ? "text-white" : "text-slate-600",
                        )}
                        style={
                          active
                            ? { backgroundColor: theme.color, boxShadow: `0 10px 26px -8px ${rgba(theme.color, 0.55)}` }
                            : hovered
                              ? { backgroundColor: rgba(theme.color, 0.09) }
                              : undefined
                        }
                        aria-current={active ? "page" : undefined}
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                          style={active ? { backgroundColor: "rgba(255,255,255,0.22)" } : { backgroundColor: softBackground }}
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ color: active ? "#ffffff" : theme.color }}
                          >
                            {item.icon}
                          </span>
                        </span>
                        <span className="w-full min-w-0 truncate text-[11px] font-bold leading-tight">{item.label}</span>
                        {itemBadge > 0 ? <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{Math.min(99, itemBadge)}</span> : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      ) : null}

      {tooltip
        ? createPortal(
            <span
              role="tooltip"
              style={{ left: tooltip.left, top: tooltip.top, backgroundColor: tooltip.color || "#0f172a" }}
              className={cn(
                "pointer-events-none fixed z-[80] rounded-md px-2.5 py-1 text-xs font-bold text-white shadow-lg ring-1 ring-white/10",
                tooltip.above ? "-translate-x-1/2 -translate-y-full" : "-translate-y-1/2",
              )}
            >
              {tooltip.above ? (
                <span
                  className="absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
                  style={{ backgroundColor: tooltip.color || "#0f172a" }}
                />
              ) : (
                <span
                  className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45"
                  style={{ backgroundColor: tooltip.color || "#0f172a" }}
                />
              )}
              {tooltip.label}
            </span>,
            document.body,
          )
        : null}
    </aside>
  );
});