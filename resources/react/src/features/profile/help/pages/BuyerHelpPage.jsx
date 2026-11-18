import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  LifeBuoy,
  MessageCircle,
  Package,
  Send,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
  Wallet,
  Wrench,
} from "lucide-react";
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
  { value: "order", label: "Pesanan", hint: "Pengiriman, status, atau barang", icon: Package },
  { value: "payment", label: "Pembayaran", hint: "Transaksi, refund, tagihan", icon: Wallet },
  { value: "product", label: "Produk", hint: "Kualitas, ukuran, ketersediaan", icon: ShoppingBag },
  { value: "store", label: "Toko", hint: "Layanan dan informasi toko", icon: Store },
  { value: "account", label: "Akun", hint: "Login, data profil, keamanan", icon: UserRound },
  { value: "technical", label: "Teknis", hint: "Kendala aplikasi atau halaman", icon: Wrench },
  { value: "other", label: "Lainnya", hint: "Belum yakin? Tetap kirim saja", icon: LifeBuoy },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Santai", hint: "Tidak mendesak" },
  { value: "normal", label: "Normal", hint: "Perlu dibantu hari ini" },
  { value: "high", label: "Penting", hint: "Menghambat aktivitas" },
  { value: "urgent", label: "Mendesak", hint: "Butuh segera" },
];

const STATUS_META = {
  open: { label: "Menunggu Admin", className: "bg-amber-50 text-amber-700" },
  in_progress: { label: "Sedang Ditangani", className: "bg-blue-50 text-blue-700" },
  resolved: { label: "Selesai", className: "bg-emerald-50 text-emerald-700" },
  closed: { label: "Ditutup", className: "bg-slate-100 text-slate-600" },
};

const STEPS = ["Topik", "Detail", "Cerita"];

