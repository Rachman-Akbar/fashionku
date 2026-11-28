import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useRawMaterialCostImpacts } from "@/features/advanced/services/advancedMarketplaceService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { useColumnVisibility, useViewMode } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { toolbarControlClassName } from "@/shared/components/crud/toolbarControlClassName";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { markHppSeen } from "@/shared/utils/hppSeen";

ChartJS.register(...registerables);

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function number(value, digits = 2) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(Number(value || 0));
}

function triggerLabel(type) {
  if (type === "raw_material_cost_change") return "Perubahan harga bahan";
  if (type === "product_price_change") return "Perubahan harga produk";
  if (type === "product_costing_change") return "Perubahan komponen HPP";
  return toTitleCase(type?.replaceAll("_", " ")) || "Perubahan HPP";
}

function chartTrend(rows, amountFor) {
  const byDay = new Map();
  rows.forEach((row) => {
    const date = row.occurred_at?.slice(0, 10) || "Tanpa tanggal";
    byDay.set(date, (byDay.get(date) || 0) + amountFor(row));
  });
  const entries = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b));
  return {
    labels: entries.map(([date]) => date === "Tanpa tanggal" ? date : new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })),
    values: entries.map(([, value]) => value),
  };
}

function topProducts(rows, amountFor) {
  const products = new Map();
  rows.forEach((row) => {
    const key = row.product?.id ?? row.product?.name ?? row.id;
    const product = products.get(key) || { name: toTitleCase(row.product?.name) || "Produk", amount: 0 };
    product.amount += amountFor(row);
    products.set(key, product);
  });
  return [...products.values()]
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 10);
}

function HppCharts({ rows, loadedCount, hasMore, loadingMore, onLoadMore, totalCount, loadError }) {
  const hppTrend = chartTrend(rows, (row) => Number(row.hpp_change_amount || 0));
  const materialHistory = [...new Map(
    rows
      .filter((row) => row.material && (row.cost_history || row.costHistory))
      .map((row) => [row.raw_material_cost_history_id ?? row.id, row]),
  ).values()];
  const materialTrend = chartTrend(materialHistory, (row) => (
    Number(row.cost_history?.new_average_cost ?? row.costHistory?.new_average_cost ?? 0)
    - Number(row.cost_history?.old_average_cost ?? row.costHistory?.old_average_cost ?? 0)
  ));
  const priceRows = rows.filter((row) => Math.abs(Number(row.new_selling_price || 0) - Number(row.old_selling_price || 0)) >= 0.01);
  const priceTrend = chartTrend(priceRows, (row) => Number(row.new_selling_price || 0) - Number(row.old_selling_price || 0));
  const products = topProducts(rows, (row) => Number(row.hpp_change_amount || 0));
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => money(context.parsed.y) } } },
    scales: { y: { ticks: { callback: (value) => money(value) }, grid: { color: "#f1f5f9" } }, x: { grid: { display: false } } },
  };
  const productBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => money(context.parsed.x) } } },
    scales: { x: { ticks: { callback: (value) => money(value) }, grid: { color: "#f1f5f9" } }, y: { grid: { display: false } } },
  };

  return (
    <div className="space-y-4 p-3 sm:p-4">
      {rows.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-extrabold text-slate-800">Tren perubahan HPP per hari</h2>
            <div className="h-64">
              <Line data={{ labels: hppTrend.labels, datasets: [{ label: "Perubahan HPP", data: hppTrend.values, borderColor: "#0f766e", backgroundColor: "rgba(15, 118, 110, 0.12)", fill: true, tension: 0.28, pointRadius: 3 }] }} options={lineOptions} />
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-extrabold text-slate-800">Tren perubahan harga bahan baku per hari</h2>
            {materialHistory.length ? (
              <div className="h-64">
                <Line data={{ labels: materialTrend.labels, datasets: [{ label: "Perubahan harga bahan baku", data: materialTrend.values, borderColor: "#0284c7", backgroundColor: "rgba(2, 132, 199, 0.12)", fill: true, tension: 0.28, pointRadius: 3 }] }} options={lineOptions} />
              </div>
            ) : <p className="flex h-64 items-center justify-center text-sm text-slate-500">Belum ada perubahan harga bahan baku pada periode ini.</p>}
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-extrabold text-slate-800">Tren perubahan harga jual per hari</h2>
            {priceRows.length ? (
              <div className="h-64">
                <Line data={{ labels: priceTrend.labels, datasets: [{ label: "Perubahan harga jual", data: priceTrend.values, borderColor: "#7c3aed", backgroundColor: "rgba(124, 58, 237, 0.12)", fill: true, tension: 0.28, pointRadius: 3 }] }} options={lineOptions} />
              </div>
            ) : <p className="flex h-64 items-center justify-center text-sm text-slate-500">Belum ada perubahan harga jual pada periode ini.</p>}
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4 xl:col-span-2">
            <h2 className="mb-3 text-sm font-extrabold text-slate-800">Produk dengan dampak perubahan HPP terbesar</h2>
            {products.length ? (
              <div className="h-72">
                <Bar
                  data={{
                    labels: products.map((product) => product.name),
                    datasets: [{ label: "Akumulasi perubahan HPP", data: products.map((product) => product.amount), backgroundColor: products.map((product) => product.amount >= 0 ? "#f59e0b" : "#10b981"), borderRadius: 5 }],
                  }}
                  options={productBarOptions}
                />
              </div>
            ) : <p className="text-sm text-slate-500">Belum ada dampak HPP pada periode ini.</p>}
          </section>
        </div>
      ) : <p className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">Belum ada perubahan harga atau HPP pada periode ini.</p>}
      <div className="flex flex-col items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 sm:flex-row">
        <span>Memuat {number(loadedCount, 0)} dari {number(totalCount, 0)} catatan riwayat.</span>
        {hasMore ? (
          <button type="button" onClick={onLoadMore} disabled={loadingMore} className="rounded-lg bg-teal-700 px-4 py-2 font-bold text-white disabled:cursor-wait disabled:opacity-60">
            {loadingMore ? "Memuat..." : "Muat riwayat lebih lama"}
          </button>
        ) : null}
      </div>
      {loadError ? <p className="text-sm text-red-700">{loadError.message || "Gagal memuat riwayat berikutnya."}</p> : null}
    </div>
  );
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

