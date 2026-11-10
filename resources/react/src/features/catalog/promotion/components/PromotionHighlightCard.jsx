import { Link } from "react-router-dom";
import { isExternalUrl } from "@/core/utils/url";

function PromotionCardContent({ promotion }) {
  return <><picture className="absolute inset-0"><source media="(max-width: 640px)" srcSet={promotion.mobileImageUrl || promotion.imageUrl} /><img src={promotion.imageUrl} alt={promotion.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /></picture><div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent" /><div className="relative flex h-full flex-col justify-between p-6"><div><span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">{promotion.badge}</span><h2 className="mt-4 max-w-[360px] text-2xl font-extrabold leading-tight text-white">{promotion.title}</h2><p className="mt-2 max-w-[420px] text-sm text-white/85">{promotion.subtitle}</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 transition group-hover:translate-x-1">{promotion.cta}<span className="material-symbols-outlined text-[18px]">arrow_forward</span></span></div></>;
}

export function PromotionHighlightCard({ promotion }) {
  const className = "group relative min-h-[260px] overflow-hidden rounded-xl bg-slate-900 text-left text-white";
  if (isExternalUrl(promotion.href)) return <a href={promotion.href} target="_blank" rel="noreferrer" className={className}><PromotionCardContent promotion={promotion} /></a>;
  return <Link to={promotion.href} className={className}><PromotionCardContent promotion={promotion} /></Link>;
}
