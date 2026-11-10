import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  advancedError,
  useCreateTicket,
  useReplyTicket,
  useTicket,
  useTicketContext,
  useTickets,
  useUpdateTicketStatus,
} from "@/features/advanced/services/advancedMarketplaceService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { inputClassName } from "@/shared/components/form/FormField";
import { toolbarControlClassName } from "@/shared/components/crud/toolbarControlClassName";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { usePanelTabs } from "@/shared/layout/tabs";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const initialForm = {
  category: "other",
  subject: "",
  description: "",
  priority: "normal",
  order_id: "",
  store_id: "",
};

function optionLabel(order) {
  const status = order?.status ? ` · ${order.status}` : "";
  return `${order?.order_number || `Pesanan #${order?.id || "-"}`} (#${order?.id || "-"})${status}`;
}

export default function HelpPage() {
  const { activeRole, user, store } = useAuth();
  const admin = activeRole === "admin";
  const seller = activeRole === "seller";
  const tabs = usePanelTabs();
  const editor = useEntityEditor();
  const detailTab = tabs?.activeTab?.type === "help-detail" ? tabs.activeTab : null;
  const selectedId = detailTab?.entity?.id || null;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(initialForm);
  const [reply, setReply] = useState("");
  const listQuery = useTickets({ per_page: 20, ...(query.trim() ? { search: query.trim() } : {}), ...(status ? { status } : {}) });
  const ticketQuery = useTicket(selectedId);
  const contextQuery = useTicketContext(!admin);
  const createMutation = useCreateTicket();
  const replyMutation = useReplyTicket();
  const statusMutation = useUpdateTicketStatus();
  const rows = listQuery.data?.rows || [];
  const total = useListTotalCount(listQuery.data?.meta, { fallbackTotal: rows.length, label: "Help" });
  const ticket = ticketQuery.data || detailTab?.entity || null;
  const context = contextQuery.data || null;
  const contextUser = context?.user || user || null;
  const contextStore = context?.store || (seller && store?.id ? { id: Number(store.id), name: store.name || "Toko Aktif" } : null);
  const orders = context?.orders || [];
  const selectedOrder = useMemo(
    () => orders.find((item) => String(item.id) === String(form.order_id)) || null,
    [form.order_id, orders],
  );
  const availableStores = useMemo(() => {
    if (seller) return contextStore ? [contextStore] : [];
    if (selectedOrder?.stores?.length) return selectedOrder.stores;
    return context?.stores || [];
  }, [context?.stores, contextStore, selectedOrder?.stores, seller]);

  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: listQuery.refetch });

  useEffect(() => {
    if (!editor.open) return;
    setForm({
      ...initialForm,
      store_id: seller && contextStore?.id ? String(contextStore.id) : "",
    });
  }, [contextStore?.id, editor.open, seller]);

  useEffect(() => {
    if (!editor.open || !seller || !contextStore?.id) return;
    setForm((current) => ({ ...current, store_id: String(contextStore.id) }));
  }, [contextStore?.id, editor.open, seller]);

  const columns = useMemo(() => [
    { key: "ticket_number", label: "Nomor Help" },
    { key: "subject", label: "Subjek" },
    { key: "user_name", label: "Pengaju" },
    { key: "store_name", label: "Toko" },
    { key: "category", label: "Kategori" },
    { key: "priority", label: "Prioritas" },
    { key: "status", label: "Status" },
    { key: "messages_count", label: "Balasan" },
    { key: "created_at", label: "Dibuat", render: (row) => row.created_at ? new Date(row.created_at).toLocaleString("id-ID") : "-" },
  ], []);

  function openDetail(row) {
    if (tabs) tabs.openOperationTab("help-detail", { id: row.id, label: row.ticket_number || "Detail Help", entity: row });
  }

  function changeOrder(value) {
    const nextOrder = orders.find((item) => String(item.id) === String(value)) || null;
    const orderStores = nextOrder?.stores || [];

    setForm((current) => {
      if (seller) {
        return { ...current, order_id: value, store_id: contextStore?.id ? String(contextStore.id) : "" };
      }

      const currentStoreAllowed = orderStores.some((item) => String(item.id) === String(current.store_id));
      const nextStoreId = !value
        ? current.store_id
        : orderStores.length === 1
          ? String(orderStores[0].id)
          : currentStoreAllowed
            ? current.store_id
            : "";

      return { ...current, order_id: value, store_id: nextStoreId };
    });
  }

  async function create(event) {
    event.preventDefault();
    try {
      await createMutation.mutateAsync({
        category: form.category,
        subject: form.subject,
        description: form.description,
        priority: form.priority,
        order_id: form.order_id ? Number(form.order_id) : null,
        ...(!seller && form.store_id ? { store_id: Number(form.store_id) } : {}),
      });
      toastSuccess("Buat Help", "Help berhasil diajukan.");
      editor.markListDirty();
      editor.completeSave();
      editor.close();
    } catch (error) {
      toastError("Buat Help", advancedError(error));
    }
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!reply.trim() || !selectedId) return;
    try {
      await replyMutation.mutateAsync({ id: selectedId, values: { message: reply.trim() } });
      setReply("");
      ticketQuery.refetch();
      toastSuccess("Kirim Balasan", "Balasan berhasil dikirim.");
    } catch (error) {
      toastError("Kirim Balasan", advancedError(error));
    }
  }

  async function updateStatus(value) {
    try {
      await statusMutation.mutateAsync({ id: selectedId, values: { status: value } });
      ticketQuery.refetch();
      toastSuccess("Ubah Status Help", "Status Help berhasil diperbarui.");
    } catch (error) {
      toastError("Ubah Status Help", advancedError(error));
    }
  }

  return (
    <>
      {editor.isListActive ? (
        <ModuleFrame
          title="Help"
          subtitle="Ajukan keluhan atau permintaan bantuan kepada admin. Identitas pengaju dan toko ditentukan otomatis dari sesi login."
          query={query}
          onQueryChange={setQuery}
          onRefresh={() => listQuery.refetch()}
          refreshing={listQuery.isFetching}
          onCreate={admin ? undefined : editor.create}
          createLabel="Buat Help"
          totalCount={total.totalCount}
          totalLabel={total.totalLabel}
          totalTitle={total.totalTitle}
          filters={<select value={status} onChange={(event) => setStatus(event.target.value)} className={toolbarControlClassName}><option value="">Semua status</option>{["open", "in_progress", "resolved", "closed"].map((item) => <option key={item}>{item}</option>)}</select>}
        >
          <DataGrid
            onFilterStateChange={total.onFilterStateChange}
            columns={columns}
            rows={rows}
            onRowClick={openDetail}
            emptyText={listQuery.isLoading ? "" : "Help belum tersedia."}
            hasNextPage={listQuery.hasNextPage}
            isFetchingNextPage={listQuery.isFetchingNextPage}
            onLoadMore={() => listQuery.fetchNextPage()}
          />
        </ModuleFrame>
      ) : null}

      <FormModal open={editor.open} title="Buat Help" subtitle="Identitas user dan toko ditentukan otomatis dari akun yang sedang login." onClose={editor.close} onSubmit={create} busy={createMutation.isPending} submitLabel="Kirim Help">
        {contextQuery.error ? <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{advancedError(contextQuery.error)}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Pengaju"><Input value={contextUser?.name || user?.name || "User login"} disabled /></Field>
          <Field label="User ID"><Input value={contextUser?.id || user?.id || ""} disabled /></Field>
        </div>
        {seller ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Toko"><Input value={contextStore?.name || "Toko belum terhubung"} disabled /></Field>
            <Field label="Store ID"><Input value={contextStore?.id || ""} disabled /></Field>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Kategori"><select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className={inputClassName}>{["order", "payment", "product", "store", "account", "technical", "other"].map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Prioritas"><select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} className={inputClassName}>{["low", "normal", "high", "urgent"].map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <Field label="Pesanan Terkait" hint="Opsional. Hanya pesanan yang dapat diakses akun aktif yang ditampilkan.">
          <select value={form.order_id} onChange={(event) => changeOrder(event.target.value)} className={inputClassName}>
            <option value="">Tidak terkait pesanan</option>
            {orders.map((order) => <option key={order.id} value={order.id}>{optionLabel(order)}</option>)}
          </select>
        </Field>
        {!seller ? (
          <Field label="Toko Terkait" hint={selectedOrder ? "Daftar toko mengikuti pesanan yang dipilih." : "Opsional. Daftar berasal dari toko pada riwayat pesanan Anda."}>
            <select value={form.store_id} onChange={(event) => setForm((current) => ({ ...current, store_id: event.target.value }))} className={inputClassName}>
              <option value="">Tidak terkait toko</option>
              {availableStores.map((item) => <option key={item.id} value={item.id}>{item.name} (Store #{item.id})</option>)}
            </select>
          </Field>
        ) : null}
        <Field label="Subjek" required><Input value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} required /></Field>
        <Field label="Keluhan" required><textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-32 w-full border border-slate-300 p-3 text-sm" required /></Field>
      </FormModal>

      {detailTab ? (
        <section className="border border-slate-200 bg-white">
          <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div><h2 className="font-extrabold text-slate-950">{ticket?.ticket_number || "Detail Help"}</h2><p className="mt-1 text-sm text-slate-500">{ticket?.subject}</p></div>
            <button type="button" onClick={() => tabs?.closeActiveTab()} className="flex h-9 w-9 items-center justify-center text-slate-500 hover:bg-slate-200"><span className="material-symbols-outlined text-[20px]">close</span></button>
          </header>
          <div className="space-y-4 p-5">
            {ticketQuery.isLoading ? null : (
              <>
                <div className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700"><span>Pengaju</span><Input value={ticket?.user_name || "-"} disabled /></label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700"><span>Toko</span><Input value={ticket?.store_name || "Tidak terkait toko"} disabled /></label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700"><span>Kategori</span><Input value={ticket?.category || "-"} disabled /></label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700"><span>Prioritas</span><Input value={ticket?.priority || "-"} disabled /></label>
                </div>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700"><span>Keluhan</span><textarea value={ticket?.description || ""} readOnly rows={4} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none" /></label>
                {admin ? <div className="flex items-center gap-2"><span className="text-sm font-bold">Status</span><select value={ticket?.status || "open"} onChange={(event) => updateStatus(event.target.value)} className={inputClassName}>{["open", "in_progress", "resolved", "closed"].map((item) => <option key={item}>{item}</option>)}</select></div> : null}
                <div className="space-y-3">{(ticket?.messages || []).map((item) => <div key={item.id} className="border border-slate-200 p-3"><div className="flex justify-between text-xs font-bold text-slate-500"><span>{item.user_name || "User"}</span><span>{item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : ""}</span></div><p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{item.message}</p></div>)}</div>
                <form onSubmit={sendReply} className="space-y-2"><textarea value={reply} onChange={(event) => setReply(event.target.value)} className="min-h-24 w-full border border-slate-300 p-3 text-sm" placeholder="Tulis balasan" required /><div className="flex justify-end"><Button type="submit" disabled={replyMutation.isPending}>Kirim Balasan</Button></div></form>
              </>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
