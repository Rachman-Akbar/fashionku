import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  advancedError,
  advancedKeys,
  subscribeChatInbox,
  subscribeConversation,
  subscribeRealtimeStatus,
  useConversation,
  useConversations,
  useMarkConversationRead,
  useSendMessage,
  useStartConversation,
} from "@/features/advanced/services/advancedMarketplaceService";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";
import { cn } from "@/shared/utils/utils";

function conversationTitle(row, currentUserId, activeRole) {
  const otherParticipant = (row?.participants || []).find((item) => String(item.id) !== String(currentUserId));
  if (activeRole === "seller" && otherParticipant?.name) return otherParticipant.name;
  if (activeRole === "buyer" && row?.store_name) return row.store_name;
  if (row?.subject) return row.subject;
  if (row?.order_number) return `Pesanan ${row.order_number}`;
  if (row?.store_name) return row.store_name;
  return otherParticipant?.name || "Percakapan";
}

function conversationSubtitle(row, activeRole) {
  const values = [];
  if (row?.subject && !(activeRole === "admin" && row.subject === conversationTitle(row, null, activeRole))) values.push(row.subject);
  if (row?.order_number) values.push(`Pesanan ${row.order_number}`);
  if (row?.store_name && activeRole !== "buyer") values.push(row.store_name);
  return values.join(" · ") || String(row?.type || "chat");
}

function connectionLabel(status) {
  const labels = {
    connected: "Real-time aktif",
    connecting: "Menghubungkan...",
    unavailable: "Real-time tidak tersedia",
    disconnected: "Terputus",
    failed: "Gagal terhubung",
    error: "Error koneksi",
    not_configured: "Reverb belum dikonfigurasi",
    unauthenticated: "Belum login",
    idle: "Menunggu koneksi",
  };
  return labels[status] || "Polling aktif";
}

function messageExists(rows, id) {
  return rows.some((item) => String(item.id) === String(id));
}

function markConversationReadInRows(current, conversationId) {
  if (!current || !Array.isArray(current.rows)) return current;
  let changed = false;
  const rows = current.rows.map((row) => {
    if (Number(row.id) !== Number(conversationId) || Number(row.unread_count || 0) === 0) return row;
    changed = true;
    return { ...row, unread_count: 0 };
  });
  return changed ? { ...current, rows } : current;
}

function updateConversationRows(current, incoming, currentUserId, selectedId) {
  if (!current || !Array.isArray(current.rows) || !incoming?.conversation_id) return current;
  let found = false;
  const rows = current.rows.map((row) => {
    if (Number(row.id) !== Number(incoming.conversation_id)) return row;
    found = true;
    const isOwnMessage = String(incoming.sender_id) === String(currentUserId);
    const isOpen = Number(selectedId) === Number(incoming.conversation_id);
    return {
      ...row,
      latest_message: incoming,
      updated_at: incoming.created_at || row.updated_at,
      unread_count: isOwnMessage || isOpen ? 0 : Number(row.unread_count || 0) + 1,
    };
  });

  if (!found) return current;
  rows.sort((left, right) => String(right.updated_at || "").localeCompare(String(left.updated_at || "")));
  return { ...current, rows };
}

const EMPTY_START_FORM = {
  type: "store",
  store_id: "",
  order_id: "",
  buyer_id: "",
  participant_ids: "",
  subject: "",
};

