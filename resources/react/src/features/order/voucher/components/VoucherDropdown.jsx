import { useCallback, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import VoucherDetailModal from "@/features/order/voucher/components/VoucherDetailModal";

function formatRupiah(value) {
  const number = Number(value || 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatDiscount(voucher) {
  const value = voucher.discountType === "percentage"
    ? `${Number(voucher.discountValue || 0).toLocaleString("id-ID")}%`
    : formatRupiah(voucher.discountValue);

  if (voucher.discountTarget === "shipping") {
    return voucher.discountType === "percentage" && Number(voucher.discountValue || 0) === 100
      ? "Gratis ongkir"
      : `Diskon ongkir ${value}`;
  }

  return value;
}

function getVoucherDescription(voucher) {
  const parts = [];

  if (voucher.name) {
    parts.push(voucher.name);
  }

  if (voucher.discountValue) {
    parts.push(formatDiscount(voucher));
  }

  if (voucher.minSpend) {
    parts.push(`Min. belanja ${formatRupiah(voucher.minSpend)}`);
  }

  if (voucher.maxDiscount) {
    parts.push(`Maks. diskon ${formatRupiah(voucher.maxDiscount)}`);
  }

  return parts.join(" • ");
}

export default function VoucherDropdown({
  vouchers = [],
  loading = false,
  error = "",
  onSelect,
}) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const visibleVouchers = useMemo(() => {
    return Array.isArray(vouchers) ? vouchers : [];
  }, [vouchers]);
  const closeVoucher = useCallback(() => setSelectedVoucher(null), []);
  const useVoucher = useCallback(
    (voucher) => {
      onSelect?.(voucher);
      closeVoucher();
    },
    [closeVoucher, onSelect],
  );
  const openVoucher = useCallback((voucher) => {
    if (voucher?.isLocked) {
      return;
    }

    setSelectedVoucher(voucher);
  }, []);

  return (
    <>
      <div className="mx-auto h-[460px] max-w-[1200px] overflow-y-auto overscroll-contain bg-white p-6">
        <div className="mb-5 border-b border-gray-100 pb-3">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            Voucher
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Pilih voucher yang tersedia untuk mendapatkan potongan belanja.
          </p>
        </div>

        {!loading && error ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-red-500">
            {error}
          </div>
        ) : null}

        {!loading && !error && !visibleVouchers.length ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-gray-400">
            Voucher belum tersedia
          </div>
        ) : null}

        {!loading && !error && visibleVouchers.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleVouchers.map((voucher) => {
              const locked = Boolean(voucher.isLocked);

              return (
                <button
                  key={voucher.id || voucher.code}
                  type="button"
                  onClick={() => openVoucher(voucher)}
                  className={`relative min-h-[160px] overflow-hidden rounded-xl border text-left transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    locked
                      ? "cursor-not-allowed border-gray-200 bg-gray-100"
                      : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-[#10B981]"
                  }`}
                >
                  {voucher.imageUrl ? (
                    <>
                      <img
                        src={voucher.imageUrl}
                        alt={voucher.name || voucher.code}
                        className={`absolute inset-0 h-full w-full object-cover ${
                          locked ? "grayscale opacity-40" : ""
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <div className="mb-2 inline-flex rounded-md border border-white/50 bg-black/20 px-3 py-1 text-sm font-bold tracking-wide backdrop-blur-sm">
                          {voucher.code}
                        </div>
                        <div className="line-clamp-2 text-sm leading-6 text-white/90">
                          {getVoucherDescription(voucher)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="min-h-[160px] p-4">
                      <div
                        className={`mb-3 inline-flex rounded-md border px-3 py-1 text-sm font-bold tracking-wide ${
                          locked
                            ? "border-gray-300 text-gray-400"
                            : "border-[#10B981]/30 text-[#10B981]"
                        }`}
                      >
                        {voucher.code}
                      </div>
                      <div
                        className={`line-clamp-3 text-sm leading-6 ${
                          locked ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {getVoucherDescription(voucher)}
                      </div>
                    </div>
                  )}

                  {locked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow">
                        <Lock size={22} className="text-gray-600" />
                      </span>
                      <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
                        Voucher terkunci
                      </span>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <VoucherDetailModal
        voucher={selectedVoucher}
        open={Boolean(selectedVoucher)}
        onClose={closeVoucher}
        onUse={onSelect ? useVoucher : undefined}
      />
    </>
  );
}
