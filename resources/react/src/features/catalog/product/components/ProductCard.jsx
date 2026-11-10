import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, X } from "lucide-react";
import { getApiMessage } from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import { VariantSelector } from "@/features/catalog/product/components/VariantSelector";
import { getProductVariants } from "@/features/catalog/product/services/productService";
import { useCart } from "@/features/order/cart/context/CartContext";
import { useWishlist } from "@/features/order/wishlist/context/WishlistContext";
import { formatPrice } from "@/shared/utils/utils";
import { toTitleCase } from "@/shared/utils/textFormatter";

const EMPTY_VARIANTS = [];

function getVariantId(variant) {
  return Number(variant?.id ?? variant?.variant_id ?? 0);
}

function normalizeVariants(variants = EMPTY_VARIANTS) {
  if (!Array.isArray(variants)) return [];
  return variants.filter((variant) => getVariantId(variant) > 0);
}

function getVariantsFromResponse(response) {
  return normalizeVariants(
    response?.data?.data ??
      response?.data?.variants ??
      response?.data ??
      response?.variants ??
      response,
  );
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getValidStock(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;

    const number = Number(value);

    if (Number.isFinite(number) && number >= 0) {
      return number;
    }
  }

  return null;
}

function getVariantStock(variant) {
  return getValidStock(
    variant?.stock,
    variant?.stock_quantity,
    variant?.quantity,
    variant?.available_stock,
  );
}

function isVariantAvailable(variant) {
  const variantStock = getVariantStock(variant);
  return variantStock === null || variantStock > 0;
}

function getInitialVariant({ variants, defaultVariant, variantId }) {
  const rows = normalizeVariants(variants);
  const requestedId = Number(variantId || 0);
  const defaultId = getVariantId(defaultVariant);

  const requestedVariant = rows.find(
    (variant) => getVariantId(variant) === requestedId,
  );

  const matchedDefault = rows.find(
    (variant) => getVariantId(variant) === defaultId,
  );

  return (
    (requestedVariant && isVariantAvailable(requestedVariant)
      ? requestedVariant
      : null) ||
    (matchedDefault && isVariantAvailable(matchedDefault)
      ? matchedDefault
      : null) ||
    rows.find(
      (variant) => variant.is_default && isVariantAvailable(variant),
    ) ||
    rows.find(isVariantAvailable) ||
    null
  );
}

