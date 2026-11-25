import { orderRequest, unwrapCollection } from "@/features/order/orderApi";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { publicQueryOptions } from "@/core/api/publicQueryOptions";

export async function getProductReviews(productId, params = {}) {
  const payload = await orderRequest(`/products/${productId}/reviews`, {
    params: {
      per_page: 20,
      ...params,
    },
  });
  const { items, meta } = unwrapCollection(payload);
  return { data: items, meta };
}

export async function getProductReviewSummary(productId) {
  const payload = await orderRequest(`/products/${productId}/reviews/summary`);
  return payload?.data || payload;
}

export function useProductReviews(productId, params = {}, options = {}) {
  return useQuery({
    queryKey: ["order", "review", "product", productId, params],
    queryFn: ({ signal }) => getProductReviews(productId, { ...params, signal }),
    enabled: Boolean(productId),
    ...publicQueryOptions,
    ...options,
  });
}

export function useInfiniteProductReviews(productId, params = {}, options = {}) {
  return useInfiniteQuery({
    queryKey: ["order", "review", "product", "infinite", productId, params],
    queryFn: ({ pageParam, signal }) => getProductReviews(productId, { ...params, cursor: pageParam, signal }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.meta?.next_cursor || undefined,
    enabled: Boolean(productId),
    ...publicQueryOptions,
    ...options,
  });
}

export function useProductReviewSummary(productId, options = {}) {
  return useQuery({
    queryKey: ["order", "review", "product", "summary", productId],
    queryFn: () => getProductReviewSummary(productId),
    enabled: Boolean(productId),
    ...publicQueryOptions,
    ...options,
  });
}

export const reviewKeys = {
  product: (productId) => ["order", "review", "product", productId],
  productSummary: (productId) => ["order", "review", "product", "summary", productId],
};