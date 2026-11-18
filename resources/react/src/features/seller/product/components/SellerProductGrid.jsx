import { memo } from "react";
import { formatPrice } from "@/shared/utils/utils";
import { StatusBadge } from "@/shared/components/feedback/StatusBadge";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { toTitleCase } from "@/shared/utils/textFormatter";

export const SellerProductGrid = memo(function SellerProductGrid({
  rows = [],
  onEdit,
  onToggleActive,
  pendingId,
  selectionEnabled = false,
  selectedIds = new Set(),
  onToggleRow,
}) {
  if (!rows.length) return null;

  return (
    <div className="grid grid-cols-2 gap-[5px] p-[2px] sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {rows.map((product) => {
        const inactive = isInactiveRow(product);
        const lowStock = product.minStock > 0 && Number(product.stock) <= Number(product.minStock);
        const selected = selectedIds.has(String(product.id));

        return (
          <div
            key={product.id}
            onClick={() => onEdit?.(product)}
            className={`group relative flex cursor-pointer flex-col overflow-hidden bg-white ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md ${
              inactive ? "opacity-60 saturate-50" : ""
            }`}
            title="Klik untuk edit"
          >
            {selectionEnabled ? (
              <label
                className="absolute left-1.5 top-1.5 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[6px] bg-white/90 shadow-sm ring-1 ring-slate-200"
                onClick={(event) => event.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggleRow?.(product.id)}
                  className="h-3.5 w-3.5 accent-emerald-600"
                  aria-label={`Pilih ${product.name}`}
                />
              </label>
            ) : null}

            <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
              {product.thumbnail ? (
                <img src={product.thumbnail} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-[32px]">image</span>
                </div>
              )}
              {lowStock ? (
                <span className="absolute left-1.5 bottom-1.5 inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                  <span className="material-symbols-outlined text-[12px]">priority_high</span>Restock
                </span>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1 p-2.5">
              <p className="truncate text-sm font-extrabold text-slate-900">{toTitleCase(product.name)}</p>
              <p className="truncate text-[11px] text-slate-500">
                {product.sku || "SKU otomatis"}
                {product.mode === "variant" ? ` · ${(product.variants || []).length} variant` : ""}
              </p>
              <div className="mt-0.5 flex items-center justify-between gap-1">
                <span className="truncate text-sm font-extrabold text-slate-800">{formatPrice(product.price)}</span>
                <span className="shrink-0 text-[11px] font-bold text-slate-500">
                  Stok {Number(product.stock || 0).toLocaleString("id-ID")}
                </span>
              </div>
              {product.poStock > 0 ? (
                <p className="text-[11px] font-bold text-amber-600">PO {product.poStock.toLocaleString("id-ID")}</p>
              ) : null}
              <div className="mt-1 flex items-center justify-between gap-1 border-t border-slate-100 pt-1.5">
                <StatusBadge status={product.status} />
                <div onClick={(event) => event.stopPropagation()}>
                  <InlineActiveSwitch
                    checked={product.isActive}
                    disabled={pendingId === product.id}
                    onChange={(checked) => onToggleActive?.(product, checked)}
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
