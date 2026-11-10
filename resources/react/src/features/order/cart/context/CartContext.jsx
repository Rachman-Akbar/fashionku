import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData } from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  getProductById,
  getProductVariants,
} from "@/features/catalog/product/services/productService";

const CartContext = createContext(null);
const CART_KEY = ["order", "cart"];
const QUANTITY_SYNC_DELAY = 180;

function resolveQuantityCap(item = {}) {
  const stock = Number(item.availableStock ?? item.stock ?? 0);
  const maxOrder = Number(item.maxOrderQty ?? 0);

  if (stock > 0 && maxOrder > 0) {
    return Math.min(stock, maxOrder);
  }
  if (stock > 0) {
    return stock;
  }

  return maxOrder > 0 ? maxOrder : 0;
}

function normalizeCartItem(item = {}) {
  const attributes =
    item.attributes && typeof item.attributes === "object"
      ? item.attributes
      : {};

  const variantLabel = Object.values(attributes).filter(Boolean).join(", ");

  return {
    cartItemId: Number(item.cart_item_id ?? item.id ?? 0),
    productId: Number(item.product_id ?? 0),
    variantId: Number(item.variant_id ?? item.product_variant_id ?? 0),
    productName: item.product_name || item.name || "Produk",
    variantLabel: item.variant_label || variantLabel || item.sku || "",
    storeId: Number(item.store_id ?? 0),
    storeName: item.store_name || "Toko",
    sku: item.sku || "",
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 0),
    subtotal: Number(item.subtotal || 0),
    stock: Number(item.stock ?? 0),
    availableStock: Number(
      item.available_stock ?? item.availableStock ?? item.stock ?? 0,
    ),
    maxOrderQty: Number(item.max_order_qty ?? item.maxOrderQty ?? 0),
    imageUrl: item.thumbnail || item.image || item.image_url || "",
    attributes,
  };
}

function normalizeCart(payload = {}) {
  const source = unwrapApiData(payload) || {};

  const rawItems = Array.isArray(source)
    ? source
    : Array.isArray(source.items)
      ? source.items
      : Array.isArray(source.cart_items)
        ? source.cart_items
        : [];

  const items = rawItems.map(normalizeCartItem);

  return {
    items,
    totalItems: Number(
      source.total_items ??
        source.totalItems ??
        items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    ),
    totalPrice: Number(
      source.total_price ??
        source.totalPrice ??
        source.subtotal ??
        items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
          0,
        ),
    ),
  };
}

function recalculateCart(cart, nextItems) {
  const items = Array.isArray(nextItems) ? nextItems : [];

  return {
    ...(cart || {}),
    items,
    totalItems: items.reduce(
      (sum, item) => sum + Math.max(0, Number(item.quantity || 0)),
      0,
    ),
    totalPrice: items.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Math.max(0, Number(item.quantity || 0)),
      0,
    ),
  };
}

async function resolveVariantId(item = {}) {
  const directVariantId = Number(
    item.variantId ?? item.variant_id ?? item.product_variant_id ?? 0,
  );

  if (directVariantId > 0) {
    return directVariantId;
  }

  const productId = Number(item.productId ?? item.product_id ?? item.id ?? 0);

  if (!productId) {
    throw new Error("Produk tidak valid karena product ID tidak ditemukan.");
  }

  try {
    const product = await getProductById(productId);
    const productVariantId = Number(
      product?.default_variant?.id ??
        product?.variants?.find((variant) => Boolean(variant.is_default))?.id ??
        product?.variants?.[0]?.id ??
        0,
    );

    if (productVariantId > 0) {
      return productVariantId;
    }
  } catch {}

  try {
    const variantsResponse = await getProductVariants(productId);
    const variants = variantsResponse?.data || [];
    const defaultVariant =
      variants.find((variant) => Boolean(variant.is_default)) ||
      variants[0] ||
      null;
    const fallbackVariantId = Number(defaultVariant?.id || 0);

    if (fallbackVariantId > 0) {
      return fallbackVariantId;
    }
  } catch {}

  throw new Error(
    "Varian produk tidak ditemukan. Silakan buka detail produk dan pilih varian terlebih dahulu.",
  );
}

async function fetchCart() {
  const response = await apiClient.get("/api/v1/order/carts");

  return normalizeCart(response.data);
}

async function addCartItem(item) {
  const variantId = await resolveVariantId(item);
  const quantity = Math.max(1, Number(item.quantity || 1));

  const response = await apiClient.post("/api/v1/order/carts/items", {
    items: [
      {
        product_variant_id: variantId,
        quantity,
      },
    ],
  });

  return response.data;
}

