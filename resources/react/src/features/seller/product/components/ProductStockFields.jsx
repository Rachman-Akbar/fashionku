import { memo, useMemo } from "react";
import { inputClassName } from "@/shared/components/form/FormField";
import { toTitleCase } from "@/shared/utils/textFormatter";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

const STOCK_CELL_CLASS = "inline-flex items-center gap-1.5 rounded-lg py-1 pr-1.5 pl-2 font-extrabold text-emerald-700 ring-1 ring-inset ring-emerald-200 transition-colors hover:bg-emerald-50 hover:ring-emerald-300";

export const ProductStockFields = memo(function ProductStockFields({
  mode,
  sku,
  price,
  stock,
  minStock,
  maxOrderQty,
  variants,
  errors,
  onSimpleChange,
  onVariantsChange,
  onOpenStock,
}) {
  const totals = useMemo(() => mode === "variant"
    ? variants.reduce((total, variant) => ({ stock: total.stock + Number(variant.stock || 0) }), { stock: 0 })
    : { stock: Number(stock || 0) }, [mode, stock, variants]);

  const updateSimple = (field, value) => onSimpleChange(field, value);
  const updateVariant = (index, field, value) => onVariantsChange(variants.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant));

  const stockCell = (row) => (
    <button
      type="button"
      onClick={() => onOpenStock?.(row)}
      title="Buka Stock / Restock di menu Persediaan"
      className={STOCK_CELL_CLASS}
    >
      {formatNumber(row.stock)}
      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
        <div>
          <div className="flex items-center gap-[5px]">
            <span className="material-symbols-outlined text-slate-400">warehouse</span>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Stok</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">Stok hanya sebagai informasi. Tekan angka stok untuk membuka Stock / Restock di menu Persediaan.</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-2 text-right ring-1 ring-inset ring-slate-200">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Tersedia marketplace</p>
          <p className="text-lg font-extrabold text-slate-900">{formatNumber(totals.stock)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-extrabold text-slate-600">
              <tr>
                <th className="px-4 py-3">Varian</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Minimal Stok</th>
                <th className="px-4 py-3">Batas Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {mode === "simple" ? (
                <tr className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-bold text-slate-900">Default</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{sku || "-"}</td>
                  <td className="px-4 py-3">
                    <input type="number" min="0" value={price} onChange={(event) => updateSimple("price", event.target.value)} className={inputClassName} aria-label="Harga" />
                  </td>
                  <td className="px-4 py-3">{stockCell({ name: "Default", sku, stock })}</td>
                  <td className="px-4 py-3">
                    <input type="number" min="0" value={minStock || 0} onChange={(event) => updateSimple("minStock", event.target.value)} className={inputClassName} title="Batas stok minimum untuk pengingat restock" aria-label="Minimal stok" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="1" value={maxOrderQty ?? 999999} onChange={(event) => updateSimple("maxOrderQty", event.target.value)} className={inputClassName} title="Maksimal jumlah item dalam satu transaksi" aria-label="Batas order" />
                  </td>
                </tr>
              ) : (
                variants.map((variant, index) => (
                  <tr key={variant.id || variant.clientId || `stock-${index}`} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-slate-900">{toTitleCase(variant.name) || `Variant ${index + 1}`}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{variant.sku || "-"}</td>
                    <td className="px-4 py-3">
                      <input type="number" min="0" value={variant.price} onChange={(event) => updateVariant(index, "price", event.target.value)} className={inputClassName} aria-label={`Harga ${variant.name || `variant ${index + 1}`}`} />
                    </td>
                    <td className="px-4 py-3">{stockCell({ ...variant, name: variant.name || `Variant ${index + 1}` })}</td>
                    <td className="px-4 py-3">
                      <input type="number" min="0" value={variant.minStock || 0} onChange={(event) => updateVariant(index, "minStock", event.target.value)} className={inputClassName} title="Batas stok minimum untuk pengingat restock" aria-label={`Minimal stok ${variant.name || `variant ${index + 1}`}`} />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" min="1" value={variant.maxOrderQty ?? 999999} onChange={(event) => updateVariant(index, "maxOrderQty", event.target.value)} className={inputClassName} title="Maksimal jumlah item dalam satu transaksi" aria-label={`Batas order ${variant.name || `variant ${index + 1}`}`} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {errors.variantStock ? <p className="border-t border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">{errors.variantStock}</p> : null}
      </div>
    </div>
  );
});