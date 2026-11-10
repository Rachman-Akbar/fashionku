import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { advancedError, useDeleteFinance, useFinance, useFinancePaymentHistory, useRecordFinancePayment, useSaveFinance } from "@/features/advanced/services/advancedMarketplaceService";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import FinanceChartPanel from "@/features/advanced/components/FinanceChartPanel";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { Input } from "@/shared/components/ui/Input";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { ActionIconButton } from "@/shared/components/crud/ActionIconButton";
import { useEntityEditor, useRefreshOnListActivation, useTableSelection, useColumnVisibility } from "@/shared/hooks";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useAdminOrders, useSellerOrders } from "@/features/admin/order/services/orderManagementService";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { inputClassName } from "@/shared/components/form/FormField";

function nowInput() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function initialForm(type, mode) {
  return {
    type,
    title: "",
    description: "",
    amount: "",
    paid_amount: "0",
    status: mode === "cashflow" ? "posted" : "open",
    due_date: "",
    occurred_at: nowInput(),
    is_active: true,
    order_id: "",
    store_id: "",
    reference_number: autoReference(type),
  };
}

function autoReference(type) {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INV/${String(type || "FIN").slice(0, 3).toUpperCase()}/${stamp}/${random}`;
}

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function typeLabel(type) {
  return ({ income: "Pemasukan", expense: "Pengeluaran", receivable: "Piutang", payable: "Hutang" })[type] || type;
}

const TYPE_BADGE = {
  receivable: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  payable: "bg-rose-50 text-rose-700 ring-rose-200",
  income: "bg-sky-50 text-sky-700 ring-sky-200",
  expense: "bg-orange-50 text-orange-700 ring-orange-200",
};

export default function FinancePage({ mode = "cashflow" }) {
  const allowedTypes = useMemo(() => (mode === "cashflow" ? ["income", "expense"] : ["receivable", "payable"]), [mode]);
  const isDebtMode = mode !== "cashflow";
  const [viewMode, setViewMode] = useState("list");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(() => initialForm(allowedTypes[0], mode));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [localPaymentOpen, setLocalPaymentOpen] = useState(false);
  const [paymentRow, setPaymentRow] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const { activeRole } = useAuth();
  const panelTabs = usePanelTabs();
  const deferredQuery = useDeferredValue(query.trim());
  const editor = useEntityEditor({ getEditLabel: (row) => row.reference_number || row.title });
  const listQuery = useFinance({
    per_page: 20,
    type: allowedTypes.join(","),
    ...(deferredQuery ? { search: deferredQuery } : {}),
  });
  const saveMutation = useSaveFinance();
  const paymentMutation = useRecordFinancePayment();
  const deleteMutation = useDeleteFinance();
  const rows = listQuery.data?.rows || [];
  const selection = useTableSelection(rows);
  const paymentOpen = panelTabs ? panelTabs.activeTab?.type === "finance-payment" : localPaymentOpen;
  const paymentHistoryQuery = useFinancePaymentHistory(paymentRow?.id, paymentOpen);
  const total = useListTotalCount(listQuery.data?.meta, { label: "Transaksi" });
  const deferredOrderSearch = useDeferredValue(orderSearch.trim());
  const sellerOrderQuery = useSellerOrders({ per_page: 20, enabled: editor.open && activeRole !== "admin", ...(deferredOrderSearch ? { order_number: deferredOrderSearch } : {}) });
  const adminOrderQuery = useAdminOrders({ per_page: 20, enabled: editor.open && activeRole === "admin", ...(deferredOrderSearch ? { order_number: deferredOrderSearch } : {}) });
  const orderRows = activeRole === "admin" ? adminOrderQuery.rows : sellerOrderQuery.rows;
  const orderOptions = useMemo(() => {
    const options = orderRows.map((order) => ({
      value: String(order.orderId || order.id),
      label: order.orderNumber || `Order #${order.id}`,
      keywords: `${order.subOrderNumber || ""} ${order.storeName || ""} ${order.customerName || ""}`,
    }));
    const currentId = String(form.order_id || "");
    if (currentId && !options.some((option) => option.value === currentId)) {
      options.unshift({ value: currentId, label: editor.entity?.order_number || `Order #${currentId}`, keywords: `${editor.entity?.store_name || ""} ${editor.entity?.order_number || ""}` });
    }
    return options;
  }, [editor.entity?.order_number, editor.entity?.store_name, form.order_id, orderRows]);
  const selectedOrder = useMemo(() => orderRows.find((order) => String(order.orderId || order.id) === String(form.order_id || "")) || null, [form.order_id, orderRows]);
  const selectedTypes = useMemo(() => [...new Set(selection.selectedRows.map((row) => row.type).filter(Boolean))], [selection.selectedRows]);
  const spreadsheetModule = selectedTypes.length === 1 ? selectedTypes[0] : allowedTypes[0];
  const spreadsheet = useSpreadsheetWorkspace({
    module: spreadsheetModule,
    label: typeLabel(spreadsheetModule),
    selectedRows: selection.selectedRows,
    onCompleted: () => {
      selection.clear();
      listQuery.refetch();
    },
  });

  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: listQuery.refetch });
  useEffect(() => {
    if (!editor.open) return;
    const row = editor.entity;
    setForm(row ? {
      type: row.type,
      title: row.title || "",
      description: row.description || "",
      amount: String(row.amount || ""),
      paid_amount: String(row.paid_amount || 0),
      status: row.status || (mode === "cashflow" ? "posted" : "open"),
      due_date: row.due_date || "",
      occurred_at: row.occurred_at ? new Date(row.occurred_at).toISOString().slice(0, 16) : nowInput(),
      is_active: row.is_active !== false,
      order_id: row.order_id ? String(row.order_id) : "",
      store_id: row.store_id ? String(row.store_id) : "",
      reference_number: row.reference_number || autoReference(row.type || allowedTypes[0]),
    } : initialForm(allowedTypes[0], mode));
  }, [allowedTypes, editor.open, editor.entity, mode]);

  const columns = useMemo(() => {
    const typeColumn = {
      key: "type",
      label: "Jenis",
      width: 120,
      minWidth: 110,
      filterType: "select",
      options: allowedTypes.map((item) => ({ value: item, label: typeLabel(item) })),
      render: (row) => (
        <span className={`inline-flex items-center rounded-[10px] px-2 py-0.5 text-[11px] font-extrabold uppercase ring-1 ring-inset ${TYPE_BADGE[row.type] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>
          {typeLabel(row.type)}
        </span>
      ),
    };
    const list = [
      { key: "reference_number", label: "Referensi" },
      { key: "title", label: "Keterangan" },
      { key: "store_name", label: "Toko" },
      { key: "order_number", label: "Pesanan" },
      { key: "amount", label: "Nominal", render: (row) => <span className="font-bold text-slate-900">{money(row.amount)}</span> },
      { key: "paid_amount", label: "Terbayar", render: (row) => money(row.paid_amount) },
      { key: "outstanding_amount", label: "Sisa", render: (row) => money(row.outstanding_amount) },
      { key: "status", label: "Status", filterType: "select", options: (isDebtMode ? ["open", "partial", "paid", "cancelled"] : ["draft", "posted", "cancelled"]).map((item) => ({ value: item, label: item })), render: (row) => <span className="font-bold uppercase text-slate-600">{row.status}</span> },
      { key: "occurred_at", label: "Tanggal", render: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleDateString("id-ID") : "-" },
    ];
    return [typeColumn, ...list];
  }, [allowedTypes, isDebtMode]);

  const tableColumns = useMemo(() => {
    if (mode === "cashflow") return columns;
    const bayarColumn = {
      key: "bayar",
      label: "Bayar",
      locked: true,
      render: (row) => {
        const canPay = Number(row.outstanding_amount) > 0 && !["paid", "cancelled"].includes(String(row.status || "").toLowerCase());
        return (
          <button
            type="button"
            disabled={!canPay}
            onClick={(event) => { event.stopPropagation(); recordPaymentRef.current?.(row); }}
            className="inline-flex h-8 items-center gap-1.5 bg-emerald-600 px-3 text-xs font-extrabold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            title={canPay ? "Catat pembayaran/cicilan" : "Transaksi sudah lunas"}
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            Bayar
          </button>
        );
      },
    };
    return [...columns, bayarColumn];
  }, [columns, mode]);

  const columnVisibility = useColumnVisibility(tableColumns, `advanced.finance.${mode}`);

  function applyOrder(orderId) {
    const nextId = String(orderId || "");
    const order = orderRows.find((item) => String(item.orderId || item.id) === nextId) || null;
    setForm((current) => ({
      ...current,
      order_id: order ? nextId : "",
      store_id: order?.storeId ? String(order.storeId) : current.store_id,
      title: order && !current.title.trim() ? `Pesanan ${order.orderNumber}` : current.title,
      amount: order && !String(current.amount).trim() ? String(order.total || "") : current.amount,
      reference_number: order && !String(current.reference_number).trim() ? `INV/${order.orderNumber}` : current.reference_number,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const { paid_amount: _paidAmount, ...editableForm } = form;
      await saveMutation.mutateAsync({
        id: editor.entity?.id,
        values: {
          ...editableForm,
          amount: Number(form.amount),
          order_id: form.order_id ? Number(form.order_id) : null,
          store_id: activeRole === "admin" && form.store_id ? Number(form.store_id) : null,
          reference_number: String(form.reference_number || "").trim() || null,
          due_date: form.due_date || null,
          occurred_at: new Date(form.occurred_at).toISOString(),
        },
      });
      toastSuccess("Simpan Data Keuangan", `${typeLabel(form.type)} berhasil disimpan.`);
      editor.markListDirty();
      editor.completeSave();
      editor.close();
    } catch (error) {
      toastError("Simpan Data Keuangan", advancedError(error));
    }
  }

  const recordPaymentRef = useRef(null);

  function recordPayment(row) {
    setPaymentRow(row);
    setPaymentAmount("");
    setPaymentMethod("transfer");
    setPaymentReference("");
    setPaymentNotes("");
    if (panelTabs) {
      panelTabs.openOperationTab("finance-payment", { id: row.id, label: `Pembayaran ${row.reference_number || row.title}` });
      return;
    }
    setLocalPaymentOpen(true);
  }

  recordPaymentRef.current = recordPayment;

  function closePayment() {
    setPaymentRow(null);
    setPaymentAmount("");
    if (panelTabs) {
      panelTabs.closeActiveTab();
      return;
    }
    setLocalPaymentOpen(false);
  }

  async function submitPayment(event) {
    event.preventDefault();
    if (!paymentRow) return;
    try {
      await paymentMutation.mutateAsync({ id: paymentRow.id, amount: Number(paymentAmount), payment_method: paymentMethod, reference_number: paymentReference || null, notes: paymentNotes || null });
      toastSuccess("Catat Pembayaran", "Pembayaran berhasil dicatat.");
      editor.markListDirty();
      closePayment();
      listQuery.refetch();
    } catch (error) {
      toastError("Catat Pembayaran", advancedError(error));
    }
  }

  async function remove() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      editor.markListDirty();
      setDeleteTarget(null);
      toastSuccess("Hapus Data Keuangan", "Data keuangan berhasil dihapus.");
    } catch (error) {
      toastError("Hapus Data Keuangan", advancedError(error));
    }
  }

  const title = mode === "cashflow" ? "Pemasukan-Pengeluaran" : "Hutang-Piutang";

  return (
    <>
      {editor.isListActive ? (
        <ModuleFrame
          title={title}
          subtitle="CRUD memakai tab data baru seperti Product. Admin melihat data global, seller otomatis dibatasi ke toko aktif."
          query={query}
          onQueryChange={setQuery}
          onRefresh={() => listQuery.refetch()}
          refreshing={listQuery.isFetching}
          totalCount={total.totalCount}
          totalLabel={total.totalLabel}
          totalTitle={total.totalTitle}
          onCreate={editor.create}
          createLabel="Tambah Data Keuangan"
          placeholder={isDebtMode ? "Cari hutang/piutang, referensi, pesanan, atau toko" : "Cari pemasukan/pengeluaran, referensi, pesanan, atau toko"}
          extraActions={(
            <ActionIconButton
              icon={viewMode === "list" ? "bar_chart" : "view_list"}
              title={viewMode === "list" ? "Tampilkan grafik" : "Tampilkan daftar datar"}
              onClick={() => setViewMode((current) => (current === "list" ? "chart" : "list"))}
              active={viewMode === "chart"}
            />
          )}
          selectionEnabled={selection.enabled}
          selectedCount={selection.selectedCount}
          onToggleSelection={selection.toggleEnabled}
          bulkActions={spreadsheet.actions}
          columns={tableColumns}
          visibleColumns={columnVisibility.visibleKeys}
          onToggleColumn={columnVisibility.toggleColumn}
          onShowAllColumns={columnVisibility.showAll}
          onResetColumns={columnVisibility.reset}
          onApplyDefaultColumns={columnVisibility.applyAsDefault}
        >
          {viewMode === "chart" ? <FinanceChartPanel mode={mode} /> : (
            <DataGrid
              onFilterStateChange={total.onFilterStateChange}
              columns={tableColumns}
              rows={rows}
              storageKey={`advanced.finance.${mode}`}
              emptyText={listQuery.isLoading ? "" : isDebtMode ? "Belum ada data hutang atau piutang." : "Belum ada data pemasukan atau pengeluaran."}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              allSelected={selection.allSelected}
              onToggleRow={selection.toggleRow}
              onToggleAll={selection.toggleAll}
              onRowClick={editor.edit}
              hasNextPage={listQuery.hasNextPage}
              isFetchingNextPage={listQuery.isFetchingNextPage}
              onLoadMore={() => listQuery.fetchNextPage()}
            />
          )}
        </ModuleFrame>
      ) : null}

      <SpreadsheetOperationPanel workspace={spreadsheet} />
      <ConfirmDialog open={Boolean(deleteTarget)} title={`Hapus ${deleteTarget ? typeLabel(deleteTarget.type) : "Data Keuangan"}`} message={deleteTarget ? `${deleteTarget.reference_number || deleteTarget.title} akan dihapus.` : "Data akan dihapus."} pending={false} onClose={() => setDeleteTarget(null)} onConfirm={remove} />


      <FormModal
        open={paymentOpen}
        title="Catat Pembayaran"
        subtitle={paymentRow ? `${paymentRow.reference_number || paymentRow.title} · Sisa ${money(paymentRow.outstanding_amount)}` : "Masukkan nominal pembayaran."}
        onClose={closePayment}
        onSubmit={submitPayment}
        busy={false}
        submitLabel="Simpan Cicilan"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nominal Cicilan" required>
            <Input type="number" min="0.01" step="0.01" max={paymentRow?.outstanding_amount || undefined} value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} required />
          </Field>
          <Field label="Metode Pembayaran">
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className={inputClassName}>
              <option value="transfer">Transfer</option><option value="cash">Tunai</option><option value="ewallet">E-Wallet</option><option value="manual">Lainnya</option>
            </select>
          </Field>
        </div>
        <Field label="Nomor Referensi"><Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} /></Field>
        <Field label="Catatan"><textarea value={paymentNotes} onChange={(event) => setPaymentNotes(event.target.value)} className="min-h-20 border border-slate-300 p-3 text-sm" /></Field>
        <div className="border-t border-slate-200 pt-4">
          <h3 className="mb-3 text-sm font-black text-slate-800">Riwayat Pembayaran</h3>
          <div className="space-y-2">
            {(Array.isArray(paymentHistoryQuery.data) ? paymentHistoryQuery.data : paymentHistoryQuery.data?.data || []).map((row) => (
              <div key={row.id} className="border border-slate-200 bg-slate-50 p-3 text-xs">
                <div className="grid gap-2 sm:grid-cols-4">
                  <span>{row.paid_at ? new Date(row.paid_at).toLocaleString("id-ID") : "-"}</span>
                  <strong>{money(row.amount)}</strong>
                  <span>{row.payment_method || "manual"}</span>
                  <span>Sisa {money(row.balance_after)}</span>
                </div>
                <p className="mt-1 border-t border-slate-200 pt-1 text-slate-500">
                  Bukti: <span className="font-semibold text-slate-700">{row.reference_number || "-"}</span>
                  {row.notes ? <span> · {row.notes}</span> : null}
                </p>
              </div>
            ))}
            {!paymentHistoryQuery.data?.length ? <p className="text-xs text-slate-500">Belum ada riwayat pembayaran.</p> : null}
          </div>
        </div>
      </FormModal>

      <FormModal
        open={editor.open}
        title={editor.entity ? `Edit ${typeLabel(form.type)}` : `Tambah ${typeLabel(form.type)}`}
        subtitle="Form dibuka pada tab data tersendiri agar daftar tetap ringkas dan pekerjaan tidak tertutup modal."
        onClose={editor.close}
        onSubmit={submit}
        busy={false}
        onDelete={editor.entity ? () => { setDeleteTarget(editor.entity); editor.close(); } : undefined}
        extraActions={(
          editor.entity && mode !== "cashflow" && Number(editor.entity.outstanding_amount) > 0
            ? [{ icon: "payments", label: "Bayar", tone: "teal", onClick: () => { const row = editor.entity; editor.close(); recordPayment(row); } }]
            : []
        )}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Jenis" required>
            <select value={form.type} onChange={(event) => { const nextType = event.target.value; setForm((current) => ({ ...current, type: nextType, reference_number: current.reference_number === autoReference(current.type) || !String(current.reference_number).trim() ? autoReference(nextType) : current.reference_number })); }} className={inputClassName} required>
              {allowedTypes.map((item) => <option key={item} value={item}>{typeLabel(item)}</option>)}
            </select>
          </Field>
          <Field label="Status" required>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className={inputClassName}>
              {(mode === "cashflow" ? ["draft", "posted", "cancelled"] : ["open", "partial", "paid", "cancelled"]).map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="No. Pesanan" hint={selectedOrder ? `Toko ${selectedOrder.storeName || "-"} · Total ${money(selectedOrder.total)}` : "Pilih pesanan untuk mengisi nominal dan nomor invoice otomatis."}>
            <SearchableSelect
              value={form.order_id || ""}
              onChange={applyOrder}
              options={orderOptions}
              onSearch={setOrderSearch}
              placeholder="Pilih / cari pesanan"
              searchPlaceholder="Cari nomor pesanan"
              emptyText="Pesanan tidak ditemukan"
            />
          </Field>
          <Field label="No. Invoice / Referensi" hint="Boleh dikosongkan, sistem akan membuat nomor otomatis.">
            <Input value={form.reference_number} placeholder={autoReference(form.type)} onChange={(event) => setForm((current) => ({ ...current, reference_number: event.target.value }))} />
          </Field>
        </div>
        <Field label="Judul" required hint={selectedOrder ? "Terisi otomatis dari pesanan, bisa diubah." : undefined}><Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required /></Field>
        <Field label="Deskripsi"><textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-24 border border-slate-300 p-3 text-sm" /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nominal" required><Input type="number" min="1" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} required /></Field>
          <Field label="Sudah Dibayar" hint="Nilai ini hanya berubah melalui tombol Bayar agar seluruh cicilan tercatat di riwayat."><Input type="number" min="0" step="0.01" value={form.paid_amount} disabled /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tanggal Transaksi" required><Input type="datetime-local" value={form.occurred_at} onChange={(event) => setForm((current) => ({ ...current, occurred_at: event.target.value }))} required /></Field>
          {mode !== "cashflow" ? <Field label="Jatuh Tempo"><Input type="date" value={form.due_date} onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))} /></Field> : <div />}
        </div>
      </FormModal>
    </>
  );
}
