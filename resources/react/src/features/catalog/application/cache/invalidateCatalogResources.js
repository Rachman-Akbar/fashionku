import { invalidateCatalogQueries } from "@/features/catalog/application/cache/catalogQueryClient";
import { invalidateCategoryNavigationCache } from "@/features/catalog/category/services/categoryService";

export async function invalidateCatalogResources(queryClient, queryKeys = [], cacheMatches = []) {
  cacheMatches.forEach((match) => invalidateCatalogQueries(match));

  if (cacheMatches.some((match) => match.includes("categories") || match.includes("catalog-groups"))) {
    invalidateCategoryNavigationCache(queryClient);
  }

  await Promise.all(
    queryKeys.map(async (queryKey) => {
      await queryClient.invalidateQueries({ queryKey, refetchType: "all" });
      await queryClient.refetchQueries({ queryKey, type: "active" });
    }),
  );
}
