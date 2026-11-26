import { forwardRef, memo } from "react";
import { inputClassName } from "@/shared/components/form/FormField";
import { cn } from "@/shared/utils/utils";

/**
 * Ubah input mentah menjadi string angka bersih (tanpa pemisah ribuan).
 * - mode bilangan bulat: hanya digit (mendukung tanda minus di depan).
 * - mode desimal: separator paling kanan diperlakukan sebagai desimal,
 *   sisanya (titik/koma) dianggap pemisah ribuan dan dibuang.
 */
export function sanitizeNumberInput(input, decimal = false) {
  const raw = input == null ? "" : String(input);
  const negative = raw.trim().startsWith("-");

  if (!decimal) {
    const digits = raw.replace(/\D/g, "");
    return `${negative ? "-" : ""}${digits}`;
  }

  const stripped = raw.replace(/[^\d.,]/g, "");
  const decimalPos = Math.max(stripped.lastIndexOf(","), stripped.lastIndexOf("."));

  let intPart;
  let decPart = null;
  if (decimalPos === -1) {
    intPart = stripped.replace(/[.,]/g, "");
  } else {
    intPart = stripped.slice(0, decimalPos).replace(/[.,]/g, "");
    decPart = stripped.slice(decimalPos + 1).replace(/[.,]/g, "");
  }

  return `${negative ? "-" : ""}${intPart}${decPart !== null ? `.${decPart}` : ""}`;
}

/**
 * Format nilai angka menjadi tampilan rapi dengan pemisah ribuan (id-ID):
 * 2000000000 -> "2.000.000.000". Mode desimal menampilkan pecahan setelah
 * koma, mis. 1000.5 -> "1.000,5".
 */
export function formatNumberDisplay(value, decimal = false) {
  const raw = value == null ? "" : String(value);
  if (raw === "" || raw === "-") return raw;

  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;
  const dotPos = unsigned.indexOf(".");

  let intPart = (dotPos === -1 ? unsigned : unsigned.slice(0, dotPos)).replace(/\D/g, "");
  const decPart = dotPos === -1 ? null : unsigned.slice(dotPos + 1).replace(/\D/g, "");
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  let output = intPart;
  if (decimal && decPart !== null) output += `,${decPart}`;
  return `${negative ? "-" : ""}${output}`;
}

/**
 * Input angka dengan pemisah ribuan otomatis (format id-ID).
 * `onChange` menerima string angka bersih (tanpa pemisah) sehingga aman
 * dipakai ulang di state/Formik tanpa mengubah alur data yang ada.
 */
const FormattedNumberInput = memo(
  forwardRef(function FormattedNumberInput(
    { value, onChange, decimal = false, className, inputMode, ...props },
    ref,
  ) {
    const handleChange = (event) => {
      const sanitized = sanitizeNumberInput(event.target.value, decimal);
      onChange?.(sanitized, event);
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode={inputMode || (decimal ? "decimal" : "numeric")}
        value={formatNumberDisplay(value, decimal)}
        onChange={handleChange}
        className={cn(
          inputClassName,
          "placeholder:text-slate-400 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    );
  }),
);

FormattedNumberInput.displayName = "FormattedNumberInput";

export { FormattedNumberInput };