export const ProductCard = memo(function ProductCard({
  id,
  productId,
  variantId,
  variants = EMPTY_VARIANTS,
  default_variant: defaultVariant,
  slug,
  image,
  thumbnail,
  badge,
  badgeVariant = "official",
  title,
  name,
  price,
  price_label,
  discountPct,
  originalPrice,
  rating,
  sold,
  location,
  storeName,
  storeId,
  store_id: storeIdSnake,
  store,
  brand,
  stock,
  onWishlistToggle,
  showAddToCart = false,
  onAddToCart,
  addToCartLabel = "Masukkan Cart",
}) {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  const resolvedProductId = Number(productId ?? id ?? 0);
  const wishedFromStore = hasItem(resolvedProductId);
  const normalizedInitialVariants = useMemo(
    () => normalizeVariants(variants),
    [variants],
  );

  const [optimisticWished, setOptimisticWished] = useState(wishedFromStore);
  const [cartStatus, setCartStatus] = useState("idle");
  const [cartMessage, setCartMessage] = useState("");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [qty, setQty] = useState(1);
  const [availableVariants, setAvailableVariants] = useState(
    normalizedInitialVariants,
  );
  const [selectedVariant, setSelectedVariant] = useState(() =>
    getInitialVariant({
      variants: normalizedInitialVariants,
      defaultVariant,
      variantId,
    }),
  );

  const displayTitle = toTitleCase(title || name || "Produk");
  const displayPrice =
    price_label ||
    (typeof price === "string" && price.startsWith("Rp")
      ? price
      : formatPrice(price));
  const displayImage = image || thumbnail;
  const displayDiscount = discountPct || badge;
  const displayLocation =
    location || storeName || store?.name || "Official Store";
  const resolvedStoreName = toTitleCase(
    storeName || store?.name || brand || displayLocation || "Toko",
  );
  const resolvedStoreId = Number(
    storeId ?? storeIdSnake ?? store?.id ?? 0,
  );
  const promoText =
    badgeVariant === "flash" ? "Bisa COD" : "Hemat s.d 15% Pakai Bonus";
  const productHref = useMemo(() => {
    const target = slug || resolvedProductId || "#";
    return `/products/${target}`;
  }, [resolvedProductId, slug]);

  const hasVariantChoices = availableVariants.length > 0;
  const productStock = getValidStock(stock);
  const selectedVariantStock = getVariantStock(selectedVariant);
  const selectedStock = selectedVariant
    ? selectedVariantStock
    : hasVariantChoices
      ? null
      : productStock;
  const selectedOutOfStock = hasVariantChoices
    ? !selectedVariant ||
      (selectedStock !== null && selectedStock <= 0)
    : selectedStock !== null && selectedStock <= 0;
  const isAdding = cartStatus === "loading";
  const selectedPrice = normalizeNumber(selectedVariant?.price ?? price, 0);
  const selectedVariantId = getVariantId(selectedVariant) || Number(variantId || 0);

  useEffect(() => {
    setOptimisticWished(wishedFromStore);
  }, [wishedFromStore, resolvedProductId]);

  useEffect(() => {
    const normalized = normalizeVariants(variants);

    setAvailableVariants(normalized);
    setSelectedVariant(
      getInitialVariant({
        variants: normalized,
        defaultVariant,
        variantId,
      }),
    );
  }, [defaultVariant, variantId, variants]);

  useEffect(() => {
    if (cartStatus !== "success" && cartStatus !== "error") {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setCartStatus("idle");
      setCartMessage("");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [cartStatus]);

  useEffect(() => {
    if (!orderModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOrderModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [orderModalOpen]);

  useEffect(() => {
    setQty((current) => {
      if (selectedStock === null) return Math.max(1, current);
      if (selectedStock <= 0) return 1;
      return Math.min(Math.max(1, current), selectedStock);
    });
  }, [selectedStock]);

  const requireLogin = useCallback(() => {
    if (isAuthenticated) return true;

    navigate("/auth/login", {
      state: {
        from: {
          pathname: currentLocation.pathname,
          search: currentLocation.search,
        },
      },
    });

    return false;
  }, [
    currentLocation.pathname,
    currentLocation.search,
    isAuthenticated,
    navigate,
  ]);

  const handleWishlistToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!requireLogin()) return;

    const previousWished = optimisticWished;
    const nextWished = !previousWished;
    setOptimisticWished(nextWished);

    const request = onWishlistToggle
      ? onWishlistToggle({
          id: resolvedProductId,
          productId: resolvedProductId,
          variantId: Number(variantId || 0),
          wished: nextWished,
        })
      : toggleItem({
          productId: resolvedProductId,
          variantId: selectedVariantId,
          productName: displayTitle,
          storeId: resolvedStoreId,
          storeName: resolvedStoreName,
          slug,
          brand,
          price: selectedPrice,
          stock: selectedStock ?? productStock ?? 0,
          imageUrl: displayImage || "",
          location: displayLocation,
          status: "published",
        });

    Promise.resolve(request).catch(() => {
      setOptimisticWished(previousWished);
    });
  };

  const loadProductVariants = useCallback(async () => {
    let rows = normalizeVariants(availableVariants);

    if (rows.length || !resolvedProductId) return rows;

    setVariantsLoading(true);

    try {
      const response = await getProductVariants(resolvedProductId);
      rows = getVariantsFromResponse(response);
      setAvailableVariants(rows);
      return rows;
    } catch {
      return [];
    } finally {
      setVariantsLoading(false);
    }
  }, [availableVariants, resolvedProductId]);

  const goDirectCheckout = useCallback(
    (targetVariant, quantity = 1) => {
      const targetVariantId =
        getVariantId(targetVariant) || Number(variantId || 0);
      const targetStock = targetVariant
        ? getVariantStock(targetVariant)
        : productStock;
      const targetPrice = normalizeNumber(targetVariant?.price ?? price, 0);

      if (targetStock !== null && targetStock <= 0) {
        throw new Error("Stok varian yang dipilih sudah habis.");
      }

      navigate("/checkout", {
        state: {
          buyNow: true,
          directItems: [
            {
              productId: resolvedProductId,
              variantId: targetVariantId,
              productName: displayTitle,
              variantLabel: targetVariant?.name || targetVariant?.label || "",
              price: targetPrice,
              quantity,
              subtotal: targetPrice * quantity,
              stock: targetStock ?? productStock ?? 0,
              imageUrl:
                targetVariant?.image ||
                targetVariant?.image_url ||
                displayImage ||
                "",
              storeId: resolvedStoreId,
              storeName: resolvedStoreName,
            },
          ],
        },
      });
    },
    [
      displayImage,
      displayTitle,
      navigate,
      price,
      productStock,
      resolvedProductId,
      resolvedStoreId,
      resolvedStoreName,
      variantId,
    ],
  );

  const handleCardOrderAction = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!requireLogin() || variantsLoading || isAdding || buyingNow) return;

    setQty(1);
    setCartStatus("idle");
    setCartMessage("");

    const rows = await loadProductVariants();
    const targetVariant = getInitialVariant({
      variants: rows,
      defaultVariant,
      variantId,
    });
    const fallbackVariantId =
      getVariantId(targetVariant) ||
      getVariantId(defaultVariant) ||
      Number(variantId || 0);
    const hasSingleVariant =
      rows.length === 1 || (rows.length === 0 && fallbackVariantId > 0);

    setAvailableVariants(rows);
    setSelectedVariant(targetVariant);

    if (!hasSingleVariant) {
      setOrderModalOpen(true);
      return;
    }

    if (rows.length === 1 && !targetVariant) {
      setCartStatus("error");
      setCartMessage("Stok produk sedang habis.");
      return;
    }

    try {
      if (showAddToCart) {
        setCartStatus("loading");
        await addSelectedVariant(targetVariant, 1);
        setCartStatus("success");
        setCartMessage("Produk berhasil dimasukkan ke keranjang.");
        return;
      }

      setBuyingNow(true);
      goDirectCheckout(targetVariant, 1);
    } catch (error) {
      setBuyingNow(false);
      setCartStatus("error");
      setCartMessage(
        getApiMessage(error, "Produk belum dapat diproses langsung."),
      );
    }
  };

  const addSelectedVariant = useCallback(
    async (targetVariant, quantity) => {
      const targetVariantId =
        getVariantId(targetVariant) || Number(variantId || 0);
      const targetStock = targetVariant
        ? getVariantStock(targetVariant)
        : productStock;

      if (targetStock !== null && targetStock <= 0) {
        throw new Error("Stok varian yang dipilih sudah habis.");
      }

      if (targetStock !== null && quantity > targetStock) {
        throw new Error(
          `Jumlah maksimal yang dapat dipesan adalah ${targetStock}.`,
        );
      }

      const cartItem = {
        id: resolvedProductId,
        productId: resolvedProductId,
        variantId: targetVariantId,
        quantity,
      };

      if (onAddToCart) {
        await onAddToCart(cartItem);
        return;
      }

      await addItem(cartItem);
    },
    [
      addItem,
      onAddToCart,
      productStock,
      resolvedProductId,
      variantId,
    ],
  );

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!requireLogin() || isAdding || variantsLoading || selectedOutOfStock) {
      return;
    }

    if (hasVariantChoices && !selectedVariant) {
      setCartStatus("error");
      setCartMessage("Pilih varian produk terlebih dahulu.");
      return;
    }

    setCartStatus("loading");
    setCartMessage("");

    try {
      await addSelectedVariant(selectedVariant, qty);
      setCartStatus("success");
      setCartMessage("Produk berhasil dimasukkan ke keranjang.");
    } catch (error) {
      setCartStatus("error");
      setCartMessage(
        getApiMessage(error, "Produk gagal dimasukkan ke keranjang."),
      );
    }
  };

  const handleBuyNow = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!requireLogin() || buyingNow || variantsLoading || selectedOutOfStock) {
      return;
    }

    if (hasVariantChoices && !selectedVariant) {
      setCartStatus("error");
      setCartMessage("Pilih varian produk terlebih dahulu.");
      return;
    }

    try {
      setBuyingNow(true);
      setCartStatus("idle");
      setCartMessage("");
      goDirectCheckout(selectedVariant, qty);
    } catch (error) {
      setCartStatus("error");
      setCartMessage(
        getApiMessage(error, "Checkout langsung gagal diproses."),
      );
      setBuyingNow(false);
    }
  };

  const handleDecreaseQty = () => {
    setQty((current) => Math.max(1, current - 1));
  };

  const handleIncreaseQty = () => {
    setQty((current) => {
      const nextQuantity = current + 1;

      if (selectedStock === null) return nextQuantity;
      if (selectedStock <= 0) return current;

      return Math.min(nextQuantity, selectedStock);
    });
  };

  return (
    <>
      <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[4px] border border-[#e5e7eb] bg-white text-[#222222] transition hover:border-[#a7f3d0] hover:shadow-sm">
        <Link
          to={productHref}
          aria-label={`Lihat ${displayTitle}`}
          className="absolute inset-0 z-0 rounded-[4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
        />

        <div className="pointer-events-none relative z-[1] aspect-square w-full overflow-hidden rounded-[4px] bg-[#f5f5f5]">
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayTitle}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5] text-[11px] text-[#999999]">
              No Image
            </div>
          )}

          {displayDiscount ? (
            <div className="absolute left-0 top-2 z-10">
              <div className="relative rounded-r-[7px] bg-[#10B981] px-[7px] py-[3px] text-[11px] font-extrabold leading-none text-white shadow-sm">
                {displayDiscount}
                <span className="absolute -bottom-[4px] left-0 h-0 w-0 border-l-[4px] border-t-[4px] border-l-transparent border-t-[#047857]" />
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`pointer-events-auto absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition duration-150 hover:scale-105 ${
              optimisticWished
                ? "text-[#f87171]"
                : "text-[#94a3b8] hover:text-[#f87171]"
            }`}
            aria-label={
              optimisticWished
                ? "Hapus dari wishlist"
                : "Tambah ke wishlist"
            }
            aria-pressed={optimisticWished}
          >
            <Heart
              size={17}
              className={optimisticWished ? "fill-current" : ""}
            />
          </button>
        </div>

        <div className="pointer-events-none relative z-[1] flex min-h-[112px] flex-1 flex-col px-[7px] pb-[8px] pt-[7px]">
          <h4 className="block min-w-0 truncate text-[13px] font-normal leading-[17px] text-[#111111]">
            {displayTitle}
          </h4>

          <div className="mt-[4px] flex min-w-0 items-baseline gap-[4px]">
            <span className="truncate text-[15px] font-extrabold leading-[18px] text-[#111111]">
              {displayPrice}
            </span>

            {originalPrice ? (
              <span className="truncate text-[11px] leading-[14px] text-[#b7b7b7] line-through">
                {originalPrice}
              </span>
            ) : null}
          </div>

          <div className="mt-[4px] truncate text-[10px] font-bold leading-[13px] text-[#10B981]">
            {promoText}
          </div>

          <div className="mt-[3px] flex min-w-0 items-center gap-[3px]">
            <span
              className="material-symbols-outlined text-[14px] leading-none text-[#ffc400]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="min-w-0 truncate text-[12px] leading-[15px] text-[#5f6f8f]">
              {rating || "4.8"}{" "}
              {sold ? `· ${sold} terjual` : "| 10rb+ terjual"}
            </span>
          </div>

          <div className="mt-[3px] flex min-w-0 items-center gap-[3px] pr-7">
            <span
              className="material-symbols-outlined text-[14px] leading-none text-[#10B981]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="min-w-0 truncate text-[12px] leading-[15px] text-[#5f6f8f]">
              {displayLocation}
            </span>
          </div>

          {showAddToCart ? (
            <div className="pointer-events-auto mt-auto pt-3">
              <button
                type="button"
                onClick={handleCardOrderAction}
                
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#10B981] px-3 text-xs font-bold text-white transition hover:bg-[#059669]"
              >
                <ShoppingCart size={15} />
                {cartStatus === "success" ? "Ditambahkan" : cartStatus === "error" ? "Coba Lagi" : addToCartLabel}
              </button>
              {cartStatus === "error" && cartMessage ? (
                <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-red-500">
                  {cartMessage}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {!showAddToCart ? (
          <button
            type="button"
            onClick={handleCardOrderAction}
            
            className="pointer-events-auto absolute bottom-[6px] right-[4px] z-20 flex h-6 w-6 items-center justify-center text-[#8a99b5] transition hover:text-[#10B981]"
            aria-label="Atur pesanan"
          >
<ShoppingCart size={18} />
          </button>
        ) : null}
      </article>

      {orderModalOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Atur pesanan ${displayTitle}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOrderModalOpen(false);
            }
          }}
        >
          <div className="max-h-[calc(100vh-48px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {displayImage ? (
                  <img
                    src={
                      selectedVariant?.image ||
                      selectedVariant?.image_url ||
                      displayImage
                    }
                    alt={displayTitle}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
                    No Image
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-slate-900">
                    {displayTitle}
                  </h3>
                  <p className="mt-1 text-lg font-bold text-[#111111]">
                    {formatPrice(selectedPrice)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                aria-label="Tutup pengaturan pesanan"
              >
                <X size={19} />
              </button>
            </div>

            <hr className="my-5 border-slate-200" />

            {availableVariants.length > 0 ? (
              <VariantSelector
                variants={availableVariants}
                value={selectedVariant}
                onVariantChange={(variant) => {
                  setSelectedVariant(variant || null);
                  setQty(1);
                  setCartStatus("idle");
                  setCartMessage("");
                }}
              />
            ) : null}

            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700">
                  Jumlah
                </span>

                <div className="flex h-9 items-center rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={handleDecreaseQty}
                    disabled={qty <= 1}
                    className="h-full px-3 font-bold text-slate-400 transition hover:text-[#10B981] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={qty}
                    readOnly
                    className="h-full w-10 border-0 p-0 text-center text-sm font-bold focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={handleIncreaseQty}
                    disabled={
                      selectedStock !== null &&
                      (selectedStock <= 0 || qty >= selectedStock)
                    }
                    className="h-full px-3 font-bold text-[#10B981] transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-500">Stok</span>
                <span className="text-sm font-bold text-slate-700">
                  {selectedStock === null ? "-" : selectedStock}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-sm text-slate-500">Subtotal</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatPrice(selectedPrice * qty)}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={selectedOutOfStock}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 text-sm font-bold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
{selectedOutOfStock ? "Stok Habis" : "Beli Sekarang"}
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedOutOfStock}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#10B981] bg-white px-4 text-sm font-bold text-[#047857] transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <ShoppingCart size={17} />
                {selectedOutOfStock ? "Stok Habis" : "Masukkan Keranjang"}
              </button>
            </div>

            {cartMessage ? (
              <p
                className={`mt-3 text-center text-xs ${
                  cartStatus === "error" ? "text-red-500" : "text-[#047857]"
                }`}
              >
                {cartMessage}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
});
