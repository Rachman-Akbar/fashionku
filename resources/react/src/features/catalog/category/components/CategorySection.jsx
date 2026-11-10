import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SkeletonLine, Skeleton } from "@/shared/components/feedback/Skeleton";
import { OverflowMenu } from "@/shared/components/ui/OverflowMenu";
import {
  getCategoryHref,
  useCategoriesMenu,
} from "@/features/catalog/category/services/categoryService";

function flattenCategories(categories = []) {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children || []),
  ]);
}

export function CategorySection() {
  const categoriesQuery = useCategoriesMenu();
  const quickLinks = useMemo(
    () => flattenCategories(categoriesQuery.data?.data || []).slice(0, 7),
    [categoriesQuery.data],
  );
  const loading = categoriesQuery.isLoading;

  return (
    <div className="bg-white border border-gray-100 p-4" style={{ borderRadius: 5 }}>
      <div className="min-w-0 p-5">
        <h3 className="text-base font-bold mb-3">Kategori Populer</h3>

        {loading ? (
          <div className="space-y-3" aria-busy="true">
            <Skeleton className="h-24 w-full" />
            <SkeletonLine className="h-8 w-full" />
            <SkeletonLine className="h-8 w-4/5" />
            <SkeletonLine className="h-8 w-3/5" />
          </div>
        ) : (
          <div
            className="relative overflow-hidden flex items-center justify-between px-6 py-4 mb-0"
            style={{
              borderRadius: 5,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              minHeight: 96,
            }}
          >
            <div className="relative z-10 text-white">
              <p className="text-xs font-semibold opacity-90">Yuk, belanja di Fashionku</p>
              <p className="text-xs opacity-75 mb-3">Koleksi fashion lengkap dari beragam kategori</p>
              <Link
                to="/search"
                className="inline-block px-4 py-1.5 border border-white/60 text-white text-xs font-semibold hover:bg-white/20 transition-colors"
                style={{ borderRadius: 5 }}
              >
                Cek Sekarang
              </Link>
            </div>

            <div className="absolute right-4 bottom-0 opacity-90 pointer-events-none">
              <span className="material-symbols-outlined text-[52px]">shopping_bag</span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-3 flex items-center gap-2" aria-busy="true">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      ) : (
        <div className="mt-3">
          <OverflowMenu
            items={quickLinks}
            maxVisible={6}
            buttonLabel="Lainnya"
            className="mb-1"
            menuClassName="w-56"
            renderItem={(item) => (
              <Link
                key={item.id || item.slug}
                to={getCategoryHref(item)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#10B981] transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] text-[#10B981]">category</span>
                {item.name}
              </Link>
            )}
          />
        </div>
      )}
    </div>
  );
}
