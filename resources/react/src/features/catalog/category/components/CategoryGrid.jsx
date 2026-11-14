import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getCategoryHref,
  useCategoryNavigation,
} from "@/features/catalog/category/services/categoryService";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

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
                  src={resolveMediaUrl(category.icon_url)}
                  alt={toTitleCase(category.name)}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M180 385h240l-74-94-54 68-42-52-70 78Z' fill='%23d1d5db'/%3E%3Ccircle cx='235' cy='235' r='35' fill='%23d1d5db'/%3E%3C/svg%3E";
                  }}
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
