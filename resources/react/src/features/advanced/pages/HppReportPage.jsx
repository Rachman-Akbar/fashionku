import { useDeferredValue, useMemo, useState } from "react";
import { useRawMaterialCostImpacts, useRawMaterials } from "@/features/advanced/services/advancedMarketplaceService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { useColumnVisibility, useViewMode } from "@/shared/hooks";
import { toolbarControlClassName } from "@/shared/components/crud/toolbarControlClassName";
import { toTitleCase } from "@/shared/utils/textFormatter";

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function number(value, digits = 2) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(Number(value || 0));
}

const PERIOD_OPTIONS = [
  { value: "7", label: "7 hari terakhir" },
  { value: "30", label: "30 hari terakhir" },
  { value: "90", label: "90 hari terakhir" },
  { value: "all", label: "Semua waktu" },
];

const DIRECTION_OPTIONS = [
  { value: "all", label: "Naik & turun" },
  { value: "increase", label: "Kenaikan saja" },
  { value: "decrease", label: "Penurunan saja" },
];

/**
 * Laporan HPP: riwayat perubahan biaya bahan baku beserta dampaknya ke HPP
 * produk. Dipakai admin & seller untuk meninjau kenaikan biaya dari waktu ke
 * waktu sebelum menyesuaikan harga jual.
 */
