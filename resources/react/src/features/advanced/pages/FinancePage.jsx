import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { advancedError, useDeleteFinance, useFinance, useFinanceDashboard, useFinancePaymentHistory, useRecordFinancePayment, useSaveFinance } from "@/features/advanced/services/advancedMarketplaceService";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { buildDatabaseColumns } from "@/shared/utils/tableData";
import { FinanceChartPanel } from "@/shared/charts/ChartPanels";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { Input } from "@/shared/components/ui/Input";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { useColumnFilterAutoLoad, useEntityEditor, useRefreshOnListActivation, useTableSelection, useColumnVisibility } from "@/shared/hooks";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useAdminOrders, useSellerOrders } from "@/features/admin/order/services/orderManagementService";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { inputClassName } from "@/shared/components/form/FormField";
import { ExcelActionButtons } from "@/shared/excel";
import { showSuccess, showError, confirmDelete, showLoading, closeLoading } from "@/shared/utils/sweetAlert";
import { useUnsavedChangesGuard, useFormDirty } from "@/shared/hooks/useUnsavedChanges";
import { MultiImagePicker } from "@/shared/components/form";
import { DetailTabs } from "@/shared/components/ui/DetailTabs";

function nowInput() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function initialForm(type) {
  return {
    type,
    title: "",
    description: "",
    amount: "",
    paid_amount: "0",
    status: isDebtTransaction(type) ? "open" : "posted",
    due_date: "",
    occurred_at: nowInput(),
    is_active: true,
    order_id: "",
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

// Piutang/hutang punya siklus status sendiri (open/partial/paid), sedangkan
// pemasukan/pengeluaran memakai draft/posted. Dua-duanya hidup di satu tabel
// keuangan, jadi status harus ditentukan dari jenis transaksi (bukan dari mode
// halaman) agar form, filter, dan tabel selalu konsisten.
export const DEBT_TYPES = ["receivable", "payable"];
export const CASH_STATUSES = ["draft", "posted", "cancelled"];
export const DEBT_STATUSES = ["open", "partial", "paid", "cancelled"];
export const ALL_FINANCE_TYPES = ["income", "expense", "receivable", "payable"];

export function isDebtTransaction(type) {
  return DEBT_TYPES.includes(String(type));
}

export function statusOptionsFor(type) {
  return isDebtTransaction(type) ? DEBT_STATUSES : CASH_STATUSES;
}

const TYPE_BADGE = {
  receivable: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  payable: "bg-rose-50 text-rose-700 ring-rose-200",
  income: "bg-sky-50 text-sky-700 ring-sky-200",
  expense: "bg-orange-50 text-orange-700 ring-orange-200",
};

function FinanceFormContent({
  form,
  setForm,
  allowedTypes,
  selectedOrder,
  orderOptions,
  applyOrder,
  setOrderSearch,
  autoReference,
  typeLabel,
  inputClassName,
  money,
  proofImages,
  setProofImages,
}) {
  return (
    <>
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Jenis" required>
        <select value={form.type} onChange={(event) => { const nextType = event.target.value; setForm((current) => ({ ...current, type: nextType, status: statusOptionsFor(nextType).includes(current.status) ? current.status : statusOptionsFor(nextType)[0], reference_number: current.reference_number === autoReference(current.type) || !String(current.reference_number).trim() ? autoReference(nextType) : current.reference_number })); }} className={inputClassName} required>
          {allowedTypes.map((item) => <option key={item} value={item}>{typeLabel(item)}</option>)}
        </select>
      </Field>
      <Field label="Status" required>
        <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className={inputClassName}>
          {statusOptionsFor(form.type).map((item) => <option key={item}>{item}</option>)}
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
      <Field label="Nominal" required><FormattedNumberInput decimal min="1" step="0.01" value={form.amount} onChange={(value) => setForm((current) => ({ ...current, amount: value }))} required /></Field>
      <Field label="Sudah Dibayar" hint="Nilai ini hanya berubah melalui tombol Bayar agar seluruh cicilan tercatat di riwayat."><FormattedNumberInput decimal min="0" step="0.01" value={form.paid_amount} disabled /></Field>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Tanggal Transaksi" required><Input type="datetime-local" value={form.occurred_at} onChange={(event) => setForm((current) => ({ ...current, occurred_at: event.target.value }))} required /></Field>
      {isDebtTransaction(form.type) ? <Field label="Jatuh Tempo"><Input type="date" value={form.due_date} onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))} /></Field> : <div />}
    </div>
    <Field label="Bukti Tanda Terima (Gambar)" hint="Wajib diisi minimal 1 gambar sebagai bukti transaksi. Maksimal 5 gambar.">
      <MultiImagePicker value={proofImages} onChange={setProofImages} scope={isDebtTransaction(form.type) ? "finance/payments" : "finance/cashflow"} maxFiles={5} />
    </Field>
    </>
  );
}