export default function RealtimeChatPage() {
  const { user, activeRole, store } = useAuth();
  const panelTabs = usePanelTabs();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const admin = activeRole === "admin";
  const seller = activeRole === "seller";
  const canStartManually = admin || seller;
  const queryConversationId = Number(searchParams.get("conversation") || 0) || null;
  const [selectedId, setSelectedId] = useState(queryConversationId);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [localStartOpen, setLocalStartOpen] = useState(false);
  const [startForm, setStartForm] = useState(EMPTY_START_FORM);
  const bottomRef = useRef(null);
  const composerRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const subscriptionsRef = useRef({ conversation: null, inbox: null });

  const panelStartOpen = panelTabs?.activeTab?.type === "chat-create";
  const startOpen = panelTabs ? panelStartOpen : localStartOpen;

  // Stable refs for callbacks to prevent re-subscription
  const selectedIdRef = useRef(selectedId);
  const userIdRef = useRef(user?.id);
  selectedIdRef.current = selectedId;
  userIdRef.current = user?.id;

  // Query params - stable reference
  const listParams = useMemo(() => ({ per_page: 50, ...(query.trim() ? { search: query.trim() } : {}) }), [query]);

  // Only fetch conversations for seller/admin (buyer uses direct admin chat)
  const listQuery = useConversations(listParams, {
    enabled: activeRole !== "buyer",
    select: (data) => data?.rows || [],
    refetchInterval: (data) => {
      const status = data?.fetchStatus;
      return 15000; // Only poll when needed
    },
  });

  const conversations = listQuery.data || [];

  // For buyer: find admin conversation
  const adminConversation = useMemo(() => {
    if (activeRole !== "buyer") return null;
    return conversations.find((row) => row.type === "admin" || (row.participants || []).some((p) => p.role === "admin"));
  }, [conversations, activeRole]);

  // Selected conversation detail - only fetch when selectedId exists
  const detailQuery = useConversation(selectedId, {
    enabled: Boolean(selectedId),
    select: (data) => ({
      ...data,
      messages: data?.messages || [],
    }),
    refetchInterval: 15000,
  });

  const active = detailQuery.data;
  const messages = useMemo(() => active?.messages || [], [active?.messages]);

  const sendMutation = useSendMessage();
  const startMutation = useStartConversation();
  const readMutation = useMarkConversationRead();

  // Stable callbacks using refs
  const selectConversation = useCallback((id) => {
    const value = Number(id);
    setSelectedId(value);
    const next = new URLSearchParams(searchParams);
    next.set("conversation", String(value));
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const focusComposer = useCallback(() => {
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    composerRef.current?.focus();
  }, []);

  // Connection status subscription - only once
  useEffect(() => {
    const unsubscribe = subscribeRealtimeStatus(setConnectionStatus);
    return unsubscribe;
  }, []);

  // Chat inbox subscription - only for seller/admin
  useEffect(() => {
    if (activeRole === "buyer" || !user?.id) return;
    const unsubscribe = subscribeChatInbox(user.id, (incoming) => {
      if (!incoming?.id || !incoming?.conversation_id) return;
      queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => {
        if (current && Array.isArray(current.rows)) {
          return updateConversationRows(current, incoming, user.id, selectedIdRef.current);
        }
        return current;
      });
      if (Number(selectedIdRef.current) === Number(incoming.conversation_id)) {
        queryClient.setQueryData([...advancedKeys.conversations, selectedIdRef.current], (current) => {
          if (!current) return current;
          const currentMessages = Array.isArray(current.messages) ? current.messages : [];
          if (messageExists(currentMessages, incoming.id)) return current;
          return { ...current, messages: [...currentMessages, incoming], updated_at: incoming.created_at };
        });
      }
    });
    subscriptionsRef.current.inbox = unsubscribe;
    return () => { subscriptionsRef.current.inbox = null; };
  }, [user?.id, activeRole, queryClient]);

  // Selected conversation subscription - only when selectedId changes
  useEffect(() => {
    if (!selectedId) return;
    const unsubscribe = subscribeConversation(selectedId, (incoming) => {
      if (!incoming?.id) {
        detailQuery.refetch();
        listQuery.refetch();
        return;
      }
      queryClient.setQueryData([...advancedKeys.conversations, selectedId], (current) => {
        if (!current) return current;
        const currentMessages = Array.isArray(current.messages) ? current.messages : [];
        if (messageExists(currentMessages, incoming.id)) return current;
        return { ...current, messages: [...currentMessages, incoming], updated_at: incoming.created_at };
      });
      queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => updateConversationRows(current, incoming, userIdRef.current, selectedId));
      readMutation.mutate(selectedId);
    });
    subscriptionsRef.current.conversation = unsubscribe;
    return () => { subscriptionsRef.current.conversation = null; };
  }, [selectedId, queryClient, detailQuery, listQuery, readMutation]);

  // Mark as read when selectedId changes
  useEffect(() => {
    if (!selectedId) return;
    queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => markConversationReadInRows(current, selectedId));
    readMutation.mutate(selectedId);
  }, [selectedId, queryClient, readMutation]);

  // Handle URL params
  useEffect(() => {
    const draft = searchParams.get("draft");
    if (!draft) return;
    setMessage(draft);
    const next = new URLSearchParams(searchParams);
    next.delete("draft");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // Handle queryConversationId from URL
  useEffect(() => {
    if (queryConversationId && Number(queryConversationId) !== Number(selectedId)) {
      setSelectedId(queryConversationId);
    }
  }, [queryConversationId, selectedId]);

  // Auto-select for buyer
  useEffect(() => {
    if (activeRole !== "buyer") return;
    if (adminConversation?.id) {
      selectConversation(adminConversation.id);
    } else if (!selectedId && !startMutation.isPending) {
      openAdminChat();
    }
  }, [adminConversation, selectedId, activeRole, selectConversation, startMutation.isPending]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionsRef.current.inbox) subscriptionsRef.current.inbox();
      if (subscriptionsRef.current.conversation) subscriptionsRef.current.conversation();
    };
  }, []);

  const openAdminChat = useCallback(async () => {
    setNotice("");
    try {
      const row = await startMutation.mutateAsync({
        type: "admin",
        subject: "Bantuan Pelanggan",
        participant_ids: [],
      });
      selectConversation(row.id);
    } catch (error) {
      setNotice(advancedError(error));
    }
  }, [startMutation, selectConversation]);

  const openStart = useCallback(() => {
    setNotice("");
    setStartForm({ ...EMPTY_START_FORM, store_id: seller ? String(store?.id || "") : "" });
    if (panelTabs) {
      panelTabs.openOperationTab("chat-create", { id: "new", label: seller ? "Chat Buyer Baru" : "Data Baru Chat" });
      return;
    }
    setLocalStartOpen(true);
  }, [seller, store, panelTabs]);

  const closeStart = useCallback(() => {
    if (panelTabs) {
      panelTabs.closeActiveTab();
      return;
    }
    setLocalStartOpen(false);
  }, [panelTabs]);

  const send = useCallback(async (event) => {
    event.preventDefault();
    const cleanMessage = message.trim();
    if (!selectedId || !cleanMessage) return;
    setNotice("");
    try {
      const sent = await sendMutation.mutateAsync({ id: selectedId, values: { message_type: "text", message: cleanMessage } });
      setMessage("");
      queryClient.setQueryData([...advancedKeys.conversations, selectedId], (current) => {
        if (!current || !sent?.id) return current;
        const currentMessages = Array.isArray(current.messages) ? current.messages : [];
        return messageExists(currentMessages, sent.id) ? current : { ...current, messages: [...currentMessages, sent] };
      });
      queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => updateConversationRows(current, sent, userIdRef.current, selectedId));
    } catch (error) {
      setNotice(advancedError(error));
    }
  }, [message, selectedId, sendMutation, queryClient]);

  const start = useCallback(async (event) => {
    event.preventDefault();
    setNotice("");

    if (seller) {
      if (!store?.id) { setNotice("Toko aktif tidak ditemukan pada sesi seller."); return; }
      if (!startForm.buyer_id) { setNotice("Pilih buyer tujuan terlebih dahulu."); return; }
    } else if (startForm.type === "store" && !startForm.store_id) { setNotice("ID toko wajib diisi untuk chat berbasis toko."); return; }
    else if (startForm.type === "order" && (!startForm.order_id || !startForm.store_id)) { setNotice("ID pesanan dan ID toko tujuan wajib diisi untuk chat berbasis pesanan."); return; }
    else if (startForm.type === "direct" && !startForm.participant_ids.trim()) { setNotice("User ID tujuan wajib diisi untuk chat langsung."); return; }

    try {
      const values = seller ? {
        type: "store", store_id: Number(store.id), order_id: null,
        subject: startForm.subject.trim() || `Chat ${store.name || "Toko"}`,
        participant_ids: [startForm.buyer_id],
      } : {
        type: startForm.type,
        store_id: startForm.store_id ? Number(startForm.store_id) : null,
        order_id: startForm.order_id ? Number(startForm.order_id) : null,
        subject: startForm.subject.trim() || null,
        participant_ids: startForm.participant_ids.split(",").map((v) => v.trim()).filter(Boolean),
      };
      const row = await startMutation.mutateAsync(values);
      selectConversation(row.id);
      setStartForm(EMPTY_START_FORM);
      closeStart();
    } catch (error) { setNotice(advancedError(error)); }
  }, [seller, store, startForm, startMutation, selectConversation, closeStart]);

  if (startOpen) {
    return (
      <FormModal open title={seller ? "Chat Buyer Baru" : "Data Baru Chat"} subtitle={seller ? `Pesan dikirim atas nama ${store?.name || "toko aktif"}` : "Buka percakapan berdasarkan toko, pesanan, atau user tujuan."} onClose={closeStart} onSubmit={start} busy={startMutation.isPending} submitLabel="Buka Chat">
        {seller ? (
          <>
            <Field label="Buyer" required hint="Hanya buyer yang pernah bertransaksi pada toko aktif.">
              <SearchableSelect value={startForm.buyer_id} onChange={(value) => setStartForm((c) => ({ ...c, buyer_id: value }))} options={[]} placeholder="Pilih buyer" searchPlaceholder="Cari nama atau email buyer" />
            </Field>
            <Field label="Nama Pengirim"><Input value={store?.name || "Toko Aktif"} disabled /></Field>
            <Field label="Subjek"><Input value={startForm.subject} onChange={(e) => setStartForm((c) => ({ ...c, subject: e.target.value }))} placeholder="Contoh: Informasi pesanan atau produk" /></Field>
          </>
        ) : (
          <>
            <Field label="Konteks" required>
              <select value={startForm.type} onChange={(e) => setStartForm((c) => ({ ...c, type: e.target.value }))} className="h-10 w-full border border-slate-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none">
                <option value="store">Toko</option><option value="order">Pesanan</option><option value="direct">Langsung</option>
              </select>
            </Field>
            {["store", "order"].includes(startForm.type) && <Field label="ID Toko" required><Input type="number" min="1" value={startForm.store_id} onChange={(e) => setStartForm((c) => ({ ...c, store_id: e.target.value }))} /></Field>}
            {startForm.type === "order" && <Field label="ID Pesanan" required><Input type="number" min="1" value={startForm.order_id} onChange={(e) => setStartForm((c) => ({ ...c, order_id: e.target.value }))} /></Field>}
            {startForm.type === "direct" && <Field label="User ID Tujuan" required hint="Pisahkan UUID dengan koma."><Input value={startForm.participant_ids} onChange={(e) => setStartForm((c) => ({ ...c, participant_ids: e.target.value }))} /></Field>}
            <Field label="Subjek"><Input value={startForm.subject} onChange={(e) => setStartForm((c) => ({ ...c, subject: e.target.value }))} placeholder="Contoh: Pertanyaan pesanan atau produk" /></Field>
          </>
        )}
        {notice && <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">{notice}</p>}
      </FormModal>
    );
  }

  // Buyer: Direct admin chat
  if (activeRole === "buyer") {
    const isLoading = detailQuery.isLoading || (!adminConversation && !selectedId);
    const adminConv = adminConversation || active;

    return (
      <section className={cn("overflow-hidden bg-white flex flex-col", fullscreen ? "fixed inset-0 z-[90]" : "border border-slate-200 min-h-[620px]")}>
        {notice && <p className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">{notice}</p>}
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="min-w-0 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-xs font-bold text-white">A</div>
            <div className="min-w-0">
              <h2 className="truncate font-extrabold text-slate-950">Admin MarketKu</h2>
              <p className="mt-1 truncate text-xs text-slate-500">Layanan Pelanggan</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className={`flex items-center gap-1 text-[11px] font-semibold ${connectionStatus === "connected" ? "text-emerald-700" : "text-amber-700"}`}>
              <span className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-emerald-500" : "bg-amber-500"}`} />
              {connectionLabel(connectionStatus)}
            </span>
            <button type="button" onClick={() => setFullscreen((c) => !c)} title={fullscreen ? "Keluar layar penuh" : "Layar penuh"} className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200">
              <span className="material-symbols-outlined text-[19px]">{fullscreen ? "fullscreen_exit" : "fullscreen"}</span>
            </button>
          </div>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-100 p-5">
          {isLoading ? (
            <div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-3 text-slate-500"><div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-emerald-500" /><p>Memuat percakapan...</p></div></div>
          ) : adminConv ? (
            <>
              <div className="relative mx-auto mb-5 flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 shadow-sm">
                <span className="material-symbols-outlined text-[13px]">verified</span>Terhubung dengan Admin
              </div>
              <div className="relative flex flex-col gap-2">
                {messages.map((item) => {
                  const mine = String(item.sender_id) === String(user?.id);
                  return (
                    <div key={item.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] border px-4 py-3 text-sm ${mine ? "border-emerald-500 bg-emerald-500 text-white" : item.message_type === "system" ? "border-sky-200 bg-sky-50 text-sky-950" : "border-slate-200 bg-white text-slate-800"}`}>
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold opacity-75">
                          {item.sender_identity_type === "store" && <span className="material-symbols-outlined text-[14px]">store</span>}
                          {item.message_type === "system" && <span className="material-symbols-outlined text-[14px]">notifications</span>}
                          <span>{item.message_type === "system" ? "Sistem" : item.sender_name || (mine ? "Anda" : "Admin")}</span>
                        </div>
                        <p className="whitespace-pre-wrap break-words">{item.message}</p>
                        <p className="mt-1 text-right text-[10px] opacity-70">{item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : ""}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center">
              <div className="max-w-md"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"><span className="material-symbols-outlined text-4xl">support_agent</span></div>
                <h2 className="mb-2 text-xl font-bold text-slate-900">Hubungi Admin</h2>
                <p className="text-sm text-slate-500 mb-4">Klik tombol di bawah untuk memulai percakapan dengan tim support kami.</p>
                <Button onClick={openAdminChat} className="w-full" disabled={startMutation.isPending}>{startMutation.isPending ? "Menghubungkan..." : "Mulai Chat dengan Admin"}</Button>
              </div>
            </div>
          )}
        </div>
        {(adminConv?.type === "announcement" || adminConv?.type === "system") ? (
          <div className="border-t border-slate-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
            {adminConv?.type === "system" ? "Pesan sistem satu arah untuk informasi otomatis." : "Pengumuman bersifat satu arah dan hanya dapat dikirim oleh admin."}
          </div>
        ) : (
          <form onSubmit={send} className="flex gap-2 border-t border-slate-200 bg-white p-4">
            <Input ref={composerRef} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis pesan ke admin..." required autoComplete="off" />
            <Button type="submit" disabled={sendMutation.isPending || !message.trim() || !adminConv?.id}>Kirim</Button>
          </form>
        )}
      </section>
    );
  }

  // Seller/Admin: Full chat with sidebar
  return (
    <section className={cn("overflow-hidden bg-white", fullscreen ? "fixed inset-0 z-[90] flex flex-col" : "border border-slate-200")}>
      {notice && <p className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">{notice}</p>}
      <div className={cn("grid lg:grid-cols-[320px_1fr]", fullscreen ? "min-h-0 flex-1 grid-rows-1" : "min-h-[620px]")}>
        <aside className={cn("border-r border-slate-200", fullscreen && "flex min-h-0 flex-col")}>
          <div className="border-b border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div><h1 className="text-base font-extrabold text-slate-950">{seller ? "Chat Buyer" : "Chat"}</h1>
                <p className={`mt-1 text-[11px] font-semibold ${connectionStatus === "connected" ? "text-emerald-700" : "text-amber-700"}`}>{connectionLabel(connectionStatus)}</p>
              </div>
              {canStartManually && <Button size="sm" onClick={openStart}>{seller ? "Chat Buyer" : "Data Baru"}</Button>}
            </div>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari percakapan" className="h-9" />
          </div>
          <div className={cn("overflow-y-auto", fullscreen ? "min-h-0 flex-1" : "max-h-[550px]")}>
            {!listQuery.isLoading && !conversations.length && <p className="p-5 text-sm text-slate-500">Percakapan belum tersedia.</p>}
            {conversations.map((row) => (
              <button key={row.id} type="button" onClick={() => selectConversation(row.id)} className={`w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${Number(selectedId) === Number(row.id) ? "border-l-2 border-l-orange-500 bg-orange-50" : ""}`}>
                <div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-extrabold text-slate-900">{conversationTitle(row, user?.id, activeRole)}</span>
                  {row.unread_count && <span className="min-w-5 rounded-full bg-red-500 px-1.5 text-center text-xs font-extrabold text-white">{row.unread_count}</span>}
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{row.latest_message?.message || conversationSubtitle(row, activeRole)}</p>
              </button>
            ))}
          </div>
        </aside>
        <div className="flex min-w-0 flex-col">
          {active ? (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div className="min-w-0"><h2 className="truncate font-extrabold text-slate-950">{conversationTitle(active, user?.id, activeRole)}</h2>
                  <p className="mt-1 truncate text-xs text-slate-500">{conversationSubtitle(active, activeRole)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={focusComposer} title="Fokus ke kolom pesan" className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200"><span className="material-symbols-outlined text-[19px]">center_focus_strong</span></button>
                  <button type="button" onClick={() => setFullscreen((c) => !c)} title={fullscreen ? "Keluar layar penuh" : "Layar penuh"} className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200"><span className="material-symbols-outlined text-[19px]">{fullscreen ? "fullscreen_exit" : "fullscreen"}</span></button>
                </div>
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-100 p-5">
                {messages.map((item) => {
                  const mine = String(item.sender_id) === String(user?.id);
                  return (
                    <div key={item.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] border px-4 py-3 text-sm ${mine ? "border-orange-500 bg-orange-500 text-white" : item.message_type === "system" ? "border-sky-200 bg-sky-50 text-sky-950" : item.message_type === "announcement" ? "border-amber-200 bg-amber-50 text-amber-950" : "border-slate-200 bg-white text-slate-800"}`}>
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold opacity-75">
                          {item.sender_identity_type === "store" && <span className="material-symbols-outlined text-[14px]">store</span>}
                          {item.message_type === "system" && <span className="material-symbols-outlined text-[14px]">notifications</span>}
                          <span>{item.message_type === "system" ? "Sistem" : item.sender_name || (mine ? "Anda" : "User")}</span>
                        </div>
                        <p className="whitespace-pre-wrap break-words">{item.message}</p>
                        <p className="mt-1 text-right text-[10px] opacity-70">{item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : ""}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              {(active.type === "announcement" || active.type === "system") ? (
                <div className="border-t border-slate-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
                  {active.type === "system" ? "Pesan sistem satu arah untuk informasi otomatis toko Anda." : "Pengumuman bersifat satu arah dan hanya dapat dikirim oleh admin."}
                </div>
              ) : (
                <form onSubmit={send} className="flex gap-2 border-t border-slate-200 bg-white p-4">
                  <Input ref={composerRef} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis pesan" required autoComplete="off" />
                  <Button type="submit" disabled={sendMutation.isPending || !message.trim()}>Kirim</Button>
                </form>
              )}
            </>
          ) : <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">Pilih percakapan untuk mulai membaca pesan.</div>}
        </div>
      </div>
    </section>
  );
}