import { PromotionCarousel } from "@/features/catalog/category/components/PromotionCarousel";
import { CategorySection } from "@/features/catalog/category/components/CategorySection";
import { ProductFeed } from "@/features/catalog/product/components/ProductFeed";

export default function HomePage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
      <PromotionCarousel />
      <CategorySection />
      <ProductFeed />
    </div>
  );
}
