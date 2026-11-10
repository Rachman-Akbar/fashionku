import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/features/catalog/product/components/ProductCard";
import { Skeleton, SkeletonProductGrid } from "@/shared/components/feedback/Skeleton";
import { flattenProductPages, useInfiniteProducts } from "@/features/catalog/product/services/productService";
import { useCatalogGroups } from "@/features/catalog/cataloggroup/services/catalogGroupService";

export function ProductFeed() {
  const [activeTab, setActiveTab] = useState(0);
  const loadMoreRef = useRef(null);
  const groupsQuery = useCatalogGroups({
    is_active: 1,
    include_categories: 0,
  });
  const groups = useMemo(
    () => groupsQuery.data?.data || [],
    [groupsQuery.data],
  );
  const selectedGroup = activeTab > 0 ? groups[activeTab - 1] || null : null;
  const tabs = useMemo(
    () => ["For You", ...groups.map((group) => group.name)],
    [groups],
  );
  const productsQuery = useInfiniteProducts({
    per_page: 24,
    catalog_group_id: selectedGroup?.id,
    catalog_group_slug: selectedGroup?.slug,
  });
  const products = useMemo(
    () => flattenProductPages(productsQuery.data),
    [productsQuery.data],
  );

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
      <div className="hide-scrollbar flex items-center gap-8 overflow-x-auto border-b border-[#bccbb4] pb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
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
          ? "Lihat produk berikutnya"
          : productsQuery.hasNextPage
            ? "Geser ke bawah untuk melihat produk berikutnya"
            : products.length
              ? "Semua produk sudah ditampilkan"
              : ""}
      </div>
    </section>
  );
}
