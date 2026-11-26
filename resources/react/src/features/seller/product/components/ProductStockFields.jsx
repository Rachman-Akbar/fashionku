import { memo, useMemo } from "react";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { toTitleCase } from "@/shared/utils/textFormatter";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

const MOVEMENT_LABELS = {
  inbound: "Masuk",
  outbound: "Keluar",
  adjustment: "Penyesuaian",
  release: "Pelepasan",
  reservation: "Reservasi",
  production: "Produksi",
};

const compactInput = `${inputClassName} h-10`;

export const ProductStockFields = memo(function ProductStockFields({
  mode,
  stock,
  minStock,
  maxOrderQty,
  variants,
  errors,
  onSimpleChange,
  onVariantsChange,
  onOpenStock,
  isNew = true,
  movements = [],
  movementsLoading = false,
  productId = null,
}) {
  const totals = useMemo(() => mode === "variant"
    ? variants.reduce((total, variant) => ({ stock: total.stock + Number(variant.stock || 0) }), { stock: 0 })
    : { stock: Number(stock || 0) }, [mode, stock, variants]);

  const updateSimple = (field, value) => onSimpleChange(field, value);
  const updateVariant = (index, field, value) => onVariantsChange(variants.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant));

  // Produk yang sudah tersimpan: saldo stok hanya berubah lewat menu Persediaan
  // agar setiap perubahan punya riwayat pergerakan. Produk baru: stok awal
  // diisi langsung di sini.
  const stockField = (label, row, error) => (
    <FormField label={label} error={error}>
      {isNew ? (
        <FormattedNumberInput
          min="0"
          value={row.stock ?? 0}
          onChange={(value) => (row.isSimple ? updateSimple("stock", value) : updateVariant(row.index, "stock", value))}
          className={compactInput}
          title="Stok awal saat produk dibuat"
          aria-label={`${label} ${row.name || "produk"}`}
        />
      ) : (
        <button
          type="button"
          onClick={() => onOpenStock?.(row)}
          title="Ubah stok di menu Persediaan agar tercatat sebagai pergerakan stok"
          className="flex h-10 w-full items-center justify-between gap-1.5 rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 text-sm font-extrabold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          {formatNumber(row.stock)}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      )}
    </FormField>
  );

  const minStockField = (row, error) => (
    <FormField label="Minimal stok" error={error}>
      <FormattedNumberInput
        min="0"
        value={row.minStock || 0}
        onChange={(value) => (row.isSimple ? updateSimple("minStock", value) : updateVariant(row.index, "minStock", value))}
        className={compactInput}
        title="Batas stok minimum untuk pengingat restock"
        aria-label={`Minimal stok ${row.name || "produk"}`}
      />
    </FormField>
  );

  const maxOrderField = (row, error) => (
    <FormField label="Batas order" error={error}>
      <FormattedNumberInput
        min="1"
        value={row.maxOrderQty ?? 999999}
        onChange={(value) => (row.isSimple ? updateSimple("maxOrderQty", value) : updateVariant(row.index, "maxOrderQty", value))}
        className={compactInput}
        title="Maksimal jumlah item dalam satu transaksi"
        aria-label={`Batas order ${row.name || "produk"}`}
      />
    </FormField>
  );

  return (
    <div className="space-y-4">
      <section className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-[5px]">
              <span className="material-symbols-outlined text-slate-400">warehouse</span>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Stok</h2>
            </div>
            <p className="text-xs text-slate-500">
              {isNew
                ? "Isi stok awal, minimal stok, dan batas order. Setelah tersimpan, perubahan stok tercatat sebagai pergerakan di menu Persediaan."
                : "Saldo stok diubah lewat menu Persediaan agar tercatat sebagai pergerakan. Minimal stok dan batas order bisa diubah di sini."}
            </p>
          </div>
          <div className="rounded-[8px] bg-slate-50 px-3 py-1.5 text-right ring-1 ring-inset ring-slate-200">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Tersedia marketplace</p>
            <p className="text-base font-extrabold leading-6 text-slate-900">{formatNumber(totals.stock)}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {mode === "simple" ? (
            <div className="grid gap-2.5 sm:grid-cols-3">
              {stockField(isNew ? "Stok awal" : "Stok", { isSimple: true, name: "Default", stock }, errors.stock)}
              {minStockField({ isSimple: true, name: "Default", minStock }, errors.minStock)}
              {maxOrderField({ isSimple: true, name: "Default", maxOrderQty }, errors.maxOrderQty)}
            </div>
          ) : (
            variants.map((variant, index) => (
              <div
                key={variant.id || variant.clientId || `stock-${index}`}
                className="grid gap-2.5 rounded-[8px] border border-slate-100 bg-slate-50/70 p-2.5 sm:grid-cols-2 sm:items-end lg:grid-cols-[minmax(0,190px)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
              >
                <div className="min-w-0">
                  <span className="mb-1.5 block text-xs font-extrabold text-slate-700">
                    {toTitleCase(variant.name) || `Variant ${index + 1}`}
                    {index === 0 ? <span className="ml-1.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">Default</span> : null}
                  </span>
                  <p className="truncate font-mono text-[11px] text-slate-400">{variant.sku || "-"}</p>
                </div>
                {stockField(isNew ? "Stok awal" : "Stok", { ...variant, index, name: variant.name || `Variant ${index + 1}` })}
                {minStockField({ ...variant, index, name: variant.name || `Variant ${index + 1}` })}
                {maxOrderField({ ...variant, index, name: variant.name || `Variant ${index + 1}` })}
              </div>
            ))
          )}
          {errors.variantStock ? <p className="rounded-[8px] bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{errors.variantStock}</p> : null}
        </div>
      </section>

      {productId ? (
        <section className="rounded-[10px] border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
            <div className="flex items-center gap-[5px]">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">history</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Riwayat Pergerakan Stok</h2>
            </div>
            {onOpenStock ? (
              <button type="button" onClick={() => onOpenStock?.({ name: "produk" })} className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                Buka Stock / Restock
              </button>
            ) : null}
          </div>

          {movementsLoading ? (
            <p className="px-4 py-3 text-sm text-slate-500">Memuat riwayat stok...</p>
          ) : movements.length ? (
            <div className="max-h-[45vh] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-100 text-xs font-extrabold text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Tanggal</th>
                    <th className="px-3 py-2">Tipe</th>
                    <th className="px-3 py-2">Varian</th>
                    <th className="px-3 py-2 text-right">Perubahan</th>
                    <th className="px-3 py-2 text-right">Saldo</th>
                    <th className="px-3 py-2">Referensi</th>
                    <th className="px-3 py-2">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {movements.map((row) => {
                    const delta = Number(row.quantity_delta || 0);

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/60">
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">{formatDateTime(row.occurred_at)}</td>
                        <td className="px-3 py-2 text-xs font-bold text-slate-700">{MOVEMENT_LABELS[row.type] || toTitleCase(row.type || "-")}</td>
                        <td className="px-3 py-2 text-xs text-slate-600">
                          <p className="font-bold text-slate-700">{toTitleCase(row.variant_name) || "-"}</p>
                          <p className="font-mono text-[11px] text-slate-400">{row.sku || "-"}</p>
                        </td>
                        <td className={`px-3 py-2 text-right text-sm font-extrabold ${delta < 0 ? "text-red-600" : "text-emerald-700"}`}>{delta > 0 ? "+" : ""}{formatNumber(delta)}</td>
                        <td className="px-3 py-2 text-right text-sm font-bold text-slate-700">{formatNumber(row.balance_after)}</td>
                        <td className="px-3 py-2 text-xs text-slate-500">
                          <p className="font-semibold text-slate-600">{row.reference_type || "-"}</p>
                          <p className="font-mono text-[11px] text-slate-400">{row.reference_id || ""}</p>
                        </td>
                        <td className="max-w-[220px] truncate px-3 py-2 text-xs text-slate-500" title={row.notes || ""}>{row.notes || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">Belum ada pergerakan stok untuk produk ini. Stok awal yang diisi saat produk dibuat otomatis tercatat sebagai pergerakan pertama.</p>
          )}
        </section>
      ) : null}
    </div>
  );
});
