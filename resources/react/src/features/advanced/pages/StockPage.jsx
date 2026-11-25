import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { advancedError, useAdjustRawMaterial, useAdjustStock, useDeleteRawMaterial, useManageableProducts, useProductCosting, useRawMaterialCostImpacts, useRawMaterialMovements, useRawMaterials, useSaveProductCosting, useSaveRawMaterial, useStockMovements } from "@/features/advanced/services/advancedMarketplaceService";
import { normalizeSellerProduct } from "@/features/seller/product/services/sellerProductService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { buildDatabaseColumns } from "@/shared/utils/tableData";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { StockChartPanel } from "@/shared/charts/ChartPanels";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { inputClassName } from "@/shared/components/form/FormField";
import { Input } from "@/shared/components/ui/Input";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { toolbarControlClassName } from "@/shared/components/crud/toolbarControlClassName";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { useEntityEditor } from "@/shared/hooks";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { ExcelActionButtons } from "@/shared/excel";
import { showSuccess, showError, confirmDelete, showLoading, closeLoading, confirmAction } from "@/shared/utils/sweetAlert";
import { MultiImagePicker } from "@/shared/components/form";
import { DetailTabs } from "@/shared/components/ui/DetailTabs";

const MATERIAL_EMPTY = { code: "", name: "", unit: "pcs", minimum_stock: 0, average_cost: 0, is_active: true };

const DEFAULT_UNITS = ["pcs", "kg", "gram", "liter", "ml", "meter", "cm", "dus", "botol", "sachet", "lusin", "pack", "rim", "unit", "buah"];

function number(value, digits = 4) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(Number(value || 0));
}

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function MaterialFormContent({
  materialForm,
  setMaterialForm,
  unitOptions,
  createUnit,
  number,
  money,
  inputClassName,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Kode" hint="Kosongkan agar dibuat otomatis oleh sistem (mis. RM-GULA), atau isi kode manual."><Input value={materialForm?.code || ""} onChange={(event) => setMaterialForm((current) => ({ ...current, code: event.target.value }))} placeholder="Otomatis bila dikosongkan" /></Field>
      <Field label="Nama" required><Input value={materialForm?.name || ""} onChange={(event) => setMaterialForm((current) => ({ ...current, name: event.target.value }))} required /></Field>
      <Field label="Satuan" required hint="Pilih satuan yang sudah ada, atau ketik satuan baru untuk menambah langsung ke daftar."><SearchableSelect value={materialForm?.unit || ""} onChange={(nextValue) => setMaterialForm((current) => ({ ...current, unit: nextValue }))} options={unitOptions} clearable={false} onCreate={createUnit} createLabel={(name) => `Satuan “${name}” belum ada, tambahkan sekarang`} placeholder="Pilih / ketik satuan" searchPlaceholder="Cari atau ketik satuan baru" /></Field>
      <Field label="Minimum Stok"><Input type="number" min="0" value={materialForm?.minimum_stock || 0} onChange={(event) => setMaterialForm((current) => ({ ...current, minimum_stock: event.target.value }))} /></Field>
      <Field label="Biaya Rata-rata" hint={materialForm?.id ? "Biaya rata-rata berubah melalui Stock / Restock Bahan Baku agar weighted average dan histori HPP tercatat." : "Biaya awal bahan sebelum transaksi restock pertama."}><Input type="number" min="0" value={materialForm?.average_cost || 0} disabled={Boolean(materialForm?.id)} onChange={(event) => setMaterialForm((current) => ({ ...current, average_cost: event.target.value }))} className={materialForm?.id ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""} /></Field>
    </div>
  );
}

