import HomePromoSection from "@/features/catalog/components/HomePromoSection";
import { ProductFeed } from "@/features/catalog/product/components/ProductFeed";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-8 px-6 py-6">
      <HomePromoSection />
      <ProductFeed />
    </div>
  );
}
