import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { ORDER_TABLE_COLUMNS, OrderManagementTable } from "@/features/admin/order/components/OrderManagementTable";
import { getOrderManagementError, useSellerOrders, useUpdateOrderStatus } from "@/features/admin/order/services/orderManagementService";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useColumnVisibility, useTableSelection, useViewMode } from "@/shared/hooks";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";import { buildDatabaseColumns, mergeColumns } from "@/shared/utils/tableData";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import OrderPrintSheet from "@/features/seller/order/components/OrderPrintSheet";
import OrderCompletionIncomeModal from "@/features/seller/order/components/OrderCompletionIncomeModal";
import { ManualOrderForm } from "@/features/seller/order/components/ManualOrderForm";
import { OrderDetailForm } from "@/features/seller/order/pages/OrderDetailPage";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { ExcelActionButtons } from "@/shared/excel";

export default function SellerOrdersPage() {
  const [viewMode, setViewMode] = useViewMode("seller-orders");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [printRow, setPrintRow] = useState(null);
  const [completionRows, setCompletionRows] = useState([]);
  const notifications = useNotificationCenter();
  const deferredQuery = useDeferredValue(query.trim());
  const ordersQuery = useSellerOrders({ per_page: 20, ...(deferredQuery ? { order_number: deferredQuery } : {}), ...(status ? { status } : {}), ...(type ? { order_type: type } : {}) });
  const updateMutation = useUpdateOrderStatus();
  const rows = ordersQuery.data?.rows || [];
  const total = useListTotalCount(ordersQuery.data?.meta, { label: "Pesanan" });
  const editor = useEntityEditor({ getEditLabel: (row) => row.orderNumber || row.order_number || row.subOrderNumber || `Order #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: ordersQuery.refetch });
  // Kolom kurasi + semua kolom database lain (kecuali kolom ID).
  const columns = useMemo(() => mergeColumns(ORDER_TABLE_COLUMNS.filter((column) => column.key !== "store"), buildDatabaseColumns(rows, {
    omit: ["id", "order_id", "order_number", "sub_order_number", "store_name", "grand_total", "total", "total_items_price", "shipping_cost", "status", "payment_status", "tracking_number", "items", "sub_orders", "user", "created_at", "order_type", "is_preorder"],
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
  const columnVisibility = useColumnVisibility(columns, "seller-orders");

  const completeOrders = (rowsToComplete) => {
    const pending = rowsToComplete.filter((row) => row.status !== "completed");
    if (!pending.length) return;
    setCompletionRows(pending);
  };

  const bulkStatus = async (nextStatus) => {
    if (!selection.selectedRows.length) return;
    if (nextStatus === "completed") {
      completeOrders(selection.selectedRows);
      return;
    }
    const task = notifications.startTask({ title: "Ubah Status Pesanan", message: `Memproses ${selection.selectedRows.length} pesanan ke status ${nextStatus}...` });
    try {
      for (const row of selection.selectedRows) {
        await updateMutation.mutateAsync({ id: row.id, status: nextStatus, trackingNumber: row.trackingNumber });
      }
      selection.clear();
      toastSuccess("Ubah Status Pesanan", `Status pesanan terpilih diubah menjadi ${nextStatus}.`);
      task.success(`${selection.selectedRows.length} pesanan diubah menjadi ${nextStatus}.`);
      ordersQuery.refetch();
    } catch (error) {
      task.fail(getOrderManagementError(error));
      toastError("Ubah Status Pesanan", getOrderManagementError(error));
    }
  };

  const bulkActions = [
    { key: "processing", label: "Set Processing", icon: "pending_actions", requiresSelection: true, onClick: () => bulkStatus("processing") },
    { key: "shipped", label: "Set Shipped", icon: "local_shipping", requiresSelection: true, onClick: () => bulkStatus("shipped") },
    { key: "received", label: "Set Received", icon: "inventory_2", requiresSelection: true, onClick: () => bulkStatus("received") },
    { key: "completed", label: "Set Completed", icon: "task_alt", requiresSelection: true, onClick: () => bulkStatus("completed") },
  ];

  return (
    <SellerPanelShell>
      {editor.open ? (
        editor.entity ? (
          <OrderDetailForm
            row={editor.entity}
            onSaved={() => ordersQuery.refetch()}
            onDeleted={() => {
              toastSuccess("Hapus Pesanan", "Pesanan berhasil dihapus.");
              editor.close();
              ordersQuery.refetch();
            }}
          />
        ) : (
          <ManualOrderForm
            onClose={editor.close}
            onSaved={() => {
              toastSuccess("Order Manual", "Order manual berhasil dibuat.");
              ordersQuery.refetch();
            }}
          />
        )
      ) : (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            createLabel="Tambah Order Manual"
            onCreate={editor.create}
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
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            viewModeOptions={[
              { value: "list", label: "Daftar", icon: "view_list" },
              { value: "chart", label: "Grafik", icon: "insert_chart" },
            ]}
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
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "processing", label: "Processing" },
                    { value: "shipped", label: "Shipped" },
                    { value: "received", label: "Received" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                  placeholder="Semua status"
                  className="w-44"
                  buttonClassName="h-9"
                />
              </>
            )}
            extraActions={
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
            }
          />
          )}
        >
          <AsyncState loading={ordersQuery.isLoading} error={ordersQuery.error ? getOrderManagementError(ordersQuery.error) : ""} empty={!ordersQuery.isLoading && !rows.length} emptyText="Pesanan toko belum tersedia." />
          {rows.length && viewMode !== "chart" ? (
            <OrderManagementTable
              rows={rows}
              onFilterStateChange={total.onFilterStateChange}
              columns={columns}
              portal="seller"
              pendingId={updateMutation.variables?.id}
              onPrint={setPrintRow}
              onEdit={editor.edit}
              visibleSet={columnVisibility.visibleSet}
              columnOrder={columnVisibility.visibleKeys}
              onOrderChange={columnVisibility.syncVisibleOrder}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              allSelected={selection.allSelected}
              onToggleRow={selection.toggleRow}
              onToggleAll={selection.toggleAll}
              onStatusChange={(row, nextStatus) => {
                if (nextStatus === "completed") {
                  completeOrders([row]);
                  return;
                }
                const task = notifications.startTask({ title: "Ubah Status Pesanan", message: `Memproses pesanan ${row.orderNumber || `#${row.id}`} ke status ${nextStatus}...` });
                updateMutation.mutateAsync({ id: row.id, status: nextStatus, trackingNumber: row.trackingNumber })
                  .then(() => {
                    task.success(`Pesanan ${row.orderNumber || `#${row.id}`} diubah menjadi ${nextStatus}.`);
                    toastSuccess("Ubah Status Pesanan", "Status pesanan berhasil diperbarui.");
                    ordersQuery.refetch();
                  })
                  .catch((error) => {
                    task.fail(getOrderManagementError(error));
                    toastError("Ubah Status Pesanan", getOrderManagementError(error));
                  });
              }}
            />
          ) : null}
          <InfiniteScrollSentinel hasNextPage={ordersQuery.hasNextPage} isFetchingNextPage={ordersQuery.isFetchingNextPage} onLoadMore={() => ordersQuery.fetchNextPage()} />
        </ListPageFrame>
      )}
      {printRow ? <OrderPrintSheet row={printRow} onClose={() => setPrintRow(null)} /> : null}
      <OrderCompletionIncomeModal
        open={completionRows.length > 0}
        rows={completionRows}
        onClose={() => setCompletionRows([])}
        onCompleted={(count) => {
          setCompletionRows([]);
          selection.clear();
          const task = notifications.startTask({ title: "Selesaikan Pesanan", message: `Mencatat pemasukan untuk ${count} pesanan...` });
          task.success(count > 1 ? `${count} pesanan berhasil diselesaikan dengan pemasukan dicatat.` : "Pesanan berhasil diselesaikan dengan pemasukan dicatat.");
          ordersQuery.refetch();
        }}
      />
    </SellerPanelShell>
  );
}
