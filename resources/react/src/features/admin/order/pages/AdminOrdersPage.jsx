import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { ADMIN_ORDER_STATUS_OPTIONS, ORDER_TABLE_COLUMNS, OrderManagementTable, orderCardDefinition } from "@/features/admin/order/components/OrderManagementTable";
import { getOrderManagementError, useAdminOrders, useUpdateOrderStatus } from "@/features/admin/order/services/orderManagementService";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { FormModal } from "@/features/advanced/components/FormModal";
import { Input } from "@/shared/components/ui/Input";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { buildDatabaseColumns, mergeColumns } from "@/shared/utils/tableData";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import OrderPrintSheet from "@/features/seller/order/components/OrderPrintSheet";
import { OrdersChartPanel } from "@/shared/charts/ChartPanels";
import { OrderDetailForm } from "@/features/seller/order/pages/OrderDetailPage";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { ExcelActionButtons } from "@/shared/excel";
import { showSuccess, showError, confirmAction, showLoading, closeLoading } from "@/shared/utils/sweetAlert";

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
  // Callback stabil: dipanggil efek di dalam tabel, jadi identitasnya tidak
  // boleh berubah tiap render agar tidak memicu setState berulang.
  const handleOrderFilterState = useCallback((state) => {
    total.onFilterStateChange(state);
    setFilteredOrders(state?.filteredRows || []);
  }, [total]);
  const editor = useEntityEditor({ getEditLabel: (row) => row.orderNumber || row.order_number || row.subOrderNumber || `Order #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: ordersQuery.refetch });
  // Kolom kurasi + semua kolom database lain (kecuali kolom ID). Kolom yang
  // sudah ditampilkan lewat kolom kurasi disembunyikan agar tidak dobel.
  const columns = useMemo(() => mergeColumns(ORDER_TABLE_COLUMNS, buildDatabaseColumns(rows, {
    omit: ["id", "order_id", "order_number", "sub_order_number", "snap_token", "store_name", "grand_total", "total", "total_items_price", "shipping_cost", "status", "payment_status", "tracking_number", "items", "sub_orders", "user", "created_at", "order_type", "is_preorder"],
    labels: {
      user_name: "Customer",
      voucher: "Voucher",
      voucher_code: "Kode Voucher",
      discount_amount: "Diskon",
      shipping_discount_amount: "Diskon Ongkir",
      shipping_address: "Alamat Kirim",
      shipping_method: "Metode Kirim",
      shipping_courier: "Kurir",
      payment_method: "Metode Bayar",
      payment_proof: "Bukti Bayar",
      pickup_note: "Catatan Ambil",
      notes: "Catatan",
      cancel_reason: "Alasan Batal",
      reject_reason: "Alasan Tolak",
      scheduled_at: "Jadwal",
      pickup_at: "Ambil di Toko",
      received_at: "Diterima",
      preorder_release_at: "Rilis Preorder",
      completed_at: "Selesai",
      cancelled_at: "Dibatalkan",
      created_at: "Dibuat",
      updated_at: "Diubah",
      deleted_at: "Dihapus",
    },
  })), [rows]);
  const selection = useTableSelection(rows);
  const columnVisibility = useColumnVisibility(columns, "admin-orders");
  const orderCard = useMemo(() => orderCardDefinition({ onPrint: setPrintRow }), []);
  
  const bulkActions = [];

  const bulkStatus = async (nextStatus, targetRows = selection.selectedRows, reason = "") => {
    if (!targetRows.length) return;
    const confirmed = await confirmAction({
      title: "Ubah Status Pesanan",
      text: `${targetRows.length} pesanan akan diubah menjadi status "${nextStatus}". Lanjutkan?`,
      icon: "question",
      confirmButtonText: "Ya, Ubah Status",
      confirmButtonColor: "#059669",
    });
    if (!confirmed.isConfirmed) return;
    const loading = showLoading("Memproses...", `Mengubah status ${targetRows.length} pesanan ke ${nextStatus}`);
    try {
      for (const row of targetRows) {
        await updateMutation.mutateAsync({ id: row.id, status: nextStatus, trackingNumber: row.trackingNumber, reason });
      }
      selection.clear();
      closeLoading();
      showSuccess("Berhasil", `${targetRows.length} pesanan diubah menjadi ${nextStatus}.`);
      ordersQuery.refetch();
    } catch (error) {
      closeLoading();
      showError("Gagal", getOrderManagementError(error));
    }
  };

  const submitStatusDialog = async (event) => {
    event?.preventDefault?.();
    if (!statusDraft) {
      showError("Validasi", "Pilih status baru terlebih dahulu.");
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
      ) : (
        <ListPageFrame
toolbar={(
            <EntityToolbar
              query={query}
              onQueryChange={setQuery}
              hideCreate
              extraActions={
                <>
                  <ExcelActionButtons
                    module="sales"
                    label="Pesanan"
                    selection={selection}
                    rows={rows}
                    onRefresh={() => ordersQuery.refetch()}
                    onCompleted={() => {}}
                    getRowId={(row) => row.id}
                    allowImport={true}
                    allowExport={true}
                    allowDelete={false}
                  />
                </>
              }
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
              columns={columnVisibility.allColumns}
              visibleColumns={columnVisibility.visibleKeys}
              onToggleColumn={columnVisibility.toggleColumn}
              onMoveColumn={columnVisibility.moveColumn}
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
              <OrderManagementTable
                rows={rows}
                columns={columns}
                portal="admin"
                headerOnly
                pendingId={updateMutation.variables?.id}
                visibleSet={columnVisibility.visibleSet}
                columnOrder={columnVisibility.visibleKeys}
                onOrderChange={columnVisibility.syncVisibleOrder}
                onFilterStateChange={handleOrderFilterState}
                onEdit={editor.edit}
                onPrint={setPrintRow}
              />
              <OrdersChartPanel data={{ orders: filteredOrders.length ? filteredOrders : rows }} />
            </>
          ) : null}
          {rows.length && viewMode === "grid" ? (
            <>
              {/* Header + filter kolom tetap tampil di mode kartu (grid). */}
              <OrderManagementTable
                rows={rows}
                columns={columns}
                portal="admin"
                headerOnly
                pendingId={updateMutation.variables?.id}
                visibleSet={columnVisibility.visibleSet}
                columnOrder={columnVisibility.visibleKeys}
                onOrderChange={columnVisibility.syncVisibleOrder}
                onFilterStateChange={handleOrderFilterState}
                onEdit={editor.edit}
                onPrint={setPrintRow}
              />
              <RecordCardGrid
                rows={filteredOrders.length ? filteredOrders : rows}
                columns={columns}
                card={orderCard}
                onRowClick={editor.edit}
                selectionEnabled={selection.enabled}
                selectedIds={selection.selectedIds}
                onToggleRow={selection.toggleRow}
                rowKey={(row) => row.id}
              />
            </>
          ) : null}
          {rows.length && viewMode !== "grid" && viewMode !== "chart" ? (
            <OrderManagementTable
              rows={rows}
              onFilterStateChange={handleOrderFilterState}
              columns={columns}
              portal="admin"
              pendingId={updateMutation.variables?.id}
              visibleSet={columnVisibility.visibleSet}
              columnOrder={columnVisibility.visibleKeys}
              onOrderChange={columnVisibility.syncVisibleOrder}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              allSelected={selection.allSelected}
              onToggleRow={selection.toggleRow}
              onToggleAll={selection.toggleAll}
              onEdit={editor.edit}
              onPrint={setPrintRow}
              onStatusChange={async (row, nextStatus) => {
                const confirmed = await confirmAction({
                  title: "Ubah Status Pesanan",
                  text: `Pesanan ${row.orderNumber || `#${row.id}`} akan diubah menjadi status "${nextStatus}". Lanjutkan?`,
                  icon: "question",
                  confirmButtonText: "Ya, Ubah",
                  confirmButtonColor: "#059669",
                });
                if (!confirmed.isConfirmed) return;
                const loading = showLoading("Memproses...", `Mengubah status pesanan ke ${nextStatus}`);
                try {
                  await updateMutation.mutateAsync({ id: row.id, status: nextStatus, trackingNumber: row.trackingNumber });
                  closeLoading();
                  showSuccess("Berhasil", `Pesanan ${row.orderNumber || `#${row.id}`} diubah menjadi ${nextStatus}.`);
                  ordersQuery.refetch();
                } catch (error) {
                  closeLoading();
                  showError("Gagal", getOrderManagementError(error));
                }
              }}
            />
          ) : null}
          <InfiniteScrollSentinel hasNextPage={ordersQuery.hasNextPage} isFetchingNextPage={ordersQuery.isFetchingNextPage} onLoadMore={() => ordersQuery.fetchNextPage()} />
        </ListPageFrame>
      )}
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
      {printRow ? <OrderPrintSheet row={printRow} onClose={() => setPrintRow(null)} /> : null}
    </>
  );
}