async function updateCartItem({ variantId, quantity }) {
  const response = await apiClient.patch(
    `/api/v1/order/carts/items/${Number(variantId)}`,
    {
      quantity: Number(quantity),
    },
  );

  return response.data;
}

async function removeCartItem(variantId) {
  const response = await apiClient.delete(
    `/api/v1/order/carts/items/${Number(variantId)}`,
  );

  return response.data;
}

async function clearRemoteCart() {
  const response = await apiClient.delete("/api/v1/order/carts");

  return response.data;
}

export function CartProvider({ children }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, initializing } = useAuth();
  const quantitySyncRef = useRef(new Map());
  const [syncingVariantIds, setSyncingVariantIds] = useState([]);
  const [syncError, setSyncError] = useState("");

  const cartQuery = useQuery({
    queryKey: CART_KEY,
    queryFn: fetchCart,
    enabled: !initializing && isAuthenticated,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      quantitySyncRef.current.forEach((entry) => {
        if (entry?.timer) window.clearTimeout(entry.timer);
      });
      quantitySyncRef.current.clear();
      setSyncingVariantIds([]);
      queryClient.removeQueries({ queryKey: CART_KEY, exact: true });
    }
  }, [initializing, isAuthenticated, queryClient]);

  useEffect(
    () => () => {
      quantitySyncRef.current.forEach((entry) => {
        if (entry?.timer) window.clearTimeout(entry.timer);
      });
      quantitySyncRef.current.clear();
    },
    [],
  );

  const synchronizeCart = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: CART_KEY,
    });
  }, [queryClient]);

  const cancelQuantitySync = useCallback((variantId) => {
    const id = Number(variantId || 0);
    const current = quantitySyncRef.current.get(id);

    if (current?.timer) {
      window.clearTimeout(current.timer);
    }

    quantitySyncRef.current.delete(id);
    setSyncingVariantIds((current) => current.filter((value) => value !== id));
  }, []);

  const flushQuantity = useCallback(
    async (variantId) => {
      const id = Number(variantId || 0);
      const entry = quantitySyncRef.current.get(id);

      if (!entry) return;

      if (entry.inFlight) {
        quantitySyncRef.current.set(id, {
          ...entry,
          needsFlush: true,
        });
        return;
      }

      const sentQuantity = Math.max(1, Number(entry.quantity || 1));
      quantitySyncRef.current.set(id, {
        ...entry,
        timer: null,
        inFlight: true,
        needsFlush: false,
      });

      try {
        await updateCartItem({ variantId: id, quantity: sentQuantity });
        setSyncError("");
      } catch (error) {
        setSyncError(getApiMessage(error, "Gagal menyinkronkan jumlah item."));
        console.warn("[cart] failed to sync quantity", error);
      }

      const latest = quantitySyncRef.current.get(id);

      if (!latest) {
        return;
      }

      const hasNewQuantity =
        Math.max(1, Number(latest.quantity || 1)) !== sentQuantity;

      if (hasNewQuantity || latest.needsFlush) {
        const nextEntry = {
          ...latest,
          inFlight: false,
          needsFlush: false,
        };
        nextEntry.timer = window.setTimeout(() => {
          flushQuantity(id);
        }, 0);
        quantitySyncRef.current.set(id, nextEntry);
        return;
      }

      quantitySyncRef.current.delete(id);
      setSyncingVariantIds((current) => current.filter((value) => value !== id));
      await queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
    [queryClient],
  );

  const updateQty = useCallback(
    (_productId, variantId, quantity) => {
      const id = Number(variantId || 0);
      const nextQuantity = Math.max(1, Number(quantity || 1));

      if (!id) {
        return Promise.reject(new Error("Varian cart tidak valid."));
      }

      queryClient.setQueryData(CART_KEY, (current) => {
        if (!current?.items) return current;

        const nextItems = current.items.map((item) => {
          if (Number(item.variantId) !== id) return item;

          const cap = resolveQuantityCap(item);
          const resolvedQuantity = cap > 0
            ? Math.min(nextQuantity, cap)
            : nextQuantity;

          return {
            ...item,
            quantity: resolvedQuantity,
            subtotal: Number(item.price || 0) * resolvedQuantity,
          };
        });

        return recalculateCart(current, nextItems);
      });

      setSyncingVariantIds((current) =>
        current.includes(id) ? current : [...current, id],
      );

      const previous = quantitySyncRef.current.get(id);

      if (previous?.timer) {
        window.clearTimeout(previous.timer);
      }

      const nextEntry = {
        quantity: nextQuantity,
        timer: null,
        inFlight: Boolean(previous?.inFlight),
        needsFlush: Boolean(previous?.inFlight),
      };

      if (!nextEntry.inFlight) {
        nextEntry.timer = window.setTimeout(() => {
          flushQuantity(id);
        }, QUANTITY_SYNC_DELAY);
      }

      quantitySyncRef.current.set(id, nextEntry);
      return Promise.resolve();
    },
    [flushQuantity, queryClient],
  );

  const addMutation = useMutation({
    mutationFn: addCartItem,
    onMutate: async (item) => {
      const variantId = Number(item.variantId ?? item.variant_id ?? item.product_variant_id ?? 0);
      const productId = Number(item.productId ?? item.product_id ?? item.id ?? 0);
      const quantity = Math.max(1, Number(item.quantity || 1));
      const previous = queryClient.getQueryData(CART_KEY);

      if (!variantId) {
        return { previous };
      }

      queryClient.setQueryData(CART_KEY, (current) => {
        const base = current || { items: [], totalItems: 0, totalPrice: 0 };
        const existing = base.items?.find((row) => Number(row.variantId) === variantId);

        if (existing) {
          const cap = resolveQuantityCap({
            ...existing,
            stock: Number(existing.stock || item.stock || 0),
            availableStock: Number(
              existing.availableStock ?? item.availableStock ?? item.stock ?? 0,
            ),
            maxOrderQty: Number(existing.maxOrderQty ?? item.maxOrderQty ?? 0),
          });
          const nextQuantity = cap > 0
            ? Math.min(cap, Number(existing.quantity || 0) + quantity)
            : Number(existing.quantity || 0) + quantity;
          const nextItems = base.items.map((row) =>
            Number(row.variantId) === variantId
              ? {
                  ...row,
                  quantity: nextQuantity,
                  subtotal: Number(row.price || item.price || 0) * nextQuantity,
                }
              : row,
          );
          return recalculateCart(base, nextItems);
        }

        const optimisticItem = {
          cartItemId: 0,
          productId,
          variantId,
          productName: item.productName || item.product_name || "Produk",
          variantLabel: item.variantLabel || item.variant_label || "",
          storeId: Number(item.storeId ?? item.store_id ?? 0),
          storeName: item.storeName || item.store_name || "Toko",
          sku: item.sku || "",
          price: Number(item.price || 0),
          quantity,
          subtotal: Number(item.price || 0) * quantity,
          stock: Number(item.stock || 0),
          imageUrl: item.imageUrl || item.image_url || item.image || "",
          attributes: item.attributes || {},
        };

        return recalculateCart(base, [...(base.items || []), optimisticItem]);
      });

      return { previous };
    },
    onError: (_error, _item, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CART_KEY, context.previous);
      }
    },
    onSettled: synchronizeCart,
  });

  const removeMutation = useMutation({
    mutationFn: async (variantId) => {
      cancelQuantitySync(variantId);
      return removeCartItem(variantId);
    },
    onMutate: async (variantId) => {
      const id = Number(variantId || 0);
      const previous = queryClient.getQueryData(CART_KEY);

      queryClient.setQueryData(CART_KEY, (current) => {
        if (!current?.items) return current;
        return recalculateCart(
          current,
          current.items.filter((item) => Number(item.variantId) !== id),
        );
      });

      return { previous };
    },
    onError: (_error, _variantId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CART_KEY, context.previous);
      }
    },
    onSettled: synchronizeCart,
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      quantitySyncRef.current.forEach((entry) => {
        if (entry?.timer) window.clearTimeout(entry.timer);
      });
      quantitySyncRef.current.clear();
      return clearRemoteCart();
    },
    onSuccess: synchronizeCart,
  });

  const cart = cartQuery.data || {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };

  const value = useMemo(
    () => ({
      items: cart.items,
      subtotal: cart.totalPrice,
      totalItems: cart.totalItems,
      loading: initializing || cartQuery.isLoading,
      error: cartQuery.error,
      addItem: (item) => addMutation.mutateAsync(item),
      updateQty,
      removeItem: (_productId, variantId) =>
        removeMutation.mutateAsync(variantId),
      clearCart: () => clearMutation.mutateAsync(),
      refreshCart: () => cartQuery.refetch(),
      syncingVariantIds,
      syncError,
      mutating:
        addMutation.isPending ||
        removeMutation.isPending ||
        clearMutation.isPending,
    }),
    [
      addMutation,
      cart.items,
      cart.totalItems,
      cart.totalPrice,
      cartQuery.error,
      cartQuery.isLoading,
      cartQuery.refetch,
      clearMutation,
      initializing,
      removeMutation,
      syncingVariantIds,
      syncError,
      updateQty,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }

  return context;
}
