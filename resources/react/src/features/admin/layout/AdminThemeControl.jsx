import { useState } from "react";
import { Popover } from "@/shared/components/ui/Popover";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { COLOR_PALETTES } from "@/shared/theme/themeConfig";
import { cn } from "@/shared/utils/utils";

const MODE_OPTIONS = [
  { value: "light", label: "Terang", icon: "light_mode" },
  { value: "dark", label: "Gelap", icon: "dark_mode" },
];

export function AdminThemeControl() {
  const { mode, resolvedMode, palette, setMode, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const activePalette = COLOR_PALETTES.find((item) => item.value === palette) || COLOR_PALETTES[0];
  const isDark = resolvedMode === "dark";

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={(state) => (
        <button
          type="button"
          onClick={state.toggle}
          aria-label="Atur tema tampilan"
          aria-expanded={state.open}
          title={`Tema: ${isDark ? "Gelap" : "Terang"} · Palet ${activePalette.label}`}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-white px-2.5 text-slate-600 transition-colors hover:bg-slate-50"
        >
          <span className="material-symbols-outlined text-[20px]">{isDark ? "dark_mode" : "light_mode"}</span>
          <span
            className="h-3 w-3 rounded-full ring-2 ring-white"
            style={{ backgroundColor: activePalette.color }}
          />
          <span className="material-symbols-outlined text-[15px] text-slate-400">expand_more</span>
        </button>
      )}
    >
      <div className="w-64 rounded-[10px] border border-slate-200 bg-white p-3 shadow-2xl">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Mode tampilan</p>
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-[10px] bg-slate-100 p-1">
          {MODE_OPTIONS.map((option) => {
            const active = mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                aria-pressed={active}
                className={cn(
                  "flex h-8 items-center justify-center gap-1.5 rounded-[8px] text-xs font-extrabold transition-colors",
                  active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
                )}
              >
                <span className="material-symbols-outlined text-[16px]">{option.icon}</span>
                {option.label}
              </button>
            );
          })}
        </div>

        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
          Palet warna · {activePalette.label}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {COLOR_PALETTES.map((option) => {
            const active = palette === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setPalette(option.value)}
                aria-pressed={active}
                aria-label={`Palet ${option.label}`}
                title={option.label}
                className={cn(
                  "flex h-9 items-center justify-center gap-1.5 rounded-[8px] border transition-colors",
                  active ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: option.color }} />
                <span className="text-[11px] font-bold text-slate-600">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Popover>
  );
}
