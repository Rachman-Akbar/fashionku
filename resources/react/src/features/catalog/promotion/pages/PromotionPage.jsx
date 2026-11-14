import { useState } from "react";
import { PromotionHighlightCard } from "@/features/catalog/promotion/components/PromotionHighlightCard";
import { usePromotionHighlights } from "@/features/catalog/promotion/services/promotionService";
import { useActiveVouchers } from "@/features/order/voucher/services/voucherService";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { Ticket, Tag } from "lucide-react";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { Link } from "react-router-dom";

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M180 385h240l-74-94-54 68-42-52-70 78Z' fill='%23d1d5db'/%3E%3Ccircle cx='235' cy='235' r='35' fill='%23d1d5db'/%3E%3C/svg%3E";

function VoucherCard({ voucher }) {
  const handleImageError = (e) => {
    e.currentTarget.src = PLACEHOLDER_SVG;
  };

  return (
    <Link
      to={`/profile/vouchers?code=${voucher.code}`}
      className="group relative block aspect-[16/9] w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-sm"
    >
      {voucher.imageUrl ? (
        <img
          src={voucher.imageUrl}
          alt={voucher.name || voucher.code}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          onError={handleImageError}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide backdrop-blur">Voucher</span>
          <Ticket size={16} className="text-white/80" />
        </div>
        <div>
          <p className="text-xl font-black leading-tight drop-shadow">{voucher.name || voucher.code}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-white/90">{voucher.code}</p>
        </div>
      </div>
    </Link>
  );
}

export default function PromotionPage() {
  const [activeTab, setActiveTab] = useState("promotion");
  const promotionsQuery = usePromotionHighlights();
  const vouchersQuery = useActiveVouchers();
  const promotions = promotionsQuery.data || [];
  const vouchers = vouchersQuery.data || [];

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-6 flex items-center gap-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("promotion")}
          className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-bold transition-colors ${
            activeTab === "promotion"
              ? "border-[#10B981] text-[#10B981]"
              : "border-transparent text-slate-500 hover:text-[#10B981]"
          }`}
        >
          <Tag size={16} />
          <span>Promosi</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("voucher")}
          className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-bold transition-colors ${
            activeTab === "voucher"
              ? "border-[#10B981] text-[#10B981]"
              : "border-transparent text-slate-500 hover:text-[#10B981]"
          }`}
        >
          <Ticket size={16} />
          <span>Voucher</span>
        </button>
      </div>

      {activeTab === "promotion" ? (
        <>
          <AsyncState
            loading={promotionsQuery.isLoading}
            error={promotionsQuery.error?.message || ""}
            empty={!promotionsQuery.isLoading && !promotions.length}
            emptyText="Belum ada promosi yang disetujui."
          />
          {promotions.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {promotions.map((promotion) => (
                <PromotionHighlightCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <>
          <AsyncState
            loading={vouchersQuery.isLoading}
            error={vouchersQuery.error?.message || ""}
            empty={!vouchersQuery.isLoading && !vouchers.length}
            emptyText="Belum ada voucher aktif saat ini."
          />
          {vouchers.length ? (
            <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 scrollbar-thin">
              {vouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}