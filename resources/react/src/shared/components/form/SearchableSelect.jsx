import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/utils";

function normalizeOption(option) {
  if (typeof option === "string" || typeof option === "number") {
    return { value: String(option), label: String(option), disabled: false, keywords: "" };
  }

  return {
    ...option,
    value: option?.value === null || option?.value === undefined ? "" : String(option.value),
    label: String(option?.label ?? option?.value ?? ""),
    disabled: Boolean(option?.disabled),
    keywords: String(option?.keywords || ""),
  };
}

function measure(node) {
  if (!node) return null;
  const box = node.getBoundingClientRect();
  return { top: box.top, left: box.left, width: box.width, bottom: box.bottom };
}

export const SearchableSelect = memo(function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = "Pilih data",
  searchPlaceholder = "Cari data",
  emptyText = "Data tidak ditemukan",
  disabled = false,
  clearable = true,
  className,
  buttonClassName,
  indicatorClassName,
  name,
  onCreate,
  createLabel,
  creating = false,
  onSearch,
}) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [anchorRect, setAnchorRect] = useState(null);
  const [creatingLocal, setCreatingLocal] = useState(false);
  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options]);
  const selected = normalizedOptions.find((option) => option.value === String(value ?? "")) || null;
  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return normalizedOptions;
    return normalizedOptions.filter((option) => `${option.label} ${option.keywords}`.toLowerCase().includes(keyword));
  }, [normalizedOptions, query]);

  const handleQuery = (next) => {
    setQuery(next);
    onSearch?.(next);
    setActiveIndex(0);
  };

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => setAnchorRect(measure(rootRef.current));

    const close = (event) => {
      if (!rootRef.current?.contains(event.target) && !panelRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    const focusFrame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      cancelAnimationFrame(focusFrame);
    };
  }, [open]);

  const openDropdown = () => {
    if (disabled || open) return;
    const selectedIndex = normalizedOptions.findIndex((option) => option.value === String(value ?? ""));
    const firstEnabledIndex = normalizedOptions.findIndex((option) => !option.disabled);
    setQuery("");
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex);
    setAnchorRect(measure(rootRef.current));
    setOpen(true);
  };

  const selectOption = (option) => {
    if (!option || option.disabled) return;
    onChange?.(option.value, option);
    setQuery("");
    setOpen(false);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const hasExactMatch = normalizedOptions.some((option) => option.label.trim().toLowerCase() === normalizedQuery);
  const canCreate = Boolean(onCreate && query.trim() && !hasExactMatch);

  const createOption = async () => {
    if (!canCreate || creating || creatingLocal) return;
    setCreatingLocal(true);
    try {
      const created = await onCreate(query.trim());
      if (created?.close === true) {
        setQuery("");
        setOpen(false);
        return;
      }
      if (created?.value !== undefined && created?.value !== null) {
        onChange?.(String(created.value), normalizeOption(created));
        setQuery("");
        setOpen(false);
      }
    } finally {
      setCreatingLocal(false);
    }
  };

  const moveActive = (step) => {
    if (!filteredOptions.length) return;
    let index = activeIndex;
    if (index < 0) index = step > 0 ? -1 : 0;
    for (let attempt = 0; attempt < filteredOptions.length; attempt += 1) {
      index = (index + step + filteredOptions.length) % filteredOptions.length;
      if (!filteredOptions[index]?.disabled) {
        setActiveIndex(index);
        return;
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      // Tutup dropdown saja; jangan teruskan ke dialog induk agar form tidak ikut tertutup.
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
      return;
    }
    if (event.key === "Enter") {
      // Jangan biarkan Enter mengirim form saat pengguna sedang mencari.
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option && !option.disabled) {
        selectOption(option);
      } else if (canCreate) {
        createOption();
      }
      return;
    }
    if (event.key === "Tab") setOpen(false);
  };

  const renderPanel = () => {
    if (!open || !anchorRect || typeof document === "undefined") return null;
    const gap = 6;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - anchorRect.bottom - gap;
    const spaceAbove = anchorRect.top - gap;
    const openUp = spaceBelow < 260 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(140, Math.min(320, openUp ? spaceAbove : spaceBelow));
    const width = Math.max(anchorRect.width, 200);
    const left = Math.max(8, Math.min(anchorRect.left, viewportWidth - width - 8));
    const style = {
      position: "fixed",
      left,
      width,
      maxHeight,
      zIndex: 9999,
      ...(openUp ? { bottom: viewportHeight - anchorRect.top + gap } : { top: anchorRect.bottom + gap }),
    };

    return createPortal(
      <div ref={panelRef} style={style} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
        <div className="overflow-y-auto py-1" role="listbox" id={listboxId} style={{ maxHeight }}>
          {canCreate ? (
            <button type="button" disabled={creating || creatingLocal} onClick={createOption} aria-label={createLabel ? createLabel(query.trim()) : undefined} className="mb-1 flex w-full items-start gap-[5px] border-b border-emerald-100 bg-emerald-50 px-3 py-3 text-left text-sm text-emerald-800 hover:bg-emerald-100 disabled:opacity-60">
              <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-[18px]">add_circle</span>
              <span className="min-w-0 flex-1"><strong className="block">{createLabel ? createLabel(query.trim()) : `Data tidak ditemukan, tambahkan “${query.trim()}” sebagai data baru`}</strong><span className="mt-0.5 block text-xs font-medium text-emerald-700">Nama akan dibersihkan dan dicek ulang agar tidak membuat data ganda.</span></span>
            </button>
          ) : null}
          {filteredOptions.length ? filteredOptions.map((option, index) => {
            const active = option.value === String(value ?? "");
            const highlighted = index === activeIndex;
            const previous = filteredOptions[index - 1];
            const showGroup = Boolean(option.group) && option.group !== previous?.group;
            return (
              <span key={`${option.value}:${option.label}`} className="block">
                {showGroup ? (
                  <span className="mt-1 block border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 first:border-t-0">
                    {option.group}
                  </span>
                ) : null}
                <button
                  type="button"
                  id={`${listboxId}-option-${index}`}
                  disabled={option.disabled}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-[5px] px-3 py-2 text-left text-sm",
                    active ? "bg-emerald-50 font-bold text-emerald-800" : "text-slate-700 hover:bg-slate-50",
                    highlighted && !active && "bg-slate-100",
                    option.disabled && "cursor-not-allowed opacity-45",
                  )}
                  role="option"
                  aria-selected={active}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {active ? <span aria-hidden="true" className="material-symbols-outlined text-[17px]">check</span> : null}
                </button>
              </span>
            );
          }) : <p className="px-3 py-5 text-center text-xs font-semibold text-slate-400">{emptyText}</p>}
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      {open ? (
        <div className="relative">
          <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => handleQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selected?.label || searchPlaceholder}
            disabled={disabled}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
            style={{ paddingLeft: 36, paddingRight: 36 }}
            className={cn(
              "h-11 w-full min-w-0 border border-slate-200 bg-white text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
              buttonClassName,
            )}
          />
          {query ? (
            <button
              type="button"
              aria-label="Bersihkan pencarian"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => { setQuery(""); setActiveIndex(0); inputRef.current?.focus(); }}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-slate-700"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[17px]">close</span>
            </button>
          ) : (
            <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-300">expand_more</span>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={openDropdown}
          className={cn(
            "flex h-11 w-full min-w-0 items-center gap-[5px] border border-slate-200 bg-white px-3 text-left text-sm outline-none transition-colors focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            buttonClassName,
          )}
          aria-haspopup="listbox"
          aria-expanded={false}
        >
          <span className="min-w-0 flex-1 truncate">
            {indicatorClassName && selected ? <span className={cn("mr-2 inline-block h-2 w-2 shrink-0 rounded-full", indicatorClassName)} aria-hidden="true" /> : null}
            <span className={cn(selected ? "font-semibold text-slate-800" : "text-slate-400")}>{selected?.label || placeholder}</span>
          </span>
          {clearable && selected && !disabled ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onChange?.("", null);
              }}
              className="flex h-7 w-7 shrink-0 items-center justify-center text-slate-400 hover:text-slate-700"
              aria-label="Hapus pilihan"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[17px]">close</span>
            </span>
          ) : null}
          <span aria-hidden="true" className="material-symbols-outlined shrink-0 text-[18px] text-slate-400">search</span>
        </button>
      )}

      {renderPanel()}
    </div>
  );
});