export default function HppReportPage() {
  const [viewMode, setViewMode] = useViewMode("admin-hpp-report");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("30");
  const [direction, setDirection] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const impactsQuery = useRawMaterialCostImpacts({ per_page: 100 });
  const materialsQuery = useRawMaterials({ per_page: 100 });

  const allRows = useMemo(() => impactsQuery.data?.rows || [], [impactsQuery.data?.rows]);

  const rows = useMemo(() => {
    let next = allRows;
    if (direction !== "all") {
      next = next.filter((row) => {
        const change = Number(row.hpp_change_amount ?? (Number(row.new_hpp) - Number(row.old_hpp)) ?? 0);
        return direction === "increase" ? change > 0 : change < 0;
      });
    }
    if (period !== "all") {
      const limit = Date.now() - Number(period) * 24 * 60 * 60 * 1000;
      next = next.filter((row) => {
        const when = row.occurred_at ? new Date(row.occurred_at).getTime() : 0;
        return !when || when >= limit;
      });
    }
    if (deferredQuery) {
      next = next.filter((row) => {
        const haystack = [
          row.material?.name,
          row.material?.code,
          row.product?.name,
          row.cost_history?.reference_number,
        ].filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(deferredQuery);
      });
    }
    return next;
  }, [allRows, direction, period, deferredQuery]);

  const summary = useMemo(() => {
    const increases = rows.filter((row) => Number(row.hpp_change_amount ?? 0) > 0);
    const products = new Set(rows.map((row) => row.product?.id).filter(Boolean));
    const materials = new Set(rows.map((row) => row.material?.id).filter(Boolean));
    const average = rows.length
      ? rows.reduce((total, row) => total + Number(row.hpp_change_percent || 0), 0) / rows.length
      : 0;
    return { increases: increases.length, products: products.size, materials: materials.size, average };
  }, [rows]);

  const columns = useMemo(() => [
    { key: "occurred_at", label: "Waktu", filterType: "text", render: (row) => (row.occurred_at ? new Date(row.occurred_at).toLocaleString("id-ID") : "-") },
    { key: "material", label: "Bahan Baku", filterType: "text", render: (row) => `${row.material?.code ? `${row.material.code} · ` : ""}${row.material?.name || "-"}` },
    { key: "product", label: "Produk Terdampak", filterType: "text", render: (row) => toTitleCase(row.product?.name) || "-" },
    { key: "old_cost", label: "Biaya Lama", align: "right", render: (row) => money(row.cost_history?.old_average_cost ?? row.costHistory?.old_average_cost) },
    { key: "new_cost", label: "Biaya Baru", align: "right", render: (row) => money(row.cost_history?.new_average_cost ?? row.costHistory?.new_average_cost) },
    { key: "old_hpp", label: "HPP Lama", align: "right", render: (row) => money(row.old_hpp) },
    { key: "new_hpp", label: "HPP Baru", align: "right", render: (row) => money(row.new_hpp) },
    {
      key: "hpp_change_percent",
      label: "Kenaikan HPP",
      align: "right",
      render: (row) => {
        const percent = Number(row.hpp_change_percent || 0);
        const positive = percent >= 0;
        return (
          <span className={positive ? "rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-extrabold text-amber-700" : "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-extrabold text-emerald-700"}>
            {positive ? "+" : ""}{number(percent)}%
          </span>
        );
      },
    },
    { key: "new_suggested_price", label: "Saran Harga Jual", align: "right", render: (row) => money(row.new_suggested_price) },
    { key: "reference_number", label: "Referensi", defaultVisible: false, render: (row) => row.cost_history?.reference_number || "-" },
  ], []);

  const columnVisibility = useColumnVisibility(columns, "admin-hpp-report");
  const total = useListTotalCount(undefined, { fallbackTotal: rows.length, label: "Riwayat HPP" });

  const viewModeOptions = [
    { key: "list", icon: "view_list", label: "Tampilan list" },
    { key: "grid", icon: "grid_view", label: "Tampilan kartu" },
  ];

  const card = {
    title: (row) => toTitleCase(row.product?.name) || "Produk",
    subtitle: (row) => `${row.material?.name || "-"} · ${row.occurred_at ? new Date(row.occurred_at).toLocaleDateString("id-ID") : "-"}`,
    badges: [
      (row) => (
        <span className={Number(row.hpp_change_percent || 0) >= 0 ? "rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700" : "rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700"}>
          HPP {Number(row.hpp_change_percent || 0) >= 0 ? "+" : ""}{number(row.hpp_change_percent)}%
        </span>
      ),
    ],
    fields: [
      { label: "HPP Lama", render: (row) => money(row.old_hpp) },
      { label: "HPP Baru", render: (row) => money(row.new_hpp) },
      { label: "Saran Harga", render: (row) => money(row.new_suggested_price) },
    ],
  };

  const filters = (
    <>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari bahan baku, produk, atau referensi"
        className={toolbarControlClassName}
        aria-label="Cari riwayat HPP"
      />
      <SearchableSelect
        value={direction}
        onChange={setDirection}
        options={DIRECTION_OPTIONS}
        clearable={false}
        className="w-40"
        buttonClassName="h-9"
      />
      <SearchableSelect
        value={period}
        onChange={setPeriod}
        options={PERIOD_OPTIONS}
        clearable={false}
        className="w-44"
        buttonClassName="h-9"
      />
    </>
  );

  return (
    <ModuleFrame
      title="Laporan HPP"
      subtitle="Riwayat perubahan biaya bahan baku dan dampaknya terhadap HPP setiap produk, lengkap dengan saran harga jual baru."
      query={query}
      onQueryChange={setQuery}
      onRefresh={() => impactsQuery.refetch()}
      refreshing={impactsQuery.isFetching}
      hideCreate
      filters={filters}
      totalCount={total.totalCount}
      totalLabel={total.totalLabel}
      totalTitle={total.totalTitle}
      columns={columns}
      visibleColumns={columnVisibility.visibleKeys}
      onToggleColumn={columnVisibility.toggleColumn}
      onMoveColumn={columnVisibility.moveColumn}
      onShowAllColumns={columnVisibility.showAll}
      onResetColumns={columnVisibility.reset}
      onApplyDefaultColumns={columnVisibility.applyAsDefault}
      viewMode={viewMode}
      onChangeViewMode={setViewMode}
      viewModeOptions={viewModeOptions}
    >
      <div className="mb-1 grid gap-1 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border-l-[3px] border-amber-500 bg-amber-50 px-3 py-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-700">Kenaikan HPP</p>
          <p className="text-lg font-extrabold text-amber-800">{summary.increases} kejadian</p>
        </div>
        <div className="border-l-[3px] border-emerald-500 bg-emerald-50 px-3 py-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Rata-rata Perubahan</p>
          <p className="text-lg font-extrabold text-emerald-800">{summary.average >= 0 ? "+" : ""}{number(summary.average)}%</p>
        </div>
        <div className="border-l-[3px] border-sky-500 bg-sky-50 px-3 py-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-700">Produk Terdampak</p>
          <p className="text-lg font-extrabold text-sky-800">{summary.products}</p>
        </div>
        <div className="border-l-[3px] border-slate-400 bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-600">Bahan Baku Berubah</p>
          <p className="text-lg font-extrabold text-slate-800">{summary.materials}</p>
        </div>
      </div>

      {impactsQuery.error ? (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{impactsQuery.error.message || "Gagal memuat laporan HPP."}</p>
      ) : null}

      <DataGrid
        viewMode={viewMode}
        columns={columns}
        rows={rows}
        card={card}
        storageKey="inventory.hpp-report"
        emptyText={impactsQuery.isLoading ? "Memuat laporan HPP..." : "Belum ada perubahan biaya yang tercatat pada periode ini."}
        onRowClick={(row) => {
          const material = (materialsQuery.data?.rows || []).find((item) => String(item.id) === String(row.material?.id));
          if (material) setQuery(material.code || material.name || "");
        }}
      />
    </ModuleFrame>
  );
}
