import { useDeferredValue, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { advancedError, useAdjustRawMaterial, useAdjustStock, useDeleteRawMaterial, useManageableProducts, useProductCosting, useRawMaterialMovements, useRawMaterials, useSaveProductCosting, useSaveRawMaterial, useStockMovements } from "@/features/advanced/services/advancedMarketplaceService";
import { normalizeSellerProduct } from "@/features/seller/product/services/sellerProductService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import StockChartTab from "@/features/advanced/components/StockChartTab";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { Input } from "@/shared/components/ui/Input";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { SpecialActionButton } from "@/shared/components/crud/SpecialActionButton";
import { toolbarControlClassName } from "@/shared/components/crud/toolbarControlClassName";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { useViewMode } from "@/shared/hooks/useViewMode";
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
  const [viewMode, setViewMode] = useViewMode("inventory");
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const deferred = useDeferredValue(query.trim());
  const [productAdjust, setProductAdjust] = useState(null);
  const [opnamePickerOpen, setOpnamePickerOpen] = useState(false);
  const [opnameTarget, setOpnameTarget] = useState("");
  const [activeToggleId, setActiveToggleId] = useState(null);
  const [materialForm, setMaterialForm] = useState(null);
  const [materialAdjust, setMaterialAdjust] = useState(null);
  const [materialDelete, setMaterialDelete] = useState(null);
  const [materialSelected, setMaterialSelected] = useState(new Set());
  const [extraUnits, setExtraUnits] = useState([]);
  const [delta, setDelta] = useState("");
  const [stockReference, setStockReference] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [costEdit, setCostEdit] = useState(null);
  const products = useManageableProducts({ per_page: 100, is_active: true });
  const productMovements = useStockMovements({ per_page: 100, ...(deferred ? { search: deferred } : {}) });
  const materials = useRawMaterials({ per_page: 100, ...(deferred ? { search: deferred } : {}) });
  const materialMovements = useRawMaterialMovements({ per_page: 100 });
  const adjustStock = useAdjustStock();
  const saveMaterial = useSaveRawMaterial();
  const deleteMaterial = useDeleteRawMaterial();
  const adjustMaterial = useAdjustRawMaterial();
  const saveProductCosting = useSaveProductCosting();

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
    const key = String(id);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  const toggleMaterialAll = () => setMaterialSelected((current) => (materialRows.length && current.size === materialRows.length ? new Set() : new Set(materialRows.map((row) => `m-${row.id}`))));

  const createUnit = async (name) => {
    const clean = String(name || "").trim();
    if (!clean) return null;
    setExtraUnits((current) => (current.includes(clean) ? current : [...current, clean]));
    setMaterialForm((current) => ({ ...current, unit: clean }));
    return { value: clean, label: clean };
  };

  const stockSpreadsheet = useSpreadsheetWorkspace({ module: "stock", label: "Stok Produk", allowBulkDelete: false, onCompleted: () => productMovements.refetch() });
  const materialSpreadsheet = useSpreadsheetWorkspace({ module: "raw-material", label: "Bahan Baku", selectedRows: materialRows.filter((row) => materialSelected.has(`m-${row.id}`)), allowBulkDelete: true, onCompleted: () => { materials.refetch(); setMaterialSelected(new Set()); } });
  const materialStockSpreadsheet = useSpreadsheetWorkspace({ module: "raw-material-stock", label: "Stok Bahan Baku", allowBulkDelete: false, onCompleted: () => { materials.refetch(); materialMovements.refetch(); } });

  const allWorkspaces = [stockSpreadsheet, materialSpreadsheet, materialStockSpreadsheet];
  const activeWorkspace = allWorkspaces.find((workspace) => workspace.activeOperation) || stockSpreadsheet;

  const allProductVariants = useMemo(
    () => (products.data?.rows || []).flatMap((product) => (product.variants || []).map((variant) => ({ ...variant, product_name: product.name, product_id: product.id }))),
    [products.data?.rows],
  );

  const variants = useMemo(() => {
    const rows = allProductVariants;
    if (!deferred) return rows;
    const needle = deferred.toLowerCase();
    return rows.filter((row) => [row.product_name, row.name, row.sku].some((value) => String(value || "").toLowerCase().includes(needle)));
  }, [deferred, allProductVariants]);

  const opnameOptions = useMemo(() => {
    const productOptions = allProductVariants.map((variant) => ({
      value: `v:${variant.id}`,
      label: `${variant.product_name || "Produk"} · ${variant.name || variant.sku || "-"}`,
      keywords: `${variant.sku || ""} ${variant.product_name || ""} ${variant.name || ""}`,
      group: "Produk / Varian",
    }));
    const materialOptions = materialRows.map((row) => ({
      value: `m:${row.id}`,
      label: `${row.code ? `${row.code} - ` : ""}${row.name || ""}`,
      keywords: `${row.code || ""} ${row.name || ""}`,
      group: "Bahan Baku",
    }));
    return [...productOptions, ...materialOptions];
  }, [allProductVariants, materialRows]);

  const productRows = useMemo(
    () => variants.map((row) => ({
      ...row,
      __kind: "product",
      id: `v-${row.id}`,
      raw_id: row.id,
      kind_label: "Produk",
      code: row.sku || "",
      name: row.product_name || "-",
      variant: row.name || "-",
      unit: "pcs",
      minimum_stock: null,
      is_active: true,
    })),
    [variants],
  );

  const materialOutRows = useMemo(
    () => materialRows.map((row) => ({
      ...row,
      __kind: "material",
      id: `m-${row.id}`,
      raw_id: row.id,
      kind_label: "Bahan Baku",
      variant: "-",
      is_active: row.is_active !== false,
    })),
    [materialRows],
  );

  const stockRows = useMemo(() => {
    const rows = [...productRows, ...materialOutRows];
    if (!deferred) return rows;
    const needle = deferred.toLowerCase();
    return rows.filter((row) => [row.name, row.variant, row.code, row.kind_label].some((value) => String(value || "").toLowerCase().includes(needle)));
  }, [productRows, materialOutRows, deferred]);

  const dateHistoryRows = useMemo(() => {
    const merged = [
      ...(productMovements.data?.rows || []).map((row) => ({
        ...row,
        id: `pm-${row.id}`,
        source: "Produk",
        item: [row.product_name, row.variant_name].filter(Boolean).join(" · ") || "-",
      })),
      ...(materialMovements.data?.rows || []).map((row) => ({
        ...row,
        id: `mm-${row.id}`,
        source: "Bahan Baku",
        item: row.material?.name || row.material_name || "-",
      })),
    ];
    return merged.sort((left, right) => new Date(right.occurred_at || 0) - new Date(left.occurred_at || 0));
  }, [productMovements.data?.rows, materialMovements.data?.rows]);

  const usageHistoryRows = useMemo(() => {
    const all = materialMovements.data?.rows || [];
    const usage = all.filter((row) => /usage|consum|pemakaian/i.test(String(row.type || "")));
    return usage.length ? usage : all;
  }, [materialMovements.data?.rows]);

  const totalStock = useListTotalCount(undefined, { fallbackTotal: stockRows.length, label: "Barang" });
  const activeTotal = totalStock;

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

  const rawVariant = (row) => allProductVariants.find((item) => String(item.id) === String(row?.raw_id ?? row?.id)) || row;
  const rawMaterial = (row) => materialRows.find((item) => String(item.id) === String(row?.raw_id ?? row?.id)) || row;

  const openRowDetail = (row) => {
    if (row.__kind === "material") {
      setMaterialForm({ ...rawMaterial(row) });
      return;
    }
    openProductDetail(row);
  };

  const stockColumns = [
    { key: "kind_label", label: "Jenis", filterType: "select", options: [{ value: "Produk", label: "Produk" }, { value: "Bahan Baku", label: "Bahan Baku" }] },
    { key: "code", label: "Kode / SKU", filterType: "text" },
    { key: "name", label: "Nama", filterType: "text" },
    { key: "variant", label: "Varian", filterType: "text" },
    { key: "unit", label: "Satuan", filterType: "select", options: unitOptions },
    { key: "stock", label: "Stok", filterType: "range" },
    { key: "minimum_stock", label: "Minimum", filterType: "range", render: (row) => (row.minimum_stock === null || row.minimum_stock === undefined ? "-" : number(row.minimum_stock)) },
    { key: "average_cost", label: "Biaya Rata-rata", filterType: "range", render: (row) => money(row.average_cost), align: "right" },
    { key: "is_active", label: "Status", filterType: "select", options: [{ value: "true", label: "Aktif" }, { value: "false", label: "Non-Aktif" }], render: (row) => (row.__kind === "material"
      ? <InlineActiveSwitch checked={row.is_active !== false} pending={activeToggleId === row.raw_id} activeLabel="Aktif" inactiveLabel="Non-Aktif" compact showLabel={false} onChange={(next) => toggleMaterialActive(rawMaterial(row), next)} />
      : <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">Aktif</span>) },
    {
      key: "actions",
      label: "Aksi",
      defaultVisible: false,
      filterable: false,
      width: 96,
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          <button type="button" title="Edit Biaya" onClick={() => setCostEdit({ kind: row.__kind, id: row.raw_id, name: row.name, code: row.code, cost: row.average_cost })} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"><span className="material-symbols-outlined text-[17px]">attach_money</span></button>
        </div>
      ),
    },
  ];
  const historyDateColumns = [
    { key: "occurred_at", label: "Tanggal", render: (row) => (row.occurred_at ? new Date(row.occurred_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"), filterType: "text" },
    { key: "source", label: "Sumber", filterType: "select", options: [{ value: "Produk", label: "Produk" }, { value: "Bahan Baku", label: "Bahan Baku" }] },
    { key: "item", label: "Barang", filterType: "text" },
    { key: "type", label: "Jenis", filterType: "text" },
    { key: "quantity_delta", label: "Perubahan", filterType: "range" },
    { key: "balance_after", label: "Saldo", filterType: "range" },
    { key: "notes", label: "Catatan", filterType: "text" },
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

  const spreadsheetActions = stockSpreadsheet.actions;

  function submitOpnamePicker(event) {
    event.preventDefault();
    const [kind, rawId] = String(opnameTarget || "").split(":");
    if (kind === "v") {
      const row = allProductVariants.find((variant) => String(variant.id) === String(rawId));
      if (!row) return;
      setProductAdjust(row);
      setDelta("");
      setStockReference("");
      setOpnamePickerOpen(false);
      return;
    }
    const row = materialRows.find((material) => String(material.id) === String(rawId));
    if (!row) return;
    setMaterialAdjust(row);
    setDelta("");
    setUnitCost(String(row.average_cost || ""));
    setStockReference("");
    setOpnamePickerOpen(false);
  }

  async function toggleMaterialActive(row, next) {
    if (saveMaterial.isPending) return;
    setActiveToggleId(row.id);
    try {
      await saveMaterial.mutateAsync({
        id: row.id,
        values: {
          code: row.code || null,
          name: row.name,
          unit: row.unit,
          minimum_stock: Number(row.minimum_stock || 0),
          average_cost: Number(row.average_cost || 0),
          is_active: next,
        },
      });
      toastSuccess("Status Bahan Baku", `${row.name || row.code} ditandai ${next ? "aktif" : "non-aktif"}.`);
    } catch (error) {
      toastError("Status Bahan Baku", advancedError(error));
    } finally {
      setActiveToggleId(null);
    }
  }

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
    } catch (error) {
      toastError("Stock / Restock Bahan Baku", advancedError(error));
    }
  }

  async function submitCostEdit(event) {
    event.preventDefault();
    if (!costEdit) return;
    try {
      if (costEdit.kind === "material") {
        const material = materialRows.find((row) => String(row.id) === String(costEdit.id));
        if (!material) return;
        await saveMaterial.mutateAsync({
          id: material.id,
          values: {
            code: material.code || null,
            name: material.name,
            unit: material.unit,
            minimum_stock: Number(material.minimum_stock || 0),
            average_cost: Number(costEdit.cost) || 0,
            is_active: material.is_active !== false,
          },
        });
        toastSuccess("Edit Biaya Bahan Baku", `Biaya ${material.name || material.code} berhasil diperbarui.`);
        materials.refetch();
        materialMovements.refetch();
      } else {
        await saveProductCosting.mutateAsync({ productId: costEdit.id, values: { average_cost: Number(costEdit.cost) || 0 } });
        toastSuccess("Edit Biaya Produk", `Biaya ${costEdit.name || costEdit.code} berhasil diperbarui.`);
        products.refetch();
      }
      setCostEdit(null);
    } catch (error) {
      toastError("Edit Biaya", advancedError(error));
    }
  }

  const materialCard = {
    title: (row) => row.name || row.code || "Bahan Baku",
    subtitle: (row) => row.code || "-",
    badges: [(row) => (
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${row.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
        {row.is_active ? "Aktif" : "Non-Aktif"}
      </span>
    )],
    fields: [
      { label: "Satuan", render: (row) => row.unit || "-" },
      { label: "Stok", render: (row) => number(row.stock) },
      { label: "Minimum", render: (row) => number(row.minimum_stock) },
      { label: "Biaya Rata-rata", render: (row) => money(row.average_cost) },
    ],
  };

  const viewModeOptions = [
    { key: "list", icon: "view_list", label: "Tampilan list" },
    { key: "grid", icon: "grid_view", label: "Tampilan kartu" },
    { key: "chart", icon: "bar_chart", label: "Tampilan grafik" },
  ];
  const specialActionButton = (
    <SpecialActionButton
      icon="warehouse"
      label="Restock / Stock Opname"
      title="Restock atau stock opname produk maupun bahan baku"
      onClick={() => { setProductAdjust(null); setMaterialAdjust(null); setOpnameTarget(""); setOpnamePickerOpen(true); }}
    />
  );

  const isMaterialScope = true;
  const canCreateMaterial = true;

  const filters = (
    <>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari produk, varian, atau bahan baku"
        className={toolbarControlClassName}
      />
    </>
  );

  return <>
    <ModuleFrame
      title="Persediaan"
      subtitle="Stok produk, bahan baku, produksi, audit pergerakan, import/export terpisah, dan laporan dampak kenaikan biaya terhadap HPP."
      query={query}
      onQueryChange={setQuery}
      onRefresh={() => { products.refetch(); productMovements.refetch(); materials.refetch(); materialMovements.refetch(); }}
      refreshing={false}
      filters={filters}
      totalCount={activeTotal?.totalCount}
      totalLabel={activeTotal?.totalLabel}
      totalTitle={activeTotal?.totalTitle}
      onCreate={canCreateMaterial ? () => setMaterialForm({ ...MATERIAL_EMPTY }) : undefined}
      createLabel="Bahan Baku"
      selectionEnabled={isMaterialScope && materialSelected.size > 0}
      selectedCount={materialSelected.size}
      onToggleSelection={isMaterialScope ? () => (materialSelected.size ? setMaterialSelected(new Set()) : setMaterialSelected(new Set(materialRows.map((row) => `m-${row.id}`)))) : undefined}
      bulkActions={spreadsheetActions}
      extraActions={viewMode === "chart" ? specialActionButton : undefined}
      viewMode={viewMode}
      onChangeViewMode={setViewMode}
      viewModeOptions={viewModeOptions}
    >
      {viewMode === "chart" ? <StockChartTab variants={variants} /> : null}
      {viewMode !== "chart" ? (
        <DataGrid viewMode={viewMode} headerActions={specialActionButton} storageKey="inventory.stock-all-v2" onFilterStateChange={totalStock.onFilterStateChange} columns={stockColumns} rows={stockRows} emptyText="Belum ada stok produk maupun bahan baku." onRowClick={openRowDetail} selectionEnabled selectedIds={materialSelected} allSelected={materialAllSelected} onToggleRow={toggleMaterialRow} onToggleAll={toggleMaterialAll} isRowSelectable={(row) => row.__kind === "material"} />
      ) : null}
    </ModuleFrame>

    <SpreadsheetOperationPanel workspace={activeWorkspace} />

    <FormModal open={Boolean(productAdjust)} title="Stock / Restock Produk" onClose={() => setProductAdjust(null)} onSubmit={submitProductStock} busy={adjustStock.isPending || (productionQuantity > 0 && productionPreview.some((row) => !row.enough))} submitLabel="Simpan">
      <Field label="Perubahan Stok" required hint="Positif berarti produksi/restock dan otomatis memakai bahan baku resep. Negatif berarti pengeluaran stok produk."><Input type="number" value={delta} onChange={(event) => setDelta(event.target.value)} required /></Field>
      <Field label="No. Referensi Stok" hint="Boleh diisi manual, atau kosongkan agar sistem membuat nomor otomatis (mis. STK-MASUK-20260927-001)."><Input value={stockReference} onChange={(event) => setStockReference(event.target.value)} placeholder="Kosongkan untuk nomor otomatis" /></Field>
      {productionQuantity > 0 ? <div className="space-y-2 border border-blue-200 bg-blue-50 p-3"><p className="text-xs font-black uppercase text-blue-700">Estimasi pemakaian bahan untuk {productionQuantity} produk</p>{productionPreview.length ? productionPreview.map((row) => <div key={row.raw_material_id} className="flex items-center justify-between gap-3 text-sm"><span>{row.material_code} - {row.material_name}</span><span className={row.enough ? "font-bold text-slate-700" : "font-bold text-red-700"}>Butuh {number(row.required)} {row.unit} / Stok {number(row.stock)} {row.unit}</span></div>) : <p className="text-sm text-blue-800">Produk belum memiliki resep bahan baku. Penambahan stok tetap diperbolehkan tanpa konsumsi bahan.</p>}</div> : null}
    </FormModal>

    <FormModal open={Boolean(materialForm)} title={materialForm?.id ? "Edit Bahan Baku" : "Data Baru Bahan Baku"} onClose={() => setMaterialForm(null)} onSubmit={submitMaterial} busy={saveMaterial.isPending} submitLabel="Simpan" extraActions={materialForm?.id ? [{ icon: "add_box", label: "Stock / Restock", tone: "teal", onClick: () => { setMaterialAdjust(materialForm); setDelta(""); setUnitCost(String(materialForm?.average_cost || "")); setStockReference(""); setMaterialForm(null); } }] : []}>
      <div className="grid gap-4 md:grid-cols-2">
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

    <FormModal open={opnamePickerOpen} title="Restock / Stock Opname" subtitle="Pilih produk, varian, atau bahan baku yang akan disesuaikan stoknya." onClose={() => setOpnamePickerOpen(false)} onSubmit={submitOpnamePicker} submitLabel="Lanjutkan">
      <Field label="Barang" required hint="Produk ditampilkan lengkap dengan variannya, bahan baku ditampilkan terpisah.">
        <SearchableSelect
          value={opnameTarget}
          onChange={setOpnameTarget}
          options={opnameOptions}
          placeholder="Pilih produk / varian / bahan baku"
          searchPlaceholder="Cari nama, SKU, atau kode bahan"
          emptyText="Barang tidak ditemukan"
          clearable={false}
        />
      </Field>
    </FormModal>

    <FormModal open={Boolean(costEdit)} title="Edit Biaya" subtitle="Ubah biaya rata-rata untuk bahan baku atau produk." onClose={() => setCostEdit(null)} onSubmit={submitCostEdit} busy={saveMaterial.isPending || saveProductCosting.isPending} submitLabel="Simpan">
      <Field label="Biaya Rata-rata" required hint="Masukkan biaya rata-rata baru per satuan. Untuk bahan baku, nilai ini mempengaruhi weighted average cost dan HPP produk terkait."><Input type="number" step="0.0001" min="0" value={costEdit?.cost || ""} onChange={(event) => setCostEdit((current) => current ? { ...current, cost: event.target.value } : null)} required /></Field>
    </FormModal>

    <ConfirmDialog open={Boolean(materialDelete)} title="Hapus Bahan Baku" message={`Bahan baku “${materialDelete?.name || materialDelete?.code || ""}” akan dihapus dari master. Riwayat pergerakan stok tetap tersimpan.`} pending={deleteMaterial.isPending} onClose={() => setMaterialDelete(null)} onConfirm={removeMaterial} />
  </>;
}
