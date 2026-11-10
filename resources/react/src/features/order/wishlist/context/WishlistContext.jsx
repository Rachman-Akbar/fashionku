import { createContext, useContext, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

const WishlistContext = createContext(null);
const WISHLIST_KEY = ["order", "wishlist"];

function getImageUrl(product = {}, item = {}) {
  const images = Array.isArray(product.images)
    ? product.images
    : Array.isArray(product.product_images)
      ? product.product_images
      : [];
  const primaryImage = images.find((image) => image.is_primary) || images[0] || null;

  return resolveMediaUrl(
    item.thumbnail ||
      item.image ||
      item.image_url ||
      item.imageUrl ||
      product.thumbnail ||
      product.image ||
      product.image_url ||
      primaryImage?.url ||
      primaryImage?.image_url ||
      "",
  );
}

function normalizeWishlistItem(item = {}) {
  const product = item.product || item.product_detail || item.product_data || item;
  const variants = Array.isArray(product.variants)
    ? product.variants
    : Array.isArray(product.product_variants)
      ? product.product_variants
      : [];
  const defaultVariant = product.default_variant || variants.find((variant) => Boolean(variant.is_default)) || variants[0] || null;
  const productId = Number(item.product_id ?? item.productId ?? product.product_id ?? product.id ?? item.id ?? 0);
  const variantId = Number(item.default_variant_id ?? item.variant_id ?? item.variantId ?? item.product_variant_id ?? defaultVariant?.id ?? 0);

  return {
    id: Number(item.wishlist_id ?? item.id ?? productId),
    productId,
    variantId,
    productName: item.product_name || item.productName || item.name || product.name || product.title || "Produk",
    storeId: Number(item.store_id ?? item.storeId ?? product.store_id ?? product.store?.id ?? 0),
    storeName: item.store_name || item.storeName || product.store_name || product.store?.name || product.seller?.store_name || "Toko",
    slug: item.slug || product.slug || String(productId || ""),
    brand: item.brand || product.brand || product.brand_name || "",
    price: Number(item.price ?? product.price ?? product.min_price ?? defaultVariant?.price ?? 0),
    stock: Number(item.stock ?? product.stock ?? product.total_stock ?? defaultVariant?.stock ?? 0),
    imageUrl: getImageUrl(product, item),
    status: item.status || product.status || "",
    location: item.location || product.location || product.city || product.store?.city || "",
    optimistic: Boolean(item.optimistic),
    raw: item,
  };
}

function getWishlistRows(payload) {
  const source = payload?.data ?? payload;
  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.data)) return source.data;
  if (Array.isArray(source?.items)) return source.items;
  if (Array.isArray(source?.wishlist)) return source.wishlist;
  return [];
}

async function fetchWishlist() {
  const response = await apiClient.get("/api/v1/order/wishlist");
  return getWishlistRows(response.data).map(normalizeWishlistItem);
}

async function addWishlistItem(item) {
  const productId = Number(item.productId ?? item.product_id ?? item.id);
  await apiClient.post("/api/v1/order/wishlist", { product_id: productId });
  return productId;
}

async function removeWishlistItem(productId) {
  await apiClient.delete(`/api/v1/order/wishlist/${Number(productId)}`);
  return Number(productId);
}

export function WishlistProvider({ children }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, initializing } = useAuth();

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: fetchWishlist,
    enabled: !initializing && isAuthenticated,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });


  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      queryClient.removeQueries({ queryKey: WISHLIST_KEY, exact: true });
    }
  }, [initializing, isAuthenticated, queryClient]);

  const addMutation = useMutation({
    mutationFn: addWishlistItem,
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData(WISHLIST_KEY) || [];
      const optimisticItem = normalizeWishlistItem({ ...item, optimistic: true });
      const exists = previous.some((row) => Number(row.productId) === Number(optimisticItem.productId));

      if (!exists) {
        queryClient.setQueryData(WISHLIST_KEY, [...previous, optimisticItem]);
      }

      return { previous };
    },
    onError: (_error, _item, context) => {
      queryClient.setQueryData(WISHLIST_KEY, context?.previous || []);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  const removeMutation = useMutation({
    mutationFn: removeWishlistItem,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData(WISHLIST_KEY) || [];
      queryClient.setQueryData(
        WISHLIST_KEY,
        previous.filter((row) => Number(row.productId) !== Number(productId)),
      );
      return { previous };
    },
    onError: (_error, _productId, context) => {
      queryClient.setQueryData(WISHLIST_KEY, context?.previous || []);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  const items = wishlistQuery.data || [];

  const value = useMemo(
    () => ({
      items,
      loading: initializing || wishlistQuery.isLoading,
      error: wishlistQuery.error,
      addItem: (item) => addMutation.mutateAsync(item),
      removeItem: (productId) => removeMutation.mutateAsync(Number(productId)),
      toggleItem: (item) => {
        const productId = Number(item.productId ?? item.product_id ?? item.id);
        const exists = items.some((row) => Number(row.productId) === productId);
        return exists ? removeMutation.mutateAsync(productId) : addMutation.mutateAsync({ ...item, productId });
      },
      hasItem: (productId) => items.some((row) => Number(row.productId) === Number(productId)),
      refreshWishlist: () => wishlistQuery.refetch(),
      mutating: addMutation.isPending || removeMutation.isPending,
    }),
    [addMutation, initializing, items, removeMutation, wishlistQuery.error, wishlistQuery.isLoading, wishlistQuery.refetch],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist harus digunakan di dalam WishlistProvider");
  return context;
}
