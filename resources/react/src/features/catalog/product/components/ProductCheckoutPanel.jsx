import { useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { formatPrice } from "@/shared/utils/utils";
import { useCart } from "@/features/order/cart/context/CartContext";
import { useWishlist } from "@/features/order/wishlist/context/WishlistContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getApiMessage } from "@/core/utils/apiClient";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

export function ProductCheckoutPanel({
  product,
  variant,
}) {
  const [qty, setQty] = useState(1);
  const addCartPendingRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  const { addItem } = useCart();

  const {
    toggleItem,
    hasItem,
    mutating: wishlistMutating,
  } = useWishlist();

  const activeVariant =
    variant ||
    product?.default_variant ||
    null;

  const hasVariants =
    Array.isArray(product?.variants) &&
    product.variants.length > 0;

  const variantId = Number(
    activeVariant?.id ||
      activeVariant?.variant_id ||
      0,
  );

  const productId = Number(product?.id || 0);

  const price = Number(
    activeVariant?.price ||
      product?.price ||
      0,
  );

  const stock = Number(
    activeVariant?.stock ??
      product?.stock ??
      0,
  );

  const image =
    product?.image ||
    product?.thumbnail;

  const variantName =
    activeVariant?.name ||
    product?.name ||
    "Produk";

  const wished = hasItem(productId);

  const requireLogin = () => {
    if (isAuthenticated) {
      return true;
    }

    navigate("/auth/login", {
      state: {
        from: {
          pathname: location.pathname,
          search: location.search,
        },
      },
    });

    return false;
  };

  const handleAddCart = async () => {
    if (!requireLogin()) {
      return;
    }

    if (hasVariants && !variantId) {
      toastError("Tambah ke Keranjang", "Pilih varian produk terlebih dahulu.");
      return;
    }

    if (addCartPendingRef.current) {
      return;
    }

    try {
      addCartPendingRef.current = true;

      await addItem({
        productId,
        variantId,
        quantity: qty,
        productName: product?.name || "Produk",
        variantLabel: activeVariant?.name || "",
        price,
        stock,
        imageUrl: image || "",
        storeId: Number(product?.store_id || product?.store?.id || 0),
        storeName: product?.store_name || product?.store?.name || product?.brand || "Toko",
      });

      toastSuccess("Keranjang", "Produk berhasil ditambahkan ke keranjang.");
    } catch (error) {
      toastError("Keranjang", getApiMessage(error, "Produk gagal ditambahkan ke keranjang."));
    } finally {
      addCartPendingRef.current = false;
    }
  };

  const handleBuyNow = () => {
    if (!requireLogin()) {
      return;
    }

    if (hasVariants && !variantId) {
      toastError("Checkout", "Pilih varian produk terlebih dahulu.");
      return;
    }

    try {
      navigate("/checkout", {
        state: {
          buyNow: true,
          directItems: [
            {
              productId,
              variantId,
              productName:
                product?.name || "Produk",
              variantLabel:
                activeVariant?.name || "",
              price,
              quantity: qty,
              subtotal: price * qty,
              stock,
              imageUrl: image || "",
              storeId: Number(
                product?.store_id ||
                  product?.store?.id ||
                  0,
              ),
              storeName:
                product?.store_name ||
                product?.store?.name ||
                product?.brand ||
                "Toko",
            },
          ],
        },
      });
    } catch (error) {
      toastError("Checkout", getApiMessage(error, "Checkout langsung gagal diproses."));
    }
  };

  const handleWishlist = async () => {
    if (!requireLogin()) {
      return;
    }

    try {
      await toggleItem({
        productId,
        variantId,
        productName: product?.name || "Produk",
        storeId: Number(product?.store_id || product?.store?.id || 0),
        storeName: product?.store_name || product?.store?.name || product?.brand || "Toko",
        slug: product?.slug || String(productId),
        brand: product?.brand || "",
        price,
        stock,
        imageUrl: image || "",
        status: product?.status || "published",
      });
    } catch (error) {
      toastError("Wishlist", getApiMessage(error, "Wishlist gagal diperbarui."));
    }
  };

  return (
    <div className="sticky top-20 rounded-xl border border-gray-200 p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-bold">
        Atur jumlah dan catatan
      </h2>

      <div className="mb-4 flex items-center gap-3">
        <img
          src={image}
          alt={variantName}
          className="h-12 w-12 rounded-md object-cover"
        />

        <span className="truncate text-sm text-gray-700">
          {variantName}
        </span>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 items-center rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() =>
              setQty((current) =>
                Math.max(1, current - 1),
              )
            }
            className="px-3 font-bold text-gray-300 hover:text-[#10B981]"
          >
            -
          </button>

          <input
            type="text"
            value={qty}
            readOnly
            className="w-10 border-none p-0 text-center text-sm focus:ring-0"
          />

          <button
            type="button"
            onClick={() =>
              setQty((current) =>
                stock
                  ? Math.min(stock, current + 1)
                  : current + 1,
              )
            }
            className="px-3 font-bold text-[#10B981]"
          >
            +
          </button>
        </div>

        <span className="text-sm">
          Stok:{" "}
          <span className="font-bold">
            {stock}
          </span>
        </span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Subtotal
        </span>

        <span className="text-lg font-bold">
          {formatPrice(price * qty)}
        </span>
      </div>

      <div className="mb-6 space-y-2">
        <button
          type="button"
          disabled={!stock}
          onClick={handleBuyNow}
          className="w-full rounded-lg bg-[#10B981] py-2.5 font-bold text-white transition-colors hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Beli Sekarang
        </button>

        <button
          type="button"
          disabled={!stock}
          onClick={handleAddCart}
          className="w-full rounded-lg border border-[#10B981] bg-white py-2.5 font-bold text-[#047857] transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          + Keranjang
        </button>
      </div>

      <div className="flex items-center justify-around text-xs font-bold">
        <button
          type="button"
          className="flex items-center gap-1.5 text-gray-600 hover:text-[#10B981]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>

          Chat
        </button>

        <div className="h-4 w-px bg-gray-200" />

        <button
          type="button"
          aria-busy={wishlistMutating}
          onClick={handleWishlist}
          className={`flex items-center gap-1.5 transition-colors ${
            wished
              ? "text-[#f87171]"
              : "text-gray-600 hover:text-[#f87171]"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>

          Wishlist
        </button>

        <div className="h-4 w-px bg-gray-200" />

        <button
          type="button"
          className="flex items-center gap-1.5 text-gray-600 hover:text-[#10B981]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>

          Share
        </button>
      </div>
    </div>
  );
}