import { useMemo } from "react";
import { useProductReviews, useProductReviewSummary } from "@/features/order/review/services/reviewService";
import { useProductById } from "@/features/catalog/product/services/productService";
import { ReviewSection } from "@/features/order/review/components/ReviewSection";

export function ProductReviewTab({ productId }) {
  const reviewsQuery = useProductReviews(productId, { is_active: true });
  const summaryQuery = useProductReviewSummary(productId);
  const productQuery = useProductById(productId);

  const reviews = useMemo(() => reviewsQuery.data?.data || [], [reviewsQuery.data]);
  const summary = useMemo(() => summaryQuery.data || null, [summaryQuery.data]);
  const product = useMemo(() => productQuery.data || null, [productQuery.data]);
  const loading = reviewsQuery.isLoading || summaryQuery.isLoading || productQuery.isLoading;

  if (!productId) {
    return (
      <div className="flex min-h-64 items-center justify-center border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        Simpan produk terlebih dahulu untuk melihat ulasan.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ReviewSection
        product={product}
        reviews={reviews}
        summary={summary}
        loading={loading}
      />
      {reviewsQuery.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
          Gagal memuat ulasan: {reviewsQuery.error.message}
        </div>
      )}
    </div>
  );
}