import { useEffect, useState } from "react";
import { LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/shared/utils/utils";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

function getItemKey(item) {
  return `${item.productId}-${item.variantId || "default"}`;
}

export function CartItemRow({
  item,
  checked,
  onToggle,
  onDecrease,
  onIncrease,
  onSetQuantity,
  onRemove,
  syncing = false,
}) {
  const itemKey = getItemKey(item);
  const stock = item.stock ?? item.availableStock ?? null;
  const atMaximum = stock !== null && Number(stock) > 0 && item.quantity >= stock;
  const [draft, setDraft] = useState(String(item.quantity ?? 1));

  useEffect(() => {
    setDraft(String(item.quantity ?? 1));
  }, [item.quantity]);

  const commitQuantity = () => {
    const max = stock !== null && Number(stock) > 0 ? Number(stock) : Infinity;
    const next = Math.max(1, Math.min(max, Math.floor(Number(draft) || 1)));
    setDraft(String(next));
    if (onSetQuantity && next !== Number(item.quantity || 0)) onSetQuantity(item, next);
  };

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
            src={resolveMediaUrl(item.imageUrl || item.image)}
            alt={item.productName}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M180 385h240l-74-94-54 68-42-52-70 78Z' fill='%23d1d5db'/%3E%3Ccircle cx='235' cy='235' r='35' fill='%23d1d5db'/%3E%3C/svg%3E";
            }}
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
              <input
                type="text"
                inputMode="numeric"
                value={draft}
                onChange={(event) => setDraft(event.target.value.replace(/\D/g, ""))}
                onBlur={commitQuantity}
                onKeyDown={(event) => { if (event.key === "Enter") { event.currentTarget.blur(); } }}
                className="min-w-[54px] bg-transparent px-1 text-center text-sm font-bold tabular-nums text-[#181c1f] outline-none"
                aria-label="Jumlah"
              />
              {syncing ? (
                <LoaderCircle
                  size={13}
                  strokeWidth={2.4}
                  className="animate-spin text-[#047857]"
                  aria-hidden="true"
                />
              ) : null}
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
