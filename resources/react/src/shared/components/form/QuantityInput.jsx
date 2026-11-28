import { forwardRef, memo } from "react";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { inputClassName } from "@/shared/components/form/FormField";
import { cn } from "@/shared/utils/utils";

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampValue(value, min, max) {
  let next = value;
  if (min !== undefined && min !== null && min !== "" && next < Number(min)) next = Number(min);
  if (max !== undefined && max !== null && max !== "" && next > Number(max)) next = Number(max);
  return next;
}

function roundToStep(value, step, decimal) {
  const base = step !== undefined && step !== null && step !== "" ? Number(step) : decimal ? 0.0001 : 1;
  const safeStep = Number.isFinite(base) && base > 0 ? base : 1;
  const decimals = decimal ? (String(safeStep).split(".")[1] || "").length : 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Input jumlah/kuantitas yang bisa diketik manual maupun ditambah/dikurangi
 * lewat tombol −/+. `onChange` menerima string angka bersih (tanpa pemisah
 * ribuan) sehingga kompatibel dengan FormattedNumberInput dan alur data yang
 * sudah ada. Nilai selalu dijepit ke rentang [min, max].
 */
export const QuantityInput = memo(
  forwardRef(function QuantityInput(
    {
      value,
      onChange,
      decimal = false,
      step,
      min,
      max,
      className,
      wrapperClassName,
      buttonClassName,
      disabled = false,
      ariaLabel,
      ...props
    },
    ref,
  ) {
    const numericStep = step !== undefined && step !== null && step !== "" ? Number(step) : decimal ? 0.0001 : 1;
    const safeStep = Number.isFinite(numericStep) && numericStep > 0 ? numericStep : 1;

    const commit = (raw) => {
      const next = clampValue(raw, min, max);
      onChange?.(String(next));
    };

    const handleStep = (direction) => {
      if (disabled) return;
      const next = roundToStep(toNumber(value) + direction * safeStep, safeStep, decimal);
      commit(next);
    };

    const atMin = min !== undefined && min !== null && min !== "" && toNumber(value) <= Number(min);
    const atMax = max !== undefined && max !== null && max !== "" && toNumber(value) >= Number(max);

    const buttonBase = cn(
      "flex h-10 w-7 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40",
      buttonClassName,
    );

    return (
      <div className={cn("flex items-stretch", wrapperClassName)}>
        <button
          type="button"
          onClick={() => handleStep(-1)}
          disabled={disabled || atMin}
          className={cn(buttonBase, "rounded-l-[10px]")}
          aria-label={ariaLabel ? `Kurangi ${ariaLabel}` : "Kurangi"}
          tabIndex={-1}
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <FormattedNumberInput
          ref={ref}
          decimal={decimal}
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(next) => onChange?.(next)}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(inputClassName, "h-10 min-w-0 flex-1 rounded-none border-x-0 text-center", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => handleStep(1)}
          disabled={disabled || atMax}
          className={cn(buttonBase, "rounded-r-[10px]")}
          aria-label={ariaLabel ? `Tambah ${ariaLabel}` : "Tambah"}
          tabIndex={-1}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>
    );
  }),
);

QuantityInput.displayName = "QuantityInput";