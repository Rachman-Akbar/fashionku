import { memo } from "react";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { toTitleCase } from "@/shared/utils/textFormatter";

export const SellerBannerCard = memo(function SellerBannerCard({ banner, onEdit, onToggleActive, pending }) {
  return (
    <article onClick={() => onEdit(banner)} className="cursor-pointer overflow-hidden border border-slate-200 bg-white hover:bg-slate-50" title="Klik untuk edit">
      <div className="relative aspect-[3/1] overflow-hidden bg-slate-100"><img src={banner.imageUrl} alt={banner.name} className="h-full w-full object-cover" loading="lazy" /></div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0"><h2 className="truncate font-extrabold text-slate-950">{toTitleCase(banner.name)}</h2><p className="mt-1 text-xs text-slate-500">Urutan {banner.sortOrder}</p></div>
        <InlineActiveSwitch checked={banner.isActive} pending={pending} onChange={(checked) => onToggleActive?.(banner, checked)} compact />
      </div>
    </article>
  );
});
