import { memo } from "react";
import { cn } from "@/shared/utils/utils";

const TONES = {
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
  sky: "bg-sky-600 text-white hover:bg-sky-700",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
  rose: "bg-rose-600 text-white hover:bg-rose-700",
  slate: "bg-slate-800 text-white hover:bg-slate-900",
};

/**
 * Tombol aksi khusus (special action) yang selalu tampil di toolbar,
 * mis. Restock / Stock Opname, Bayar / Bayar Sebagian, Ubah Status Pesanan.
 */
export const SpecialActionButton = memo(function SpecialActionButton({
  icon,
  label,
  title,
  onClick,
  disabled = false,
  tone = "emerald",
  className,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      aria-label={title || label}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] px-3 text-xs font-extrabold shadow-sm transition-colors disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none",
        TONES[tone] || TONES.emerald,
        className,
      )}
    >
      <span className="material-symbols-outlined text-[17px] leading-none">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
});
