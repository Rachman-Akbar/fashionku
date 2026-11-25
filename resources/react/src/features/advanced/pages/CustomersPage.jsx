import { useDeferredValue, useState } from "react";
import { useCustomers, useUpdateCustomer } from "@/features/advanced/services/advancedMarketplaceService";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { buildDatabaseColumns } from "@/shared/utils/tableData";
import { CustomerDetailForm } from "@/features/advanced/pages/CustomerDetailPage";
import { useEntityEditor, useRefreshOnListActivation, useViewMode, useTableSelection } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { ExcelActionButtons } from "@/shared/excel";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "-";
  }
}

export default function CustomersPage() {
  const [viewMode, setViewMode] = useViewMode("customers");
  const { activeRole } = useAuth();
  const admin = activeRole === "admin";
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const listQuery = useCustomers({ per_page: 20, ...(deferredQuery ? { search: deferredQuery } : {}) });
  const updateCustomer = useUpdateCustomer();
  const [activeToggleId, setActiveToggleId] = useState(null);

  const toggleCustomerActive = async (row, next) => {
    if (updateCustomer.isPending) return;
    setActiveToggleId(row.id);
    try {
      await updateCustomer.mutateAsync({ id: row.id, values: { is_active: next } });
      toastSuccess("Status Pelanggan", `${row.name || "Pelanggan"} ditandai ${next ? "aktif" : "nonaktif"}.`);
    } catch (error) {
      toastError("Status Pelanggan", error?.response?.data?.message || "Gagal mengubah status pelanggan.");
    } finally {
      setActiveToggleId(null);
    }
  };

  const rows = listQuery.data?.rows || [];
  const total = useListTotalCount(listQuery.data?.meta, { fallbackTotal: rows.length, label: "Pelanggan" });
  const editor = useEntityEditor({ getEditLabel: (row) => row.name || `Pelanggan #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: listQuery.refetch });
  const selection = useTableSelection(rows);

  const columns = [
    { key: "code", label: "Kode" },
    { key: "name", label: "Nama", render: (row) => {
      const avatar = resolveMediaUrl(row.avatar || "");
      return (
        <div className="flex min-w-0 items-center gap-2">
          {avatar ? (
            <img src={avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200" />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-500 ring-1 ring-slate-200">{(row.name || "?").slice(0, 1).toUpperCase()}</span>
          )}
          <span className="truncate font-bold text-slate-900">{row.name || "-"}</span>
        </div>
      );
    } },
    { key: "email", label: "Email" },
    { key: "is_manual", label: "Sumber", filterType: "select", options: [{ value: "Manual", label: "Manual" }, { value: "Transaksi", label: "Transaksi" }], valueOf: (row) => (row.is_manual ? "Manual" : "Transaksi"), render: (row) => row.is_manual ? <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-extrabold uppercase text-teal-700">Manual</span> : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold uppercase text-slate-500">Transaksi</span> },
    { key: "orders_count", label: "Jumlah Pesanan" },
    { key: "total_spent", label: "Total Belanja", render: (row) => money(row.total_spent) },
    { key: "last_order_at", label: "Pesanan Terakhir", valueOf: (row) => row.last_order_at ? formatDate(row.last_order_at) : "", render: (row) => row.last_order_at ? formatDate(row.last_order_at) : "-" },
    { key: "is_active", label: "Status", filterType: "select", options: [{ value: "true", label: "Aktif" }, { value: "false", label: "Nonaktif" }], render: (row) => <InlineActiveSwitch checked={row.is_active !== false} pending={activeToggleId === row.id} activeLabel="Aktif" inactiveLabel="Nonaktif" compact onChange={(next) => toggleCustomerActive(row, next)} /> },
    // Sisa kolom database (profil, audit, verifikasi) tampil otomatis.
    ...buildDatabaseColumns(rows, {
      omit: ["id", "code", "name", "email", "is_manual", "orders_count", "total_spent", "last_order_at", "is_active", "created_at"],
      labels: {
        is_email_verified: "Email Terverifikasi",
        note: "Catatan",
        recipient_name: "Nama Penerima",
        registered_at: "Terdaftar",
        created_by_user: "Dibuat Oleh",
        updated_by_user: "Diubah Oleh",
        updated_at: "Diubah",
      },
    }),
  ];

  const customerCard = {
    title: (row) => row.name || "Pelanggan",
    subtitle: (row) => row.code ? `${row.code} · ${row.email || "-"}` : row.email || "-",
    badges: [
      (row) => row.is_manual
        ? <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-teal-700">Manual</span>
        : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-500">Transaksi</span>,
      (row) => (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${row.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {row.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    ],
    fields: [
      { label: "Kode", render: (row) => row.code || "-" },
      { label: "Pesanan", render: (row) => row.orders_count ?? 0 },
      { label: "Total Belanja", render: (row) => money(row.total_spent) },
      { label: "Terakhir", render: (row) => (row.last_order_at ? formatDate(row.last_order_at) : "-") },
    ],
  };

  return <>
    {editor.open ? <CustomerDetailForm customer={editor.entity || null} admin={admin} onSaved={() => { editor.markListDirty(); editor.completeSave(); editor.close(); toastSuccess("Simpan Pelanggan", editor.entity ? "Pelanggan berhasil diperbarui." : "Pelanggan berhasil ditambahkan."); }} onDeleted={() => { editor.close(); toastSuccess("Hapus Pelanggan", "Pelanggan berhasil dihapus."); }} /> : null}
    {editor.isListActive ? (
      <ModuleFrame
        title="Pelanggan"
        subtitle="Daftar dibentuk dari buyer yang bertransaksi di toko, ditambah pelanggan manual. Pelanggan dapat diubah atau dihapus tanpa mengubah riwayat transaksi."
        query={query}
        onQueryChange={setQuery}
        onRefresh={() => listQuery.refetch()}
        bulkActions={[]}
        onCreate={admin ? undefined : editor.create}
        createLabel="Tambah Pelanggan"
        totalCount={total.totalCount}
        totalLabel={total.totalLabel}
        totalTitle={total.totalTitle}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        selectionEnabled={selection.enabled}
        selectedCount={selection.selectedCount}
        onToggleSelection={selection.toggleEnabled}
        extraActions={
          <ExcelActionButtons
            module="customer"
            label="Pelanggan"
            selection={selection}
            rows={rows}
            onRefresh={() => listQuery.refetch()}
            onCompleted={() => {}}
            getRowId={(row) => row.id}
            allowImport={true}
            allowExport={true}
            allowDelete={true}
          />
        }
      >
        <DataGrid
          viewMode={viewMode}
          card={customerCard}
          storageKey="seller.customers"
          onFilterStateChange={total.onFilterStateChange}
          columns={columns}
          rows={rows}
          onRowClick={editor.edit}
          emptyText={listQuery.isLoading ? "" : "Belum ada pelanggan yang pernah membeli."}
          hasNextPage={listQuery.hasNextPage}
          isFetchingNextPage={listQuery.isFetchingNextPage}
          onLoadMore={() => listQuery.fetchNextPage()}
        />
      </ModuleFrame>
    ) : null}
  </>;
}