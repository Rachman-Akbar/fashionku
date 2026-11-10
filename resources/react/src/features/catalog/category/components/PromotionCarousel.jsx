import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { isExternalUrl } from "@/core/utils/url";
import { usePromotionHighlights } from "@/features/catalog/promotion/services/promotionService";

function PromotionLink({ promotion, children }) {
  const className = "inline-flex bg-white/20 px-5 py-2.5 text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-white/30";
  if (isExternalUrl(promotion.href)) {
    return <a href={promotion.href} target="_blank" rel="noreferrer" className={className}>{children}</a>;
  }
  return <Link to={promotion.href} className={className}>{children}</Link>;
}

export function PromotionCarousel() {
  const [active, setActive] = useState(0);
  const promotionsQuery = usePromotionHighlights();
  const promotions = promotionsQuery.data || [];
  const promotion = promotions[Math.min(active, Math.max(0, promotions.length - 1))];

  const move = useCallback((direction) => {
    setActive((current) => {
      if (!promotions.length) return 0;
      return (current + direction + promotions.length) % promotions.length;
    });
  }, [promotions.length]);

  useEffect(() => {
    if (active >= promotions.length) setActive(0);
  }, [active, promotions.length]);

  useEffect(() => {
    if (promotions.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), 6500);
    return () => window.clearInterval(timer);
  }, [move, promotions.length]);

  if (promotionsQuery.isLoading) return null;
  if (!promotion) return null;

  return (
    <section className="group relative aspect-[12/3] min-h-[180px] w-full overflow-hidden bg-slate-900">
      <picture className="absolute inset-0">
        <source media="(max-width: 640px)" srcSet={promotion.mobileImageUrl || promotion.imageUrl} />
        <img src={promotion.imageUrl} alt={promotion.title} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
      <div className="relative flex h-full max-w-xl flex-col justify-center px-12 py-8 text-white sm:px-16 lg:px-20">
        <span className="w-fit bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide backdrop-blur">{promotion.badge}</span>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">{promotion.title}</h2>
        <p className="mt-2 hidden text-sm text-white/85 sm:block">{promotion.subtitle}</p>
        <div className="mt-4"><PromotionLink promotion={promotion}>{promotion.cta}</PromotionLink></div>
      </div>

      {promotions.length > 1 ? (
        <>
          <button type="button" onClick={() => move(-1)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-slate-950/45 text-white opacity-90 transition hover:bg-slate-950/70 focus:outline-none focus:ring-2 focus:ring-white/70" aria-label="Promosi sebelumnya">
            <ChevronLeft size={24} />
          </button>
          <button type="button" onClick={() => move(1)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-slate-950/45 text-white opacity-90 transition hover:bg-slate-950/70 focus:outline-none focus:ring-2 focus:ring-white/70" aria-label="Promosi berikutnya">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {promotions.map((item, index) => (
              <button key={item.id} type="button" onClick={() => setActive(index)} className={`h-2 transition-all ${index === active ? "w-6 bg-white" : "w-2 bg-white/40"}`} aria-label={`Buka promo ${item.title}`} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
