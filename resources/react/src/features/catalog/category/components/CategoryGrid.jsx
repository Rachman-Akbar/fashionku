import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getCategoryHref,
  useCategoryNavigation,
} from "@/features/catalog/category/services/categoryService";
import { toTitleCase } from "@/shared/utils/textFormatter";

export function CategoryGrid() {
  const navigationQuery = useCategoryNavigation();
  const groups = navigationQuery.data?.groups || [];
  const categoriesByGroup = navigationQuery.data?.categoriesByGroup || {};
  const categories = useMemo(
    () =>
      groups.flatMap((group) => categoriesByGroup[group.key] || []),
    [categoriesByGroup, groups],
  );

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Kategori Populer</h2>
      {navigationQuery.error && (
        <div className="text-sm text-red-500">
          {navigationQuery.error.message || "Gagal memuat kategori populer"}
        </div>
      )}
      {!navigationQuery.isLoading && !navigationQuery.error && (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id || category.slug}
              to={getCategoryHref(category)}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-orange-300 transition-colors group"
            >
              {category.icon_url ? (
                <img
                  src={category.icon_url}
                  alt={toTitleCase(category.name)}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <span className="material-symbols-outlined text-3xl text-[#10B981]">
                  category
                </span>
              )}
              <span className="text-xs text-gray-700 text-center leading-tight group-hover:text-orange-500 transition-colors">
                {toTitleCase(category.name)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
