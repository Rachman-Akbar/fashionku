import { ProductCard } from "@/features/catalog/product/components/ProductCard";

export function ProductGrid({ products = [], className = "" }) {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`.trim()}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product?.id ?? product?.slug ?? index}
          {...product}
        />
      ))}
    </div>
  );
}
