import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { publicQueryOptions } from "@/core/api/publicQueryOptions";
import { FilterSidebar } from "@/shared/components/ui/FilterSidebar";
import { ProductCard } from "@/features/catalog/product/components/ProductCard";
import { Skeleton, SkeletonProductGrid } from "@/shared/components/feedback/Skeleton";
import { flattenProductPages, useInfiniteProducts } from "@/features/catalog/product/services/productService";
import { getCategories } from "@/features/catalog/category/services/categoryService";

const initialFilters = {
  categories: [],
  minPrice: "",
  maxPrice: "",
  hasDiscount: false,
};

function flattenCategories(rows = [], result = []) {
  rows.forEach((row) => {
    result.push({ id: row.id, name: row.name, slug: row.slug });
    flattenCategories(row.children || [], result);
  });
  return result;
}

export default function SearchClient() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sort, setSort] = useState("relevance");
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedFilters(filters), 350);
    return () => window.clearTimeout(timer);
  }, [filters]);

  const params = useMemo(
    () => ({
      per_page: 24,
      search: query || undefined,
      q: query || undefined,
      category_ids: debouncedFilters.categories.length
        ? debouncedFilters.categories
        : undefined,
      min_price: debouncedFilters.minPrice || undefined,
      max_price: debouncedFilters.maxPrice || undefined,
      has_discount: debouncedFilters.hasDiscount ? 1 : undefined,
      sort,
    }),
    [debouncedFilters, query, sort],
  );

  const productsQuery = useInfiniteProducts(params);
  const categoriesQuery = useQuery({
    queryKey: ["catalog", "categories", "filter"],
    queryFn: getCategories,
    ...publicQueryOptions,
  });
const products = useMemo(
    () => flattenProductPages(productsQuery.data),
    [productsQuery.data],
  );
  const facets = productsQuery.data?.pages?.[0]?.facets || {};
  const categories = useMemo(
    () => flattenCategories(categoriesQuery.data?.data || [], []),
    [categoriesQuery.data],
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

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-4">
      <div className="flex gap-4">
<aside className="w-64 flex-shrink-0 hidden md:block">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            sort={sort}
            onSortChange={setSort}
          />
        </aside>
        <div className="flex-grow">
          <p className="text-sm text-[#3e4a39] mb-4">
            Menampilkan hasil pencarian untuk <strong className="text-[#1b1c1c]">"{query || "Semua Produk"}"</strong>
          </p>
          {productsQuery.error ? <div className="text-sm text-red-500 py-8">{productsQuery.error.message}</div> : null}
          {productsQuery.isLoading ? (
            <div className="pt-2">
              <SkeletonProductGrid count={10} columns="grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4" />
              <div className="mt-4 flex items-center justify-center gap-2">
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ) : null}
          {!productsQuery.isLoading && !productsQuery.error && !products.length ? <div className="text-sm text-gray-500 py-8">Produk tidak ditemukan.</div> : null}
          {!productsQuery.isLoading && !productsQuery.error && products.length ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id || product.slug} {...product} />
              ))}
            </div>
          ) : null}
          <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center py-4 text-xs font-semibold text-slate-400">
            {productsQuery.isFetchingNextPage
              ? "Lihat produk berikutnya"
              : productsQuery.hasNextPage
                ? "Geser ke bawah untuk melihat produk berikutnya"
                : products.length
                  ? "Semua produk sudah ditampilkan"
                  : ""}
          </div>
        </div>
      </div>
    </main>
  );
}