function PaymentHistoryTab({ financeId, paymentHistoryQuery, money }) {
  const payments = Array.isArray(paymentHistoryQuery.data) ? paymentHistoryQuery.data : paymentHistoryQuery.data?.data || [];

  if (!financeId) {
    return <p className="text-sm text-slate-500">Pilih data keuangan untuk melihat riwayat pembayaran.</p>;
  }

  if (paymentHistoryQuery.isLoading) {
    return <p className="text-sm text-slate-500">Memuat riwayat pembayaran...</p>;
  }

  if (!payments.length) {
    return <p className="text-sm text-slate-500">Belum ada riwayat pembayaran.</p>;
  }

  return (
    <div className="space-y-3">
      {payments.map((row) => (
        <div key={row.id} className="border border-slate-200 bg-white rounded-xl p-4">
          <div className="grid gap-3 sm:grid-cols-4 mb-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Tanggal</p>
              <p className="font-medium text-slate-900">{row.paid_at ? new Date(row.paid_at).toLocaleString("id-ID") : "-"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Nominal</p>
              <p className="font-bold text-emerald-700">{money(row.amount)}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Metode</p>
              <p className="font-medium text-slate-700">{row.payment_method || "manual"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Sisa</p>
              <p className="font-medium text-slate-700">{money(row.balance_after)}</p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <div className="grid gap-2 sm:grid-cols-3 mb-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Referensi</p>
                <p className="font-semibold text-slate-700">{row.reference_number || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Catatan</p>
                <p className="text-slate-600">{row.notes || "-"}</p>
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
        </div>
      ))}
    </div>
  );
}

export default function FinancePage({ mode = "cashflow" }) {
  // Halaman Keuangan menampilkan seluruh jenis transaksi; halaman Hutang/Piutang
  // hanyalah pintasan yang menyaring dua jenis hutang-piutang.
  const allowedTypes = useMemo(() => (mode === "cashflow" ? ALL_FINANCE_TYPES : DEBT_TYPES), [mode]);
  const isDebtMode = mode !== "cashflow";
  const [viewMode, setViewMode] = useState("list");
  const viewModeOptions = [
    { value: "list", label: "Daftar", icon: "view_list" },
    { value: "chart", label: "Grafik", icon: "insert_chart" },
  ];
  const financeCard = {
    title: (row) => row.title || row.reference_number || "Data Keuangan",
    subtitle: (row) => [row.reference_number, row.occurred_at ? new Date(row.occurred_at).toLocaleDateString("id-ID") : null].filter(Boolean).join(" · ") || "-",
    badges: [
      (row) => (
        <span className={`inline-flex items-center rounded-[10px] px-2 py-0.5 text-[10px] font-extrabold uppercase ring-1 ring-inset ${TYPE_BADGE[row.type] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>
          {typeLabel(row.type)}
        </span>
      ),
      (row) => <span className="text-[10px] font-extrabold uppercase text-slate-600">{row.status}</span>,
    ],
    fields: [
      { label: "Nominal", render: (row) => money(row.amount) },
      { label: "Terbayar / Sisa", render: (row) => {
        const amount = Number(row.amount || 0);
        const paid = Number(row.paid_amount || 0);
        const outstanding = Number(row.outstanding_amount || 0);
        return `${money(paid)} / ${money(amount)} (Sisa ${money(outstanding)})`;
      } },
      { label: "Pesanan", render: (row) => row.order_number || "-" },
    ],
  };
  const [query, setQuery] = useState("");
  // Aksi cepat dashboard (mis. /admin/cashflow?new=expense) membuka formulir
  // dengan jenis tertentu; jenis pilihan disimpan di ref agar efek reset
  // formulir tidak perlu bergantung pada state tambahan.
  const [searchParams, setSearchParams] = useSearchParams();
  const presetTypeRef = useRef(null);
  const [pendingType, setPendingType] = useState(null);
  const [form, setForm] = useState(() => initialForm(allowedTypes[0]));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [localPaymentOpen, setLocalPaymentOpen] = useState(false);
  const [payPickerOpen, setPayPickerOpen] = useState(false);
  const [payPickerTarget, setPayPickerTarget] = useState("");
  const [paymentRow, setPaymentRow] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [proofImages, setProofImages] = useState([]);
  const [paymentImages, setPaymentImages] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const { activeRole } = useAuth();
  const panelTabs = usePanelTabs();
  const deferredQuery = useDeferredValue(query.trim());
  const editor = useEntityEditor({ getEditLabel: (row) => row.reference_number || row.title });
  const [initialFormData, setInitialFormData] = useState(null);
  const formDirty = useFormDirty(form, initialFormData, ["type", "title", "description", "amount", "status", "due_date", "occurred_at", "is_active", "order_id", "reference_number", "proof_images"]);
  const { handleLeave: handleFormLeave, handleCancel: handleFormCancel } = useUnsavedChangesGuard({
    isDirty: formDirty && editor.open,
    onLeave: editor.close,
    onCancel: () => {},
    message: "Data keuangan yang diedit belum disimpan. Yakin ingin meninggalkan formulir?",
  });
  const listQuery = useFinance({
    per_page: 20,
    type: allowedTypes.join(","),
    ...(deferredQuery ? { search: deferredQuery } : {}),
  });
  const chartQuery = useFinanceDashboard({ type: allowedTypes.join(",") });
  const saveMutation = useSaveFinance();
  const paymentMutation = useRecordFinancePayment();
  const deleteMutation = useDeleteFinance();
  const rows = listQuery.data?.rows || [];
  const payOptions = useMemo(
    () => rows
      .filter((row) => Number(row.outstanding_amount) > 0 && !["paid", "cancelled"].includes(String(row.status || "").toLowerCase()))
      .map((row) => ({
        value: String(row.id),
        label: `${row.reference_number || row.title || "Transaksi"} · Sisa ${money(row.outstanding_amount)}`,
        keywords: `${row.title || ""} ${row.reference_number || ""} ${row.order_number || ""}`,
        group: typeLabel(row.type),
      })),
    [rows],
  );
  const selection = useTableSelection(rows);
  const paymentOpen = panelTabs ? panelTabs.activeTab?.type === "finance-payment" : localPaymentOpen;
  const paymentHistoryQuery = useFinancePaymentHistory(paymentRow?.id, paymentOpen);
  const total = useListTotalCount(listQuery.data?.meta, { label: "Transaksi" });
  // Filter kolom berjalan di client, jadi sisa halaman dimuat dulu saat filter aktif.
  useColumnFilterAutoLoad({ activeCount: total.filterState.activeCount, query: listQuery });
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

  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: listQuery.refetch });
  useEffect(() => {
    if (!editor.open) {
      setInitialFormData(null);
      setProofImages([]);
      presetTypeRef.current = null;
      return;
    }
    const row = editor.entity;
    const newForm = row ? {
      type: row.type,
      title: row.title || "",
      description: row.description || "",
      amount: String(row.amount || ""),
      paid_amount: String(row.paid_amount || 0),
      status: row.status || (isDebtTransaction(row.type) ? "open" : "posted"),
      due_date: row.due_date || "",
      occurred_at: row.occurred_at ? new Date(row.occurred_at).toISOString().slice(0, 16) : nowInput(),
      is_active: row.is_active !== false,
      order_id: row.order_id ? String(row.order_id) : "",
      reference_number: row.reference_number || autoReference(row.type || allowedTypes[0]),
    } : initialForm(presetTypeRef.current || allowedTypes[0]);
    setForm(newForm);
    setInitialFormData(newForm);
    setProofImages(row?.proof_images || []);
  }, [allowedTypes, editor.open, editor.entity, mode]);

  // Dijalankan SETELAH efek reset formulir di atas. Dashboard mengirim
  // `?new=<jenis>` (mis. expense) untuk membuka formulir "Tambah" langsung:
  // 1. jenis pilihan disimpan, parameter dihapus dari URL (form tidak ikut
  //    terbuka lagi saat tab dibuka ulang), lalu
  // 2. pada render berikutnya formulir dibuka — menunggu satu commit agar
  //    tab induk halaman sudah terdaftar di PanelTabs (efek parent berjalan
  //    setelah efek child saat mount).
  useEffect(() => {
    const requested = searchParams.get("new");
    if (!requested || !allowedTypes.includes(requested)) return;
    setPendingType(requested);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("new");
    setSearchParams(nextParams, { replace: true });
  }, [allowedTypes, searchParams, setSearchParams]);

  useEffect(() => {
    if (!pendingType) return;
    presetTypeRef.current = pendingType;
    editor.create();
    setPendingType(null);
  }, [pendingType, editor]);

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
      { key: "order_number", label: "Pesanan" },
      { key: "amount", label: "Nominal", render: (row) => <span className="font-bold text-slate-900">{money(row.amount)}</span> },
      { key: "paid_progress", label: "Terbayar / Sisa", width: 200, minWidth: 160, valueOf: (row) => {
        const amount = Number(row.amount || 0);
        const paid = Number(row.paid_amount || 0);
        const pct = amount > 0 ? Math.min(Math.round((paid / amount) * 100), 100) : 0;
        return `${money(paid)} / ${money(amount)} · ${pct}%`;
      }, render: (row) => {
        const amount = Number(row.amount || 0);
        const paid = Number(row.paid_amount || 0);
        const outstanding = Number(row.outstanding_amount || 0);
        const pct = amount > 0 ? Math.min(Math.round((paid / amount) * 100), 100) : 0;
        const isDebtType = ["receivable", "payable"].includes(row.type);
        const done = !isDebtType || row.status === "paid" || outstanding <= 0;
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{money(paid)} / {money(amount)}</span>
              <span className={`font-bold ${done ? "text-emerald-700" : pct >= 50 ? "text-amber-700" : "text-rose-700"}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${done ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${pct}%` }} />
            </div>
            {!done && outstanding > 0 && <span className="text-[10px] text-rose-600 font-bold">Sisa {money(outstanding)}</span>}
          </div>
        );
      } },
      { key: "status", label: "Status", filterType: "select", options: [...new Set(allowedTypes.flatMap((type) => statusOptionsFor(type)))].map((item) => ({ value: item, label: item })), render: (row) => <span className="font-bold uppercase text-slate-600">{row.status}</span> },
      { key: "occurred_at", label: "Tanggal", valueOf: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleDateString("id-ID") : "", render: (row) => row.occurred_at ? new Date(row.occurred_at).toLocaleDateString("id-ID") : "-" },
      // Sisa kolom database transaksi (kategori, deskripsi, audit, relasi).
      ...buildDatabaseColumns(rows, {
        omit: ["id", "order_id", "user_id", "type", "reference_number", "title", "order_number", "amount", "paid_amount", "outstanding_amount", "status", "occurred_at", "order", "counterparty"],
        labels: {
          category: "Kategori",
          description: "Deskripsi",
          due_date: "Jatuh Tempo",
          settled_at: "Lunas Pada",
          is_active: "Aktif",
          metadata: "Metadata",
          created_by_user: "Dibuat Oleh",
          updated_by_user: "Diubah Oleh",
          created_at: "Dibuat",
          updated_at: "Diubah",
          deleted_at: "Dihapus",
        },
      }),
    ];
    return [typeColumn, ...list];
  }, [allowedTypes, rows]);

  const tableColumns = useMemo(() => {
    const bayarColumn = {
      key: "bayar",
      label: "Bayar",
      defaultVisible: true,
      filterable: false,
      render: (row) => {
        const isDebtType = ["receivable", "payable"].includes(row.type);
        const canPay = isDebtType && Number(row.outstanding_amount) > 0 && !["paid", "cancelled"].includes(String(row.status || "").toLowerCase());
        if (!isDebtType) return null;
        return (
          <button
            type="button"
            disabled={!canPay}
            onClick={(event) => { event.stopPropagation(); recordPaymentRef.current?.(row); }}
            className="inline-flex h-8 items-center gap-1.5 px-3 text-xs font-extrabold text-emerald-700 transition-colors hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-slate-300"
            title={canPay ? "Catat pembayaran/cicilan" : "Transaksi sudah lunas"}
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            Bayar
          </button>
        );
      },
    };
    return [...columns, bayarColumn];
  }, [columns]);

  const columnVisibility = useColumnVisibility(tableColumns, `advanced.finance.${mode}-v2`);
  const cardView = {
    ...financeCard,
    footer: (row) => {
      const isDebtType = ["receivable", "payable"].includes(row.type);
      const payColumn = tableColumns.find((column) => column.key === "bayar");
      if (isDebtType && payColumn?.render) return payColumn.render(row);
      return <span className="text-[11px] font-bold text-slate-500">Klik untuk edit</span>;
    },
  };

  function applyOrder(orderId) {
    const nextId = String(orderId || "");
    const order = orderRows.find((item) => String(item.orderId || item.id) === nextId) || null;
    setForm((current) => ({
      ...current,
      order_id: order ? nextId : "",
      title: order && !current.title.trim() ? `Pesanan ${order.orderNumber}` : current.title,
      amount: order && !String(current.amount).trim() ? String(order.total || "") : current.amount,
      reference_number: order && !String(current.reference_number).trim() ? `INV/${order.orderNumber}` : current.reference_number,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    const loading = showLoading("Menyimpan...", "Data keuangan sedang disimpan");
    try {
      const { paid_amount: _paidAmount, ...editableForm } = form;
      await saveMutation.mutateAsync({
        id: editor.entity?.id,
        values: {
          ...editableForm,
          amount: Number(form.amount),
          order_id: form.order_id ? Number(form.order_id) : null,
          reference_number: String(form.reference_number || "").trim() || null,
          due_date: form.due_date || null,
          occurred_at: new Date(form.occurred_at).toISOString(),
          proof_images: proofImages,
        },
      });
      closeLoading();
      showSuccess("Berhasil", `${typeLabel(form.type)} berhasil disimpan.`);
      editor.markListDirty();
      editor.completeSave();
      editor.close();
      setProofImages([]);
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
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

  function submitPayPicker(event) {
    event.preventDefault();
    const row = rows.find((item) => String(item.id) === String(payPickerTarget));
    if (!row) return;
    setPayPickerOpen(false);
    setPayPickerTarget("");
    recordPayment(row);
  }

  function closePayment() {
    setPaymentRow(null);
    setPaymentAmount("");
    setPaymentImages([]);
    if (panelTabs) {
      panelTabs.closeActiveTab();
      return;
    }
    setLocalPaymentOpen(false);
  }

  async function submitPayment(event) {
    event.preventDefault();
    if (!paymentRow) return;
    const loading = showLoading("Mencatat Pembayaran...", "Pembayaran sedang diproses");
    try {
      await paymentMutation.mutateAsync({ id: paymentRow.id, amount: Number(paymentAmount), payment_method: paymentMethod, reference_number: paymentReference || null, notes: paymentNotes || null, proof_images: paymentImages });
      closeLoading();
      showSuccess("Berhasil", "Pembayaran berhasil dicatat.");
      editor.markListDirty();
      closePayment();
      listQuery.refetch();
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
    }
  }

  async function remove() {
    if (!deleteTarget) return;
    const confirmed = await confirmDelete({ title: `Hapus ${typeLabel(deleteTarget.type)}`, text: `${deleteTarget.reference_number || deleteTarget.title} akan dihapus permanen.` });
    if (!confirmed.isConfirmed) return;
    const loading = showLoading("Menghapus...", "Data keuangan sedang dihapus");
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      closeLoading();
      showSuccess("Berhasil", "Data keuangan berhasil dihapus.");
      editor.markListDirty();
      setDeleteTarget(null);
    } catch (error) {
      closeLoading();
      showError("Gagal", advancedError(error));
    }
  }

  const title = isDebtMode ? "Hutang-Piutang" : "Keuangan";
  return (
    <>
      {editor.isListActive ? (
        <ModuleFrame
          title={title}
          subtitle="CRUD memakai tab data baru seperti Product. Admin melihat data global, seller otomatis dibatasi ke toko aktif."
          query={query}
          onQueryChange={setQuery}
          onRefresh={() => { listQuery.refetch(); chartQuery.refetch(); }}
          refreshing={listQuery.isFetching}
          totalCount={total.totalCount}
          totalLabel={total.totalLabel}
          totalTitle={total.totalTitle}
          onCreate={editor.create}
          createLabel="Tambah Data Keuangan"
          placeholder={isDebtMode ? "Cari hutang/piutang, referensi, pesanan, atau toko" : "Cari transaksi, referensi, pesanan, atau toko"}
          selectionEnabled={selection.enabled}
          selectedCount={selection.selectedCount}
          onToggleSelection={selection.toggleEnabled}
          bulkActions={[]}
          columns={tableColumns}
          visibleColumns={columnVisibility.visibleKeys}
          onToggleColumn={columnVisibility.toggleColumn}
          onMoveColumn={columnVisibility.moveColumn}
          onShowAllColumns={columnVisibility.showAll}
          onResetColumns={columnVisibility.reset}
          onApplyDefaultColumns={columnVisibility.applyAsDefault}
          extraActions={
            <ExcelActionButtons
              module="finance"
              label="Keuangan"
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
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          viewModeOptions={viewModeOptions}
        >
          {viewMode === "chart" ? (
            <FinanceChartPanel data={chartQuery.data} isLoading={chartQuery.isLoading} />
          ) : (
            <DataGrid
              viewMode={viewMode}
              chart={null}
              card={cardView}
              onFilterStateChange={total.onFilterStateChange}
              columns={tableColumns}
              rows={rows}
              storageKey={`advanced.finance.${mode}-v2`}
              emptyText={listQuery.isLoading ? "" : isDebtMode ? "Belum ada data hutang atau piutang." : "Belum ada data keuangan."}
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

      <ConfirmDialog open={Boolean(deleteTarget)} title={`Hapus ${deleteTarget ? typeLabel(deleteTarget.type) : "Data Keuangan"}`} message={deleteTarget ? `${deleteTarget.reference_number || deleteTarget.title} akan dihapus.` : "Data akan dihapus."} pending={false} onClose={() => setDeleteTarget(null)} onConfirm={remove} />


      <FormModal
        presentation="modal"
        open={payPickerOpen}
        title="Bayar / Bayar Sebagian"
        subtitle="Pilih transaksi yang masih memiliki sisa tagihan, lalu catat pembayarannya."
        onClose={() => { setPayPickerOpen(false); setPayPickerTarget(""); }}
        onSubmit={submitPayPicker}
        submitLabel="Lanjutkan"
      >
        <Field label="Transaksi" required hint="Nominal cicilan, metode, dan riwayat pembayaran diatur pada langkah berikutnya.">
          <SearchableSelect
            value={payPickerTarget}
            onChange={setPayPickerTarget}
            options={payOptions}
            placeholder="Pilih transaksi"
            searchPlaceholder="Cari referensi, judul, atau nomor pesanan"
            emptyText="Belum ada transaksi dengan sisa tagihan"
            clearable={false}
          />
        </Field>
      </FormModal>

      <FormModal
        presentation="modal"
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
            <FormattedNumberInput decimal min="0.01" step="0.01" max={paymentRow?.outstanding_amount || undefined} value={paymentAmount} onChange={(value) => setPaymentAmount(value)} required />
          </Field>
          <Field label="Metode Pembayaran">
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className={inputClassName}>
              <option value="transfer">Transfer</option><option value="cash">Tunai</option><option value="ewallet">E-Wallet</option><option value="manual">Lainnya</option>
            </select>
          </Field>
        </div>
        <Field label="Nomor Referensi"><Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} /></Field>
        <Field label="Catatan"><textarea value={paymentNotes} onChange={(event) => setPaymentNotes(event.target.value)} className="min-h-20 border border-slate-300 p-3 text-sm" /></Field>
        <Field label="Bukti Pembayaran (Gambar)" hint="Wajib diisi minimal 1 gambar sebagai bukti transfer/pembayaran. Maksimal 5 gambar.">
          <MultiImagePicker value={paymentImages} onChange={setPaymentImages} scope="finance/payments" maxFiles={5} />
        </Field>
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
        presentation="page"
        open={editor.open}
        title={editor.entity ? `Edit ${typeLabel(form.type)}` : `Tambah ${typeLabel(form.type)}`}
        subtitle="Form dibuka pada tab data tersendiri agar daftar tetap ringkas dan pekerjaan tidak tertutup modal."
        onClose={handleFormLeave}
        onSubmit={submit}
        busy={false}
        onDelete={editor.entity ? () => { setDeleteTarget(editor.entity); editor.close(); } : undefined}
        extraActions={(
          editor.entity && isDebtTransaction(editor.entity.type) && Number(editor.entity.outstanding_amount) > 0
            ? [{ icon: "payments", label: "Bayar", tone: "teal", onClick: () => { const row = editor.entity; editor.close(); recordPayment(row); } }]
            : []
        )}
      >
        {editor.entity ? (
          (() => {
            const entityType = editor.entity.type;
            const isDebtType = ["receivable", "payable"].includes(entityType);
            if (isDebtType) {
              return (
                <DetailTabs
                  tabs={[
                    {
                      id: "form",
                      label: "Umum",
                      icon: "edit",
                      content: (
                        <FinanceFormContent
                          form={form}
                          setForm={setForm}
                          allowedTypes={allowedTypes}
                          selectedOrder={selectedOrder}
                          orderOptions={orderOptions}
                          applyOrder={applyOrder}
                          setOrderSearch={setOrderSearch}
                          autoReference={autoReference}
                          typeLabel={typeLabel}
                          inputClassName={inputClassName}
                          money={money}
                          proofImages={proofImages}
                          setProofImages={setProofImages}
                        />
                      ),
                    },
                    {
                      id: "payment-history",
                      label: "Riwayat Bayar",
                      icon: "receipt_long",
                      content: (
                        <PaymentHistoryTab
                          financeId={editor.entity.id}
                          paymentHistoryQuery={paymentHistoryQuery}
                          money={money}
                        />
                      ),
                    },
                  ]}
                  defaultTab="form"
                />
              );
            }
            return (
              <FinanceFormContent
                form={form}
                setForm={setForm}
                allowedTypes={allowedTypes}
                selectedOrder={selectedOrder}
                orderOptions={orderOptions}
                applyOrder={applyOrder}
                setOrderSearch={setOrderSearch}
                autoReference={autoReference}
                typeLabel={typeLabel}
                inputClassName={inputClassName}
                money={money}
                proofImages={proofImages}
                setProofImages={setProofImages}
              />
            );
          })()
        ) : (
          <FinanceFormContent
            form={form}
            setForm={setForm}
            allowedTypes={allowedTypes}
            selectedOrder={selectedOrder}
            orderOptions={orderOptions}
            applyOrder={applyOrder}
            setOrderSearch={setOrderSearch}
            autoReference={autoReference}
            typeLabel={typeLabel}
            inputClassName={inputClassName}
            money={money}
            proofImages={proofImages}
            setProofImages={setProofImages}
          />
        )}
      </FormModal>
    </>
  );
}
