import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TicketPercent } from "lucide-react";
import { isExternalUrl } from "@/core/utils/url";
import { usePromotionHighlights } from "@/features/catalog/promotion/services/promotionService";
import { getCategoryHref, useCategoriesMenu } from "@/features/catalog/category/services/categoryService";
import { useActiveVouchers } from "@/features/order/voucher/services/voucherService";
import { formatPrice } from "@/shared/utils/utils";

function flattenCategories(categories = []) {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children || [])]);
}

function PromotionCarousel({ promos }) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const count = promos.length;

  const go = useCallback((idx) => {
    if (!count) return;
    setActive((idx + count) % count);
  }, [count]);

  useEffect(() => {
    if (active >= count) setActive(0);
  }, [active, count]);

  useEffect(() => {
    if (count < 2) return undefined;
    const timer = window.setInterval(() => {
      if (!pausedRef.current) setActive((c) => (c + 1) % count);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [count]);

  if (!count) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-slate-100"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {promos.map((promo) => {
          const src = promo.mobileImageUrl || promo.imageUrl;
          const label = promo.title || promo.name || "Promosi";
          const img = (
            <img src={src} alt={label} className="aspect-[16/7] w-full object-cover sm:aspect-[16/6] lg:aspect-[16/5]" loading="lazy" />
          );
          return (
            <div key={promo.id} className="w-full shrink-0">
              {isExternalUrl(promo.href) ? (
                <a href={promo.href} target="_blank" rel="noreferrer" aria-label={label} className="block">{img}</a>
              ) : (
                <Link to={promo.href || "/promotions"} aria-label={label} className="block">{img}</Link>
              )}
            </div>
          );
        })}
      </div>
      {count > 1 ? (
        <>
          <button type="button" onClick={() => go(active - 1)} className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white" aria-label="Sebelumnya">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button type="button" onClick={() => go(active + 1)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white" aria-label="Berikutnya">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {promos.map((p, i) => (
              <button key={p.id} type="button" onClick={() => go(i)} aria-label={`Slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-2 bg-white/60"}`} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function CategoryChip({ category }) {
  const image = category.image_url || category.icon_url;
  return (
    <Link
      to={getCategoryHref(category)}
      className="group flex w-[76px] shrink-0 flex-col items-center gap-1.5 text-center sm:w-[84px]"
    >
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-md">
        {image ? (
          <img src={image} alt={category.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span className="material-symbols-outlined text-[26px] text-[#10B981]">category</span>
        )}
      </div>
      <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-slate-700 group-hover:text-[#047857]">
        {category.name}
      </span>
    </Link>
  );
}

function voucherValue(voucher) {
  if (voucher.discountTarget === "shipping" && voucher.discountType === "percentage" && Number(voucher.discountValue) >= 100) {
    return "Gratis Ongkir";
  }
  if (voucher.discountType === "percentage") return `Diskon ${voucher.discountValue}%`;
  return formatPrice(voucher.discountValue);
}

function VoucherCard({ voucher }) {
  return (
    <Link
      to="/profile/vouchers"
      className="group relative block aspect-[16/9] w-64 shrink-0 snap-start overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-sm sm:w-72"
    >
      {voucher.imageUrl ? (
        <img src={voucher.imageUrl} alt={voucher.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide backdrop-blur">Voucher</span>
          <TicketPercent size={16} className="text-white/80" />
        </div>
        <div>
          <p className="text-xl font-black leading-tight drop-shadow">{voucherValue(voucher)}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-white/90">{voucher.name || voucher.code}</p>
          <p className="mt-0.5 text-[11px] text-white/75">Min. belanja {formatPrice(voucher.minSpend || 0)}</p>
          {voucher.code ? (
            <span className="mt-2 inline-block rounded-md border border-dashed border-white/50 bg-white/10 px-2 py-0.5 text-[10px] font-black tracking-widest">{voucher.code}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function HomePromoSection() {
  const promotionsQuery = usePromotionHighlights();
  const categoriesQuery = useCategoriesMenu();
  const vouchersQuery = useActiveVouchers();

  const promos = promotionsQuery.data || [];

  const categoryCards = useMemo(() => {
    const roots = categoriesQuery.data?.data || [];
    const picked = roots.length ? roots : flattenCategories(roots);
    return picked.slice(0, 16);
  }, [categoriesQuery.data]);

  const vouchers = (vouchersQuery.data || []).slice(0, 10);

  return (
    <section className="space-y-6">
      <div>
        {promotionsQuery.isLoading ? (
          <div className="aspect-[16/6] animate-pulse rounded-2xl bg-slate-100" />
        ) : promos.length ? (
          <PromotionCarousel promos={promos} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            Belum ada promosi aktif saat ini.
          </div>
        )}
      </div>

      <div>
        {categoriesQuery.isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex w-[76px] shrink-0 flex-col items-center gap-1.5">
                <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : categoryCards.length ? (
          <div className="flex flex-wrap gap-x-4 gap-y-4 sm:gap-x-5">
            {categoryCards.map((cat) => (
              <CategoryChip key={cat.id || cat.key || cat.slug} category={cat} />
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 sm:text-lg">Voucher Spesial</h3>
            <p className="mt-0.5 text-sm text-slate-500">Klaim dan pakai voucher hemat untuk belanja fashion favoritmu.</p>
          </div>
          <Link to="/profile/vouchers" className="shrink-0 whitespace-nowrap text-sm font-bold text-[#10B981] hover:underline">
            Lihat semua
          </Link>
        </div>
        {vouchersQuery.isLoading ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[16/9] w-64 shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:w-72" />
            ))}
          </div>
        ) : vouchers.length ? (
          <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 scrollbar-thin">
            {vouchers.map((v) => (
              <VoucherCard key={v.id} voucher={v} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Belum ada voucher aktif saat ini.</p>
        )}
      </div>
    </section>
  );
}
