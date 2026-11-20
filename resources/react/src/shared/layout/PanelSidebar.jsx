import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { usePanelTabs } from "@/shared/layout/tabs";
import { RailTooltip, useRailTooltip } from "@/shared/layout/RailTooltip";

const GROUP_ICONS = {
  Persediaan: "inventory_2",
  Penjualan: "point_of_sale",
  Finance: "account_balance_wallet",
  Toko: "store",
  Operasional: "event_note",
  Marketing: "campaign",
  "Master Data": "database",
  Bantuan: "support_agent",
  Manajemen: "admin_panel_settings",
  "Manajemen User": "manage_accounts",
  Chat: "chat",
  Jadwal: "calendar_month",
  "Pengaturan Toko": "settings",
};

export const PanelSidebar = memo(function PanelSidebar({
  items,
  homeHref,
  title,
  showHomeLink = true,
  showMarketplaceLink = true,
  badges = {},
}) {
  const tabs = usePanelTabs();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const [hoveredHref, setHoveredHref] = useState(null);
  const { tooltip, showTip, clearTip } = useRailTooltip();
  const railRef = useRef(null);
  const panelRef = useRef(null);
  const groupButtonRefs = useRef(new Map());

  const dashboard = items.find((item) => item.href === homeHref);
  const groups = useMemo(() => {
    const grouped = new Map();

    items
      .filter((item) => !item.hiddenInSidebar && !item.bottom && !item.pinTop)
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

  const railButtonClassName = (active) =>
    cn(
      "relative flex h-11 w-11 items-center justify-center rounded-[10px] transition-all",
      active
        ? "bg-[var(--panel-rail-active)] text-white shadow-[var(--panel-rail-active-shadow)]"
        : "text-[var(--panel-rail-icon)] hover:bg-[var(--panel-rail-hover)] hover:text-white",
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
    <aside ref={railRef} className="relative hidden h-full min-h-0 w-[76px] shrink-0 self-stretch text-white lg:block" aria-label={title}>
      <div className="sticky top-0 flex h-dvh w-[76px] flex-col overflow-hidden bg-[var(--panel-rail-bg)]">
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
            {topItems.map((item) => {
              const active = activeParentId === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  onMouseEnter={(event) => showTip(event, item.label)}
                  onMouseLeave={clearTip}
                  onClick={(event) => openMenu(event, item)}
                  className={cn(railButtonClassName(active), "text-base")}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={cn("material-symbols-outlined text-[22px]", active && "text-white")}>
                    {item.icon || "settings"}
                  </span>
                </button>
              );
            })}
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
                onMouseEnter={(event) => showTip(event, group.name)}
                onMouseLeave={clearTip}
                onClick={() => setOpenGroup((current) => (current === group.name ? null : group.name))}
                className={railButtonClassName(active)}
                aria-label={group.name}
                aria-expanded={openGroup === group.name}
              >
                <span className={cn("material-symbols-outlined text-[22px]", active && "text-white")}>
                  {icon}
                </span>
                {badge > 0 ? <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{Math.min(99, badge)}</span> : null}
              </button>
            );
          })}
        </nav>

        {pinnedItems.length ? (
          <div className="relative border-t border-white/10 px-3 py-3">
            <div className="space-y-1.5">
              {pinnedItems.map((item) => {
                const active = activeParentId === item.href;
                return (
                  <Fragment key={item.href}>
                    {item.dividerBefore ? <div className="mx-2 my-2 h-px bg-white/10" /> : null}
                    <button
                      type="button"
                      onMouseEnter={(event) => showTip(event, item.label)}
                      onMouseLeave={clearTip}
                      onClick={(event) => openMenu(event, item)}
                      className={railButtonClassName(active)}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={cn("material-symbols-outlined text-[22px]", active && "text-white")}>{item.icon}</span>
                      {groupBadge([item]) > 0 ? <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{Math.min(99, groupBadge([item]))}</span> : null}
                    </button>
                  </Fragment>
                );
              })}
            </div>
          </div>
        ) : null}

        {showMarketplaceLink ? (
          <div className="relative border-t border-white/10 p-2">
            <Link
              to="/"
              onMouseEnter={(event) => showTip(event, "Kembali ke Marketplace")}
              onMouseLeave={clearTip}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] text-[var(--panel-rail-icon)] transition-colors hover:bg-[var(--panel-rail-hover)] hover:text-white"
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

            return (
              <div className="w-[340px] max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[10px] border border-[var(--panel-border-tint)] bg-white p-2 shadow-[var(--panel-popover-shadow)]">
                <div className="flex items-center gap-[5px] px-2 pb-2 pt-1.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-soft)]">
                    <span className="material-symbols-outlined text-[15px] text-[var(--color-primary)]">{icon}</span>
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-primary-strong)]">{group.name}</p>
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
                          "relative flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-[10px] px-1.5 py-3 text-center transition-colors",
                          active
                            ? "bg-[var(--color-primary)] text-white shadow-[var(--panel-popover-active-shadow)]"
                            : "text-slate-600 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]",
                          hovered && !active ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]" : null,
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                            active ? "bg-white/20 text-white" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
                          )}
                        >
                          <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
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

      <RailTooltip tooltip={tooltip} />
    </aside>
  );
});
