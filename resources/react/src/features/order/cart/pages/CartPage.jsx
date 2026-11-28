import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ProductCard } from "@/features/catalog/product/components/ProductCard";
import {
  ArrowRight,
  Heart,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Star,
  Ticket,
  Trash2,
} from "lucide-react";
import { useCart } from "@/features/order/cart/context/CartContext";
import { useWishlist } from "@/features/order/wishlist/context/WishlistContext";
import { useOrders } from "@/features/order/ordering/orderService";
import { useReviews } from "@/features/advanced/services/advancedMarketplaceService";
import OrderReviewModal from "@/features/order/review/components/OrderReviewModal";
import { CartItemRow } from "@/features/order/cart/components/CartItemRow";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import VoucherSearchSelect from "@/features/order/voucher/components/VoucherSearchSelect";
import { formatPrice } from "@/shared/utils/utils";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

const tabs = [
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "cart", label: "Cart", icon: ShoppingCart },
  { key: "order", label: "Riwayat", icon: PackageCheck },
  { key: "review", label: "Review", icon: Star },
];

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M180 385h240l-74-94-54 68-42-52-70 78Z' fill='%23d1d5db'/%3E%3Ccircle cx='235' cy='235' r='35' fill='%23d1d5db'/%3E%3C/svg%3E";

function onImageError(event) {
  event.currentTarget.src = PLACEHOLDER_SVG;
}

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
  { value: "cancelled", label: "Dibatalkan" },
];

const REVIEW_RATING_OPTIONS = [
  { value: "5", label: "5 Bintang" },
  { value: "4", label: "4 Bintang" },
  { value: "3", label: "3 Bintang" },
  { value: "2", label: "2 Bintang" },
  { value: "1", label: "1 Bintang" },
];

function getItemKey(item) {
  return `${item.productId}-${item.variantId || "default"}`;
}

function getItemAmount(item) {
  return item.price * (item.quantity || 1);
}

