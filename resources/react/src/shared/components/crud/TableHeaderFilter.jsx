import { memo, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/utils";

function emptyValue(type) {
  if (type === "range") return { min: "", max: "", status: "" };
  return "";
}

function hasFilterValue(type, value) {
  if (type === "range") return Boolean(value?.min !== "" || value?.max !== "" || value?.status);
  return value !== "" && value !== null && value !== undefined;
}

export const TableHeaderFilter = memo(function TableHeaderFilter({
  label,
  sortKey,
  sortBy,
  sortDirection = "asc",
  onSortChange,
  filterable = true,
  filterType,
  filterValue,
  onFilterChange,
  onResetSort,
  onClearAllFilters,
  extraRangeFilter,
  options = [],
  placeholder = "Cari nilai",
  minPlaceholder = "Minimum",
  maxPlaceholder = "Maksimum",
  className,
  headerProps,
  columnKey,
  columnStyle,
  onResizeStart,
  onResetWidth,
  dragging = false,
  dropTarget = false,
  align = "left",
}) {
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [draft, setDraft] = useState(filterValue ?? emptyValue(filterType));
  const activeSort = Boolean(sortKey && sortBy === sortKey);
  const activeFilter = hasFilterValue(filterType, filterValue);

  useEffect(() => {
    if (open) setDraft(filterValue ?? emptyValue(filterType));
  }, [filterType, filterValue, open]);

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 280;
      const margin = 8;
      const left = Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin));
      const menuHeight = menuRef.current?.getBoundingClientRect().height || 380;
      const below = rect.bottom + 5;
      const above = rect.top - 5 - menuHeight;
      const top = below + menuHeight > window.innerHeight - margin && above > margin ? above : Math.max(margin, below);
      setPosition({ top, left });
    };

    const close = (event) => {
      if (buttonRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    updatePosition();
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const normalizedOptions = useMemo(
    () => options.map((option) => ({
      value: String(option?.value ?? ""),
      label: String(option?.label ?? option?.value ?? ""),
    })),
    [options],
  );

  const applyFilter = () => {
    onFilterChange?.(draft);
    setOpen(false);
  };

  const clearFilter = () => {
    const nextValue = emptyValue(filterType);
    setDraft(nextValue);
    onFilterChange?.(nextValue);
    setOpen(false);
  };

  const clearAllFilters = () => {
    onResetSort?.();
    onClearAllFilters?.();
    setOpen(false);
  };

  const setSort = (direction) => {
    onSortChange?.(sortKey, direction);
    setOpen(false);
  };

  const menu = open ? (
    <div
      ref={menuRef}
      className="fixed z-[300] w-[280px] border border-slate-200 bg-white p-2 text-sm shadow-xl"
      style={{ top: position.top, left: position.left }}
    >
      <div className="border-b border-slate-100 pb-2">
        {onClearAllFilters ? (
          <button
            type="button"
            onClick={clearAllFilters}
            title="Reset semua filter dan urutan"
            className="flex h-8 w-full items-center justify-start gap-[5px] whitespace-nowrap rounded-md px-2 text-left text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
            Reset Filter
          </button>
        ) : null}
      </div>

      {sortKey ? (
        <div className="space-y-1 border-b border-slate-100 pb-2 pt-2">
          <button
            type="button"
            onClick={() => setSort("desc")}
            className={cn(
              "flex h-9 w-full items-center gap-[5px] px-2 text-left font-semibold text-slate-700 hover:bg-slate-50",
              activeSort && sortDirection === "desc" && "bg-emerald-50 text-emerald-800",
            )}
          >
            <span className={cn("material-symbols-outlined text-[18px]", activeSort && sortDirection === "desc" && "font-fill")}>arrow_downward</span>
            Urutkan terbesar
          </button>
          <button
            type="button"
            onClick={() => setSort("asc")}
            className={cn(
              "flex h-9 w-full items-center gap-[5px] px-2 text-left font-semibold text-slate-700 hover:bg-slate-50",
              activeSort && sortDirection === "asc" && "bg-emerald-50 text-emerald-800",
            )}
          >
            <span className={cn("material-symbols-outlined text-[18px]", activeSort && sortDirection === "asc" && "font-fill")}>arrow_upward</span>
            Urutkan terkecil
          </button>
        </div>
      ) : null}

      {filterType ? (
        <div className="pt-2">
          <p className="mb-2 px-1 text-xs font-extrabold uppercase tracking-wide text-slate-500">Filter {label}</p>

          {filterType === "text" ? (
            <input
              value={draft || ""}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyFilter();
              }}
              autoFocus
              placeholder={placeholder}
              className="h-10 w-full border border-slate-200 px-3 outline-none focus:border-emerald-500"
            />
          ) : null}

          {filterType === "select" ? (
            <div className="max-h-56 overflow-y-auto border border-slate-200 py-1">
              <button
                type="button"
                onClick={() => setDraft("")}
                className={cn(
                  "flex w-full items-center gap-[5px] px-3 py-2 text-left text-sm hover:bg-slate-50",
                  draft === "" && "bg-emerald-50 font-bold text-emerald-800",
                )}
              >
                <span className="material-symbols-outlined text-[17px]">select_all</span>
                Semua
              </button>
              {normalizedOptions.map((option) => (
                <button
                  key={`${option.value}:${option.label}`}
                  type="button"
                  onClick={() => setDraft(option.value)}
                  className={cn(
                    "flex w-full items-center gap-[5px] px-3 py-2 text-left text-sm hover:bg-slate-50",
                    String(draft ?? "") === option.value && "bg-emerald-50 font-bold text-emerald-800",
                  )}
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {String(draft ?? "") === option.value ? "check_box" : "check_box_outline_blank"}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {filterType === "range" ? (
            <div className="grid grid-cols-2 gap-[5px]">
              <input
                type="number"
                min="0"
                value={draft?.min ?? ""}
                onChange={(event) => setDraft((current) => ({ ...current, min: event.target.value }))}
                placeholder={minPlaceholder}
                className="h-10 min-w-0 border border-slate-200 px-3 outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                min="0"
                value={draft?.max ?? ""}
                onChange={(event) => setDraft((current) => ({ ...current, max: event.target.value }))}
                placeholder={maxPlaceholder}
                className="h-10 min-w-0 border border-slate-200 px-3 outline-none focus:border-emerald-500"
              />
            </div>
          ) : null}

          {filterType === "range" && extraRangeFilter ? (
            <div className="mt-2 border-t border-slate-100 pt-2">
              <p className="px-1 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">{extraRangeFilter.label}</p>
              <select
                value={String(draft?.status ?? "")}
                onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
                className="h-9 w-full border border-slate-200 bg-white px-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">Semua status</option>
                {extraRangeFilter.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-[5px]">
            <button
              type="button"
              onClick={clearFilter}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-extrabold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100"
              title={`Hapus filter dan reset urutan ${label}`}
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Hapus
            </button>
            <button
              type="button"
              onClick={applyFilter}
              className="h-9 rounded-lg bg-emerald-600 px-4 text-xs font-extrabold text-white hover:bg-emerald-700"
            >
              Terapkan
            </button>
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

  if (!filterable) {
    return (
      <th
        {...headerProps}
        style={columnStyle}
        className={cn("whitespace-nowrap bg-slate-100 px-4 py-3 text-left", align === "right" && "text-right", align === "center" && "text-center", className)}
      >
        <span className="block font-extrabold leading-4">{label}</span>
      </th>
    );
  }

  return (
    <th
      {...headerProps}
      style={columnStyle}
      className={cn("group relative select-none whitespace-nowrap bg-slate-100 px-4 py-3", align === "right" && "text-right", align === "center" && "text-center", dragging && "opacity-45", dropTarget && !dragging && "bg-emerald-50", className)}
      title="Tarik header untuk mengubah urutan kolom. Tarik garis kanan untuk mengubah lebar."
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-1.5 text-left font-extrabold transition-colors hover:text-emerald-700",
          align === "right" && "justify-end",
          align === "center" && "justify-center",
          (activeSort || activeFilter) && "text-emerald-700",
        )}
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {activeSort ? <span className={cn("material-symbols-outlined text-[16px]", sortDirection === "asc" && "rotate-180")}>arrow_drop_down</span> : null}
        {activeFilter && !activeSort ? <span className="material-symbols-outlined font-fill text-[16px]">filter_alt</span> : null}
      </button>
      <button
        type="button"
        aria-label={`Ubah lebar kolom ${label}`}
        onPointerDown={(event) => onResizeStart?.(event, columnKey)}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onResetWidth?.(columnKey);
        }}
        draggable={false}
        className="absolute right-0 top-0 h-full w-2 cursor-col-resize touch-none border-0 bg-transparent p-0 outline-none before:absolute before:right-[3px] before:top-[18%] before:h-[64%] before:w-px before:bg-slate-300 before:opacity-0 before:transition-opacity hover:before:opacity-100 group-hover:before:opacity-100"
      />
      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </th>
  );
});
