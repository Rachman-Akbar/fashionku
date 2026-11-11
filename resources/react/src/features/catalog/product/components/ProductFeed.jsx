import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/features/catalog/product/components/ProductCard";
import { Skeleton, SkeletonProductGrid } from "@/shared/components/feedback/Skeleton";
import { flattenProductPages, useInfiniteProducts } from "@/features/catalog/product/services/productService";
import { useCategoriesMenu } from "@/features/catalog/category/services/categoryService";

export function ProductFeed() {
  const [activeTab, setActiveTab] = useState(0);
  const loadMoreRef = useRef(null);
  const categoriesQuery = useCategoriesMenu();
  const rootCategories = useMemo(
    () =>
      (categoriesQuery.data?.data || [])
        .filter((c) => Number(c.level || 1) === 1)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || String(a.name).localeCompare(String(b.name))),
    [categoriesQuery.data],
  );
  const selectedCategory = activeTab > 0 ? rootCategories[activeTab - 1] || null : null;
  const tabs = useMemo(
    () => ["Untuk Kamu", ...rootCategories.map((c) => c.name)],
    [rootCategories],
  );
  const productsQuery = useInfiniteProducts({
    per_page: 24,
    ...(selectedCategory?.id ? { category_id: selectedCategory.id } : {}),
    ...(selectedCategory?.full_slug ? { category: selectedCategory.full_slug } : {}),
  });
  const products = useMemo(
    () => flattenProductPages(productsQuery.data),
    [productsQuery.data],
  );

  useEffect(() => {
    if (activeTab > rootCategories.length) setActiveTab(0);
  }, [activeTab, rootCategories.length]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !productsQuery.hasNextPage) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || productsQuery.isFetchingNextPage) return;
        productsQuery.fetchNextPage();
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [productsQuery.fetchNextPage, productsQuery.hasNextPage, productsQuery.isFetchingNextPage]);

  const handleTabClick = useCallback((index) => {
    setActiveTab((current) => (current === index ? current : index));
  }, []);

  return (
    <section className="space-y-6">
      <div id="product-feed-sentinel" className="h-px w-full" />
      <div
        className="sticky z-[70] -mx-6 bg-white px-6 pt-1 transition-[top] duration-300 ease-in-out"
        style={{ top: "var(--main-nav-offset, 96px)" }}
      >
        <div className="hide-scrollbar flex items-center gap-8 overflow-x-auto border-b border-[#bccbb4] pb-2">
          {tabs.map((tab, index) => (
            <button
              key={`${tab}-${index}`}
              type="button"
              onClick={() => handleTabClick(index)}
              className={`whitespace-nowrap pb-2 text-base transition-colors ${
                index === activeTab
                  ? "border-b-2 border-[#047857] font-bold text-[#047857]"
                  : "text-[#3e4a39] hover:text-[#047857]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {productsQuery.error ? (
        <div className="py-8 text-sm text-red-500">
          {productsQuery.error.message || "Gagal memuat produk"}
        </div>
      ) : null}

      {productsQuery.isLoading ? (
        <div className="pt-2">
          <SkeletonProductGrid count={12} columns="grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6" />
          <div className="mt-4 flex items-center justify-center gap-2">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ) : null}

      {!productsQuery.isLoading && !productsQuery.error && !products.length ? (
        <div className="py-8 text-sm text-gray-500">Produk belum tersedia.</div>
      ) : null}

      {!productsQuery.isLoading && !productsQuery.error && products.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id || product.slug} {...product} />
          ))}
        </div>
      ) : null}

      <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center py-2 text-xs font-semibold text-slate-400">
        {productsQuery.isFetchingNextPage
          ? "Memuat produk berikutnya..."
          : productsQuery.hasNextPage
            ? "Geser ke bawah untuk melihat produk berikutnya"
            : products.length
              ? "Semua produk sudah ditampilkan"
              : ""}
      </div>
    </section>
  );
}
