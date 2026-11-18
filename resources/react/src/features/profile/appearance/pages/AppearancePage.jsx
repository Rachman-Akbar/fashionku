import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { COLOR_PALETTES, THEME_MODES } from "@/shared/theme/themeConfig";
import { cn } from "@/shared/utils/utils";
import { toastSuccess } from "@/shared/utils/userFeedback";

const MODE_ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

function ModeOption({ option, active, onSelect }) {
  const Icon = MODE_ICONS[option.value] || Sun;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : "border-[#e5e7eb] bg-white hover:border-[var(--color-primary)]/40",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          active
            ? "bg-[var(--color-primary)] text-white"
            : "bg-slate-100 text-slate-500",
        )}
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-950">
          {option.label}
          {active ? (
            <Check size={14} className="text-[var(--color-primary)]" />
          ) : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {option.description}
        </span>
      </span>
    </button>
  );
}

function PaletteOption({ option, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : "border-[#e5e7eb] bg-white hover:border-[var(--color-primary)]/40",
      )}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: option.color }}
      >
        {active ? <Check size={16} /> : null}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-900">
          {option.label}
        </span>
        <span className="block text-[11px] uppercase tracking-[0.12em] text-slate-400">
          {option.color}
        </span>
      </span>
    </button>
  );
}

export default function AppearancePage() {
  const { mode, setMode, palette, setPalette, resolvedMode } = useTheme();

  const handleMode = (value) => {
    setMode(value);
    toastSuccess("Mode tampilan", "Preferensi mode tampilan disimpan.");
  };

  const handlePalette = (value) => {
    setPalette(value);
    toastSuccess("Palet warna", "Warna aksen akun diperbarui.");
  };

  return (
    <section className={profileLayout.contentShell} aria-label="Pengaturan tampilan">
      <div className={profileLayout.contentInner}>
        <div className={profileLayout.contentHeader}>
          <div>
            <span className={profileLayout.contentEyebrow}>Tampilan</span>
            <h2 className={profileLayout.contentTitle}>Atur tema akun</h2>
            <p className={`mt-2 ${profileLayout.contentDesc}`}>
              Pilih mode terang atau gelap dan tentukan warna aksen yang dipakai
              di seluruh halaman marketplace, akun, dan panel admin. Pengaturan
              tersimpan otomatis di perangkat ini.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
            <Palette size={14} className="text-[var(--color-primary)]" />
            Mode aktif: {resolvedMode === "dark" ? "Gelap" : "Terang"}
          </span>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Mode tampilan
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {THEME_MODES.map((option) => (
                <ModeOption
                  key={option.value}
                  option={option}
                  active={mode === option.value}
                  onSelect={handleMode}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Palet warna
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COLOR_PALETTES.map((option) => (
                <PaletteOption
                  key={option.value}
                  option={option}
                  active={palette === option.value}
                  onSelect={handlePalette}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Pratinjau
            </h3>
            <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                    Z
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    Pratinjau akun
                  </span>
                </div>
                <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                  Aktif
                </span>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm leading-6 text-slate-500">
                  Beginilah tampilan kartu, tombol, dan aksen saat kamu memakai
                  palet ini.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={profileLayout.primaryButton}>Simpan</span>
                  <span className={profileLayout.secondaryButton}>Batal</span>
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    Teks aksen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
