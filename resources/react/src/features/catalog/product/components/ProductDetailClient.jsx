import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ImageGallery } from "@/features/catalog/product/components/ImageGallery";
import { VariantSelector } from "../components/VariantSelector";
import { ProductCheckoutPanel } from "@/features/catalog/product/components/ProductCheckoutPanel";
import { ReviewSection } from "@/features/order/review/components/ReviewSection";
import { Skeleton, SkeletonLine } from "@/shared/components/feedback/Skeleton";
import { advancedError, usePublicReviews, useStartConversation } from "@/features/advanced/services/advancedMarketplaceService";
import { useAuth } from "@/features/auth/context/AuthContext";
import { formatPrice } from "@/shared/utils/utils";
import {
  useProductBySlug,
  useProductVariants,
} from "@/features/catalog/product/services/productService";
import { getCategoryHref } from "@/features/catalog/category/services/categoryService";
import { toTitleCase } from "@/shared/utils/textFormatter";

const DETAIL_TABS = ["Detail Produk", "Panduan"];

function getProductCategories(product) {
  const categories = product?.categories || [];
  if (categories.length) return categories;
  if (product?.primary_category) return [product.primary_category];
  return [];
}

function getVariantId(variant) {
  return Number(variant?.id ?? variant?.variant_id ?? 0);
}

function getVariantStock(variant) {
  const value =
    variant?.stock ??
    variant?.stock_quantity ??
    variant?.quantity ??
    variant?.available_stock;

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isVariantAvailable(variant) {
  const stock = getVariantStock(variant);
  return stock === null || stock > 0;
}

function hasVariantOptions(variant) {
  const sources = [variant?.values, variant?.attributes, variant?.options, variant?.option_values];
  return sources.some((source) => {
    if (Array.isArray(source)) return source.some((value) => String(value?.value ?? value?.name ?? value ?? "").trim() !== "");
    if (source && typeof source === "object") return Object.values(source).some((value) => String(value?.value ?? value?.name ?? value ?? "").trim() !== "");
    return false;
  });
}

function shouldShowVariantSelector(product) {
  const variants = Array.isArray(product?.variants) ? product.variants.filter(Boolean) : [];
  if (variants.length > 1) return true;
  if (!variants.length) return false;
  const variant = variants[0];
  const name = String(variant?.name || variant?.variant_name || "").trim().toLowerCase();
  const defaultNames = new Set(["", "default", "utama", "standard", "standar"]);
  return hasVariantOptions(variant) || (!defaultNames.has(name) && !variant?.is_default);
}

function getInitialVariant(product) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const defaultId = getVariantId(product?.default_variant);
  const matchedDefault = variants.find(
    (variant) => getVariantId(variant) === defaultId,
  );

  return (
    (matchedDefault && isVariantAvailable(matchedDefault)
      ? matchedDefault
      : null) ||
    variants.find(
      (variant) => variant.is_default && isVariantAvailable(variant),
    ) ||
    variants.find(isVariantAvailable) ||
    null
  );
}

