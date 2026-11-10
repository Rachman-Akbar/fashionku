import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, CircleHelp, Clock3, LifeBuoy, MessageCircle, Package, Plus, RefreshCw, Search, Send, Store } from "lucide-react";
import {
  advancedError,
  useCreateTicket,
  useReplyTicket,
  useTicket,
  useTicketContext,
  useTickets,
} from "@/features/advanced/services/advancedMarketplaceService";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { Pagination } from "@/shared/components/ui/Pagination";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const CATEGORY_OPTIONS = [
  { value: "order", label: "Pesanan", icon: Package },
  { value: "payment", label: "Pembayaran", icon: CircleHelp },
  { value: "product", label: "Produk", icon: Package },
  { value: "store", label: "Toko", icon: Store },
  { value: "account", label: "Akun", icon: CircleHelp },
  { value: "technical", label: "Teknis", icon: CircleHelp },
  { value: "other", label: "Lainnya", icon: LifeBuoy },
];

const STATUS_META = {
  open: { label: "Menunggu Admin", className: "bg-amber-50 text-amber-700" },
  in_progress: { label: "Sedang Ditangani", className: "bg-blue-50 text-blue-700" },
  resolved: { label: "Selesai", className: "bg-emerald-50 text-emerald-700" },
  closed: { label: "Ditutup", className: "bg-slate-100 text-slate-600" },
};

function initialForm() {
  return {
    category: "order",
    subject: "",
    description: "",
    priority: "normal",
    order_id: "",
    store_id: "",
  };
}

function statusMeta(value) {
  return STATUS_META[String(value || "open").toLowerCase()] || STATUS_META.open;
}