function sortByOption(list, sortBy) {
  const rows = [...list];
  if (sortBy === "priceHigh") return rows.sort((a, b) => (b.price || b.total || 0) - (a.price || a.total || 0));
  if (sortBy === "priceLow") return rows.sort((a, b) => (a.price || a.total || 0) - (b.price || b.total || 0));
  return rows;
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Icon size={28} className="text-slate-300" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TabNavigation({ activeTab, onChange }) {
  return (
    <div
      className="sticky z-[70] -mx-4 mb-6 bg-white px-4 pt-1 transition-[top] duration-300 ease-in-out"
      style={{ top: "var(--main-nav-offset, 96px)" }}
    >
      <div className="grid w-full grid-cols-4 border-b border-slate-200">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex min-w-0 items-center justify-center gap-1.5 border-b-2 pb-3 px-1 text-xs font-bold transition-colors sm:gap-2 sm:text-sm ${
                active
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-transparent text-slate-500 hover:text-[#10B981]"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CartSummary({ selectedItems, onCheckout, voucherCode, onVoucherCodeChange }) {
  const itemCount = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + getItemAmount(item), 0);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-slate-100 bg-white p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
          <Ticket size={16} className="text-[#10B981]" />
          Promo / Voucher
        </h4>
        <VoucherSearchSelect value={voucherCode} onChange={onVoucherCodeChange} label="Cari voucher" />
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-4">
        <h4 className="mb-4 text-sm font-bold text-slate-800">Ringkasan</h4>
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex justify-between"><span>{itemCount} barang</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Ongkir</span><span>{formatPrice(0)}</span></div>
          <div className="flex justify-between text-[#047857]"><span>Diskon</span><span>-{formatPrice(0)}</span></div>
        </div>
        <hr className="my-4 border-slate-100" />
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">Total</span>
          <span className="text-lg font-bold text-[#047857]">{formatPrice(subtotal)}</span>
        </div>
        <button
          type="button"
          disabled={!selectedItems.length}
          onClick={onCheckout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] py-3 text-sm font-bold text-white transition hover:bg-[#059669] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lanjut ke Pembayaran <ArrowRight size={16} />
        </button>
      </div>
      <p className="px-1 text-center text-[10px] text-slate-400">
        <ShieldCheck size={11} className="mr-0.5 inline align-[-1px]" />
        Transaksi aman dan terlindungi.
      </p>
    </aside>
  );
}

function CartTab({
  items,
  selectedKeys,
  onToggleAll,
  onToggleItem,
  onDecrease,
  onIncrease,
  onSetQuantity,
  onRemove,
  syncingVariantIds,
  onClear,
  onCheckout,
  voucherCode,
  onVoucherCodeChange,
}) {
  const selectedItems = items.filter((item) => selectedKeys.includes(getItemKey(item)));

  if (!items.length) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Cart kosong"
        description="Tambahkan produk agar bisa diproses ke pembayaran."
      />
    );
  }

  return (
    <div className="grid grid-cols-12 items-start gap-6">
      <div className="col-span-12 space-y-3 lg:col-span-8">
        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedKeys.length === items.length}
              onChange={onToggleAll}
              className="h-4 w-4 rounded border-slate-300 text-[#047857] focus:ring-[#10B981]"
            />
            <span className="text-sm font-semibold text-slate-700">Pilih Semua ({items.length})</span>
          </div>
          <button type="button" onClick={onClear} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600">
            <Trash2 size={14} /> Hapus
          </button>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="divide-y divide-slate-50">
            {items.map((item) => (
              <CartItemRow
                key={getItemKey(item)}
                item={item}
                checked={selectedKeys.includes(getItemKey(item))}
                onToggle={onToggleItem}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
                onSetQuantity={onSetQuantity}
                onRemove={onRemove}
                syncing={syncingVariantIds.includes(Number(item.variantId))}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <CartSummary
          selectedItems={selectedItems}
          onCheckout={onCheckout}
          voucherCode={voucherCode}
          onVoucherCodeChange={onVoucherCodeChange}
        />
      </div>
    </div>
  );
}

function WishlistTab({ items, onAddToCart, onRemoveFromWishlist }) {
  if (!items.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Wishlist kosong"
        description="Simpan produk favoritmu agar lebih mudah ditemukan."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <ProductCard
          key={`${item.productId}-${item.variantId || "default"}`}
          id={item.productId}
          productId={item.productId}
          variantId={item.variantId}
          slug={item.slug || String(item.productId)}
          image={resolveMediaUrl(item.imageUrl)}
          title={item.productName}
          price={item.price}
          stock={item.stock}
          location={item.location || ""}
          wishlistBtn
          showAddToCart
          addToCartLabel="Masukkan Cart"
          onAddToCart={() => onAddToCart(item)}
          onWishlistToggle={() => onRemoveFromWishlist(item)}
        />
      ))}
    </div>
  );
}

