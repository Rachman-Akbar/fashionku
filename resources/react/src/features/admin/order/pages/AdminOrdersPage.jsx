import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { AdminShell } from "@/features/admin/dashboard/components/AdminShell";
import { ORDER_TABLE_COLUMNS, OrderManagementTable } from "@/features/admin/order/components/OrderManagementTable";
import { getOrderManagementError, useAdminOrders, useUpdateOrderStatus } from "@/features/admin/order/services/orderManagementService";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import OrderPrintSheet from "@/features/seller/order/components/OrderPrintSheet";
import { OrderDetailForm } from "@/features/seller/order/pages/OrderDetailPage";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";

export default function AdminOrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [printRow, setPrintRow] = useState(null);
  const notifications = useNotificationCenter();
  const deferredQuery = useDeferredValue(query.trim());
  const ordersQuery = useAdminOrders({ per_page: 20, ...(deferredQuery ? { search: deferredQuery } : {}), ...(status ? { status } : {}), ...(type ? { order_type: type } : {}) });
  const updateMutation = useUpdateOrderStatus();
  const rows = ordersQuery.data?.rows || [];
  const total = useListTotalCount(ordersQuery.data?.meta, { label: "Pesanan" });
  const editor = useEntityEditor({ getEditLabel: (row) => row.orderNumber || row.order_number || row.subOrderNumber || `Order #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: ordersQuery.refetch });
  const columns = useMemo(() => mergeColumns(ORDER_TABLE_COLUMNS, buildRawColumns(rows, ["id", "order_id", "order_number", "sub_order_number", "store_id", "store_name", "grand_total", "total", "total_items_price", "shipping_cost", "status", "payment_status", "tracking_number"])), [rows]);
  const selection = useTableSelection(rows);
  const columnVisibility = useColumnVisibility(columns, "admin-orders");
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

  const bulkStatus = async (nextStatus) => {
    if (!selection.selectedRows.length) return;
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
      toastError("Ubah Status Pesanan", getOrderManagementError(error));
      task.fail(getOrderManagementError(error));
    }
  };

  const bulkActions = [
    { key: "processing", label: "Set Processing", icon: "pending_actions", requiresSelection: true, onClick: () => bulkStatus("processing") },
    { key: "shipped", label: "Set Shipped", icon: "local_shipping", requiresSelection: true, onClick: () => bulkStatus("shipped") },
    { key: "received", label: "Set Received", icon: "inventory_2", requiresSelection: true, onClick: () => bulkStatus("received") },
    { key: "completed", label: "Set Completed", icon: "task_alt", requiresSelection: true, onClick: () => bulkStatus("completed") },
    ...spreadsheet.actions,
  ];

  return (
    <AdminShell>
      {editor.open && editor.entity ? (
        <OrderDetailForm row={editor.entity} />
      ) : !spreadsheet.activeOperation ? (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            hideCreate
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
                    { value: "normal", label: "Normal" },
                    { value: "preorder", label: "Preorder" },
                    { value: "booking", label: "Booking" },
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
          />
          )}
        >
          <AsyncState loading={ordersQuery.isLoading} error={ordersQuery.error ? getOrderManagementError(ordersQuery.error) : ""} empty={!ordersQuery.isLoading && !rows.length} emptyText="Pesanan belum tersedia." />
          {rows.length ? (
            <OrderManagementTable
              rows={rows}
              onFilterStateChange={total.onFilterStateChange}
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
      <SpreadsheetOperationPanel workspace={spreadsheet} />
      {printRow ? <OrderPrintSheet row={printRow} onClose={() => setPrintRow(null)} /> : null}
    </AdminShell>
  );
}
