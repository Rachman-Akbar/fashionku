import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { advancedError, useProductCosting, useRawMaterials, useSaveProductCosting, useSaveRawMaterial } from "@/features/advanced/services/advancedMarketplaceService";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { inputClassName } from "@/shared/components/form/FormField";
import { useFormDirty } from "@/shared/hooks/useFormDirty";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const DEFAULT_COSTING = { materials: [], labor_cost: 0, overhead_cost: 0, other_cost: 0, margin_percent: 30, selling_price: 0, apply_to_variants: false };

const COSTING_NUMERIC_KEYS = ["quantity", "labor_cost", "overhead_cost", "other_cost", "margin_percent", "selling_price"];

const COMMON_UNITS = ["pcs", "pack", "box", "kg", "gram", "liter", "ml", "meter", "roll", "sak", "lembar"];

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function qty(value) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 4 }).format(Number(value || 0));
}

export const ProductCostingFields = forwardRef(function ProductCostingFields({ productId, value, onChange, onDirtyChange }, ref) {
  const createMode = !productId && typeof onChange === "function";
  const materialsQuery = useRawMaterials({ per_page: 100 });
  const costingQuery = useProductCosting(productId, Boolean(productId));
  const save = useSaveProductCosting();
  const saveRawMaterial = useSaveRawMaterial();
  const [form, setForm] = useState(DEFAULT_COSTING);
  const [baseline, setBaseline] = useState(DEFAULT_COSTING);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreate, setQuickCreate] = useState({ code: "", name: "", unit: "pcs" });
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
    setForm(loaded);
    setBaseline(loaded);
  }, [createMode, data.costing, data.materials]);

  const activeForm = useMemo(() => (createMode ? { ...DEFAULT_COSTING, ...(value || {}) } : form), [createMode, form, value]);
  const dirty = useFormDirty(baseline, activeForm, { numericKeys: COSTING_NUMERIC_KEYS });

  useEffect(() => {
    if (createMode) return;
    onDirtyChange?.(dirty);
  }, [createMode, dirty, onDirtyChange]);

  function updateForm(updater) {
    if (createMode) {
      onChange(typeof updater === "function" ? updater(activeForm) : updater);
      return;
    }
    setForm(updater);
  }

  const materialOptions = materialsQuery.data?.rows || [];
  const materialCost = useMemo(() => activeForm.materials.reduce((sum, row) => {
    const material = materialOptions.find((item) => Number(item.id) === Number(row.raw_material_id));
    return sum + Number(row.quantity || 0) * Number(material?.average_cost || 0);
  }, 0), [activeForm.materials, materialOptions]);
  const hpp = materialCost + Number(activeForm.labor_cost || 0) + Number(activeForm.overhead_cost || 0) + Number(activeForm.other_cost || 0);
  const suggested = hpp * (1 + Number(activeForm.margin_percent || 0) / 100);

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

  if (!productId && !createMode) return <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Simpan produk terlebih dahulu. Setelah produk memiliki ID, tab HPP dapat digunakan.</div>;

  function updateMaterial(index, field, fieldValue) {
    updateForm((current) => ({ ...current, materials: current.materials.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: fieldValue } : row) }));
  }

  async function createRawMaterial() {
    const code = quickCreate.code.trim();
    const name = quickCreate.name.trim();
    if (!name) {
      toastError("Bahan baku belum lengkap", "Nama bahan baku wajib diisi.");
      return;
    }
    try {
      const created = await saveRawMaterial.mutateAsync({ values: { code, name, unit: quickCreate.unit.trim() || "pcs" } });
      const createdId = String(created?.data?.id || created?.id || "");
      await materialsQuery.refetch();
      const emptyIndex = activeForm.materials.findIndex((row) => !String(row.raw_material_id || "").trim());
      const newRow = { raw_material_id: createdId, quantity: 1 };
      if (emptyIndex >= 0) {
        updateMaterial(emptyIndex, "raw_material_id", createdId);
        updateMaterial(emptyIndex, "quantity", 1);
      } else {
        updateForm((current) => ({ ...current, materials: [...current.materials, newRow] }));
      }
      setQuickCreateOpen(false);
      setQuickCreate({ code: "", name: "", unit: "pcs" });
      toastSuccess("Bahan baku dibuat", `Bahan baku ${created?.data?.code || created?.code || code} berhasil dibuat dan langsung dipilih pada resep.`);
    } catch (error) {
      toastError("Bahan baku gagal dibuat", advancedError(error, "Bahan baku gagal dibuat."));
    }
  }

  return <div className="space-y-5">
    <section className="rounded-[10px] p-5 ring-1 ring-slate-200">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-[5px]">
            <span className="material-symbols-outlined text-slate-400">layers</span>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-emerald-700">Tahap 1 · Pilih Bahan Baku</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">Biaya satuan dikunci dari average cost bahan baku aktual sehingga HPP selalu sinkron dengan database.</p>
        </div>
        <div className="flex items-center gap-[5px]">
          <Button type="button" size="sm" variant="outline" onClick={() => setQuickCreateOpen((current) => !current)}>Bahan Baru</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => updateForm((current) => ({ ...current, materials: [...current.materials, { raw_material_id: "", quantity: 1 }] }))}>Tambah Bahan</Button>
        </div>
      </div>

      {quickCreateOpen ? (
        <div className="mb-3 grid gap-[5px] border border-emerald-200 bg-emerald-50 p-3 md:grid-cols-[140px_minmax(0,1fr)_100px_120px_auto]">
          <Input value={quickCreate.code} onChange={(event) => setQuickCreate((current) => ({ ...current, code: event.target.value }))} placeholder="Kode (opsional)" className="uppercase" />
          <Input value={quickCreate.name} onChange={(event) => setQuickCreate((current) => ({ ...current, name: event.target.value }))} placeholder="Nama bahan baku" />
          <select className={inputClassName} value={quickCreate.unit} onChange={(event) => setQuickCreate((current) => ({ ...current, unit: event.target.value }))}>
            {COMMON_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </select>
          <Button type="button" size="sm" disabled={saveRawMaterial.isPending} onClick={createRawMaterial}>Simpan & Pilih</Button>
          <button type="button" className="text-xs font-bold text-slate-500 hover:text-slate-700" onClick={() => setQuickCreateOpen(false)}>Batal</button>
        </div>
      ) : null}

      <div className="space-y-2">
        {activeForm.materials.map((row, index) => {
          const material = materialOptions.find((item) => Number(item.id) === Number(row.raw_material_id));
          return <div key={`${row.raw_material_id}-${index}`} className="grid gap-[5px] border border-slate-100 p-2 md:grid-cols-[minmax(0,1fr)_120px_140px_130px_70px]">
            <select className={inputClassName} value={row.raw_material_id} onChange={(event) => updateMaterial(index, "raw_material_id", event.target.value)}>
              <option value="">Pilih bahan baku</option>
              {materialOptions.filter((item) => item.is_active !== false).map((item) => <option key={item.id} value={item.id}>{item.code} - {item.name}</option>)}
            </select>
            <Input type="number" step="0.0001" min="0.0001" value={row.quantity} onChange={(event) => updateMaterial(index, "quantity", event.target.value)} />
            <div className="flex h-10 items-center border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">{money(material?.average_cost || 0)}</div>
            <div className="flex h-10 items-center border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600">Stok {qty(material?.stock || 0)} {material?.unit || ""}</div>
            <button type="button" className="text-sm font-bold text-red-600" onClick={() => updateForm((current) => ({ ...current, materials: current.materials.filter((_, rowIndex) => rowIndex !== index) }))}>Hapus</button>
          </div>;
        })}
        {!activeForm.materials.length ? <p className="border border-dashed border-slate-200 p-4 text-sm text-slate-500">Belum ada bahan baku pada resep produk. Gunakan "Tambah Bahan" atau buat bahan baru lewat "Bahan Baru".</p> : null}
      </div>
    </section>

    <section className="rounded-[10px] p-5 ring-1 ring-slate-200">
      <div className="flex items-center gap-[5px]">
        <span className="material-symbols-outlined text-slate-400">calculate</span>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-emerald-700">Tahap 2 · Perhitungan HPP</h2>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold">Tenaga Kerja<Input type="number" min="0" value={activeForm.labor_cost} onChange={(event) => updateForm((current) => ({ ...current, labor_cost: event.target.value }))} /></label>
        <label className="text-xs font-bold">Overhead<Input type="number" min="0" value={activeForm.overhead_cost} onChange={(event) => updateForm((current) => ({ ...current, overhead_cost: event.target.value }))} /></label>
        <label className="text-xs font-bold">Biaya Lain<Input type="number" min="0" value={activeForm.other_cost} onChange={(event) => updateForm((current) => ({ ...current, other_cost: event.target.value }))} /></label>
        <div className="border border-slate-200 bg-white p-3"><span className="text-xs text-slate-500">Biaya Bahan</span><strong className="block text-base">{money(materialCost)}</strong></div>
      </div>
    </section>

    <section className="rounded-[10px] p-5 ring-1 ring-slate-200">
      <div className="flex items-center gap-[5px]">
        <span className="material-symbols-outlined text-slate-400">sell</span>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-emerald-700">Tahap 3 · Pembentukan Harga Jual</h2>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><span className="text-xs text-slate-500">Modal / HPP</span><strong className="block text-lg">{money(hpp)}</strong></div>
        <label className="text-xs font-bold">Margin %<Input type="number" min="0" step="0.01" value={activeForm.margin_percent} onChange={(event) => updateForm((current) => ({ ...current, margin_percent: event.target.value }))} /></label>
        <div><span className="text-xs text-slate-500">Saran Harga Jual</span><strong className="block text-lg text-emerald-700">{money(suggested)}</strong></div>
        <label className="text-xs font-bold">Harga Jual<Input type="number" min="0" value={activeForm.selling_price} onChange={(event) => updateForm((current) => ({ ...current, selling_price: event.target.value }))} /></label>
      </div>
      <label className="mt-3 flex items-center gap-[5px] text-sm font-semibold"><input type="checkbox" checked={activeForm.apply_to_variants} onChange={(event) => updateForm((current) => ({ ...current, apply_to_variants: event.target.checked }))} /> Terapkan harga jual ke seluruh variant produk</label>
    </section>

    <section className="rounded-[10px] p-5 ring-1 ring-slate-200">
      <div className="flex items-center gap-[5px]">
        <span className="material-symbols-outlined text-slate-400">factory</span>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Tahap 4 · Produksi melalui Stock / Restock Produk</h2>
      </div>
      <p className="mt-2 text-sm text-slate-600">Setelah resep HPP disimpan, penambahan stok produk pada menu Persediaan otomatis mengurangi stok bahan baku sesuai quantity resep. Jika salah satu bahan tidak cukup, penambahan stok produk ditolak seluruhnya agar saldo tidak setengah berubah.</p>
    </section>

    <p className="rounded-lg bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-700">{createMode ? "Resep, HPP, dan harga jual disimpan" : "Perubahan HPP dan harga jual tersimpan"} bersamaan saat produk disimpan lewat tombol Simpan di sisi kanan.</p>
  </div>;
});


