import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { advancedError, useProductCosting, useRawMaterials, useSaveProductCosting } from "@/features/advanced/services/advancedMarketplaceService";
import { Button } from "@/shared/components/ui/Button";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { useFormDirty } from "@/shared/hooks/useFormDirty";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const DEFAULT_COSTING = { materials: [], labor_cost: 0, overhead_cost: 0, other_cost: 0, margin_percent: 30, selling_price: 0, apply_to_variants: false };

const COSTING_NUMERIC_KEYS = ["quantity", "labor_cost", "overhead_cost", "other_cost", "margin_percent", "selling_price"];

const compactInput = `${inputClassName} h-10`;

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function qty(value) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 4 }).format(Number(value || 0));
}

function SectionHeader({ icon, title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-[5px]">
          <span className="material-symbols-outlined text-slate-400">{icon}</span>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">{title}</h2>
        </div>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-1.5">{action}</div> : null}
    </div>
  );
}

function Readout({ label, value, tone = "" }) {
  return (
    <div className="rounded-[8px] bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className={`truncate text-sm font-extrabold ${tone || "text-slate-900"}`}>{value}</p>
    </div>
  );
}

export const ProductCostingFields = forwardRef(function ProductCostingFields({ productId, value, onChange, onDirtyChange, onCreateRawMaterial, draftCosting = null, onStateChange, variants = [], mode = "simple", simplePrice = 0, simpleSku = "", onApplyPrice }, ref) {
  const createMode = !productId && typeof onChange === "function";
  const materialsQuery = useRawMaterials({ per_page: 100 });
  const costingQuery = useProductCosting(productId, Boolean(productId));
  const save = useSaveProductCosting();
  const [form, setForm] = useState(DEFAULT_COSTING);
  const [baseline, setBaseline] = useState(DEFAULT_COSTING);
  const data = costingQuery.data || {};
  const hasLoadedCosting = Boolean(data.costing) || (data.materials && data.materials.length > 0);

  useEffect(() => {
    if (createMode || (!data.costing && !data.materials)) return;
    const loaded = {
      materials: (data.materials || []).map((row) => ({ raw_material_id: row.raw_material_id, quantity: row.quantity })),
      labor_cost: data.costing?.labor_cost || 0,
      overhead_cost: data.costing?.overhead_cost || 0,
      other_cost: data.costing?.other_cost || 0,
      margin_percent: data.costing?.margin_percent || 30,
      selling_price: data.costing?.selling_price || 0,
      apply_to_variants: false,
    };
    // Draft dari tab editor (kalau ada) dipulihkan di atas data server supaya
    // perubahan HPP yang belum disimpan tidak hilang saat pindah tab.
    setForm(draftCosting ? { ...loaded, ...draftCosting } : loaded);
    setBaseline(loaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createMode, data.costing, data.materials]);

  const activeForm = useMemo(() => (createMode ? { ...DEFAULT_COSTING, ...(value || {}) } : form), [createMode, form, value]);
  const dirty = useFormDirty(baseline, activeForm, { numericKeys: COSTING_NUMERIC_KEYS });

  function updateForm(updater) {
    if (createMode) {
      onChange(typeof updater === "function" ? updater(activeForm) : updater);
      return;
    }
    setForm(updater);
  }

  // Perhitungan biaya & harga harus dihitung lebih dulu sebelum dipakai hook
  // lain (dependency array React dievaluasi saat render, jadi urutan deklarasi
  // ini penting agar tidak kena "Cannot access before initialization").
  const materialOptions = materialsQuery.data?.rows || [];
  const activeMaterialOptions = useMemo(
    () => materialOptions.filter((item) => item.is_active !== false),
    [materialOptions],
  );
  const materialCost = useMemo(() => activeForm.materials.reduce((sum, row) => {
    const material = materialOptions.find((item) => Number(item.id) === Number(row.raw_material_id));
    return sum + Number(row.quantity || 0) * Number(material?.average_cost || 0);
  }, 0), [activeForm.materials, materialOptions]);
  const hpp = materialCost + Number(activeForm.labor_cost || 0) + Number(activeForm.overhead_cost || 0) + Number(activeForm.other_cost || 0);
  const suggested = hpp * (1 + Number(activeForm.margin_percent || 0) / 100);
  const applyToAll = Boolean(activeForm.apply_to_variants);
  const sellingValue = Number(activeForm.selling_price || 0);
  // Harga di tab HPP hanyalah saran. Harga jual baru berubah saat opsi
  // "jadikan harga saran sebagai harga jual" dicentang.
  const effectiveSellingPrice = sellingValue > 0 ? sellingValue : Math.round(suggested);

  useEffect(() => {
    if (createMode) return;
    onDirtyChange?.(dirty);
  }, [createMode, dirty, onDirtyChange]);

  useEffect(() => {
    if (createMode) return;
    onStateChange?.(activeForm);
  }, [activeForm, createMode, onStateChange]);

  // Sinkron ke tab Variant/Umum: begitu opsi diterapkan, harga jual produk
  // (tanpa variant) atau semua harga variant ikut memakai nilai saran ini.
  useEffect(() => {
    if (!applyToAll || effectiveSellingPrice <= 0) return;
    onApplyPrice?.(effectiveSellingPrice);
  }, [applyToAll, effectiveSellingPrice, onApplyPrice]);

  const variantPriceRange = useMemo(() => {
    const prices = (variants || []).map((variant) => Number(variant.price || 0)).filter((price) => price > 0);

    if (!prices.length) return null;

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max, uniform: min === max };
  }, [variants]);

  const pricePreviewRows = useMemo(() => {
    if (mode === "variant" && variants.length) {
      return variants.map((variant, index) => ({
        key: variant.clientId || variant.id || `variant-${index}`,
        label: toTitleCase(variant.name) || `Variant ${index + 1}`,
        sku: variant.sku || "-",
        current: Number(variant.price || 0),
      }));
    }

    return [{ key: "default", label: "Tanpa variant", sku: simpleSku || "-", current: Number(simplePrice || 0) }];
  }, [mode, simplePrice, simpleSku, variants]);

  const pricesAlreadyMatch = useMemo(
    () => effectiveSellingPrice > 0
      && pricePreviewRows.length > 0
      && pricePreviewRows.every((row) => Number(row.current) === Number(effectiveSellingPrice)),
    [effectiveSellingPrice, pricePreviewRows],
  );

  function toggleApplyPrice(checked) {
    const suggestedWhole = Math.round(suggested);
    const currentSelling = Number(activeForm.selling_price || 0);
    const nextSelling = currentSelling > 0 ? currentSelling : suggestedWhole;

    if (checked && nextSelling <= 0) {
      toastError("Harga jual belum ada", "Isi biaya resep/margin HPP atau harga jual saran terlebih dahulu.");
      return;
    }

    updateForm((current) => ({
      ...current,
      apply_to_variants: checked,
      selling_price: checked ? (Number(current.selling_price || 0) || suggestedWhole) : current.selling_price,
    }));

    if (checked) onApplyPrice?.(nextSelling);
  }

  function hasContent(current) {
    const hasMaterials = (current.materials || []).some((row) => String(row.raw_material_id || "").trim() !== "");
    const hasVariableCost = [current.labor_cost, current.overhead_cost, current.other_cost].some((value) => Number(value || 0) > 0);
    return hasMaterials || hasVariableCost || String(current.selling_price || "").trim() !== "";
  }

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (createMode || !productId) return true;
      if (!hasLoadedCosting && !hasContent(activeForm)) return true;
      const rows = activeForm.materials.filter((row) => String(row.raw_material_id || "").trim() !== "");
      const ids = rows.map((row) => Number(row.raw_material_id));
      if (ids.length !== new Set(ids).size) {
        toastError("Bahan baku duplikat", "Bahan baku yang sama tidak boleh dipilih lebih dari satu kali.");
        return false;
      }
      if (rows.some((row) => Number(row.quantity || 0) <= 0)) {
        toastError("Jumlah pemakaian tidak valid", "Jumlah pemakaian setiap bahan baku harus lebih besar dari nol.");
        return false;
      }
      try {
        await save.mutateAsync({ productId, values: { ...activeForm, materials: rows, selling_price: Number(activeForm.selling_price || suggested) } });
        toastSuccess("HPP dan harga jual tersimpan", "HPP dan harga jual berhasil disimpan menggunakan biaya bahan baku terbaru dari database.");
        costingQuery.refetch();
        return true;
      } catch (error) {
        toastError("HPP gagal disimpan", advancedError(error));
        return false;
      }
    },
  }), [activeForm, costingQuery, createMode, hasLoadedCosting, productId, save, suggested]);

  if (!productId && !createMode) return <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Simpan produk terlebih dahulu. Setelah produk memiliki ID, tab HPP dapat digunakan.</div>;

  function updateMaterial(index, field, fieldValue) {
    updateForm((current) => ({ ...current, materials: current.materials.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: fieldValue } : row) }));
  }

  /**
   * Satu bahan baku hanya boleh muncul sekali pada resep. Kalau bahan yang
   * sudah dipakai dipilih lagi, kuantitasnya yang bertambah (bukan membuat
   * baris baru), sehingga HPP tidak terhitung ganda.
   */
  function selectMaterial(index, rawMaterialId) {
    const selectedId = String(rawMaterialId || "").trim();

    if (!selectedId) {
      updateMaterial(index, "raw_material_id", "");
      return;
    }

    const duplicateIndex = activeForm.materials.findIndex(
      (row, rowIndex) => rowIndex !== index && String(row.raw_material_id || "") === selectedId,
    );

    if (duplicateIndex < 0) {
      updateMaterial(index, "raw_material_id", selectedId);
      return;
    }

    const mergedQuantity = Number(activeForm.materials[duplicateIndex].quantity || 0)
      + Number(activeForm.materials[index].quantity || 0);

    updateForm((current) => ({
      ...current,
      materials: current.materials
        .map((row, rowIndex) => (rowIndex === duplicateIndex ? { ...row, quantity: mergedQuantity } : row))
        .filter((_, rowIndex) => rowIndex !== index),
    }));

    toastSuccess(
      "Jumlah bahan digabung",
      "Bahan baku yang sama sudah ada di resep, jadi jumlah pemakaiannya yang ditambahkan.",
    );
  }

  function addMaterialRow() {
    updateForm((current) => {
      if ((current.materials || []).some((row) => !String(row.raw_material_id || "").trim())) {
        return current;
      }

      return { ...current, materials: [...(current.materials || []), { raw_material_id: "", quantity: 1 }] };
    });
  }

  function optionsForRow(index) {
    const usedIds = new Set(
      activeForm.materials
        .map((row, rowIndex) => (rowIndex === index ? "" : String(row.raw_material_id || "")))
        .filter(Boolean),
    );

    return activeMaterialOptions
      .filter((item) => !usedIds.has(String(item.id)))
      .map((item) => ({
        value: String(item.id),
        label: `${item.code} - ${item.name}`,
        keywords: `${item.code || ""} ${item.name || ""} ${item.unit || ""}`,
      }));
  }

  return (
    <div className="space-y-3">
      <section className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200">
        <SectionHeader
          icon="layers"
          title="Resep Bahan Baku"
          description="Biaya satuan dikunci dari average cost bahan baku aktual. Satu bahan hanya bisa dipilih sekali; memilih bahan yang sama akan menambah quantity-nya."
          action={(
            <>
              <Button type="button" size="sm" variant="outline" onClick={() => onCreateRawMaterial?.()}>Bahan Baru</Button>
              <Button type="button" size="sm" variant="outline" onClick={addMaterialRow}>Tambah Bahan</Button>
            </>
          )}
        />


        <div className="mt-2.5">
          <div className="hidden gap-1.5 px-2.5 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400 sm:grid sm:grid-cols-[minmax(0,1fr)_110px_130px_130px_56px]">
            <span>Bahan Baku</span>
            <span className="text-right">Jumlah</span>
            <span>Biaya Satuan</span>
            <span>Stok</span>
            <span className="sr-only">Aksi</span>
          </div>

          <div className="space-y-1.5">
            {activeForm.materials.map((row, index) => {
              const material = materialOptions.find((item) => Number(item.id) === Number(row.raw_material_id));
              return (
                <div key={`${row.raw_material_id}-${index}`} className="grid gap-1.5 rounded-[8px] border border-slate-100 bg-slate-50/60 p-2 sm:grid-cols-[minmax(0,1fr)_110px_130px_130px_56px] sm:items-center">
                  <SearchableSelect
                    value={row.raw_material_id}
                    onChange={(nextValue) => selectMaterial(index, nextValue)}
                    options={optionsForRow(index)}
                    placeholder="Pilih bahan baku"
                    searchPlaceholder="Cari kode atau nama bahan"
                    emptyText="Semua bahan baku aktif sudah dipakai pada resep"
                    buttonClassName="h-10"
                    clearable
                  />
                  <FormattedNumberInput decimal step="0.0001" min="0.0001" value={row.quantity} onChange={(value) => updateMaterial(index, "quantity", value)} className={compactInput} aria-label="Jumlah pemakaian" />
                  <div className="flex h-10 items-center rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700">{money(material?.average_cost || 0)}</div>
                  <div className="flex h-10 items-center rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500">Stok {qty(material?.stock || 0)} {material?.unit || ""}</div>
                  <button
                    type="button"
                    onClick={() => updateForm((current) => ({ ...current, materials: current.materials.filter((_, rowIndex) => rowIndex !== index) }))}
                    className="flex h-10 w-full items-center justify-center rounded-[8px] text-red-600 hover:bg-red-50 sm:w-14"
                    aria-label="Hapus bahan"
                    title="Hapus bahan"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              );
            })}
            {!activeForm.materials.length ? (
              <p className="border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">Belum ada bahan baku pada resep. Klik “Tambah Bahan” untuk memilih bahan, atau “Bahan Baru” untuk membuat bahan baku baru.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200">
        <SectionHeader icon="calculate" title="Biaya & Harga Jual" description="HPP dihitung otomatis dari resep di atas, lalu dikalikan margin untuk saran harga jual." />

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Tenaga Kerja">
            <FormattedNumberInput min="0" value={activeForm.labor_cost} onChange={(value) => updateForm((current) => ({ ...current, labor_cost: value }))} className={compactInput} placeholder="0" />
          </FormField>
          <FormField label="Overhead">
            <FormattedNumberInput min="0" value={activeForm.overhead_cost} onChange={(value) => updateForm((current) => ({ ...current, overhead_cost: value }))} className={compactInput} placeholder="0" />
          </FormField>
          <FormField label="Biaya Lain">
            <FormattedNumberInput min="0" value={activeForm.other_cost} onChange={(value) => updateForm((current) => ({ ...current, other_cost: value }))} className={compactInput} placeholder="0" />
          </FormField>
          <FormField label="Margin %">
            <FormattedNumberInput decimal min="0" step="0.01" value={activeForm.margin_percent} onChange={(value) => updateForm((current) => ({ ...current, margin_percent: value }))} className={compactInput} placeholder="0" />
          </FormField>
        </div>

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Readout label="Biaya Bahan" value={money(materialCost)} />
          <Readout label="Modal / HPP" value={money(hpp)} />
          <FormField label="Harga jual (saran)">
            <FormattedNumberInput min="0" value={activeForm.selling_price} onChange={(value) => updateForm((current) => ({ ...current, selling_price: value }))} className={compactInput} placeholder={String(Math.round(suggested))} />
          </FormField>
          <Readout label="Saran HPP + margin" value={money(suggested)} tone="text-emerald-700" />
        </div>

        <label className="mt-2.5 flex items-start gap-2 rounded-[8px] border border-slate-200 bg-slate-50 p-2.5">
          <input type="checkbox" checked={applyToAll} onChange={(event) => toggleApplyPrice(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <span className="text-xs">
            <span className="block font-extrabold text-slate-700">Jadikan harga saran sebagai harga jual</span>
            <span className="block font-semibold text-slate-500">Tanpa centang, nilai di atas hanya saran perhitungan HPP dan harga jual di tab Umum/Variant tidak berubah. Dengan centang, harga jual {mode === "variant" ? "seluruh variant" : "produk tanpa variant"} ikut diperbarui.</span>
          </span>
        </label>

        <div className="mt-2.5 overflow-hidden rounded-[8px] border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">Preview harga jual</p>
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-extrabold ${applyToAll ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
              {applyToAll
                ? `Diterapkan ${money(effectiveSellingPrice)}`
                : pricesAlreadyMatch
                  ? "Harga jual sudah sama dengan saran"
                  : "Belum diterapkan (saran saja)"}
            </span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-white text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-1.5">Target</th>
                <th className="px-3 py-1.5">SKU</th>
                <th className="px-3 py-1.5 text-right">Harga saat ini</th>
                <th className="px-3 py-1.5 text-right">Setelah diterapkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pricePreviewRows.map((row) => {
                const changed = applyToAll && effectiveSellingPrice > 0 && Number(row.current) !== Number(effectiveSellingPrice);

                return (
                  <tr key={row.key} className="bg-white">
                    <td className="px-3 py-1.5 font-bold text-slate-700">{row.label}</td>
                    <td className="px-3 py-1.5 font-mono text-[11px] text-slate-400">{row.sku}</td>
                    <td className="px-3 py-1.5 text-right font-semibold text-slate-600">{money(row.current)}</td>
                    <td className={`px-3 py-1.5 text-right font-extrabold ${changed ? "text-emerald-700" : "text-slate-400"}`}>
                      {applyToAll ? money(effectiveSellingPrice) : money(row.current)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-slate-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
            {mode === "variant"
              ? `${pricePreviewRows.length} variant terdeteksi.${variantPriceRange ? ` Harga variant saat ini ${money(variantPriceRange.min)}${variantPriceRange.uniform ? "" : ` – ${money(variantPriceRange.max)}`}${variantPriceRange.uniform ? " (sama)" : " (berbeda per variant)"}; bisa diubah langsung di tab Variant.` : ""}`
              : "Produk ini tanpa variant, jadi hanya ada satu harga jual."}
          </p>
        </div>
      </section>

      <div className="space-y-1 rounded-[8px] bg-sky-50 px-3 py-2.5 text-xs text-sky-700">
        <p><strong className="font-extrabold">Produksi:</strong> penambahan stok di menu Persediaan otomatis memakai bahan sesuai resep. Jika ada bahan yang kurang, penambahan ditolak seluruhnya agar saldo tidak berubah setengah.</p>
        <p><strong className="font-extrabold">Penyimpanan:</strong> {createMode ? "Resep, HPP, dan harga jual disimpan" : "Perubahan HPP dan harga jual tersimpan"} bersamaan saat produk disimpan lewat tombol Simpan di sisi kanan.</p>
      </div>
    </div>
  );
});
