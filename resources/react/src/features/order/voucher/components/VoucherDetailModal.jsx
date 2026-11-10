import { useEffect } from "react";
import { CalendarDays, Copy, TicketPercent, X } from "lucide-react";
import { formatPrice } from "@/shared/utils/utils";

function formatDate(value) {
  if (!value) {
    return "Tanpa batas";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDiscount(voucher = {}) {
  const type = String(voucher.discountType || "fixed").toLowerCase();
  const target = String(voucher.discountTarget || "product").toLowerCase();
  const value = Number(voucher.discountValue || 0);
  const amount = type === "percentage" ? `${value.toLocaleString("id-ID")}%` : formatPrice(value);

  if (target === "shipping") {
    return type === "percentage" && value === 100 ? "Gratis Ongkir" : `Diskon Ongkir ${amount}`;
  }

  return `Diskon Produk ${amount}`;
}

function getTerms(voucher = {}) {
  const terms =
    voucher.terms || voucher.termsAndConditions || voucher.description;

  if (Array.isArray(terms)) {
    return terms.filter(Boolean).join("\n");
  }

  return String(terms || "Voucher mengikuti ketentuan transaksi yang berlaku.");
}

export default function VoucherDetailModal({ voucher, open, onClose, onUse }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open || !voucher) {
    return null;
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code || "");
    } catch {
      return;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail voucher ${voucher.code || voucher.name}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className="max-h-[calc(100vh-48px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {voucher.imageUrl ? (
          <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
            <img
              src={voucher.imageUrl}
              alt={voucher.name || voucher.code}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em]">
                Voucher aktif
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {voucher.name || "Voucher"}
              </h2>
            </div>
          </div>
        ) : null}

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {!voucher.imageUrl ? (
                <h2 className="text-xl font-bold text-slate-900">
                  {voucher.name || "Voucher"}
                </h2>
              ) : null}
              <p className="mt-1 text-sm text-slate-500">
                Detail promo dan ketentuan penggunaan voucher.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
              aria-label="Tutup detail voucher"
            >
              <X size={19} />
            </button>
          </div>

          <hr className="my-5 border-slate-200" />

          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">
                    Kode voucher
                  </p>
                  <p className="mt-1 truncate text-lg font-black tracking-wide text-[#047857]">
                    {voucher.code || "-"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#10B981] ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                  aria-label="Salin kode voucher"
                >
                  <Copy size={17} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-[#10B981]">
                  <TicketPercent size={17} />
                  <span className="text-xs font-semibold text-slate-500">
                    Besaran diskon
                  </span>
                </div>
                <p className="mt-2 text-base font-bold text-slate-900">
                  {formatDiscount(voucher)}
                </p>
                {voucher.maxDiscount ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Maks. {formatPrice(voucher.maxDiscount)}
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-[#10B981]">
                  <CalendarDays size={17} />
                  <span className="text-xs font-semibold text-slate-500">
                    Masa berlaku
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {formatDate(voucher.startsAt)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  sampai {formatDate(voucher.endsAt)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500">
                Minimum belanja
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {voucher.minSpend
                  ? formatPrice(voucher.minSpend)
                  : "Tanpa minimum belanja"}
              </p>
              {voucher.minItems || voucher.minDistinctProducts ? (
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                  {voucher.minItems ? (
                    <li className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#10B981]" />
                      Minimal {Number(voucher.minItems).toLocaleString("id-ID")} item dibeli
                    </li>
                  ) : null}
                  {voucher.minDistinctProducts ? (
                    <li className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#10B981]" />
                      Minimal {Number(voucher.minDistinctProducts).toLocaleString("id-ID")} produk berbeda
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500">
                Syarat & ketentuan
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                {getTerms(voucher)}
              </p>
            </div>
          </div>

          {onUse ? (
            <button
              type="button"
              onClick={() => onUse(voucher)}
              className="mt-5 h-11 w-full rounded-xl bg-[#10B981] px-4 text-sm font-bold text-white transition hover:bg-[#059669]"
            >
              Pakai Voucher
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