function initialForm() {
  return {
    category: "",
    subject: "",
    description: "",
    priority: "normal",
    order_id: "",
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

function categoryLabel(value) {
  return CATEGORY_OPTIONS.find((item) => item.value === value)?.label || "-";
}

function SurveyProgress({ step }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {STEPS.map((label, index) => {
          const state = index === step ? "current" : index < step ? "done" : "upcoming";
          return (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                  state === "current"
                    ? "bg-[var(--color-primary)] text-white"
                    : state === "done"
                      ? "bg-emerald-50 text-[var(--color-primary)]"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {state === "done" ? <CheckCircle2 size={14} /> : index + 1}
              </span>
              <span className={`text-xs font-semibold ${state === "upcoming" ? "text-slate-400" : "text-slate-700"}`}>{label}</span>
              {index < STEPS.length - 1 ? <span className="mx-1 h-px w-6 bg-slate-200 sm:w-10" /> : null}
            </div>
          );
        })}
      </div>
      <span className="text-xs font-semibold text-slate-400">Langkah {step + 1} dari {STEPS.length}</span>
    </div>
  );
}

function SurveySuccess({ ticket, onHistory, onAgain }) {
  return (
    <div className="mx-auto max-w-xl py-14 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[var(--color-primary)]">
        <CheckCircle2 size={30} />
      </span>
      <h2 className="mt-6 text-2xl font-light text-slate-950">Bantuan Anda sudah dikirim</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Admin menerima permintaan Anda{ticket?.ticket_number ? ` dengan nomor ${ticket.ticket_number}` : ""}. Balasan akan muncul di Riwayat dan notifikasi akun Anda.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={onHistory} className={profileLayout.primaryButton}>Lihat Riwayat</button>
        <button type="button" onClick={onAgain} className={profileLayout.secondaryButton}>Ajukan Lagi</button>
      </div>
    </div>
  );
}

export default function BuyerHelpPage() {
  const [view, setView] = useState("survey");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm());
  const [createdTicket, setCreatedTicket] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [reply, setReply] = useState("");

  const listQuery = useTickets({ page, per_page: 10, ...(status ? { status } : {}), ...(query ? { search: query } : {}) });
  const contextQuery = useTicketContext(view === "survey");
  const ticketQuery = useTicket(selectedId, view === "detail");
  const createMutation = useCreateTicket();
  const replyMutation = useReplyTicket();

  const rows = listQuery.data?.rows || [];
  const meta = listQuery.data?.meta || {};
  const orders = contextQuery.data?.orders || [];
  const ticket = ticketQuery.data || null;

  const answeredCount = useMemo(() => {
    let count = 0;
    if (form.category) count += 1;
    if (form.order_id) count += 1;
    if (form.subject.trim()) count += 1;
    if (form.description.trim()) count += 1;
    return count;
  }, [form]);

  const stepValid = step === 0 ? Boolean(form.category) : step === 1 ? true : Boolean(form.subject.trim() && form.description.trim());

  function resetSurvey() {
    setForm(initialForm());
    setStep(0);
    setCreatedTicket(null);
    setView("survey");
  }

  function openDetail(id) {
    setSelectedId(id);
    setReply("");
    setView("detail");
  }

  async function submitSurvey() {
    try {
      const created = await createMutation.mutateAsync({
        category: form.category,
        subject: form.subject.trim(),
        description: form.description.trim(),
        priority: form.priority,
        order_id: form.order_id ? Number(form.order_id) : null,
      });
      setCreatedTicket(created || {});
      setForm(initialForm());
      setStep(0);
      listQuery.refetch();
      toastSuccess("Kirim Bantuan", "Permintaan bantuan berhasil dikirim ke admin.");
    } catch (error) {
      toastError("Kirim Bantuan", advancedError(error));
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

  const tabButton = (key, label) => (
    <button
      key={key}
      type="button"
      onClick={() => { setView(key); setSelectedId(null); }}
      className={`relative h-10 px-1 text-sm font-semibold transition ${view === key || (key === "history" && view === "detail") ? "text-slate-950" : "text-slate-400 hover:text-slate-600"}`}
    >
      {label}
      {(view === key || (key === "history" && view === "detail")) ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--color-primary)]" /> : null}
    </button>
  );

  if (view === "detail") {
    const metaStatus = statusMeta(ticket?.status);
    return (
      <section className={profileLayout.contentShell} aria-label="Detail Bantuan">
        <div className={profileLayout.contentInner}>
          <button type="button" onClick={() => setView("history")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[var(--color-primary)]">
            <ArrowLeft size={17} /> Kembali ke riwayat
          </button>

          {ticketQuery.error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{advancedError(ticketQuery.error)}</div> : null}

          {ticket ? (
            <div className="max-w-3xl">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span className={profileLayout.contentEyebrow}>{ticket.ticket_number || "Bantuan"}</span>
                  <h2 className="mt-2 text-2xl font-light text-slate-950">{ticket.subject}</h2>
                  <p className="mt-2 text-xs text-slate-400">Dibuat {formatDate(ticket.created_at)} · Kategori {categoryLabel(ticket.category)}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${metaStatus.className}`}>{metaStatus.label}</span>
              </div>

              <div className="space-y-3 py-6">
                {(ticket.messages || []).map((item) => {
                  const fromAdmin = ticket.user_id != null && item.user_id !== ticket.user_id;
                  return (
                    <div key={item.id} className={`max-w-[85%] rounded-2xl px-4 py-3 ${fromAdmin ? "bg-emerald-50" : "ml-auto bg-slate-50"}`}>
                      <div className="flex items-center justify-between gap-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{item.user_name || (fromAdmin ? "Admin" : "Anda")}</p>
                        <p className="text-[11px] text-slate-400">{formatDate(item.created_at)}</p>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.message}</p>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={sendReply} className="rounded-2xl border border-slate-200 p-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Balas admin</span>
                  <textarea value={reply} onChange={(event) => setReply(event.target.value)} className="min-h-24 w-full resize-none border-0 p-0 text-sm leading-6 outline-none placeholder:text-slate-400" placeholder="Tulis informasi tambahan untuk admin" required />
                </label>
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                  <button type="submit" disabled={replyMutation.isPending} className={profileLayout.primaryButton}>
                    <Send size={15} /> Kirim
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
    <section className={profileLayout.contentShell} aria-label="Bantuan buyer">
      <div className={profileLayout.contentInner}>
        <div className={profileLayout.contentHeader}>
          <div>
            <span className={profileLayout.contentEyebrow}>Bantuan langsung</span>
            <h2 className={profileLayout.contentTitle}>Butuh bantuan admin?</h2>
            <p className={`mt-2 ${profileLayout.contentDesc}`}>
              Jawab beberapa pertanyaan singkat. Permintaan Anda langsung masuk ke admin dan dipantau di riwayat.
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-6 border-b border-slate-100">
          {tabButton("survey", "Ajukan Bantuan")}
          {tabButton("history", "Riwayat")}
        </div>

        {view === "survey" ? (
          createdTicket ? (
            <SurveySuccess ticket={createdTicket} onHistory={() => { setView("history"); setCreatedTicket(null); }} onAgain={resetSurvey} />
          ) : (
            <div className="max-w-2xl">
              <SurveyProgress step={step} />

              {contextQuery.error && step === 1 ? (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{advancedError(contextQuery.error)}</div>
              ) : null}

              <div className="mt-8">
                {step === 0 ? (
                  <div>
                    <h3 className="text-xl font-light text-slate-950">Apa yang bisa kami bantu?</h3>
                    <p className="mt-1.5 text-sm text-slate-500">Pilih satu topik yang paling dekat dengan kendala Anda.</p>
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      {CATEGORY_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
                        const active = form.category === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setForm((current) => ({ ...current, category: value }))}
                            className={`flex items-start gap-3 rounded-xl p-4 text-left ring-1 transition ${active ? "bg-emerald-50/70 ring-[var(--color-primary)]" : "bg-white ring-slate-200 hover:ring-slate-300"}`}
                          >
                            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-[var(--color-primary)] text-white" : "bg-slate-50 text-slate-500"}`}>
                              <Icon size={17} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-slate-900">{label}</span>
                              <span className="mt-0.5 block text-xs leading-5 text-slate-500">{hint}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-light text-slate-950">Seberapa mendesak?</h3>
                      <p className="mt-1.5 text-sm text-slate-500">Prioritas membantu admin mengurutkan antrean.</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-4">
                        {PRIORITY_OPTIONS.map((item) => {
                          const active = form.priority === item.value;
                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => setForm((current) => ({ ...current, priority: item.value }))}
                              className={`rounded-xl px-3 py-3 text-left ring-1 transition ${active ? "bg-emerald-50/70 ring-[var(--color-primary)]" : "bg-white ring-slate-200 hover:ring-slate-300"}`}
                            >
                              <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                              <span className="mt-0.5 block text-[11px] text-slate-500">{item.hint}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-light text-slate-950">Pesanan terkait</h3>
                      <p className="mt-1.5 text-sm text-slate-500">Opsional, agar admin bisa langsung memeriksa transaksi.</p>
                      <select
                        value={form.order_id}
                        onChange={(event) => setForm((current) => ({ ...current, order_id: event.target.value }))}
                        className="mt-4 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                      >
                        <option value="">Tidak terkait pesanan</option>
                        {orders.map((order) => <option key={order.id} value={order.id}>{orderLabel(order)}</option>)}
                      </select>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-light text-slate-950">Ceritakan singkat</h3>
                      <p className="mt-1.5 text-sm text-slate-500">Semakin jelas cerita Anda, semakin cepat admin membantu.</p>
                    </div>
                    <label className="block border-b border-slate-200 pb-3">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Judul bantuan</span>
                      <input
                        value={form.subject}
                        onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                        className="h-9 w-full border-0 bg-transparent p-0 text-[15px] font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
                        placeholder="Contoh: Pesanan belum diterima"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Detail kendala</span>
                      <textarea
                        value={form.description}
                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        className="min-h-36 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-[var(--color-primary)]"
                        placeholder="Tuliskan kronologi singkat, waktu kejadian, dan apa yang Anda harapkan."
                      />
                    </label>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Ringkasan</p>
                      <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <p className="text-slate-500">Topik: <span className="font-semibold text-slate-900">{categoryLabel(form.category)}</span></p>
                        <p className="text-slate-500">Prioritas: <span className="font-semibold text-slate-900">{PRIORITY_OPTIONS.find((item) => item.value === form.priority)?.label}</span></p>
                        <p className="text-slate-500">Pesanan: <span className="font-semibold text-slate-900">{form.order_id ? orderLabel(orders.find((order) => String(order.id) === String(form.order_id))) : "Tidak terkait"}</span></p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  disabled={step === 0 || createMutation.isPending}
                  className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 disabled:opacity-40"
                >
                  <ArrowLeft size={16} /> Kembali
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((current) => current + 1)}
                    disabled={!stepValid}
                    className={`${profileLayout.primaryButton} disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    Lanjut <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitSurvey}
                    disabled={!stepValid || createMutation.isPending}
                    className={`${profileLayout.primaryButton} disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    <Send size={16} /> {createMutation.isPending ? "Mengirim..." : "Kirim ke Admin"}
                  </button>
                )}
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Sparkles size={14} className="text-[var(--color-primary)]" />
                {answeredCount} dari 4 bagian sudah terisi · data akun terkirim otomatis
              </p>
            </div>
          )
        ) : null}

        {view === "history" ? (
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto">
                {[{ value: "", label: "Semua" }, { value: "open", label: "Menunggu" }, { value: "in_progress", label: "Ditangani" }, { value: "resolved", label: "Selesai" }].map((item) => (
                  <button
                    key={item.value || "all"}
                    type="button"
                    onClick={() => { setStatus(item.value); setPage(1); }}
                    className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold transition ${status === item.value ? "bg-[var(--color-primary)] text-white" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-slate-300"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => { event.preventDefault(); setPage(1); }}
                className={`${profileLayout.searchBox} min-w-0 sm:w-64`}
              >
                <CircleHelp size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  className="w-full border-0 bg-transparent text-sm outline-none"
                  placeholder="Cari bantuan"
                />
              </form>
            </div>

            {listQuery.error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{advancedError(listQuery.error)}</div> : null}

            {!listQuery.isLoading && !listQuery.error && rows.length ? (
              <div className="mt-4 divide-y divide-slate-100">
                {rows.map((row) => {
                  const metaStatus = statusMeta(row.status);
                  return (
                    <button key={row.id} type="button" onClick={() => openDetail(row.id)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 text-left transition hover:bg-slate-50/70 sm:px-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-950">{row.subject}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${metaStatus.className}`}>{metaStatus.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{row.ticket_number || `Bantuan #${row.id}`} · {formatDate(row.updated_at || row.created_at)}</p>
                        <p className="mt-1.5 line-clamp-1 text-sm text-slate-500">{row.description || "Buka detail untuk melihat percakapan."}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </button>
                  );
                })}
              </div>
            ) : null}

            {!listQuery.isLoading && !listQuery.error && !rows.length ? (
              <div className="py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[var(--color-primary)]"><MessageCircle size={26} /></div>
                <h3 className="mt-5 text-xl font-light text-slate-950">Belum ada riwayat bantuan</h3>
                <p className="mt-2 text-sm text-slate-500">Ajukan pertanyaan pertama Anda, admin akan membalas di halaman ini.</p>
                <button type="button" onClick={resetSurvey} className={`mt-6 ${profileLayout.primaryButton}`}>Mulai Survey</button>
              </div>
            ) : null}

            {rows.length && Number(meta.last_page || 1) > 1 ? <Pagination current={meta.current_page || page} total={meta.last_page || 1} onChange={setPage} /> : null}

            <div className="mt-10 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              <Clock3 size={18} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
              <p>Admin membalas pada jam kerja melalui riwayat ini. Konteks akun dan toko diverifikasi otomatis oleh sistem.</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
