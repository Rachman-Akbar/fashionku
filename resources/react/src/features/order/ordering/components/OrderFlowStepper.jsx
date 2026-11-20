import { Link } from "react-router-dom";
import { Check, ChevronLeft, ShoppingCart } from "lucide-react";

/**
 * Satu sumber kebenaran untuk navigasi alur pesanan buyer:
 *   1. Informasi checkout  → /checkout
 *   2. Review & konfirmasi → /checkout/preview
 *   3. Detail pesanan      → /orders/:id
 *
 * Dipakai di ketiga langkah supaya header, stepper, tombol kembali, dan
 * pintasan ke keranjang selalu terlihat sama.
 */
export const ORDER_FLOW_STEPS = [
  {
    step: 1,
    label: "Informasi",
    hint: "Alamat, pengiriman, pembayaran",
    to: "/checkout",
  },
  {
    step: 2,
    label: "Review",
    hint: "Periksa sebelum dikirim",
    to: "/checkout/preview",
  },
  {
    step: 3,
    label: "Detail Pesanan",
    hint: "Status & pembayaran",
    to: null,
  },
];

export function OrderFlowStepper({
  currentStep = 1,
  title = "Alur Pesanan",
  subtitle = "",
  onBack,
  backLabel = "Kembali",
  cartHref = "/cart",
  cartLabel = "Lihat Keranjang",
}) {
  const activeIndex = Math.min(
    Math.max(Number(currentStep) || 1, 1),
    ORDER_FLOW_STEPS.length,
  );

  return (
    <header className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-[#047857]"
            >
              <ChevronLeft size={15} />
              {backLabel}
            </button>
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-900">{title}</p>
            <p className="truncate text-[11px] text-slate-400">
              {subtitle || `Langkah ${activeIndex} dari ${ORDER_FLOW_STEPS.length}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#047857] sm:inline">
            Langkah {activeIndex} / {ORDER_FLOW_STEPS.length}
          </span>
          <Link
            to={cartHref}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#047857]"
          >
            <ShoppingCart size={14} />
            {cartLabel}
          </Link>
        </div>
      </div>

      <ol className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
        {ORDER_FLOW_STEPS.map((item) => {
          const isActive = item.step === activeIndex;
          const isDone = item.step < activeIndex;
          const content = (
            <>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                  isActive
                    ? "bg-[#10B981] text-white"
                    : isDone
                      ? "bg-emerald-100 text-[#047857]"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <Check size={11} /> : item.step}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-bold sm:text-xs">
                  {item.label}
                </span>
                <span className="hidden truncate text-[10px] font-medium opacity-70 sm:block">
                  {item.hint}
                </span>
              </span>
            </>
          );

          const baseClass = `flex min-w-0 items-center gap-1.5 rounded-xl border px-2 py-2 text-left transition sm:gap-2 sm:px-3 ${
            isActive
              ? "border-emerald-200 bg-emerald-50 text-[#047857]"
              : isDone
                ? "border-slate-100 bg-white text-slate-600 hover:border-emerald-200 hover:text-[#047857]"
                : "border-slate-100 bg-slate-50/60 text-slate-400"
          }`;

          if (isDone && item.to) {
            return (
              <li key={item.step} className="min-w-0">
                <Link to={item.to} className={baseClass}>
                  {content}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.step} className="min-w-0" aria-current={isActive ? "step" : undefined}>
              <div className={baseClass}>{content}</div>
            </li>
          );
        })}
      </ol>
    </header>
  );
}

export default OrderFlowStepper;