function orderLabel(order) {
  return order?.order_number || `Pesanan #${order?.id || "-"}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function BuyerHelpPage() {
  const [mode, setMode] = useState("list");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(initialForm());
  const [reply, setReply] = useState("");

  const listQuery = useTickets({ page, per_page: 12, ...(status ? { status } : {}), ...(query.trim() ? { search: query.trim() } : {}) });
  const contextQuery = useTicketContext(mode === "create");
  const ticketQuery = useTicket(selectedId, mode === "detail");
  const createMutation = useCreateTicket();
  const replyMutation = useReplyTicket();

  const rows = listQuery.data?.rows || [];
  const meta = listQuery.data?.meta || {};
  const context = contextQuery.data || {};
  const orders = context.orders || [];
  const stores = context.stores || [];
  const selectedOrder = orders.find((item) => String(item.id) === String(form.order_id));
  const availableStores = selectedOrder?.stores?.length ? selectedOrder.stores : stores;
  const ticket = ticketQuery.data || null;

  const summary = useMemo(() => ({
    total: Number(meta.total || rows.length),
    waiting: rows.filter((row) => ["open", "in_progress"].includes(String(row.status))).length,
    solved: rows.filter((row) => ["resolved", "closed"].includes(String(row.status))).length,
  }), [meta.total, rows]);

  function openCreate() {
    setForm(initialForm());
    setMode("create");
  }

  function openDetail(id) {
    setSelectedId(id);
    setReply("");
    setMode("detail");
  }

  function backToList() {
    setMode("list");
    setSelectedId(null);
    listQuery.refetch();
  }

  function changeOrder(value) {
    const order = orders.find((item) => String(item.id) === String(value));
    const orderStores = order?.stores || [];
    setForm((current) => ({
      ...current,
      order_id: value,
      store_id: !value ? "" : orderStores.length === 1 ? String(orderStores[0].id) : "",
    }));
  }

  async function createHelp(event) {
    event.preventDefault();
    try {
      const created = await createMutation.mutateAsync({
        category: form.category,
        subject: form.subject.trim(),
        description: form.description.trim(),
        priority: form.priority,
        order_id: form.order_id ? Number(form.order_id) : null,
        store_id: form.store_id ? Number(form.store_id) : null,
      });
      setSelectedId(created?.id || null);
      setForm(initialForm());
      toastSuccess("Kirim Help", "Permintaan bantuan berhasil dikirim.");
      if (created?.id) setMode("detail");
      else backToList();
    } catch (error) {
      toastError("Kirim Help", advancedError(error));
    }
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!reply.trim() || !selectedId) return;
    try {
      await replyMutation.mutateAsync({ id: selectedId, values: { message: reply.trim() } });
      setReply("");
      await ticketQuery.refetch();
      toastSuccess("Kirim Balasan", "Balasan berhasil dikirim.");
    } catch (error) {
      toastError("Kirim Balasan", advancedError(error));
    }
  }

  if (mode === "create") {
    return (
      <section className={profileLayout.contentShell} aria-label="Buat Help">
        <div className={profileLayout.contentInner}>
          <button type="button" onClick={backToList} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#10B981]">
            <ArrowLeft size={17} /> Kembali ke Help
          </button>
          <div className="max-w-3xl">
            <span className={profileLayout.contentEyebrow}>Ziip Care</span>
            <h2 className="mt-2 text-3xl font-light text-slate-950">Ceritakan kendala Anda</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Identitas akun diambil otomatis. Pilih pesanan atau toko hanya jika bantuan berkaitan dengan transaksi tertentu.</p>
          </div>

          {contextQuery.error ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{advancedError(contextQuery.error)}</div> : null}

          <form onSubmit={createHelp} className="mt-8 max-w-3xl space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-800">Jenis masalah</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, category: value }))}
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold ring-1 transition ${form.category === value ? "bg-emerald-50 text-emerald-800 ring-emerald-300" : "bg-white text-slate-600 ring-slate-200 hover:ring-emerald-200"}`}
                  >
                    <Icon size={18} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Pesanan terkait</span>
                <select value={form.order_id} onChange={(event) => changeOrder(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#10B981]">
                  <option value="">Tidak terkait pesanan</option>
                  {orders.map((order) => <option key={order.id} value={order.id}>{orderLabel(order)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Toko terkait</span>
                <select value={form.store_id} onChange={(event) => setForm((current) => ({ ...current, store_id: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#10B981]">
                  <option value="">Tidak terkait toko</option>
                  {availableStores.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Judul bantuan</span>
              <input value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#10B981]" placeholder="Contoh: Pesanan belum diterima" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Jelaskan kendala</span>
              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-40 w-full rounded-xl border border-slate-300 p-4 text-sm leading-6 outline-none focus:border-[#10B981]" placeholder="Tuliskan kronologi dan informasi yang membantu admin memahami masalah Anda." required />
            </label>

            <label className="block max-w-xs">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Tingkat kebutuhan</span>
              <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#10B981]">
                <option value="low">Tidak mendesak</option>
                <option value="normal">Normal</option>
                <option value="high">Penting</option>
                <option value="urgent">Mendesak</option>
              </select>
            </label>

            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
              <button type="submit" disabled={createMutation.isPending || contextQuery.isLoading} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#10B981] px-6 text-sm font-semibold text-white hover:bg-[#059669] disabled:opacity-50">
                <Send size={16} /> Kirim ke Admin
              </button>
              <button type="button" onClick={backToList} className={profileLayout.secondaryButton}>Batal</button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  if (mode === "detail") {
    const metaStatus = statusMeta(ticket?.status);
    return (
      <section className={profileLayout.contentShell} aria-label="Detail Help">
        <div className={profileLayout.contentInner}>
          <button type="button" onClick={backToList} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#10B981]">
            <ArrowLeft size={17} /> Kembali ke daftar
          </button>

          {ticketQuery.error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{advancedError(ticketQuery.error)}</div> : null}

          {ticket ? (
            <div className="max-w-4xl">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span className={profileLayout.contentEyebrow}>{ticket.ticket_number || "Help"}</span>
                  <h2 className="mt-2 text-3xl font-light text-slate-950">{ticket.subject}</h2>
                  <p className="mt-2 text-sm text-slate-500">Dibuat {formatDate(ticket.created_at)}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${metaStatus.className}`}>{metaStatus.label}</span>
              </div>

              <div className="grid gap-3 py-5 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Kategori</p><p className="mt-1 text-sm font-semibold text-slate-800">{ticket.category || "-"}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Toko</p><p className="mt-1 text-sm font-semibold text-slate-800">{ticket.store_name || "Tidak terkait toko"}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Prioritas</p><p className="mt-1 text-sm font-semibold text-slate-800">{ticket.priority || "normal"}</p></div>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-6">
                {(ticket.messages || []).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-bold text-slate-800">{item.user_name || "Ziip User"}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(item.created_at)}</p>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.message}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply} className="mt-6 rounded-2xl bg-slate-50 p-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Balas admin</span>
                  <textarea value={reply} onChange={(event) => setReply(event.target.value)} className="min-h-28 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-[#10B981]" placeholder="Tulis balasan Anda" required />
                </label>
                <div className="mt-3 flex justify-end">
                  <button type="submit" disabled={replyMutation.isPending} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#10B981] px-5 text-sm font-semibold text-white hover:bg-[#059669] disabled:opacity-50">
                    <Send size={15} /> Kirim Balasan
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={profileLayout.contentShell} aria-label="Help buyer">
      <div className={profileLayout.contentInner}>
        <div className={profileLayout.contentHeader}>
          <div>
            <span className={profileLayout.contentEyebrow}>Ziip Care</span>
            <h2 className={profileLayout.contentTitle}>Pusat Bantuan</h2>
            <p className={`mt-2 ${profileLayout.contentDesc}`}>Pantau permintaan bantuan Anda dan lanjutkan percakapan dengan admin tanpa melihat menu operasional internal.</p>
          </div>
          <button type="button" onClick={openCreate} className={profileLayout.primaryButton}><Plus size={16} /> Buat Bantuan</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100"><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Total Help</p><strong className="mt-2 block text-2xl font-light text-slate-950">{summary.total}</strong></div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Sedang Ditangani</p><strong className="mt-2 block text-2xl font-light text-slate-950">{summary.waiting}</strong></div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Selesai</p><strong className="mt-2 block text-2xl font-light text-slate-950">{summary.solved}</strong></div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-y border-slate-200 py-4 lg:flex-row lg:items-center">
          <form onSubmit={(event) => { event.preventDefault(); setQuery(searchDraft.trim()); setPage(1); }} className={`${profileLayout.searchBox} flex min-w-0 flex-1 gap-2`}>
            <Search size={17} />
            <input value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} type="search" className="w-full border-0 bg-transparent text-sm outline-none" placeholder="Cari nomor atau judul bantuan" />
            {searchDraft ? <button type="button" onClick={() => { setSearchDraft(""); setQuery(""); setPage(1); }} className="text-xs font-semibold text-slate-400 hover:text-slate-700">Reset</button> : null}
          </form>
          <div className="flex items-center gap-2 overflow-x-auto">
            {[{ value: "", label: "Semua" }, { value: "open", label: "Menunggu" }, { value: "in_progress", label: "Ditangani" }, { value: "resolved", label: "Selesai" }].map((item) => (
              <button key={item.value || "all"} type="button" onClick={() => { setStatus(item.value); setPage(1); }} className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold ${status === item.value ? "bg-[#10B981] text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>{item.label}</button>
            ))}
            <button type="button" onClick={() => listQuery.refetch()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200" aria-label="Perbarui"><RefreshCw size={15}  /></button>
          </div>
        </div>

        {listQuery.error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{advancedError(listQuery.error)}</div> : null}

        {!listQuery.isLoading && !listQuery.error ? (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const metaStatus = statusMeta(row.status);
              return (
                <button key={row.id} type="button" onClick={() => openDetail(row.id)} className="grid w-full min-w-0 gap-3 py-5 text-left transition hover:bg-slate-50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-[#10B981]"><MessageCircle size={19} /></div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-semibold text-slate-950">{row.subject}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${metaStatus.className}`}>{metaStatus.label}</span></div>
                    <p className="mt-1 text-xs text-slate-400">{row.ticket_number || `Help #${row.id}`} · {formatDate(row.updated_at || row.created_at)}</p>
                    <p className="mt-2 line-clamp-1 text-sm text-slate-500">{row.description || "Buka detail untuk melihat percakapan bantuan."}</p>
                  </div>
                  <ChevronRight size={18} className="hidden text-slate-300 sm:block" />
                </button>
              );
            })}
          </div>
        ) : null}

        {!listQuery.isLoading && !listQuery.error && !rows.length ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-[#10B981]"><LifeBuoy size={34} /></div>
            <h3 className="mt-5 text-xl font-light text-slate-950">Belum ada permintaan bantuan</h3>
            <p className="mt-2 text-sm text-slate-500">Jika ada kendala pesanan, pembayaran, produk, atau akun, kirim bantuan ke admin.</p>
            <button type="button" onClick={openCreate} className={`mt-5 ${profileLayout.primaryButton}`}><Plus size={16} /> Buat Bantuan</button>
          </div>
        ) : null}

        {rows.length && Number(meta.last_page || 1) > 1 ? <Pagination current={meta.current_page || page} total={meta.last_page || 1} onChange={setPage} /> : null}

        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          <Clock3 size={18} className="mt-0.5 shrink-0 text-[#10B981]" />
          <p>Admin akan membalas melalui halaman ini. Konteks akun dan toko diverifikasi otomatis oleh sistem.</p>
        </div>
      </div>
    </section>
  );
}
