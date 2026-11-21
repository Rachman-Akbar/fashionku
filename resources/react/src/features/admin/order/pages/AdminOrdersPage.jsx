import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { ADMIN_ORDER_STATUS_OPTIONS, ORDER_TABLE_COLUMNS, OrderManagementTable, orderCardDefinition } from "@/features/admin/order/components/OrderManagementTable";
import { getOrderManagementError, useAdminOrders, useUpdateOrderStatus } from "@/features/admin/order/services/orderManagementService";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { SpecialActionButton } from "@/shared/components/crud/SpecialActionButton";
import { FormModal } from "@/features/advanced/components/FormModal";
import { Input } from "@/shared/components/ui/Input";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useColumnVisibility, useTableSelection, useViewMode } from "@/shared/hooks";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import OrderPrintSheet from "@/features/seller/order/components/OrderPrintSheet";
import OrdersChartPanel from "@/features/admin/order/components/OrdersChartPanel";
import OrderDetailForm from "@/features/seller/order/pages/OrderDetailPage";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";

export default function AdminOrdersPage() {
  const viewMode = "list";
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [printRow, setPrintRow] = useState(null);
  // Baris hasil filter header tabel, dipakai agar mode grafik tetap
  // menghormati filter yang sama dengan mode list.
  const [filteredOrders, setFilteredOrders] = useState([]);
  // Aksi Khusus "Ubah Status Pesanan": satu tombol untuk massal, sementara
  // perubahan cepat per pesanan tetap lewat kolom status di tabel.
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const notifications = useNotificationCenter();
  const deferredQuery = useDeferredValue(query.trim());
  const ordersQuery = useAdminOrders({ per_page: 20, ...(deferredQuery ? { search: deferredQuery } : {}), ...(status ? { status } : {}), ...(type ? { order_type: type } : {}) });
  const updateMutation = useUpdateOrderStatus();
  const rows = ordersQuery.data?.rows || [];
  const total = useListTotalCount(ordersQuery.data?.meta, { label: "Pesanan" });
  const editor = useEntityEditor({ getEditLabel: (row) => row.orderNumber || row.order_number || row.subOrderNumber || `Order #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: ordersQuery.refetch });
  const columns = useMemo(() => [
    ...mergeColumns(ORDER_TABLE_COLUMNS, buildRawColumns(rows, ["id", "order_id", "order_number", "sub_order_number", "store_name", "grand_total", "total", "total_items_price", "shipping_cost", "status", "payment_status", "tracking_number"]))
  ], [rows]);
  const selection = useTableSelection(rows);
  const columnVisibility = useColumnVisibility(columns, "admin-orders");
  const orderCard = useMemo(() => orderCardDefinition({ onPrint: setPrintRow }), []);
  const spreadsheetRowId = useCallback((row) => row?.orderId || row?.order_id || row?.id, []);
  const spreadsheet = useSpreadsheetWorkspace({
    module: "order",
    label: "Pesanan",
    selectedRows: selection.selectedRows,
    allowBulkDelete: false,
    getRowId: spreadsheetRowId,
    onCompleted: () => {
      selection.clear();
      ordersQuery.refetch();
    },
  });

  const bulkStatus = async (nextStatus, targetRows = selection.selectedRows, reason = "") => {
    if (!targetRows.length) return;
    const task = notifications.startTask({ title: "Ubah Status Pesanan", message: `Memproses ${targetRows.length} pesanan ke status ${nextStatus}...` });
    try {
      for (const row of targetRows) {
        await updateMutation.mutateAsync({ id: row.id, status: nextStatus, trackingNumber: row.trackingNumber, reason });
      }
      selection.clear();
      toastSuccess("Ubah Status Pesanan", `Status pesanan terpilih diubah menjadi ${nextStatus}.`);
      task.success(`${targetRows.length} pesanan diubah menjadi ${nextStatus}.`);
      ordersQuery.refetch();
    } catch (error) {
      toastError("Ubah Status Pesanan", getOrderManagementError(error));
      task.fail(getOrderManagementError(error));
    }
  };

  // Status tidak lagi punya menu sendiri: semua lewat satu Aksi Khusus.
  const bulkActions = [...spreadsheet.actions];

  const submitStatusDialog = async (event) => {
    event?.preventDefault?.();
    if (!statusDraft) {
      toastError("Ubah Status Pesanan", "Pilih status baru terlebih dahulu.");
      return;
    }
    await bulkStatus(statusDraft, selection.selectedRows, statusReason.trim());
    setStatusDialogOpen(false);
    setStatusDraft("");
    setStatusReason("");
  };

  return (
    <>
      {editor.open && editor.entity ? (
        <OrderDetailForm row={editor.entity} />
      ) : !spreadsheet.activeOperation ? (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            hideCreate
            extraActions={(
              <SpecialActionButton
                icon="swap_horiz"
                label="Ubah Status Pesanan"
                title={selection.selectedCount ? `Ubah status ${selection.selectedCount} pesanan terpilih` : "Aktifkan pilih baris, centang pesanan, lalu ubah statusnya"}
                onClick={() => {
                  setStatusDraft("");
                  setStatusReason("");
                  if (!selection.selectedCount && !selection.enabled) {
                    selection.toggleEnabled();
                    toastError("Ubah Status Pesanan", "Mode pilih baris diaktifkan. Centang pesanan yang ingin diubah statusnya.");
                    return;
                  }
                  setStatusDialogOpen(true);
                }}
              />
            )}
            onRefresh={() => ordersQuery.refetch()}
            refreshing={ordersQuery.isFetching}
            placeholder="Cari nomor order lalu tekan Enter"
            totalCount={total.totalCount}
            totalLabel={total.totalLabel}
            totalTitle={total.totalTitle}
            selectionEnabled={selection.enabled}
            selectedCount={selection.selectedCount}
            onToggleSelection={selection.toggleEnabled}
            bulkActions={bulkActions}
            columns={columns}
            visibleColumns={columnVisibility.visibleKeys}
            onToggleColumn={columnVisibility.toggleColumn}
            onShowAllColumns={columnVisibility.showAll}
            onResetColumns={columnVisibility.reset}
            onApplyDefaultColumns={columnVisibility.applyAsDefault}
            filters={(
              <>
                <SearchableSelect
                  value={type}
                  onChange={setType}
                  options={[
                    { value: "reguler", label: "Reguler" },
                    { value: "terjadwal", label: "Pesanan Terjadwal" },
                    { value: "manual", label: "Manual" },
                  ]}
                  placeholder="Semua tipe"
                  className="w-40"
                  buttonClassName="h-9"
                />
                <SearchableSelect
                  value={status}
                  onChange={setStatus}
                  options={ADMIN_ORDER_STATUS_OPTIONS}
                  placeholder="Semua status"
                  className="w-44"
                  buttonClassName="h-9"
                />
              </>
            )}
          />
          )}
        >
          <AsyncState loading={ordersQuery.isLoading} error={ordersQuery.error ? getOrderManagementError(ordersQuery.error) : ""} empty={!ordersQuery.isLoading && !rows.length} emptyText="Pesanan belum tersedia." />
          {rows.length && viewMode === "chart" ? (
            <>
              {/* Header + filter tetap tampil di mode grafik (body tabel disembunyikan). */}
              <div className="[&_tbody]:hidden">
                <OrderManagementTable
                  rows={rows}
                  columns={columns}
                  portal="admin"
                  pendingId={updateMutation.variables?.id}
                  visibleSet={columnVisibility.visibleSet}
                  onFilterStateChange={(state) => setFilteredOrders(state?.filteredRows || [])}
                  onEdit={editor.edit}
                  onPrint={setPrintRow}
                />
              </div>
              <OrdersChartPanel rows={filteredOrders.length ? filteredOrders : rows} />
            </>
          ) : null}
          {rows.length && viewMode === "grid" ? (
            <RecordCardGrid
              rows={rows}
              columns={columns}
              card={orderCard}
              onRowClick={editor.edit}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              onToggleRow={selection.toggleRow}
              rowKey={(row) => row.id}
            />
          ) : null}
          {rows.length && viewMode !== "grid" && viewMode !== "chart" ? (
            <OrderManagementTable
              rows={rows}
              onFilterStateChange={(state) => { total.onFilterStateChange(state); setFilteredOrders(state?.filteredRows || []); }}
              columns={columns}
              portal="admin"
              pendingId={updateMutation.variables?.id}
              visibleSet={columnVisibility.visibleSet}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              allSelected={selection.allSelected}
              onToggleRow={selection.toggleRow}
              onToggleAll={selection.toggleAll}
              onEdit={editor.edit}
              onPrint={setPrintRow}
              onStatusChange={async (row, nextStatus) => {
                const task = notifications.startTask({ title: "Ubah Status Pesanan", message: `Memproses pesanan ${row.orderNumber || `#${row.id}`} ke status ${nextStatus}...` });
                try {
                  await updateMutation.mutateAsync({ id: row.id, status: nextStatus, trackingNumber: row.trackingNumber });
                  task.success(`Pesanan ${row.orderNumber || `#${row.id}`} diubah menjadi ${nextStatus}.`);
                  toastSuccess("Ubah Status Pesanan", "Status pesanan berhasil diperbarui.");
                  ordersQuery.refetch();
                } catch (error) {
                  toastError("Ubah Status Pesanan", getOrderManagementError(error));
                  task.fail(getOrderManagementError(error));
                }
              }}
            />
          ) : null}
          <InfiniteScrollSentinel hasNextPage={ordersQuery.hasNextPage} isFetchingNextPage={ordersQuery.isFetchingNextPage} onLoadMore={() => ordersQuery.fetchNextPage()} />
        </ListPageFrame>
      ) : null}
      <FormModal
        presentation="modal"
        open={statusDialogOpen}
        title="Ubah Status Pesanan"
        subtitle={selection.selectedCount ? `${selection.selectedCount} pesanan terpilih akan diubah. Buyer otomatis menerima notifikasi untuk status diterima, ditolak, dibatalkan, dan selesai.` : "Pilih pesanan pada tabel terlebih dahulu."}
        onClose={() => setStatusDialogOpen(false)}
        onSubmit={submitStatusDialog}
        busy={updateMutation.isPending}
        submitLabel="Simpan Status"
      >
        <label className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" htmlFor="order-status">
          Status Baru
        </label>
        <SearchableSelect
          value={statusDraft}
          onChange={setStatusDraft}
          options={ADMIN_ORDER_STATUS_OPTIONS}
          placeholder="Pilih status"
          clearable={false}
          className="mt-1 w-full"
        />
        <label className="mt-4 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" htmlFor="order-status-reason">
          Alasan (opsional)
        </label>
        <Input
          id="order-status-reason"
          value={statusReason}
          onChange={(event) => setStatusReason(event.target.value)}
          placeholder="Contoh: stok habis / permintaan buyer"
          className="mt-1"
        />
      </FormModal>
      <SpreadsheetOperationPanel workspace={spreadsheet} />
      {printRow ? <OrderPrintSheet row={printRow} onClose={() => setPrintRow(null)} /> : null}
    </>
  );
}