export function ProductDetailClient({ slug }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, activeRole, isAuthenticated } = useAuth();
  const startConversation = useStartConversation();
  const [chatNotice, setChatNotice] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const productQuery = useProductBySlug(slug);
  const baseProduct = productQuery.data || null;
  const variantsQuery = useProductVariants(baseProduct?.id, {
    enabled: Boolean(baseProduct?.id && !baseProduct?.variants?.length),
  });
  const reviewsQuery = usePublicReviews(baseProduct?.id, { per_page: 100 });

  const product = useMemo(() => {
    if (!baseProduct) return null;

    if (baseProduct.variants?.length || !variantsQuery.data?.data?.length) {
      return baseProduct;
    }

    const variants = variantsQuery.data.data;

    return {
      ...baseProduct,
      variants,
      default_variant:
        variants.find((variant) => variant.is_default) || variants[0] || null,
    };
  }, [baseProduct, variantsQuery.data]);

  useEffect(() => {
    setSelectedVariant(getInitialVariant(product));
  }, [product?.id, product?.variants, product?.default_variant]);

  const loading = productQuery.isLoading || variantsQuery.isLoading;
  const error =
    productQuery.error?.message || variantsQuery.error?.message || "";

  const handleVariantChange = useCallback((variant) => {
    setSelectedVariant(variant || null);
  }, []);

  const categories = useMemo(() => getProductCategories(product), [product]);
  const showVariantSelector = useMemo(() => shouldShowVariantSelector(product), [product]);
  const activePrice = Number(selectedVariant?.price ?? product?.price ?? 0);
  const selectedVariantStock = getVariantStock(selectedVariant);
  const activeStock = selectedVariant
    ? selectedVariantStock ?? "-"
    : Number(product?.stock ?? 0);
  const store = product?.store || {};
  const storeName = store.name || product?.store_name || "Toko";
  const storeLocation = [store.city, store.province]
    .filter(Boolean)
    .join(", ") || store.location || product?.location || "Marketplace Indonesia";
  const reviewRows = reviewsQuery.data?.rows || product?.reviews || [];
  const reviewTotal = Number(product?.review_count ?? product?.reviewCount ?? reviewsQuery.data?.meta?.total ?? reviewRows.length ?? 0);
  const averageRating = Number(product?.average_rating ?? product?.rating ?? reviewsQuery.data?.summary?.average ?? 0);
  const storeOwnerId = store.user_id ?? store.owner_id ?? store.seller_id;
  const ownStore = Boolean(user?.id && storeOwnerId && String(user.id) === String(storeOwnerId));

  async function handleStartChat() {
    if (!store.id) {
      setChatNotice("Toko penjual tidak ditemukan pada data produk.");
      return;
    }

    const currentUrl = `${location.pathname}${location.search}`;
    if (!isAuthenticated) {
      navigate(`/chat/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (ownStore) {
      setChatNotice("Produk ini berasal dari toko Anda sendiri.");
      return;
    }

    setChatNotice("");
    try {
      const conversation = await startConversation.mutateAsync({
        type: "store",
        store_id: Number(store.id),
        subject: `Produk: ${product.name}`,
      });
      const chatPath = activeRole === "admin" ? "/admin/chat" : activeRole === "seller" ? "/seller/chat" : "/chat";
      const draft = `Halo, saya ingin bertanya tentang produk ${product.name}.`;
      navigate(`${chatPath}?conversation=${encodeURIComponent(conversation.id)}&draft=${encodeURIComponent(draft)}`);
    } catch (error) {
      setChatNotice(advancedError(error, "Chat dengan penjual gagal dibuka."));
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-8" aria-busy="true">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <SkeletonLine className="h-3 w-2/5" />
            <SkeletonLine className="h-8 w-4/5" />
            <SkeletonLine className="h-5 w-3/5" />
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 w-32" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="text-sm text-red-500">{error}</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="text-sm text-gray-500">Produk tidak ditemukan.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-4">
      <nav className="mb-6 text-xs font-semibold text-[#10B981]">
        <div className="flex flex-wrap items-center gap-1">
          <span className="after:mx-2 after:text-gray-400 after:content-['>']">
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </span>

          {categories.slice(0, 3).map((crumb) => (
            <span
              key={crumb.id || crumb.slug || crumb.name}
              className="after:mx-2 after:text-gray-400 after:content-['>']"
            >
              <Link to={getCategoryHref(crumb)} className="hover:underline">
                {crumb.name}
              </Link>
            </span>
          ))}

          <span className="text-gray-400">{toTitleCase(product.name)}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="lg:col-span-4">
          <ImageGallery images={product.images} alt={product.name} />
        </section>

        <section className="lg:col-span-5">
          <h1 className="mb-1 text-xl font-bold leading-tight">
            {toTitleCase(product.name)}
          </h1>

          <div className="mb-4 flex items-center gap-2 text-sm">
            {!!product.sold && (
              <span className="text-gray-500">
                Terjual{" "}
                <span className="font-semibold text-gray-800">
                  {product.sold}
                </span>
              </span>
            )}

            {!!product.sold && (
              <span className="text-gray-300">•</span>
            )}

            <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({reviewTotal})</span>
              </div>
          </div>

          <div className="mb-6 text-3xl font-bold">
            {formatPrice(activePrice)}
          </div>

          <hr className="mb-6 border-gray-100" />

          {showVariantSelector ? (
            <VariantSelector
              variants={product.variants}
              value={selectedVariant}
              onVariantChange={handleVariantChange}
            />
          ) : null}

          <div className="mb-4 border-b border-gray-200">
            <div className="flex gap-8">
              {DETAIL_TABS.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
                    index === activeTab
                      ? "border-[#10B981] font-bold text-[#10B981]"
                      : "border-transparent text-gray-500 hover:text-[#10B981]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 text-sm">
            {activeTab === 0 && (
              <>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    ["Brand:", product.brand || "-"],
                    ["Stok:", activeStock],
                    ["Status:", product.status || "-"],
                    ["Kategori:", categories[0]?.name || "-"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex gap-2">
                      <span className="w-24 text-gray-500">{label}</span>
                      <span className="font-bold">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="whitespace-pre-line leading-relaxed">
                    {product.description || "Deskripsi produk belum tersedia."}
                  </p>
                </div>
              </>
            )}

            {activeTab === 1 && (
              <div className="space-y-4">
                <p className="leading-relaxed">
                  Panduan produk belum tersedia.
                </p>
              </div>
            )}

            <hr className="border-gray-100" />

            <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 font-black text-emerald-700">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={storeName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    storeName.slice(0, 1).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="truncate font-bold">
                      {toTitleCase(storeName)}
                    </span>
                    <svg
                      className="h-4 w-4 shrink-0 text-[#10B981]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>

                  <div className="truncate text-xs text-gray-500">
                    {storeLocation}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartChat}
                  disabled={startConversation.isPending || ownStore}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#10B981] px-5 text-sm font-bold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  {ownStore ? "Toko Anda" : "Chat Penjual"}
                </button>
              </div>
            </div>
            {chatNotice ? <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">{chatNotice}</p> : null}
          </div>
        </section>

        <aside className="lg:col-span-3">
          <ProductCheckoutPanel product={product} variant={selectedVariant} />
        </aside>

        <div className="lg:col-span-9">
          <ReviewSection
            reviews={reviewRows}
            summary={{ average: averageRating, total: reviewTotal }}
            loading={reviewsQuery.isLoading}
          />
        </div>
      </div>
    </main>
  );
}
