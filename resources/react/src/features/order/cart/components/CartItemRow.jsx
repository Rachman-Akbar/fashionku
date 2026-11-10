import { LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/shared/utils/utils";

function getItemKey(item) {
  return `${item.productId}-${item.variantId || "default"}`;
}

export function CartItemRow({
  item,
  checked,
  onToggle,
  onDecrease,
  onIncrease,
  onRemove,
  syncing = false,
}) {
  const itemKey = getItemKey(item);
  const stock = item.stock ?? item.availableStock ?? null;
  const atMaximum = stock !== null && Number(stock) > 0 && item.quantity >= stock;

  return (
    <div className="flex gap-4 py-4 group">
      <div className="flex items-start pt-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(itemKey)}
          className="h-5 w-5 rounded border-[#6d7b6e] text-[#047857] focus:ring-[#10B981]"
        />
      </div>

      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#f1f4f8]">
        {item.imageUrl || item.image ? (
          <img
            src={item.imageUrl || item.image}
            alt={item.productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#8b9490]">
            <ShoppingBag size={32} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-[#181c1f]">
            {item.productName}
          </h3>
          <p className="mt-1 text-sm leading-5 text-[#5f5e5e]">
            Variant: {item.variantLabel || "Default"}
          </p>
          {stock !== null && stock <= 3 ? (
            <span className="mt-1 inline-block text-xs font-bold text-[#ba1a1a]">
              Sisa {stock} stok
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <span className="text-xl font-bold leading-6 text-[#047857]">
            {formatPrice(item.price)}
          </span>

          <div className="flex items-center gap-3">
            <div
              className="flex h-10 items-center overflow-hidden rounded-xl border border-[#d9e1db] bg-white shadow-sm transition-shadow duration-150 focus-within:ring-2 focus-within:ring-emerald-100"
            >
              <button
                type="button"
                onClick={() => onDecrease(item)}
                className="flex h-full w-10 touch-manipulation items-center justify-center text-[#065F46] transition-all duration-150 hover:bg-emerald-50 active:scale-90 active:bg-emerald-100"
                aria-label="Kurangi jumlah"
              >
                <Minus size={16} strokeWidth={2.4} />
              </button>
              <span className="flex min-w-[54px] items-center justify-center gap-1 px-2 text-center text-sm font-bold tabular-nums text-[#181c1f] transition-all duration-150">
{item.quantity}
                {syncing ? (
                  <LoaderCircle
                    size={13}
                    strokeWidth={2.4}
                    className="animate-spin text-[#047857]"
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              <button
                type="button"
                disabled={atMaximum}
                onClick={() => onIncrease(item)}
                className="flex h-full w-10 touch-manipulation items-center justify-center text-[#065F46] transition-all duration-150 hover:bg-emerald-50 active:scale-90 active:bg-emerald-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                aria-label="Tambah jumlah"
              >
                <Plus size={16} strokeWidth={2.4} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item)}
              className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl text-[#ba1a1a] transition-all duration-150 hover:bg-[#ffdad6] active:scale-90"
              aria-label="Hapus dari cart"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden shrink-0 text-right md:block">
        <p className="text-sm font-bold text-[#181c1f]">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
