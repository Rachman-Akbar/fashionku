import { memo, useEffect, useMemo, useRef, useState } from "react";
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
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const handleQuery = (next) => {
    setQuery(next);
    onSearch?.(next);
  };
  const [creatingLocal, setCreatingLocal] = useState(false);
  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options]);
  const selected = normalizedOptions.find((option) => option.value === String(value ?? "")) || null;
  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return normalizedOptions;
    return normalizedOptions.filter((option) => `${option.label} ${option.keywords}`.toLowerCase().includes(keyword));
  }, [normalizedOptions, query]);

  useEffect(() => {
    if (!open) return undefined;

    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);
    requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
    };
  }, [open]);

  const selectOption = (option) => {
    if (option.disabled) return;
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

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full min-w-0 items-center gap-[5px] border border-slate-200 bg-white px-3 text-left text-sm outline-none transition-colors focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
          buttonClassName,
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
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

      {open ? (
        <div className="absolute left-0 right-0 top-full z-[100] mt-1 overflow-hidden border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-2">
            <div className="flex items-center gap-[5px] bg-slate-50 px-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[17px] text-slate-400">search</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => handleQuery(event.target.value)}
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1" role="listbox">
            {canCreate ? (
              <button type="button" disabled={creating || creatingLocal} onClick={createOption} aria-label={createLabel ? createLabel(query.trim()) : undefined} className="mb-1 flex w-full items-start gap-[5px] border-b border-emerald-100 bg-emerald-50 px-3 py-3 text-left text-sm text-emerald-800 hover:bg-emerald-100 disabled:opacity-60">
                <span aria-hidden="true" className={`material-symbols-outlined mt-0.5 text-[18px] ${(creating || creatingLocal) ? "" : ""}`}>{(creating || creatingLocal) ? "add_circle" : "add_circle"}</span>
                <span className="min-w-0 flex-1"><strong className="block">{createLabel ? createLabel(query.trim()) : `Data tidak ditemukan, tambahkan “${query.trim()}” sebagai data baru`}</strong><span className="mt-0.5 block text-xs font-medium text-emerald-700">Nama akan dibersihkan dan dicek ulang agar tidak membuat data ganda.</span></span>
              </button>
            ) : null}
            {filteredOptions.length ? filteredOptions.map((option) => {
              const active = option.value === String(value ?? "");
              return (
                <button
                  key={`${option.value}:${option.label}`}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "flex w-full items-center gap-[5px] px-3 py-2 text-left text-sm",
                    active ? "bg-emerald-50 font-bold text-emerald-800" : "text-slate-700 hover:bg-slate-50",
                    option.disabled && "cursor-not-allowed opacity-45",
                  )}
                  role="option"
                  aria-selected={active}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {active ? <span aria-hidden="true" className="material-symbols-outlined text-[17px]">check</span> : null}
                </button>
              );
            }) : <p className="px-3 py-5 text-center text-xs font-semibold text-slate-400">{emptyText}</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
});
