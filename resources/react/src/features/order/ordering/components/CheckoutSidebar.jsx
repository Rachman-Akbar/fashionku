import { useMemo, useState } from "react";
import { formatPrice } from "@/shared/utils/utils";

export function CheckoutSidebar({
  product,
  variant,
  onAddToCart,
  onWishlist,
  onChat,
  onShare,
}) {
  const [qty, setQty] = useState(1);
  const stock = Number(variant?.stock ?? product?.stock ?? 0);
  const price = Number(variant?.price ?? product?.price ?? 0);
  const image = variant?.image || product?.image || product?.thumbnail || "";
  const label = variant?.name || product?.name || "Produk";
  const subtotal = useMemo(() => price * qty, [price, qty]);

  return (
    <div className="sticky border border-gray-200 rounded-xl p-4 shadow-sm top-20">
      <h2 className="font-bold text-sm mb-4">Atur jumlah dan catatan</h2>
      <div className="flex items-center gap-3 mb-4">
        {image ? (
          <img
            src={image}
            alt={label}
            className="w-12 h-12 rounded-md object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-100" />
        )}
        <span className="text-sm text-gray-700 truncate">{label}</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center border border-gray-200 rounded-lg h-9">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            className="px-3 text-gray-300 font-bold hover:text-[#10B981]"
          >
            -
          </button>
          <input
            type="text"
            value={qty}
            readOnly
            className="w-10 text-center border-none text-sm p-0 focus:ring-0"
          />
          <button
            type="button"
            disabled={qty >= stock}
            onClick={() => setQty((value) => Math.min(stock, value + 1))}
            className="px-3 text-[#10B981] font-bold disabled:text-gray-300"
          >
            +
          </button>
        </div>
        <span className="text-sm">
          Stok: <span className="font-bold">{stock}</span>
        </span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
      </div>
      <div className="space-y-2 mb-6">
        <button
          type="button"
          disabled={!stock}
          onClick={() => onAddToCart?.(qty)}
          className="w-full bg-[#10B981] text-white font-bold py-2.5 rounded-lg hover:bg-[#059669] transition-colors disabled:bg-gray-300"
        >
          + Keranjang
        </button>
      </div>
      <div className="flex justify-around items-center text-xs font-bold text-gray-600">
        <button type="button" onClick={onChat} className="hover:text-[#10B981]">
          Chat
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <button
          type="button"
          onClick={onWishlist}
          className="hover:text-[#10B981]"
        >
          Wishlist
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <button
          type="button"
          onClick={onShare}
          className="hover:text-[#10B981]"
        >
          Share
        </button>
      </div>
    </div>
  );
}
