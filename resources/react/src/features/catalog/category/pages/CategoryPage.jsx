import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { FilterSidebar } from "@/shared/components/ui/FilterSidebar";
import { ProductCard } from "@/features/catalog/product/components/ProductCard";
import { Skeleton, SkeletonProductGrid } from "@/shared/components/feedback/Skeleton";
import { publicQueryOptions } from "@/core/api/publicQueryOptions";
import {
  getCategoryByPath,
  getCategoryHref,
  useInfiniteProductsByCategoryPath,
} from "@/features/catalog/category/services/categoryService";
import { normalizeProduct } from "@/features/catalog/product/services/productService";

const INITIAL_FILTERS = {
  categories: [],
  locations: [],
  minPrice: "",
  maxPrice: "",
};

function titleFromSlug(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function mapSort(value) {
  if (value === "newest") return "latest";
  if (value === "price_asc") return "price_asc";
  if (value === "price_desc") return "price_desc";
  return "relevance";
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params["*"] || params.slug || "";
  const scrollerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [sort, setSort] = useState("relevance");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    setFilters(INITIAL_FILTERS);
  }, [slug]);

  const productParams = useMemo(
    () => ({
      sort: mapSort(sort),
      category_ids: filters.categories.length
        ? filters.categories.join(",")
        : undefined,
      locations: filters.locations.length
        ? filters.locations.join(",")
        : undefined,
      min_price: filters.minPrice || undefined,
      max_price: filters.maxPrice || undefined,
    }),
    [filters, sort],
  );

  const categoryQuery = useQuery({
    queryKey: ["catalog", "category", "path", slug],
    queryFn: () => getCategoryByPath(slug),
    enabled: Boolean(slug),
    ...publicQueryOptions,
  });

  const productsQuery = useInfiniteProductsByCategoryPath(slug, {
    per_page: 24,
    ...productParams,
  });

  const category = categoryQuery.data || null;
  const products = useMemo(() => {
    const rows = productsQuery.data?.pages?.flatMap((page) => page?.data || []) || [];
    const seen = new Set();

    return rows
      .map(normalizeProduct)
      .filter((product) => {
        const key = String(product?.id ?? product?.slug ?? "");
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [productsQuery.data]);
  const firstPage = productsQuery.data?.pages?.[0] || null;
  const rawFacets =
    firstPage?.raw?.facets ||
    firstPage?.raw?.data?.facets ||
    {};
  const categoryName = category?.name || titleFromSlug(slug) || "Kategori";
  const childCategories = category?.children || [];
  const categoryLevel = Number(category?.level || 1);
  const categoryBubbles = categoryLevel === 2 ? [] : childCategories.filter((item) => item.image_url);
  const levelThreeCards = categoryLevel === 2
    ? childCategories.filter((item) => Number(item.level || 3) === 3)
    : [];
  const sidebarCategories = childCategories;
  const locations = useMemo(
    () =>
      unique([
        ...(Array.isArray(rawFacets.locations)
          ? rawFacets.locations.map((item) =>
              typeof item === "string" ? item : item?.name || item?.value,
            )
          : []),
        ...products.map((product) => product.location),
      ]),
    [products, rawFacets.locations],
  );
  const totalProducts = products.length;

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

  const loading = categoryQuery.isLoading || productsQuery.isLoading;
  const error =
    productsQuery.error?.message || categoryQuery.error?.message || "";

  return (
    <div className="w-full">
      <section className="bg-[#10B981] text-white py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">{categoryName}</h2>
          {levelThreeCards.length ? (
            <div className="mb-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {levelThreeCards.map((child) => (
                <Link
                  key={child.id || child.slug}
                  to={getCategoryHref(child)}
                  className="group overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 transition hover:ring-emerald-300"
                >
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    {child.image_url ? (
                      <img src={child.image_url} alt={child.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-4xl">category</span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-3 text-center text-sm font-extrabold text-slate-800 group-hover:text-emerald-700">
                    {child.name}
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
          {!!categoryBubbles.length && (
            <div className="relative group">
              <div
                ref={scrollerRef}
                className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 scroll-smooth"
              >
                {categoryBubbles.map((bubble) => (
                  <div
                    key={bubble.id || bubble.slug}
                    className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden border-2 border-transparent hover:border-[#76ff64] transition-all">
                      <img
                        src={bubble.image_url}
                        alt={bubble.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-center w-20">
                      {bubble.name}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-white text-[#1b1c1c] rounded-full shadow-lg flex items-center justify-center hover:bg-[#f6f3f2] transition-colors"
                onClick={() =>
                  scrollerRef.current?.scrollBy({
                    left: 200,
                    behavior: "smooth",
                  })
                }
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <nav className="text-xs text-[#3e4a39] mb-6">
          <span>Beranda</span>
          <span className="mx-2">&gt;</span>
          <span>Kategori Utama</span>
          {category?.parent_id && (
            <>
              <span className="mx-2">&gt;</span>
              <span>Sub Kategori</span>
            </>
          )}
          <span className="mx-2">&gt;</span>
          <span className="text-[#1b1c1c] font-bold">{categoryName}</span>
        </nav>

        <div className="flex gap-4">
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <FilterSidebar
              showCategories
              categories={sidebarCategories}
              locations={locations}
              filters={filters}
              onChange={setFilters}
            />
          </aside>

          <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#3e4a39]">
                Menampilkan {totalProducts} produk untuk "{categoryName}"
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">Urutkan:</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="border border-[#bccbb4] rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:border-[#047857] bg-white"
                >
                  <option value="relevance">Paling Sesuai</option>
                  <option value="newest">Terbaru</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {error && <div className="text-sm text-red-500 py-8">{error}</div>}
            {loading && (
              <div className="pt-2">
                <SkeletonProductGrid count={10} columns="grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4" />
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            )}
            {!loading && !error && !products.length && (
              <div className="text-sm text-gray-500 py-8">
                Produk belum tersedia.
              </div>
            )}
            {!loading && !error && !!products.length && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id || product.slug} {...product} />
                ))}
              </div>
            )}

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
      </div>
    </div>
  );
}
