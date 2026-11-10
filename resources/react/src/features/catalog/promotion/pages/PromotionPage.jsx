import { PromotionHighlightCard } from "@/features/catalog/promotion/components/PromotionHighlightCard";
import { usePromotionHighlights } from "@/features/catalog/promotion/services/promotionService";
import { AsyncState } from "@/shared/components/feedback/AsyncState";

export default function PromotionPage() {
  const promotionsQuery = usePromotionHighlights();
  const promotions = promotionsQuery.data || [];

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#10B981]">Promo pilihan</p><h1 className="mt-2 text-2xl font-extrabold text-[#1b1c1c]">Campaign terbaru dari platform dan seller</h1><p className="mt-1 text-sm text-[#3e4a39]">Hanya promosi active yang telah disetujui admin yang ditampilkan kepada buyer.</p></div>
      <AsyncState loading={promotionsQuery.isLoading} error={promotionsQuery.error?.message || ""} empty={!promotionsQuery.isLoading && !promotions.length} emptyText="Belum ada promosi yang disetujui." />
      {promotions.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{promotions.map((promotion) => <PromotionHighlightCard key={promotion.id} promotion={promotion} />)}</div> : null}
    </main>
  );
}