export default function HppReportPage() {
  useEffect(() => { markHppSeen(); }, []);
  const [viewMode, setViewMode] = useViewMode("admin-hpp-report-chart", "chart");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("30");
  const [direction, setDirection] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const impactsQuery = useRawMaterialCostImpacts({ per_page: 100 });
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
      next = next.filter((row) => [
        row.material?.name,
        row.material?.code,
        row.product?.name,
        row.variant?.name,
        row.variant?.sku,
        row.cost_history?.reference_number,
        row.trigger_type,
      ].filter(Boolean).join(" ").toLowerCase().includes(deferredQuery));
    }
    return next;
  }, [allRows, direction, period, deferredQuery]);

  const summary = useMemo(() => {
    const products = new Set(rows.map((row) => row.product?.id).filter(Boolean));
    const materials = new Set(rows.map((row) => row.material?.id).filter(Boolean));
    const priceChanges = rows.filter((row) => Math.abs(Number(row.new_selling_price || 0) - Number(row.old_selling_price || 0)) >= 0.01);
    const hppTotal = rows.reduce((total, row) => total + Number(row.hpp_change_amount || 0), 0);
    const priceTotal = priceChanges.reduce((total, row) => total + Number(row.new_selling_price || 0) - Number(row.old_selling_price || 0), 0);
    const average = rows.length ? rows.reduce((total, row) => total + Number(row.hpp_change_percent || 0), 0) / rows.length : 0;
    return { products: products.size, materials: materials.size, priceChanges: priceChanges.length, hppTotal, priceTotal, average };
  }, [rows]);

  const columns = useMemo(() => [
    { key: "occurred_at", label: "Waktu", filterType: "text", valueOf: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleString("id-ID") : "", render: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleString("id-ID") : "-" },
    { key: "change_type", label: "Jenis Perubahan", filterType: "text", valueOf: (row) => triggerLabel(row.trigger_type), render: (row) => triggerLabel(row.trigger_type) },
    { key: "material", label: "Bahan Baku", filterType: "text", valueOf: (row) => `${row.material?.code ? `${row.material.code} · ` : ""}${row.material?.name || ""}`, render: (row) => row.material?.name ? `${row.material.code ? `${row.material.code} · ` : ""}${row.material.name}` : "-" },
    { key: "old_unit_cost", label: "Harga Bahan Lama", align: "right", render: (row) => row.cost_history || row.costHistory ? money(row.cost_history?.old_average_cost ?? row.costHistory?.old_average_cost) : "-" },
    { key: "new_unit_cost", label: "Harga Bahan Baru", align: "right", render: (row) => row.cost_history || row.costHistory ? money(row.cost_history?.new_average_cost ?? row.costHistory?.new_average_cost) : "-" },
    { key: "product", label: "Produk Terdampak", filterType: "text", valueOf: (row) => `${row.product?.name || ""} ${row.variant?.name || ""} ${row.variant?.sku || ""}`, render: (row) => <span>{toTitleCase(row.product?.name) || "-"}{row.variant ? <span className="block text-xs text-slate-500">{row.variant.name} · {row.variant.sku}</span> : null}</span> },
    { key: "old_material_cost", label: "Total Biaya Bahan Lama", align: "right", render: (row) => money(row.old_material_cost) },
    { key: "new_material_cost", label: "Total Biaya Bahan Baru", align: "right", render: (row) => money(row.new_material_cost) },
    { key: "old_hpp", label: "HPP Lama", align: "right", render: (row) => money(row.old_hpp) },
    { key: "new_hpp", label: "HPP Baru", align: "right", render: (row) => money(row.new_hpp) },
    { key: "hpp_change_percent", label: "Perubahan HPP", align: "right", render: (row) => {
      const percent = Number(row.hpp_change_percent || 0);
      return <span className={percent >= 0 ? "font-extrabold text-amber-700" : "font-extrabold text-emerald-700"}>{percent > 0 ? "+" : ""}{number(percent)}% ({money(row.hpp_change_amount)})</span>;
    } },
    { key: "old_selling_price", label: "Harga Jual Lama", align: "right", render: (row) => money(row.old_selling_price) },
    { key: "new_selling_price", label: "Harga Jual Baru", align: "right", render: (row) => money(row.new_selling_price) },
    { key: "new_suggested_price", label: "Saran Harga Jual", align: "right", render: (row) => money(row.new_suggested_price) },
    { key: "reference_number", label: "Referensi", defaultVisible: false, render: (row) => row.cost_history?.reference_number || "-" },
  ], []);

  const columnVisibility = useColumnVisibility(columns, "admin-hpp-report-chart");
  const total = useListTotalCount(impactsQuery.data?.meta, { fallbackTotal: allRows.length, label: "Riwayat HPP" });
  const viewModeOptions = [
    { key: "chart", icon: "monitoring", label: "Grafik" },
    { key: "list", icon: "view_list", label: "Tabel detail" },
  ];
  const filters = (
    <>
      <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari bahan baku, produk, atau referensi" className={toolbarControlClassName} aria-label="Cari riwayat HPP" />
      <SearchableSelect value={direction} onChange={setDirection} options={DIRECTION_OPTIONS} clearable={false} className="w-40" buttonClassName="h-9" />
      <SearchableSelect value={period} onChange={setPeriod} options={PERIOD_OPTIONS} clearable={false} className="w-44" buttonClassName="h-9" />
    </>
  );

  return (
    <ModuleFrame
      title="Laporan HPP"
      subtitle="Grafik dan rincian perubahan biaya bahan baku, HPP, serta harga jual produk."
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
        <div className="border-l-[3px] border-amber-500 bg-amber-50 px-3 py-2"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-700">Akumulasi Perubahan HPP</p><p className="text-lg font-extrabold text-amber-800">{money(summary.hppTotal)}</p></div>
        <div className="border-l-[3px] border-violet-500 bg-violet-50 px-3 py-2"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-violet-700">Perubahan Harga Jual</p><p className="text-lg font-extrabold text-violet-800">{summary.priceChanges} kejadian · {money(summary.priceTotal)}</p></div>
        <div className="border-l-[3px] border-sky-500 bg-sky-50 px-3 py-2"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-700">Produk Terdampak</p><p className="text-lg font-extrabold text-sky-800">{summary.products} produk</p></div>
        <div className="border-l-[3px] border-slate-400 bg-slate-50 px-3 py-2"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-600">Perubahan Bahan Baku</p><p className="text-lg font-extrabold text-slate-800">{summary.materials} bahan · rata-rata HPP {summary.average >= 0 ? "+" : ""}{number(summary.average)}%</p></div>
      </div>

      {impactsQuery.error ? <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{impactsQuery.error.message || "Gagal memuat laporan HPP."}</p> : null}

      <DataGrid
        viewMode={viewMode}
        columns={columns}
        rows={rows}
        chart={(visibleRows) => (
          <HppCharts
            rows={visibleRows}
            loadedCount={allRows.length}
            hasMore={impactsQuery.hasNextPage}
            loadingMore={impactsQuery.isFetchingNextPage}
            onLoadMore={() => impactsQuery.fetchNextPage()}
            totalCount={total.totalCount}
            loadError={impactsQuery.isFetchNextPageError ? impactsQuery.error : null}
          />
        )}
        hasNextPage={impactsQuery.hasNextPage}
        isFetchingNextPage={impactsQuery.isFetchingNextPage}
        onLoadMore={() => impactsQuery.fetchNextPage()}
        storageKey="inventory.hpp-report-chart"
        emptyText={impactsQuery.isLoading ? "Memuat laporan HPP..." : "Belum ada perubahan harga atau HPP yang tercatat pada periode ini."}
      />
    </ModuleFrame>
  );
}