function StockMovementHistoryTab({ materialId, materialMovements, number, money }) {
  const movements = materialMovements.data?.rows || [];

  if (!materialId) {
    return <p className="text-sm text-slate-500">Pilih bahan baku untuk melihat riwayat stok.</p>;
  }

  if (materialMovements.isLoading) {
    return <p className="text-sm text-slate-500">Memuat riwayat stok...</p>;
  }

  if (!movements.length) {
    return <p className="text-sm text-slate-500">Belum ada riwayat pergerakan stok.</p>;
  }

  const filteredMovements = movements.filter((m) => String(m.raw_material_id ?? m.material?.id) === String(materialId));

  if (!filteredMovements.length) {
    return <p className="text-sm text-slate-500">Belum ada riwayat pergerakan stok untuk bahan baku ini.</p>;
  }

  return (
    <div className="space-y-3">
      {filteredMovements.map((row) => (
        <div key={row.id} className="border border-slate-200 bg-white rounded-xl p-4">
          <div className="grid gap-3 sm:grid-cols-4 mb-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Tanggal</p>
              <p className="font-medium text-slate-900">{row.occurred_at ? new Date(row.occurred_at).toLocaleString("id-ID") : "-"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Jenis</p>
              <p className="font-medium text-slate-700 capitalize">{row.type || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Perubahan</p>
              <p className="font-bold text-slate-700">{number(row.quantity_delta)}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Saldo</p>
              <p className="font-medium text-slate-700">{number(row.balance_after)}</p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <div className="grid gap-2 sm:grid-cols-4 mb-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Biaya/Satuan</p>
                <p className="font-semibold text-slate-700">{row.unit_cost != null ? money(row.unit_cost) : "-"}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Referensi</p>
                <p className="font-semibold text-slate-700">{row.reference_number || "-"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Catatan</p>
                <p className="text-slate-600">{row.notes || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Bukti Gambar</p>
              {row.proof_images && row.proof_images.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {row.proof_images.map((img, idx) => (
                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="inline-flex h-16 w-16 rounded-lg overflow-hidden ring-1 ring-slate-200 bg-slate-50">
                      <img src={img} alt={`Bukti ${idx + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform" />
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400">Tidak ada bukti</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StockPage() {
  const [viewMode, setViewMode] = useState("list");
  const viewModeOptions = [
    { value: "list", label: "Daftar", icon: "view_list" },
    { value: "grid", label: "Kartu", icon: "grid_view" },
    { value: "chart", label: "Grafik", icon: "insert_chart" },
  ];
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
  // Tab per entitas untuk master bahan baku (tambah/edit), seperti halaman
  // Product. Dialog aksi (restock, biaya) tetap memakai modal.
  const editor = useEntityEditor({ getEditLabel: (row) => row.name || row.code || "Bahan Baku" });
  const [materialAdjust, setMaterialAdjust] = useState(null);
  const [materialDelete, setMaterialDelete] = useState(null);
  const [materialSelected, setMaterialSelected] = useState(new Set());
  const [extraUnits, setExtraUnits] = useState([]);
  const [delta, setDelta] = useState("");
  const [stockReference, setStockReference] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [productAdjustImages, setProductAdjustImages] = useState([]);
  const [materialAdjustImages, setMaterialAdjustImages] = useState([]);
  const [costEdit, setCostEdit] = useState(null);
  const products = useManageableProducts({ per_page: 100, is_active: true });
  const productMovements = useStockMovements({ per_page: 100, ...(deferred ? { search: deferred } : {}) });
  const materials = useRawMaterials({ per_page: 100, ...(deferred ? { search: deferred } : {}) });
  const materialMovements = useRawMaterialMovements({ per_page: 100 });
  // Riwayat kenaikan HPP dipakai sebagai kolom + modal riwayat per barang.
  const costImpacts = useRawMaterialCostImpacts({ per_page: 100 });
  const [historyTarget, setHistoryTarget] = useState(null);
  const [historyPeriod, setHistoryPeriod] = useState("30");
  const adjustStock = useAdjustStock();
  const saveMaterial = useSaveRawMaterial();
  const deleteMaterial = useDeleteRawMaterial();
  const adjustMaterial = useAdjustRawMaterial();
  const saveProductCosting = useSaveProductCosting();
  // Resep/bahan produksi dipakai untuk pratinjau pemakaian bahan saat
  // restock produk. Sebelumnya query ini tidak pernah dibuat sehingga
  // seluruh halaman Persediaan error (`productionCosting is not defined`).
  const productionCosting = useProductCosting(productAdjust?.product_id ?? productAdjust?.productId ?? null, Boolean(productAdjust));

  const materialRows = useMemo(() => materials.data?.rows || [], [materials.data?.rows]);

  useEffect(() => {
    if (!editor.open) {
      setMaterialForm(null);
      return;
    }
    setMaterialForm(editor.entity ? { ...editor.entity } : { ...MATERIAL_EMPTY });
  }, [editor.open, editor.activeTab?.id]);
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
      editor.edit(rawMaterial(row));
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
    { key: "hpp_impact", label: "Kenaikan HPP", filterable: false, align: "right", render: (row) => {
      const impact = hppImpactOf(row);
      if (!impact) return <span className="text-slate-400">-</span>;
      const positive = impact.percent >= 0;
      return (
        <span className={positive ? "rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-extrabold text-amber-700" : "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-extrabold text-emerald-700"}>
          {positive ? "+" : ""}{number(impact.percent, 2)}%
        </span>
      );
    } },
    { key: "is_active", label: "Status", filterType: "select", options: [{ value: "true", label: "Aktif" }, { value: "false", label: "Non-Aktif" }], render: (row) => (row.__kind === "material"
      ? <InlineActiveSwitch checked={row.is_active !== false} pending={activeToggleId === row.raw_id} activeLabel="Aktif" inactiveLabel="Non-Aktif" compact showLabel={false} onChange={(next) => toggleMaterialActive(rawMaterial(row), next)} />
      : <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">Aktif</span>) },
    // Sisa kolom database varian produk & bahan baku (kolom ID otomatis dibuang).
    ...buildDatabaseColumns(stockRows, {
      omit: ["__kind", "raw_id", "kind_label", "code", "name", "variant", "unit", "stock", "minimum_stock", "average_cost", "hpp_impact", "is_active", "product_id", "product_name"],
      labels: {
        sku: "SKU",
        price: "Harga",
        price_original: "Harga Awal",
        price_sale: "Harga Diskon",
        hpp: "HPP",
        po_stock: "Stok PO",
        stock_reserved: "Stok Dipesan",
        stock_booked: "Stok Terkunci",
        stock_preorder: "Stok Preorder",
        max_order_qty: "Maks. Order",
        min_stock: "Min. Stok",
        is_default: "Varian Utama",
        image: "Gambar",
        created_at: "Dibuat",
        updated_at: "Diubah",
        deleted_at: "Dihapus",
      },
    }),
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
    // Sisa kolom database riwayat biaya bahan baku.
    ...buildDatabaseColumns(costImpacts.data?.rows || [], {
      omit: ["id", "raw_material_id", "raw_material_stock_movement_id", "occurred_at", "material", "product", "cost_history", "old_cost", "new_cost", "old_hpp", "new_hpp", "hpp_change_percent", "new_suggested_price"],
      labels: {
        change_amount: "Selisih Biaya",
        change_percent: "Persentase Selisih",
        direction: "Arah",
        reference_type: "Tipe Referensi",
        reference_number: "Referensi",
        old_average_cost: "Biaya Rata-rata Lama",
        new_average_cost: "Biaya Rata-rata Baru",
        created_at: "Dibuat",
        updated_at: "Diubah",
      },
    }),
  ];

  // Peta dampak HPP terakhir per bahan baku (untuk kolom "Kenaikan HPP").
  const hppImpactByMaterial = useMemo(() => {
    const map = new Map();
    (costImpacts.data?.rows || []).forEach((impact) => {
      const materialId = impact.raw_material_id ?? impact.material?.id;
      if (!materialId) return;
      const percent = Number(impact.hpp_change_percent ?? (Number(impact.old_hpp) > 0 ? ((Number(impact.new_hpp) - Number(impact.old_hpp)) / Number(impact.old_hpp)) * 100 : 0));
      const current = map.get(String(materialId));
      if (!current || Math.abs(percent) > Math.abs(current.percent)) {
        map.set(String(materialId), { percent, newHpp: impact.new_hpp, product: impact.product?.name || "" });
      }
    });
    return map;
  }, [costImpacts.data?.rows]);

  // Satu kolom "Aksi Khusus" per baris: restock/stock opname + ubah biaya.
  // Tombol hijau di toolbar dihapus agar tidak ada aksi ganda.
  const rowSpecialActions = (row) => {
    const isMaterial = row.__kind === "material";
    return (
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          title={isMaterial ? "Restock / Stock Opname bahan baku" : "Restock / Stock Opname produk"}
          onClick={() => {
            if (isMaterial) {
              setMaterialAdjust(rawMaterial(row));
              setDelta("");
              setUnitCost(String(row.average_cost || ""));
              setStockReference("");
            } else {
              setProductAdjust(row);
              setDelta("");
              setStockReference("");
            }
          }}
          className="inline-flex h-8 items-center gap-1 rounded-md bg-emerald-50 px-2 text-[11px] font-extrabold text-emerald-700 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-100"
        >
          <span className="material-symbols-outlined text-[16px]">warehouse</span>
          Restock
        </button>
        <button
          type="button"
          title="Ubah biaya bahan baku / produk"
          onClick={() => setCostEdit({ kind: row.__kind, id: row.raw_id, name: row.name, code: row.code, cost: row.average_cost })}
          className="inline-flex h-8 items-center gap-1 rounded-md bg-amber-50 px-2 text-[11px] font-extrabold text-amber-700 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-100"
        >
          <span className="material-symbols-outlined text-[16px]">attach_money</span>
          Biaya
        </button>
        <button
          type="button"
          title="Riwayat stok & HPP barang ini"
          onClick={() => { setHistoryPeriod("30"); setHistoryTarget(row); }}
          className="inline-flex h-8 items-center gap-1 rounded-md bg-slate-100 px-2 text-[11px] font-extrabold text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-200"
        >
          <span className="material-symbols-outlined text-[16px]">history</span>
          Riwayat
        </button>
      </div>
    );
  };

  const hppImpactOf = (row) => {
    if (row.__kind !== "material") return null;
    return hppImpactByMaterial.get(String(row.raw_id)) || null;
  };

  // Riwayat per barang: produk memakai product movements, bahan baku memakai
  // material movements. Periode diatur lewat dropdown (semua/7/30/90 hari).
  const historyRows = useMemo(() => {
    if (!historyTarget) return [];
    const source = historyTarget.__kind === "material"
      ? (materialMovements.data?.rows || []).filter((item) => String(item.raw_material_id ?? item.material?.id) === String(historyTarget.raw_id))
      : (productMovements.data?.rows || []).filter((item) => String(item.variant_id ?? item.product_variant_id ?? item.product_id) === String(historyTarget.raw_id) || String(item.product_id) === String(historyTarget.product_id));
    if (historyPeriod === "all") return source;
    const days = Number(historyPeriod);
    const limit = Date.now() - days * 24 * 60 * 60 * 1000;
    return source.filter((item) => {
      const when = item.occurred_at ? new Date(item.occurred_at).getTime() : 0;
      return !when || when >= limit;
    });
  }, [historyTarget, historyPeriod, materialMovements.data?.rows, productMovements.data?.rows]);

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
      showSuccess("Berhasil", `${row.name || row.code} ditandai ${next ? "aktif" : "non-aktif"}.`);
    } catch (error) {
      showError("Gagal", advancedError(error));
    } finally {
      setActiveToggleId(null);
    }
  }

  async function submitProductStock(event) {
    event.preventDefault();
    if (adjustStock.isPending) return;
    if (productionQuantity > 0 && productionPreview.some((row) => !row.enough)) {
      showError("Validasi", "Stok bahan baku belum mencukupi untuk jumlah produksi tersebut.");
      return;
    }
    const loading = showLoading("Menyimpan...", "Stok produk sedang diperbarui");
    try {
      await adjustStock.mutateAsync({ variant_id: productAdjust.id, quantity_delta: Number(delta), reference_type: Number(delta) > 0 ? "production_restock" : "manual", reference_id: String(stockReference || "").trim() || null, notes: Number(delta) > 0 ? "Produksi / restock dari Persediaan" : "Penyesuaian dari Persediaan", proof_images: productAdjustImages });
      setProductAdjust(null);
      setDelta("");
      setStockReference("");
      setProductAdjustImages([]);
      closeLoading();
      showSuccess("Berhasil", "Stok produk berhasil diperbarui dan pemakaian bahan baku telah dicatat.");
      products.refetch();
      productMovements.refetch();
      materials.refetch();
      materialMovements.refetch();
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
    }
  }

  async function submitMaterial(event) {
    event.preventDefault();
    if (saveMaterial.isPending) return;
    const loading = showLoading("Menyimpan...", "Bahan baku sedang disimpan");
    try {
      await saveMaterial.mutateAsync({ id: materialForm?.id, values: materialForm });
      setMaterialForm(null);
      editor.completeSave();
      closeLoading();
      showSuccess("Berhasil", "Bahan baku berhasil disimpan. Jika biaya berubah, HPP produk terkait telah dihitung ulang.");
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
    }
  }

  const removeMaterial = async () => {
    if (!materialDelete || deleteMaterial.isPending) return;
    const confirmed = await confirmDelete({ title: "Hapus Bahan Baku", text: `Bahan baku "${materialDelete.name || materialDelete.code}" akan dihapus permanen. Riwayat pergerakan stok tetap tersimpan.` });
    if (!confirmed.isConfirmed) return;
    const loading = showLoading("Menghapus...", "Bahan baku sedang dihapus");
    try {
      await deleteMaterial.mutateAsync(materialDelete.id);
      setMaterialDelete(null);
      setMaterialSelected(new Set());
      closeLoading();
      showSuccess("Berhasil", `Bahan baku ${materialDelete.name || materialDelete.code} berhasil dihapus.`);
      materials.refetch();
      materialMovements.refetch();
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
    }
  };

  async function submitMaterialStock(event) {
    event.preventDefault();
    if (adjustMaterial.isPending) return;
    const loading = showLoading("Menyimpan...", "Stok bahan baku sedang diperbarui");
    try {
      await adjustMaterial.mutateAsync({ id: materialAdjust.id, values: { quantity_delta: Number(delta), unit_cost: unitCost ? Number(unitCost) : null, reference_type: Number(delta) > 0 ? "restock" : "usage", reference_number: String(stockReference || "").trim() || null, notes: "Pergerakan dari Persediaan", proof_images: materialAdjustImages } });
      setMaterialAdjust(null);
      setDelta("");
      setUnitCost("");
      setStockReference("");
      setMaterialAdjustImages([]);
      closeLoading();
      showSuccess("Berhasil", "Stok bahan baku berhasil diperbarui. Dampak biaya terhadap HPP sudah disinkronkan.");
      materials.refetch();
      materialMovements.refetch();
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
    }
  }

  async function submitCostEdit(event) {
    event.preventDefault();
    if (!costEdit) return;
    const loading = showLoading("Menyimpan...", "Biaya sedang diperbarui");
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
        closeLoading();
        showSuccess("Berhasil", `Biaya ${material.name || material.code} berhasil diperbarui.`);
        materials.refetch();
        materialMovements.refetch();
      } else {
        await saveProductCosting.mutateAsync({ productId: costEdit.id, values: { average_cost: Number(costEdit.cost) || 0 } });
        closeLoading();
        showSuccess("Berhasil", `Biaya ${costEdit.name || costEdit.code} berhasil diperbarui.`);
        products.refetch();
      }
      setCostEdit(null);
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
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
    {editor.isListActive ? <ModuleFrame
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
      onCreate={canCreateMaterial ? () => editor.create() : undefined}
      createLabel="Bahan Baku"
      selectionEnabled={isMaterialScope && materialSelected.size > 0}
      selectedCount={materialSelected.size}
      onToggleSelection={isMaterialScope ? () => (materialSelected.size ? setMaterialSelected(new Set()) : setMaterialSelected(new Set(materialRows.map((row) => `m-${row.id}`)))) : undefined}
      bulkActions={[]}
      extraActions={
        <ExcelActionButtons
          module="stock"
          label="Stok Produk"
          selection={{ enabled: materialSelected.size > 0, selectedCount: materialSelected.size, selectedRows: stockRows.filter((row) => row.__kind === "product" && materialSelected.has(row.id)), toggleEnabled: () => (materialSelected.size ? setMaterialSelected(new Set()) : setMaterialSelected(new Set(materialRows.map((row) => `m-${row.id}`)))) }}
          rows={productRows}
          onRefresh={() => { products.refetch(); productMovements.refetch(); }}
          onCompleted={() => {}}
          getRowId={(row) => row.raw_id}
          allowImport={true}
          allowExport={true}
          allowDelete={false}
        />
      }
      viewMode={viewMode}
      onChangeViewMode={setViewMode}
      viewModeOptions={viewModeOptions}
    >
      {viewMode === "chart" ? (
        <StockChartPanel data={{ products: products.data?.rows || [], materials: materials.data?.rows || [] }} isLoading={products.isLoading || materials.isLoading} />
      ) : (
        <DataGrid viewMode="list" renderSpecialActions={rowSpecialActions} storageKey="inventory.stock-all-v2" onFilterStateChange={totalStock.onFilterStateChange} columns={stockColumns} rows={stockRows} emptyText="Belum ada stok produk maupun bahan baku." onRowClick={openRowDetail} selectionEnabled selectedIds={materialSelected} allSelected={materialAllSelected} onToggleRow={toggleMaterialRow} onToggleAll={toggleMaterialAll} isRowSelectable={(row) => row.__kind === "material"} />
      )}
    </ModuleFrame> : null}

    <FormModal presentation="modal" open={Boolean(productAdjust)} title="Stock / Restock Produk" onClose={() => { setProductAdjust(null); setProductAdjustImages([]); }} onSubmit={submitProductStock} busy={adjustStock.isPending || (productionQuantity > 0 && productionPreview.some((row) => !row.enough))} submitLabel="Simpan">
      <Field label="Perubahan Stok" required hint="Positif berarti produksi/restock dan otomatis memakai bahan baku resep. Negatif berarti pengeluaran stok produk."><Input type="number" value={delta} onChange={(event) => setDelta(event.target.value)} required /></Field>
      <Field label="No. Referensi Stok" hint="Boleh diisi manual, atau kosongkan agar sistem membuat nomor otomatis (mis. STK-MASUK-20260927-001)."><Input value={stockReference} onChange={(event) => setStockReference(event.target.value)} placeholder="Kosongkan untuk nomor otomatis" /></Field>
      <Field label="Bukti Stok (Gambar)" hint="Wajib diisi minimal 1 gambar sebagai bukti restock/penyesuaian. Maksimal 5 gambar.">
        <MultiImagePicker value={productAdjustImages} onChange={setProductAdjustImages} scope="stock/products" maxFiles={5} />
      </Field>
      {productionQuantity > 0 ? <div className="space-y-2 border border-blue-200 bg-blue-50 p-3"><p className="text-xs font-black uppercase text-blue-700">Estimasi pemakaian bahan untuk {productionQuantity} produk</p>{productionPreview.length ? productionPreview.map((row) => <div key={row.raw_material_id} className="flex items-center justify-between gap-3 text-sm"><span>{row.material_code} - {row.material_name}</span><span className={row.enough ? "font-bold text-slate-700" : "font-bold text-red-700"}>Butuh {number(row.required)} {row.unit} / Stok {number(row.stock)} {row.unit}</span></div>) : <p className="text-sm text-blue-800">Produk belum memiliki resep bahan baku. Penambahan stok tetap diperbolehkan tanpa konsumsi bahan.</p>}</div> : null}
    </FormModal>

    <FormModal presentation="page" open={Boolean(materialForm)} title={materialForm?.id ? "Edit Bahan Baku" : "Data Baru Bahan Baku"} onClose={() => setMaterialForm(null)} onSubmit={submitMaterial} busy={saveMaterial.isPending} submitLabel="Simpan" extraActions={materialForm?.id ? [{ icon: "add_box", label: "Stock / Restock", tone: "teal", onClick: () => { const row = materialForm; setMaterialForm(null); editor.close(); setMaterialAdjust(row); setDelta(""); setUnitCost(String(row?.average_cost || "")); setStockReference(""); } }] : []}>
      {materialForm?.id ? (
        <DetailTabs
          tabs={[
            {
              id: "form",
              label: "Form",
              icon: "edit",
              content: (
                <MaterialFormContent
                  materialForm={materialForm}
                  setMaterialForm={setMaterialForm}
                  unitOptions={unitOptions}
                  createUnit={createUnit}
                  number={number}
                  money={money}
                  inputClassName={inputClassName}
                />
              ),
            },
            {
              id: "stock-history",
              label: "Riwayat Stok",
              icon: "history",
              content: (
                <StockMovementHistoryTab
                  materialId={materialForm.id}
                  materialMovements={materialMovements}
                  number={number}
                  money={money}
                />
              ),
            },
          ]}
          defaultTab="form"
        />
      ) : (
        <MaterialFormContent
          materialForm={materialForm}
          setMaterialForm={setMaterialForm}
          unitOptions={unitOptions}
          createUnit={createUnit}
          number={number}
          money={money}
          inputClassName={inputClassName}
        />
      )}
    </FormModal>

<FormModal presentation="modal" open={Boolean(materialAdjust)} title="Stock / Restock Bahan Baku" onClose={() => { setMaterialAdjust(null); setMaterialAdjustImages([]); }} onSubmit={submitMaterialStock} busy={adjustMaterial.isPending} submitLabel="Simpan">
      <Field label="Perubahan Stok" required hint="Positif untuk restock, negatif untuk pemakaian."><Input type="number" step="0.0001" value={delta} onChange={(event) => setDelta(event.target.value)} required /></Field>
      <Field label="Biaya per Satuan" hint="Saat restock, nilai ini dipakai untuk average cost tertimbang dan laporan dampak HPP."><Input type="number" step="0.0001" min="0" value={unitCost} onChange={(event) => setUnitCost(event.target.value)} /></Field>
      <Field label="No. Referensi Stok" hint="Boleh diisi manual, atau kosongkan agar sistem membuat nomor otomatis (mis. RM-RSK-20260927-001)."><Input value={stockReference} onChange={(event) => setStockReference(event.target.value)} placeholder="Kosongkan untuk nomor otomatis" /></Field>
      <Field label="Bukti Stok (Gambar)" hint="Wajib diisi minimal 1 gambar sebagai bukti restock/pemakaian. Maksimal 5 gambar.">
        <MultiImagePicker value={materialAdjustImages} onChange={setMaterialAdjustImages} scope="stock/materials" maxFiles={5} />
      </Field>
    </FormModal>

    <FormModal presentation="modal" open={opnamePickerOpen} title="Restock / Stock Opname" subtitle="Pilih produk, varian, atau bahan baku yang akan disesuaikan stoknya." onClose={() => setOpnamePickerOpen(false)} onSubmit={submitOpnamePicker} submitLabel="Lanjutkan">
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

    <FormModal
      presentation="modal"
      open={Boolean(historyTarget)}
      title={`Riwayat Stok & HPP — ${historyTarget?.name || "-"}`}
      subtitle="Pilih periode untuk melihat pergerakan stok, biaya, dan dampak HPP barang ini."
      onClose={() => setHistoryTarget(null)}
      onSubmit={(event) => event?.preventDefault?.()}
      submitLabel="Tutup"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Periode</span>
        <SearchableSelect
          value={historyPeriod}
          onChange={setHistoryPeriod}
          options={[{ value: "7", label: "7 hari terakhir" }, { value: "30", label: "30 hari terakhir" }, { value: "90", label: "90 hari terakhir" }, { value: "all", label: "Semua waktu" }]}
          clearable={false}
          className="w-52"
        />
      </div>
      {historyRows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr><th className="px-2 py-2">Waktu</th><th className="px-2 py-2">Jenis</th><th className="px-2 py-2 text-right">Perubahan</th><th className="px-2 py-2 text-right">Saldo</th><th className="px-2 py-2 text-right">Biaya/Satuan</th><th className="px-2 py-2">Catatan</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyRows.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="px-2 py-2 text-slate-600">{item.occurred_at ? new Date(item.occurred_at).toLocaleString("id-ID") : "-"}</td>
                  <td className="px-2 py-2 font-bold text-slate-700">{item.type || "-"}</td>
                  <td className="px-2 py-2 text-right text-slate-700">{number(item.quantity_delta)}</td>
                  <td className="px-2 py-2 text-right text-slate-700">{number(item.balance_after)}</td>
                  <td className="px-2 py-2 text-right text-slate-700">{item.unit_cost != null ? money(item.unit_cost) : "-"}</td>
                  <td className="px-2 py-2 text-slate-500">{item.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-sm text-slate-500">Belum ada pergerakan pada periode ini.</p>}
    </FormModal>
    <FormModal presentation="modal" open={Boolean(costEdit)} title="Edit Biaya" subtitle="Ubah biaya rata-rata untuk bahan baku atau produk." onClose={() => setCostEdit(null)} onSubmit={submitCostEdit} busy={saveMaterial.isPending || saveProductCosting.isPending} submitLabel="Simpan">
      <Field label="Biaya Rata-rata" required hint="Masukkan biaya rata-rata baru per satuan. Untuk bahan baku, nilai ini mempengaruhi weighted average cost dan HPP produk terkait."><Input type="number" step="0.0001" min="0" value={costEdit?.cost || ""} onChange={(event) => setCostEdit((current) => current ? { ...current, cost: event.target.value } : null)} required /></Field>
    </FormModal>

    <ConfirmDialog open={Boolean(materialDelete)} title="Hapus Bahan Baku" message={`Bahan baku “${materialDelete?.name || materialDelete?.code || ""}” akan dihapus dari master. Riwayat pergerakan stok tetap tersimpan.`} pending={deleteMaterial.isPending} onClose={() => setMaterialDelete(null)} onConfirm={removeMaterial} />
  </>;
}