function OrderTab({ items, onOpen, statusFilter }) {
  const filteredItems = useMemo(() => {
    let rows = items;

    if (statusFilter) rows = rows.filter((r) => {
      const s = String(r.rawStatus || r.status || "").toLowerCase();
      return s === statusFilter;
    });
    return rows;
  }, [items, statusFilter]);

  if (!filteredItems.length) {
    return (
      <EmptyState
        icon={PackageCheck}
        title="Belum ada riwayat"
        description="Pesanan Anda akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-3">
      {filteredItems.map((item) => {
        return (
          <button
            key={item.id || item.orderId}
            type="button"
            onClick={() => onOpen?.(item.orderId || item.id)}
            className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left transition hover:border-slate-200 hover:shadow-sm active:scale-[0.995]"
          >
            <div className="flex items-start gap-3">
              {item.imageUrl ? (
                <img src={resolveMediaUrl(item.imageUrl)} alt={item.productName} className="h-12 w-12 shrink-0 rounded-xl object-cover" loading="lazy" onError={onImageError} />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  <PackageCheck size={18} className="text-slate-300" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-400">{item.id}</p>
                    <h4 className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-800">{item.productName}</h4>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.variantLabel}
                      {item.quantity ? ` x${item.quantity}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{formatPrice(item.total)}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      ["completed", "success", "paid", "settlement"].includes(item.rawStatus || item.status)
                        ? "bg-emerald-50 text-[#047857]"
                        : ["cancelled", "failed", "expired"].includes(item.rawStatus || item.status)
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-600"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-50 pt-3">
              <p className="text-[11px] text-slate-400">{item.date}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#047857]">
                Lihat <ArrowRight size={12} />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={13} className={index < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
    </div>
  );
}

function ReviewTab({ items, reviews = [], onReviewItem, onOpenProduct, ratingFilter }) {
  const reviewableItems = items.filter((item) => !item.reviewed);

  const filteredReviewable = useMemo(() => {
    if (!ratingFilter) return reviewableItems;
    return reviewableItems;
  }, [reviewableItems, ratingFilter]);

  const filteredReviews = useMemo(() => {
    if (!ratingFilter) return reviews;
    return reviews.filter((r) => String(r.rating) === ratingFilter);
  }, [reviews, ratingFilter]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Perlu Direview</h3>
            <p className="mt-1 text-xs text-slate-400">Produk dari pesanan yang sudah selesai/diterima.</p>
          </div>
          {filteredReviewable.length ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#047857]">{filteredReviewable.length} produk</span>
          ) : null}
        </div>
        {filteredReviewable.length ? (
          <div className="mt-3 divide-y divide-slate-50">
            {filteredReviewable.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3">
                {item.imageUrl ? (
                  <img src={resolveMediaUrl(item.imageUrl)} alt={item.productName} className="h-12 w-12 shrink-0 rounded-xl object-cover" loading="lazy" onError={onImageError} />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50"><PackageCheck size={16} className="text-slate-300" /></div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-sm font-bold text-slate-800">{item.productName}</h4>
                  <p className="text-[11px] text-slate-400">{item.variantLabel || "-"}</p>
                </div>
                <button type="button" onClick={() => onReviewItem?.(item)} className="flex shrink-0 items-center gap-1 rounded-xl bg-[#10B981] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#059669]">
                  <Star size={12} className="fill-white" /> Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <MessageSquareText size={24} className="mx-auto text-slate-300" />
            <p className="mt-2 text-xs font-semibold text-slate-400">Belum ada produk untuk direview</p>
          </div>
        )}
      </section>

      {filteredReviews.length ? (
        <section className="rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="text-base font-bold text-slate-800">Review Terkirim</h3>
          <div className="mt-2 divide-y divide-slate-50">
            {filteredReviews.map((review) => (
              <article key={review.id} className="group cursor-pointer py-3 first:pt-0" onClick={() => onOpenProduct?.(review)}>
                <div className="flex gap-3">
                  {review.imageUrl ? (
                    <img src={resolveMediaUrl(review.imageUrl)} alt={review.productName} className="h-10 w-10 shrink-0 rounded-lg object-cover" loading="lazy" onError={onImageError} />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"><PackageCheck size={16} className="text-slate-300" /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><Stars rating={review.rating} /><span className="text-[11px] text-slate-400">{review.date}</span></div>
                    <h4 className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-800 group-hover:text-[#047857]">{review.productName}</h4>
                    {review.content ? <p className="mt-1 line-clamp-1 text-xs text-slate-400">{review.content}</p> : null}
                    {review.media?.length ? (
                      <div className="mt-1.5 flex gap-1">
                        {review.media.map((url, i) => (
                          <img key={`${review.id}-m-${i}`} src={resolveMediaUrl(url)} className="h-8 w-8 rounded-md object-cover" loading="lazy" />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    items: cartItems,
    updateQty,
    removeItem,
    clearCart,
    addItem,
    syncingVariantIds,
    syncError,
  } = useCart();
  const { items: wishlistSource, removeItem: removeWishlistItem } = useWishlist();

  const ordersQuery = useOrders({ per_page: 50 });
  const reviewsQuery = useReviews({ per_page: 50 });

  const requestedTab = searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.key === requestedTab) ? requestedTab : "cart";
  // Tautan lama `/cart?tab=order&orderId=...` kini diarahkan ke halaman alur
  // pesanan tersendiri (`/orders/:id`, langkah 3).
  const selectedOrderId = searchParams.get("orderId");

  const [sortBy] = useState("latest");
  const [voucherCode, setVoucherCode] = useState(location.state?.voucherCode || "");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("");

  const sortedCartItems = useMemo(() => sortByOption(cartItems, sortBy), [cartItems, sortBy]);
  const wishlistItems = useMemo(() => sortByOption(wishlistSource, sortBy), [sortBy, wishlistSource]);

  const orderItems = useMemo(() => {
    const labels = { pending: "Menunggu", processing: "Diproses", shipped: "Dikirim", received: "Diterima", completed: "Selesai", rejected: "Ditolak", cancelled: "Dibatalkan" };
    return (ordersQuery.data?.data || []).map((order) => {
      const firstItem = order.items[0] || order.subOrders[0]?.items?.[0] || {};
      return {
        id: order.orderNumber,
        orderId: order.id,
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID") : "-",
        _rawDate: order.createdAt,
        storeName: "Toko",
        status: labels[order.status] || order.status,
        rawStatus: order.status,
        productName: firstItem.productName || "Pesanan",
        variantLabel: firstItem.variantLabel || firstItem.sku || "-",
        quantity: firstItem.quantity || order.items.reduce((sum, item) => sum + item.quantity, 0),
        total: order.grandTotal,
        imageUrl: firstItem.imageUrl || "",
      };
    });
  }, [ordersQuery.data?.data]);

  const reviewedReviewRows = useMemo(() => (reviewsQuery.data?.rows || []).filter((r) => r.order_item_id), [reviewsQuery.data?.rows]);
  const reviewedItemIds = useMemo(() => new Set(reviewedReviewRows.map((r) => String(r.order_item_id))), [reviewedReviewRows]);

  const reviewableItems = useMemo(() => {
    const allOrders = ordersQuery.data?.data || [];
    const reviewable = [];
    for (const order of allOrders) {
      const status = String(order.status || "").toLowerCase();
      if (!["received", "completed"].includes(status)) continue;
      const items = order.items?.length ? order.items : (order.subOrders || []).flatMap((sub) => sub.items || []);
      for (const item of items) {
        if (!item?.id) continue;
        reviewable.push({
          id: item.id,
          orderItemId: item.id,
          productId: item.productId,
          productName: item.productName || "Produk",
          variantLabel: item.variantLabel || item.sku || "-",
          imageUrl: item.imageUrl || "",
          storeName: "Toko",
          orderNumber: order.orderNumber || "-",
          reviewed: reviewedItemIds.has(String(item.id)),
        });
      }
    }
    return reviewable;
  }, [ordersQuery.data?.data, reviewedItemIds]);

  const existingReviews = useMemo(() => {
    return reviewedReviewRows.map((review) => ({
      id: review.id,
      productId: review.product_id,
      productSlug: review.product_slug || "",
      productName: review.product_name || "Produk",
      rating: Number(review.rating || 0),
      date: review.created_at ? new Date(review.created_at).toLocaleDateString("id-ID") : "-",
      content: review.review || "",
      imageUrl: resolveMediaUrl(review.product_thumbnail),
      media: Array.isArray(review.media) ? review.media : [],
    }));
  }, [reviewedReviewRows]);

  const [reviewTarget, setReviewTarget] = useState(null);
  const handleReviewSaved = () => setReviewTarget(null);

  const handleOpenProductReview = (review) => {
    const slug = review.productSlug || review.productId || "";
    if (slug) navigate(`/products/${slug}#review-${review.id}`);
  };

  const changeTab = (tab) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    if (tab !== "order") { next.delete("orderId"); }
    setSearchParams(next, { replace: true });
  };

  const openOrderDetail = (id) => {
    if (!id) return;
    navigate(`/orders/${encodeURIComponent(String(id))}`);
  };

  useEffect(() => {
    setSelectedKeys((current) => {
      const available = sortedCartItems.map(getItemKey);
      const retained = current.filter((key) => available.includes(key));
      return retained.length ? retained : available;
    });
  }, [sortedCartItems]);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const selectedItems = sortedCartItems.filter((item) => selectedKeys.includes(getItemKey(item)));
  const selectedCount = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const goCheckout = () => navigate("/checkout", { state: { cartItemIds: selectedItems.map((item) => item.cartItemId).filter(Boolean), voucherCode } });

  const handleToggleAll = () => setSelectedKeys((current) => current.length === sortedCartItems.length ? [] : sortedCartItems.map(getItemKey));
  const handleToggleItem = (itemKey) => setSelectedKeys((current) => current.includes(itemKey) ? current.filter((key) => key !== itemKey) : [...current, itemKey]);
  const handleDecrease = (item) => { const q = Math.max(1, Number(item.quantity || 1) - 1); if (q !== item.quantity) updateQty(item.productId, item.variantId, q); };
  const handleIncrease = (item) => { const q = Math.min(Number(item.stock || Infinity), Math.max(1, Number(item.quantity || 1)) + 1); if (q !== item.quantity) updateQty(item.productId, item.variantId, q); };
  const handleSetQuantity = (item, q) => { const next = Math.max(1, Math.min(Number(item.stock || Infinity), Math.floor(Number(q) || 1))); if (next !== Number(item.quantity || 0)) updateQty(item.productId, item.variantId, next); };

  if (selectedOrderId) {
    return <Navigate to={`/orders/${encodeURIComponent(selectedOrderId)}`} replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <TabNavigation activeTab={activeTab} onChange={changeTab} />

        <div className="transition-all duration-200">
          {activeTab === "wishlist" ? (
            <WishlistTab
              items={wishlistItems}
              onAddToCart={(item) => {
                addItem({ productId: item.productId, variantId: item.variantId, quantity: 1 });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onRemoveFromWishlist={(item) => removeWishlistItem(item.productId)}
            />
          ) : null}

          {activeTab === "cart" ? (
            <>
              {syncError ? <div className="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">{syncError}</div> : null}
              <CartTab
                items={sortedCartItems}
                selectedKeys={selectedKeys}
                onToggleAll={handleToggleAll}
                onToggleItem={handleToggleItem}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                onSetQuantity={handleSetQuantity}
                onRemove={(item) => removeItem(item.productId, item.variantId)}
                syncingVariantIds={syncingVariantIds}
                onClear={clearCart}
                onCheckout={goCheckout}
                voucherCode={voucherCode}
                onVoucherCodeChange={setVoucherCode}
              />
            </>
          ) : null}

          {activeTab === "order" ? (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="max-w-[180px]">
                  <SearchableSelect
                    value={orderStatusFilter}
                    onChange={setOrderStatusFilter}
                    options={ORDER_STATUS_OPTIONS}
                    placeholder="Semua status"
                    emptyText="—"
                  />
                </div>
              </div>
              <OrderTab
                items={orderItems}
                onOpen={openOrderDetail}
                statusFilter={orderStatusFilter}
              />
            </>
          ) : null}

          {activeTab === "review" ? (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="max-w-[180px]">
                  <SearchableSelect
                    value={reviewRatingFilter}
                    onChange={setReviewRatingFilter}
                    options={REVIEW_RATING_OPTIONS}
                    placeholder="Semua rating"
                    emptyText="—"
                  />
                </div>
              </div>
              <ReviewTab
                items={reviewableItems}
                reviews={existingReviews}
                onReviewItem={setReviewTarget}
                onOpenProduct={handleOpenProductReview}
                ratingFilter={reviewRatingFilter}
                onRatingFilterChange={setReviewRatingFilter}
              />
            </>
          ) : null}
        </div>

        <OrderReviewModal item={reviewTarget} open={Boolean(reviewTarget)} onClose={() => setReviewTarget(null)} onSaved={handleReviewSaved} />

        {activeTab === "cart" && sortedCartItems.length ? (
          <div className="mt-4 lg:hidden">
            <button type="button" disabled={!selectedCount} onClick={goCheckout} className="w-full rounded-2xl bg-[#10B981] py-4 text-lg font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-50">
              Bayar ({selectedCount})
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
