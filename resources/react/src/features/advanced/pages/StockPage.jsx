import { useDeferredValue, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { advancedError, useAdjustRawMaterial, useAdjustStock, useDeleteRawMaterial, useManageableProducts, useProductCosting, useRawMaterialCostImpacts, useRawMaterialMovements, useRawMaterials, useSaveRawMaterial, useStockMovements } from "@/features/advanced/services/advancedMarketplaceService";
import { normalizeSellerProduct } from "@/features/seller/product/services/sellerProductService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import StockChartTab from "@/features/advanced/components/StockChartTab";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { Input } from "@/shared/components/ui/Input";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { inputClassName } from "@/shared/components/form/FormField";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const MATERIAL_EMPTY = { code: "", name: "", unit: "pcs", minimum_stock: 0, average_cost: 0, is_active: true };

const DEFAULT_UNITS = ["pcs", "kg", "gram", "liter", "ml", "meter", "cm", "dus", "botol", "sachet", "lusin", "pack", "rim", "unit", "buah"];

function number(value, digits = 4) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(Number(value || 0));
}

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function StockPage() {
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("product");
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const deferred = useDeferredValue(query.trim());
  const [productAdjust, setProductAdjust] = useState(null);
  const [materialForm, setMaterialForm] = useState(null);
  const [materialAdjust, setMaterialAdjust] = useState(null);
  const [materialDelete, setMaterialDelete] = useState(null);
  const [materialSelected, setMaterialSelected] = useState(new Set());
  const [extraUnits, setExtraUnits] = useState([]);
  const [delta, setDelta] = useState("");
  const [stockReference, setStockReference] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const products = useManageableProducts({ per_page: 100, is_active: true });
  const productMovements = useStockMovements({ per_page: 100, ...(deferred ? { search: deferred } : {}) });
  const materials = useRawMaterials({ per_page: 100, ...(deferred ? { search: deferred } : {}) });
  const materialMovements = useRawMaterialMovements({ per_page: 100 });
  const costImpacts = useRawMaterialCostImpacts({ per_page: 100, direction: "increase" });
  const productionCosting = useProductCosting(productAdjust?.product_id, Boolean(productAdjust?.product_id && Number(delta) > 0));
  const adjustStock = useAdjustStock();
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

  const stockSpreadsheet = useSpreadsheetWorkspace({ module: "stock", label: "Stok Produk", allowBulkDelete: false, onCompleted: () => productMovements.refetch() });
  const materialSpreadsheet = useSpreadsheetWorkspace({ module: "raw-material", label: "Bahan Baku", selectedRows: materialRows.filter((row) => materialSelected.has(row.id)), allowBulkDelete: true, onCompleted: () => { materials.refetch(); setMaterialSelected(new Set()); } });
  const materialStockSpreadsheet = useSpreadsheetWorkspace({ module: "raw-material-stock", label: "Stok Bahan Baku", allowBulkDelete: false, onCompleted: () => { materials.refetch(); materialMovements.refetch(); costImpacts.refetch(); } });
  const impactSpreadsheet = useSpreadsheetWorkspace({ module: "cost-impact", label: "Laporan Dampak HPP", allowImport: false, allowBulkDelete: false });

  const workspaceByModule = { stock: stockSpreadsheet, "raw-material": materialSpreadsheet, "raw-material-stock": materialStockSpreadsheet, "cost-impact": impactSpreadsheet };
  const activeSpreadsheetModule = stockSpreadsheet.activeOperation?.payload?.module;
  const activeWorkspace = workspaceByModule[activeSpreadsheetModule] || stockSpreadsheet;

  const storeOptions = useMemo(() => {
    const map = new Map();
    (products.data?.rows || []).forEach((product) => {
      const id = Number(product.store_id || product.storeId || product.store?.id || 0);
      const name = product.store_name || product.storeName || product.store?.name || `Toko ${id}`;
      if (id) map.set(id, { id, name });
    });
    return [...map.values()];
  }, [products.data?.rows]);

  const variants = useMemo(() => {
    const rows = (products.data?.rows || []).flatMap((product) => (product.variants || []).map((variant) => ({ ...variant, product_name: product.name, product_id: product.id })));
    if (!deferred) return rows;
    const needle = deferred.toLowerCase();
    return rows.filter((row) => [row.product_name, row.name, row.sku].some((value) => String(value || "").toLowerCase().includes(needle)));
  }, [deferred, products.data?.rows]);

  const totalProduct = useListTotalCount(undefined, { fallbackTotal: variants.length, label: "Varian" });
  const totalMaterials = useListTotalCount(materials.data?.meta, { label: "Bahan Baku" });
  const totalProductHistory = useListTotalCount(productMovements.data?.meta, { label: "Pergerakan" });
  const totalMaterialHistory = useListTotalCount(materialMovements.data?.meta, { label: "Pergerakan" });
  const totalCostImpact = useListTotalCount(costImpacts.data?.meta, { label: "Dampak HPP" });
  const activeTotal = {
    product: totalProduct,
    materials: totalMaterials,
    "product-history": totalProductHistory,
    "material-history": totalMaterialHistory,
    "cost-impact": totalCostImpact,
  }[tab];

  const openProductDetail = (row) => {
    const raw = (products.data?.rows || []).find((product) => Number(product.id) === Number(row.product_id));
    if (!raw) return;
    const href = activeRole === "admin" ? "/admin/products" : "/seller/products";
    navigate(href, { state: { editProduct: normalizeSellerProduct(raw), initialSection: "stock" } });
  };
  const productionMaterials = useMemo(() => productionCosting.data?.materials || [], [productionCosting.data?.materials]);
  const productionQuantity = Math.max(0, Number(delta || 0));
  const productionPreview = useMemo(() => productionMaterials.map((recipe) => {
    const master = materialRows.find((item) => Number(item.id) === Number(recipe.raw_material_id));
    const required = Number(recipe.quantity || 0) * productionQuantity;
    return { ...recipe, stock: Number(master?.stock || recipe.material_stock || 0), required, unit: master?.unit || recipe.unit || "", enough: Number(master?.stock || recipe.material_stock || 0) + 0.0000001 >= required };
  }), [productionMaterials, materialRows, productionQuantity]);

  const productColumns = [
    { key: "product_name", label: "Produk" }, { key: "name", label: "Varian" }, { key: "sku", label: "SKU" }, { key: "stock", label: "Stok" },
    {
      key: "actions",
      label: "Aksi",
      filterable: false,
      width: 96,
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          <button type="button" title="Stock / Restock" onClick={() => { setProductAdjust(row); setDelta(""); setStockReference(""); }} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"><span className="material-symbols-outlined text-[17px]">add_box</span></button>
        </div>
      ),
    },
  ];
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
          <button type="button" title="Stock / Restock" onClick={() => { setMaterialAdjust(row); setDelta(""); setUnitCost(String(row.average_cost || "")); }} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"><span className="material-symbols-outlined text-[17px]">add_box</span></button>
          <button type="button" title="Edit" onClick={() => setMaterialForm({ ...row })} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"><span className="material-symbols-outlined text-[17px]">edit</span></button>
          <button type="button" title="Hapus" onClick={() => setMaterialDelete(row)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"><span className="material-symbols-outlined text-[17px]">delete</span></button>
        </div>
      ),
    },
  ];
  const productHistoryColumns = [
    { key: "occurred_at", label: "Waktu", render: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleString("id-ID") : "-" }, { key: "product_name", label: "Produk" }, { key: "variant_name", label: "Varian" }, { key: "type", label: "Jenis" }, { key: "quantity_delta", label: "Perubahan" }, { key: "balance_after", label: "Saldo" }, { key: "notes", label: "Catatan" },
  ];
  const materialHistoryColumns = [
    { key: "occurred_at", label: "Waktu", render: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleString("id-ID") : "-" }, { key: "material_name", label: "Bahan Baku", render: (row) => row.material?.name || row.material_name || "-" }, { key: "type", label: "Jenis" }, { key: "quantity_delta", label: "Perubahan" }, { key: "balance_after", label: "Saldo" }, { key: "unit_cost", label: "Biaya/Satuan", render: (row) => money(row.unit_cost) }, { key: "reference_number", label: "Referensi" },
  ];
  const impactColumns = [
    { key: "occurred_at", label: "Waktu", render: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleString("id-ID") : "-" },
    { key: "material", label: "Bahan Baku", render: (row) => `${row.material?.code || ""} ${row.material?.name || ""}`.trim() || "-" },
    { key: "product", label: "Produk", render: (row) => row.product?.name || "-" },
    { key: "old_cost", label: "Biaya Lama", render: (row) => money(row.cost_history?.old_average_cost || row.costHistory?.old_average_cost) },
    { key: "new_cost", label: "Biaya Baru", render: (row) => money(row.cost_history?.new_average_cost || row.costHistory?.new_average_cost) },
    { key: "old_hpp", label: "HPP Lama", render: (row) => money(row.old_hpp) },
    { key: "new_hpp", label: "HPP Baru", render: (row) => money(row.new_hpp) },
    { key: "hpp_change_percent", label: "Kenaikan HPP", render: (row) => `${number(row.hpp_change_percent, 2)}%` },
    { key: "new_suggested_price", label: "Saran Harga Baru", render: (row) => money(row.new_suggested_price) },
  ];

  const spreadsheetActions = tab === "materials" ? materialSpreadsheet.actions
    : tab === "material-history" ? materialStockSpreadsheet.actions
      : tab === "cost-impact" ? impactSpreadsheet.actions
        : stockSpreadsheet.actions;

  async function submitProductStock(event) {
    event.preventDefault();
    if (adjustStock.isPending) return;
    if (productionQuantity > 0 && productionPreview.some((row) => !row.enough)) {
      toastError("Stock / Restock Produk", "Stok bahan baku belum mencukupi untuk jumlah produksi tersebut.");
      return;
    }
    try {
      await adjustStock.mutateAsync({ variant_id: productAdjust.id, quantity_delta: Number(delta), reference_type: Number(delta) > 0 ? "production_restock" : "manual", reference_id: String(stockReference || "").trim() || null, notes: Number(delta) > 0 ? "Produksi / restock dari Persediaan" : "Penyesuaian dari Persediaan" });
      setProductAdjust(null);
      setDelta("");
      setStockReference("");
      toastSuccess("Stock / Restock Produk", "Stok produk berhasil diperbarui dan pemakaian bahan baku telah dicatat.");
      products.refetch();
      productMovements.refetch();
      materials.refetch();
      materialMovements.refetch();
    } catch (error) {
      toastError("Stock / Restock Produk", advancedError(error));
    }
  }

  async function submitMaterial(event) {
    event.preventDefault();
    if (saveMaterial.isPending) return;
    try {
      await saveMaterial.mutateAsync({ id: materialForm?.id, values: materialForm });
      setMaterialForm(null);
      toastSuccess("Simpan Bahan Baku", "Bahan baku berhasil disimpan. Jika biaya berubah, HPP produk terkait telah dihitung ulang.");
      costImpacts.refetch();
    } catch (error) {
      toastError("Simpan Bahan Baku", advancedError(error));
    }
  }

  const removeMaterial = async () => {
    if (!materialDelete || deleteMaterial.isPending) return;
    try {
      await deleteMaterial.mutateAsync(materialDelete.id);
      setMaterialDelete(null);
      setMaterialSelected(new Set());
      toastSuccess("Hapus Bahan Baku", `Bahan baku ${materialDelete.name || materialDelete.code} berhasil dihapus.`);
      materials.refetch();
      materialMovements.refetch();
      costImpacts.refetch();
    } catch (error) {
      toastError("Hapus Bahan Baku", advancedError(error));
    }
  };

  async function submitMaterialStock(event) {
    event.preventDefault();
    if (adjustMaterial.isPending) return;
    try {
      await adjustMaterial.mutateAsync({ id: materialAdjust.id, values: { quantity_delta: Number(delta), unit_cost: unitCost ? Number(unitCost) : null, reference_type: Number(delta) > 0 ? "restock" : "usage", reference_number: String(stockReference || "").trim() || null, notes: "Pergerakan dari Persediaan" } });
      setMaterialAdjust(null);
      setDelta("");
      setUnitCost("");
      setStockReference("");
      toastSuccess("Stock / Restock Bahan Baku", "Stok bahan baku berhasil diperbarui. Dampak biaya terhadap HPP sudah disinkronkan.");
      materials.refetch();
      materialMovements.refetch();
      costImpacts.refetch();
    } catch (error) {
      toastError("Stock / Restock Bahan Baku", advancedError(error));
    }
  }

  const tabs = [["product", "Stok Produk"], ["materials", "Bahan Baku"], ["grafik", "Grafik"], ["product-history", "Riwayat Produk"], ["material-history", "Riwayat Bahan Baku"], ["cost-impact", "Kenaikan Bahan & HPP"]];

  return <>
    <ModuleFrame
      title="Persediaan"
      subtitle="Stok produk, bahan baku, produksi, audit pergerakan, import/export terpisah, dan laporan dampak kenaikan biaya terhadap HPP."
      query={query}
      onQueryChange={setQuery}
      onRefresh={() => { products.refetch(); productMovements.refetch(); materials.refetch(); materialMovements.refetch(); costImpacts.refetch(); }}
      refreshing={false}
      totalCount={activeTotal?.totalCount}
      totalLabel={activeTotal?.totalLabel}
      totalTitle={activeTotal?.totalTitle}
      onCreate={tab === "materials" ? () => setMaterialForm({ ...MATERIAL_EMPTY }) : undefined}
      createLabel="Bahan Baku"
      selectionEnabled={materialSelected.size > 0}
      selectedCount={materialSelected.size}
      onToggleSelection={tab === "materials" ? () => (materialSelected.size ? setMaterialSelected(new Set()) : setMaterialSelected(new Set(materialRows.map((row) => row.id)))) : undefined}
      bulkActions={spreadsheetActions}
    >
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">{tabs.map(([id, label]) => <button key={id} type="button" onClick={() => setTab(id)} className={`h-9 px-4 text-sm font-bold ${tab === id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>{label}</button>)}</div>
      {tab === "product" ? <DataGrid storageKey="inventory.product-stock" onFilterStateChange={totalProduct.onFilterStateChange} columns={productColumns} rows={variants} emptyText="Produk belum tersedia." onRowClick={openProductDetail} /> : null}
      {tab === "materials" ? <DataGrid storageKey="inventory.raw-materials" onFilterStateChange={totalMaterials.onFilterStateChange} columns={materialColumns} rows={materialRows} emptyText="Bahan baku belum tersedia." onRowClick={(row) => (row.id ? setMaterialForm({ ...row }) : undefined)} selectionEnabled selectedIds={materialSelected} allSelected={materialAllSelected} onToggleRow={toggleMaterialRow} onToggleAll={toggleMaterialAll} /> : null}
      {tab === "grafik" ? <StockChartTab variants={variants} /> : null}
      {tab === "product-history" ? <DataGrid storageKey="inventory.product-history" onFilterStateChange={totalProductHistory.onFilterStateChange} columns={productHistoryColumns} rows={productMovements.data?.rows || []} emptyText="Riwayat stok produk belum tersedia." /> : null}
      {tab === "material-history" ? <DataGrid storageKey="inventory.material-history" onFilterStateChange={totalMaterialHistory.onFilterStateChange} columns={materialHistoryColumns} rows={materialMovements.data?.rows || []} emptyText="Riwayat stok bahan baku belum tersedia." /> : null}
      {tab === "cost-impact" ? <><div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Laporan ini muncul otomatis saat average cost bahan baku naik dan perubahan tersebut menaikkan HPP produk. Harga jual aktif tidak diubah otomatis; Seller dapat memakai kolom Saran Harga Baru sebagai dasar keputusan.</div><DataGrid storageKey="inventory.cost-impact" onFilterStateChange={totalCostImpact.onFilterStateChange} columns={impactColumns} rows={costImpacts.data?.rows || []} emptyText="Belum ada kenaikan biaya bahan baku yang memengaruhi HPP." /></> : null}
    </ModuleFrame>

    <SpreadsheetOperationPanel workspace={activeWorkspace} />

    <FormModal open={Boolean(productAdjust)} title="Stock / Restock Produk" onClose={() => setProductAdjust(null)} onSubmit={submitProductStock} busy={adjustStock.isPending || (productionQuantity > 0 && productionPreview.some((row) => !row.enough))} submitLabel="Simpan">
      <Field label="Perubahan Stok" required hint="Positif berarti produksi/restock dan otomatis memakai bahan baku resep. Negatif berarti pengeluaran stok produk."><Input type="number" value={delta} onChange={(event) => setDelta(event.target.value)} required /></Field>
      <Field label="No. Referensi Stok" hint="Boleh diisi manual, atau kosongkan agar sistem membuat nomor otomatis (mis. STK-MASUK-20260927-001)."><Input value={stockReference} onChange={(event) => setStockReference(event.target.value)} placeholder="Kosongkan untuk nomor otomatis" /></Field>
      {productionQuantity > 0 ? <div className="space-y-2 border border-blue-200 bg-blue-50 p-3"><p className="text-xs font-black uppercase text-blue-700">Estimasi pemakaian bahan untuk {productionQuantity} produk</p>{productionPreview.length ? productionPreview.map((row) => <div key={row.raw_material_id} className="flex items-center justify-between gap-3 text-sm"><span>{row.material_code} - {row.material_name}</span><span className={row.enough ? "font-bold text-slate-700" : "font-bold text-red-700"}>Butuh {number(row.required)} {row.unit} / Stok {number(row.stock)} {row.unit}</span></div>) : <p className="text-sm text-blue-800">Produk belum memiliki resep bahan baku. Penambahan stok tetap diperbolehkan tanpa konsumsi bahan.</p>}</div> : null}
    </FormModal>

    <FormModal open={Boolean(materialForm)} title={materialForm?.id ? "Edit Bahan Baku" : "Data Baru Bahan Baku"} onClose={() => setMaterialForm(null)} onSubmit={submitMaterial} busy={saveMaterial.isPending} submitLabel="Simpan" extraActions={materialForm?.id ? [{ icon: "add_box", label: "Stock / Restock", tone: "teal", onClick: () => { setMaterialAdjust(materialForm); setDelta(""); setUnitCost(String(materialForm?.average_cost || "")); setStockReference(""); setMaterialForm(null); } }] : []}>
      <div className="grid gap-4 md:grid-cols-2">
        {activeRole === "admin" ? <Field label="Toko" required><select className={inputClassName} value={materialForm?.store_id || ""} onChange={(event) => setMaterialForm((current) => ({ ...current, store_id: event.target.value }))} required><option value="">Pilih toko</option>{storeOptions.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}</select></Field> : null}
        <Field label="Kode" hint="Kosongkan agar dibuat otomatis oleh sistem (mis. RM-GULA), atau isi kode manual."><Input value={materialForm?.code || ""} onChange={(event) => setMaterialForm((current) => ({ ...current, code: event.target.value }))} placeholder="Otomatis bila dikosongkan" /></Field>
        <Field label="Nama" required><Input value={materialForm?.name || ""} onChange={(event) => setMaterialForm((current) => ({ ...current, name: event.target.value }))} required /></Field>
        <Field label="Satuan" required hint="Pilih satuan yang sudah ada, atau ketik satuan baru untuk menambah langsung ke daftar."><SearchableSelect value={materialForm?.unit || ""} onChange={(nextValue) => setMaterialForm((current) => ({ ...current, unit: nextValue }))} options={unitOptions} clearable={false} onCreate={createUnit} createLabel={(name) => `Satuan “${name}” belum ada, tambahkan sekarang`} placeholder="Pilih / ketik satuan" searchPlaceholder="Cari atau ketik satuan baru" /></Field>
        <Field label="Minimum Stok"><Input type="number" min="0" value={materialForm?.minimum_stock || 0} onChange={(event) => setMaterialForm((current) => ({ ...current, minimum_stock: event.target.value }))} /></Field>
        <Field label="Biaya Rata-rata" hint={materialForm?.id ? "Biaya rata-rata berubah melalui Stock / Restock Bahan Baku agar weighted average dan histori HPP tercatat." : "Biaya awal bahan sebelum transaksi restock pertama."}><Input type="number" min="0" value={materialForm?.average_cost || 0} disabled={Boolean(materialForm?.id)} onChange={(event) => setMaterialForm((current) => ({ ...current, average_cost: event.target.value }))} className={materialForm?.id ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""} /></Field>
      </div>
    </FormModal>

    <FormModal open={Boolean(materialAdjust)} title="Stock / Restock Bahan Baku" onClose={() => setMaterialAdjust(null)} onSubmit={submitMaterialStock} busy={adjustMaterial.isPending} submitLabel="Simpan">
      <Field label="Perubahan Stok" required hint="Positif untuk restock, negatif untuk pemakaian."><Input type="number" step="0.0001" value={delta} onChange={(event) => setDelta(event.target.value)} required /></Field>
      <Field label="Biaya per Satuan" hint="Saat restock, nilai ini dipakai untuk average cost tertimbang dan laporan dampak HPP."><Input type="number" step="0.0001" min="0" value={unitCost} onChange={(event) => setUnitCost(event.target.value)} /></Field>
      <Field label="No. Referensi Stok" hint="Boleh diisi manual, atau kosongkan agar sistem membuat nomor otomatis (mis. RM-RSK-20260927-001)."><Input value={stockReference} onChange={(event) => setStockReference(event.target.value)} placeholder="Kosongkan untuk nomor otomatis" /></Field>
    </FormModal>

    <ConfirmDialog open={Boolean(materialDelete)} title="Hapus Bahan Baku" message={`Bahan baku “${materialDelete?.name || materialDelete?.code || ""}” akan dihapus dari master. Riwayat pergerakan stok tetap tersimpan.`} pending={deleteMaterial.isPending} onClose={() => setMaterialDelete(null)} onConfirm={removeMaterial} />
  </>;
}
