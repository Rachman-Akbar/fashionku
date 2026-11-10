import { useDeferredValue, useMemo, useState } from "react";
import { useCustomers } from "@/features/advanced/services/advancedMarketplaceService";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { CustomerDetailForm } from "@/features/advanced/pages/CustomerDetailPage";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastSuccess } from "@/shared/utils/userFeedback";

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function CustomersPage() {
  const { activeRole } = useAuth();
  const admin = activeRole === "admin";
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const listQuery = useCustomers({ per_page: 20, ...(deferredQuery ? { search: deferredQuery } : {}) });
  const rows = listQuery.data?.rows || [];
  const total = useListTotalCount(listQuery.data?.meta, { fallbackTotal: rows.length, label: "Pelanggan" });
  const editor = useEntityEditor({ getEditLabel: (row) => row.name || `Pelanggan #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: listQuery.refetch });
  const spreadsheet = useSpreadsheetWorkspace({ module: "customer", label: "Pelanggan", allowImport: false, allowBulkDelete: false });
  const columns = useMemo(() => [
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "is_manual", label: "Sumber", render: (row) => row.is_manual ? <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-extrabold uppercase text-teal-700">Manual</span> : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold uppercase text-slate-500">Transaksi</span> },
    { key: "orders_count", label: "Jumlah Pesanan" },
    { key: "total_spent", label: "Total Belanja", render: (row) => money(row.total_spent) },
    { key: "last_order_at", label: "Pesanan Terakhir", render: (row) => row.last_order_at ? new Date(row.last_order_at).toLocaleString("id-ID") : "-" },
    { key: "is_active", label: "Status", render: (row) => row.is_active ? "Aktif" : "Nonaktif" },
  ], []);

  return <>
    {editor.open ? <CustomerDetailForm customer={editor.entity || null} admin={admin} onSaved={() => { editor.markListDirty(); editor.completeSave(); editor.close(); toastSuccess("Simpan Pelanggan", editor.entity ? "Pelanggan berhasil diperbarui." : "Pelanggan berhasil ditambahkan."); }} onDeleted={() => { editor.close(); toastSuccess("Hapus Pelanggan", "Pelanggan berhasil dihapus."); }} /> : null}
    {editor.isListActive ? (
      <ModuleFrame
        title="Pelanggan"
        subtitle="Daftar dibentuk dari buyer yang bertransaksi di toko, ditambah pelanggan manual. Pelanggan dapat diubah atau dihapus tanpa mengubah riwayat transaksi."
        query={query}
        onQueryChange={setQuery}
        onRefresh={() => listQuery.refetch()}
        bulkActions={spreadsheet.actions}
        onCreate={admin ? undefined : editor.create}
        createLabel="Tambah Pelanggan"
        totalCount={total.totalCount}
        totalLabel={total.totalLabel}
        totalTitle={total.totalTitle}
      >
        <DataGrid
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
    <SpreadsheetOperationPanel workspace={spreadsheet} />
  </>;
}