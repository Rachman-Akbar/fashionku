import { useDeferredValue, useMemo, useState } from "react";
import {
  advancedError,
  useAdjustRawMaterial,
  useDeleteRawMaterial,
  useRawMaterials,
  useSaveRawMaterial,
} from "@/features/advanced/services/advancedMarketplaceService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { Input } from "@/shared/components/ui/Input";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const MATERIAL_EMPTY = { code: "", name: "", unit: "pcs", minimum_stock: 0, average_cost: 0, is_active: true };
const DEFAULT_UNITS = ["pcs", "kg", "gram", "liter", "ml", "meter", "cm", "dus", "botol", "sachet", "lusin", "pack", "rim", "unit", "buah"];

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function BahanBakuPage() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim());
  const [materialForm, setMaterialForm] = useState(null);
  const [materialInitial, setMaterialInitial] = useState(null);
  const [materialAdjust, setMaterialAdjust] = useState(null);
  const [materialDelete, setMaterialDelete] = useState(null);
  const [materialSelected, setMaterialSelected] = useState(new Set());
  const [extraUnits, setExtraUnits] = useState([]);
  const [delta, setDelta] = useState("");
  const [stockReference, setStockReference] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [unitCostInitial, setUnitCostInitial] = useState("");

  const materials = useRawMaterials({ per_page: 100, ...(deferred ? { search: deferred } : {}) });
  const saveMaterial = useSaveRawMaterial();
  const deleteMaterial = useDeleteRawMaterial();
  const adjustMaterial = useAdjustRawMaterial();

  const materialRows = useMemo(() => materials.data?.rows || [], [materials.data?.rows]);
  const materialAllSelected = materialRows.length > 0 && materialSelected.size === materialRows.length;
  const unitOptions = useMemo(() => {
    const seen = new Set();
    const options = [];
    const feed = (unit) => {
      const value = String(unit || "").trim();
      if (value && !seen.has(value)) {
        seen.add(value);
        options.push({ value, label: value });
      }
    };
    DEFAULT_UNITS.forEach(feed);
    materialRows.forEach((row) => feed(row.unit));
    extraUnits.forEach(feed);
    return options;
  }, [materialRows, extraUnits]);

  const toggleMaterialRow = (id) => setMaterialSelected((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const toggleMaterialAll = () => setMaterialSelected((current) => (materialRows.length && current.size === materialRows.length ? new Set() : new Set(materialRows.map((row) => row.id))));

  const createUnit = async (name) => {
    const clean = String(name || "").trim();
    if (!clean) return null;
    setExtraUnits((current) => (current.includes(clean) ? current : [...current, clean]));
    setMaterialForm((current) => ({ ...current, unit: clean }));
    return { value: clean, label: clean };
  };

  const materialSpreadsheet = useSpreadsheetWorkspace({ module: "raw-material", label: "Bahan Baku", selectedRows: materialRows.filter((row) => materialSelected.has(row.id)), allowBulkDelete: true, onCompleted: () => { materials.refetch(); setMaterialSelected(new Set()); } });
  const totalMaterials = useListTotalCount(materials.data?.meta, { label: "Bahan Baku" });

  const openMaterial = (row) => {
    const draft = row ? { ...row } : { ...MATERIAL_EMPTY };
    setMaterialInitial({ ...draft });
    setMaterialForm(draft);
  };

  const openStock = (row) => {
    setMaterialAdjust(row);
    setDelta("");
    setUnitCost(String(row?.average_cost || ""));
    setUnitCostInitial(String(row?.average_cost || ""));
    setStockReference("");
  };

  const materialDirty = useMemo(() => {
    if (!materialForm || !materialInitial) return true;
    const keys = ["code", "name", "unit", "minimum_stock", "average_cost", "is_active"];
    return keys.some((key) => String(materialForm[key] ?? "") !== String(materialInitial[key] ?? ""));
  }, [materialForm, materialInitial]);

  const stockDirty = Number(delta) !== 0 || String(unitCost || "") !== String(unitCostInitial || "") || String(stockReference || "").trim() !== "";

  const materialColumns = [
    { key: "code", label: "Kode", filterType: "text" },
    { key: "name", label: "Bahan Baku", filterType: "text" },
    { key: "unit", label: "Satuan", filterType: "select", options: unitOptions },
    { key: "stock", label: "Stok", filterType: "range" },
    { key: "minimum_stock", label: "Minimum", filterType: "range" },
    { key: "average_cost", label: "Biaya Rata-rata", filterType: "range", render: (row) => money(row.average_cost), align: "right" },
    { key: "is_active", label: "Status", filterable: false, render: (row) => row.is_active ? "Aktif" : "Non-Aktif" },
    {
      key: "actions",
      label: "Aksi",
      filterable: false,
      width: 132,
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          <button type="button" title="Stock / Restock" onClick={() => openStock(row)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"><span className="material-symbols-outlined text-[17px]">add_box</span></button>
          <button type="button" title="Edit" onClick={() => openMaterial(row)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"><span className="material-symbols-outlined text-[17px]">edit</span></button>
          <button type="button" title="Hapus" onClick={() => setMaterialDelete(row)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"><span className="material-symbols-outlined text-[17px]">delete</span></button>
        </div>
      ),
    },
  ];

  const submitMaterial = async () => {
    if (!materialForm || saveMaterial.isPending) return;
    try {
      await saveMaterial.mutateAsync({ id: materialForm?.id, values: materialForm });
      setMaterialForm(null);
      toastSuccess("Simpan Bahan Baku", "Bahan baku berhasil disimpan.");
      materials.refetch();
    } catch (error) {
      toastError("Simpan Bahan Baku", advancedError(error));
    }
  };

  const removeMaterial = async () => {
    if (!materialDelete || deleteMaterial.isPending) return;
    try {
      await deleteMaterial.mutateAsync(materialDelete.id);
      setMaterialDelete(null);
      setMaterialSelected(new Set());
      toastSuccess("Hapus Bahan Baku", `Bahan baku ${materialDelete.name || materialDelete.code} berhasil dihapus.`);
      materials.refetch();
    } catch (error) {
      toastError("Hapus Bahan Baku", advancedError(error));
    }
  };

  const submitMaterialStock = async () => {
    if (!materialAdjust || adjustMaterial.isPending) return;
    try {
      await adjustMaterial.mutateAsync({ id: materialAdjust.id, values: { quantity_delta: Number(delta), unit_cost: unitCost ? Number(unitCost) : null, reference_type: Number(delta) > 0 ? "restock" : "usage", reference_number: String(stockReference || "").trim() || null, notes: "Pergerakan dari Persediaan" } });
      setMaterialAdjust(null);
      setDelta("");
      setUnitCost("");
      setStockReference("");
      toastSuccess("Stock / Restock Bahan Baku", "Stok bahan baku berhasil diperbarui.");
      materials.refetch();
    } catch (error) {
      toastError("Stock / Restock Bahan Baku", advancedError(error));
    }
  };

  return (
    <>
      <ModuleFrame
        title="Bahan Baku (Master Data)"
        subtitle="Kelola master data bahan baku yang digunakan oleh produk. Stok berkurang otomatis saat produk dengan resep bahan baku diproduksi."
        query={query}
        onQueryChange={setQuery}
        onRefresh={() => materials.refetch()}
        refreshing={false}
        totalCount={totalMaterials?.totalCount}
        totalLabel={totalMaterials?.totalLabel}
        totalTitle={totalMaterials?.totalTitle}
        onCreate={() => openMaterial(null)}
        createLabel="Bahan Baku"
        selectionEnabled={materialSelected.size > 0}
        selectedCount={materialSelected.size}
        onToggleSelection={() => (materialSelected.size ? setMaterialSelected(new Set()) : setMaterialSelected(new Set(materialRows.map((row) => row.id))))}
        bulkActions={materialSpreadsheet.actions}
      >
        <DataGrid storageKey="inventory.raw-materials" onFilterStateChange={totalMaterials.onFilterStateChange} columns={materialColumns} rows={materialRows} emptyText="Bahan baku belum tersedia." onRowClick={(row) => (row.id ? openMaterial(row) : undefined)} selectionEnabled selectedIds={materialSelected} allSelected={materialAllSelected} onToggleRow={toggleMaterialRow} onToggleAll={toggleMaterialAll} />
      </ModuleFrame>

      <SpreadsheetOperationPanel workspace={materialSpreadsheet} />

      <FormModal open={Boolean(materialForm)} title={materialForm?.id ? "Edit Bahan Baku" : "Data Baru Bahan Baku"} onClose={() => { setMaterialForm(null); setMaterialInitial(null); }} onSubmit={submitMaterial} busy={saveMaterial.isPending} dirty={materialDirty} submitLabel="Simpan" onDelete={materialForm?.id ? () => { setMaterialDelete(materialForm); setMaterialForm(null); setMaterialInitial(null); } : undefined} extraActions={materialForm?.id ? [{ icon: "add_box", label: "Stock / Restock", tone: "teal", onClick: () => { openStock(materialForm); setMaterialForm(null); setMaterialInitial(null); } }] : []}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Kode" hint="Kosongkan agar dibuat otomatis oleh sistem (mis. RM-GULA), atau isi kode manual."><Input value={materialForm?.code || ""} onChange={(event) => setMaterialForm((current) => ({ ...current, code: event.target.value }))} placeholder="Otomatis bila dikosongkan" /></Field>
          <Field label="Nama" required><Input value={materialForm?.name || ""} onChange={(event) => setMaterialForm((current) => ({ ...current, name: event.target.value }))} required /></Field>
          <Field label="Satuan" required hint="Pilih satuan yang sudah ada, atau ketik satuan baru untuk menambah langsung ke daftar."><SearchableSelect value={materialForm?.unit || ""} onChange={(nextValue) => setMaterialForm((current) => ({ ...current, unit: nextValue }))} options={unitOptions} clearable={false} onCreate={createUnit} createLabel={(name) => `Satuan “${name}” belum ada, tambahkan sekarang`} placeholder="Pilih / ketik satuan" searchPlaceholder="Cari atau ketik satuan baru" /></Field>
          <Field label="Minimum Stok"><Input type="number" min="0" value={materialForm?.minimum_stock || 0} onChange={(event) => setMaterialForm((current) => ({ ...current, minimum_stock: event.target.value }))} /></Field>
          <Field label="Biaya Rata-rata" hint={materialForm?.id ? "Biaya rata-rata berubah melalui Stock / Restock Bahan Baku." : "Biaya awal bahan sebelum transaksi restock pertama."}><Input type="number" min="0" value={materialForm?.average_cost || 0} disabled={Boolean(materialForm?.id)} onChange={(event) => setMaterialForm((current) => ({ ...current, average_cost: event.target.value }))} className={materialForm?.id ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""} /></Field>
        </div>
      </FormModal>

      <FormModal open={Boolean(materialAdjust)} title="Stock / Restock Bahan Baku" onClose={() => setMaterialAdjust(null)} onSubmit={submitMaterialStock} busy={adjustMaterial.isPending} dirty={stockDirty} submitLabel="Simpan">
        <Field label="Perubahan Stok" required hint="Positif untuk restock, negatif untuk pemakaian."><Input type="number" step="0.0001" value={delta} onChange={(event) => setDelta(event.target.value)} required /></Field>
        <Field label="Biaya per Satuan" hint="Saat restock, nilai ini dipakai untuk average cost tertimbang."><Input type="number" step="0.0001" min="0" value={unitCost} onChange={(event) => setUnitCost(event.target.value)} /></Field>
        <Field label="No. Referensi Stok" hint="Boleh diisi manual, atau kosongkan agar sistem membuat nomor otomatis."><Input value={stockReference} onChange={(event) => setStockReference(event.target.value)} placeholder="Kosongkan untuk nomor otomatis" /></Field>
      </FormModal>

      <ConfirmDialog open={Boolean(materialDelete)} title="Hapus Bahan Baku" message={`Bahan baku “${materialDelete?.name || materialDelete?.code || ""}” akan dihapus dari master. Riwayat pergerakan stok tetap tersimpan.`} pending={deleteMaterial.isPending} onClose={() => setMaterialDelete(null)} onConfirm={removeMaterial} />
    </>
  );
}

