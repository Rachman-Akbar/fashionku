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
import { ChatPanel, chatCounterpartName, connectionLabel, connectionTone } from "@/features/advanced/components/ChatPanel";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/utils/utils";

function messageExists(rows, id) {
  return rows.some((item) => String(item.id) === String(id));
}

function conversationTime(row) {
  return new Date(row?.latest_message?.created_at || row?.updated_at || 0).getTime() || 0;
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
  rows.sort((left, right) => conversationTime(right) - conversationTime(left));
  return { ...current, rows };
}

export default function RealtimeChatPage() {
  const { user, activeRole } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConversationId = Number(searchParams.get("conversation") || 0) || null;
  const [selectedId, setSelectedId] = useState(queryConversationId);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [fullscreen, setFullscreen] = useState(false);
  const subscriptionsRef = useRef({ conversation: null, inbox: null });

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
  });

  // Chat terbaru selalu di urutan teratas (berdasarkan pesan terakhir).
  const conversations = useMemo(
    () => [...(listQuery.data || [])].sort((left, right) => conversationTime(right) - conversationTime(left)),
    [listQuery.data],
  );

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

  // Stable refs for React Query results (new object every render)
  const readMutationRef = useRef(readMutation);
  const detailQueryRef = useRef(detailQuery);
  const listQueryRef = useRef(listQuery);
  readMutationRef.current = readMutation;
  detailQueryRef.current = detailQuery;
  listQueryRef.current = listQuery;

  // Stable callbacks using refs
  const selectConversation = useCallback((id) => {
    const value = Number(id);
    setSelectedId(value);
    const next = new URLSearchParams(searchParams);
    next.set("conversation", String(value));
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

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
        detailQueryRef.current.refetch();
        listQueryRef.current.refetch();
        return;
      }
      queryClient.setQueryData([...advancedKeys.conversations, selectedId], (current) => {
        if (!current) return current;
        const currentMessages = Array.isArray(current.messages) ? current.messages : [];
        if (messageExists(currentMessages, incoming.id)) return current;
        return { ...current, messages: [...currentMessages, incoming], updated_at: incoming.created_at };
      });
      queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => updateConversationRows(current, incoming, userIdRef.current, selectedId));
      readMutationRef.current.mutate(selectedId);
    });
    subscriptionsRef.current.conversation = unsubscribe;
    return () => { subscriptionsRef.current.conversation = null; };
  }, [selectedId, queryClient]);

  // Mark as read when selectedId changes
  useEffect(() => {
    if (!selectedId) return;
    queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => markConversationReadInRows(current, selectedId));
    readMutationRef.current.mutate(selectedId);
  }, [selectedId, queryClient]);

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
        type: "direct",
        subject: "Bantuan Pelanggan",
        participant_ids: [],
      });
      selectConversation(row.id);
    } catch (error) {
      setNotice(advancedError(error));
    }
  }, [startMutation, selectConversation]);

  // Auto-select for buyer
  useEffect(() => {
    if (activeRole !== "buyer") return;
    if (adminConversation?.id) {
      selectConversation(adminConversation.id);
    } else if (!selectedId && !startMutation.isPending) {
      openAdminChat();
    }
  }, [adminConversation, selectedId, activeRole, selectConversation, startMutation.isPending, openAdminChat]);

  const appendConversationMessage = useCallback((conversationId, nextMessage) => {
    queryClient.setQueryData([...advancedKeys.conversations, conversationId], (current) => {
      if (!current) return current;
      const currentMessages = Array.isArray(current.messages) ? current.messages : [];
      if (messageExists(currentMessages, nextMessage.id)) return current;
      return { ...current, messages: [...currentMessages, nextMessage], updated_at: nextMessage.created_at || current.updated_at };
    });
  }, [queryClient]);

  const replaceConversationMessage = useCallback((conversationId, tempId, nextMessage) => {
    queryClient.setQueryData([...advancedKeys.conversations, conversationId], (current) => {
      if (!current) return current;
      const currentMessages = Array.isArray(current.messages) ? current.messages : [];
      const withoutTemp = currentMessages.filter((item) => String(item.id) !== String(tempId));
      if (messageExists(withoutTemp, nextMessage.id)) return { ...current, messages: withoutTemp };
      return { ...current, messages: [...withoutTemp, nextMessage], updated_at: nextMessage.created_at || current.updated_at };
    });
  }, [queryClient]);

  const removeConversationMessage = useCallback((conversationId, tempId) => {
    queryClient.setQueryData([...advancedKeys.conversations, conversationId], (current) => {
      if (!current) return current;
      const currentMessages = Array.isArray(current.messages) ? current.messages : [];
      return { ...current, messages: currentMessages.filter((item) => String(item.id) !== String(tempId)) };
    });
  }, [queryClient]);

  const send = useCallback(async (event) => {
    event?.preventDefault?.();
    const cleanMessage = message.trim();
    if (!selectedId || !cleanMessage) return;

    const tempId = `pending-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      conversation_id: selectedId,
      sender_id: user?.id,
      sender_name: user?.name,
      sender_identity_type: "user",
      message_type: "text",
      message: cleanMessage,
      read_by: [],
      created_at: new Date().toISOString(),
      pending: true,
    };

    setNotice("");
    setMessage("");
    appendConversationMessage(selectedId, optimisticMessage);
    queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => updateConversationRows(current, optimisticMessage, user?.id, selectedId));

    try {
      const sent = await sendMutation.mutateAsync({ id: selectedId, values: { message_type: "text", message: cleanMessage } });
      replaceConversationMessage(selectedId, tempId, sent);
      queryClient.setQueriesData({ queryKey: advancedKeys.conversations }, (current) => updateConversationRows(current, sent, userIdRef.current, selectedId));
    } catch (error) {
      removeConversationMessage(selectedId, tempId);
      setMessage(cleanMessage);
      setNotice(advancedError(error));
    }
  }, [appendConversationMessage, message, queryClient, removeConversationMessage, replaceConversationMessage, selectedId, sendMutation, user?.id, user?.name]);

  // Buyer: Direct admin chat
  if (activeRole === "buyer") {
    const adminConv = adminConversation || active;
    const loading = detailQuery.isLoading || (!adminConv && startMutation.isPending);

    return (
      <section className={cn("flex flex-col overflow-hidden bg-white", fullscreen ? "fixed inset-0 z-[90]" : "h-full min-h-0 border border-slate-200")}>
        {notice && <p className="shrink-0 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{notice}</p>}
        <ChatPanel
          conversation={adminConv}
          messages={messages}
          currentUserId={user?.id}
          role={activeRole}
          connectionStatus={connectionStatus}
          loading={loading}
          message={message}
          onMessageChange={setMessage}
          onSend={send}
          sendPending={sendMutation.isPending}
          placeholder="Tulis pesan ke admin..."
          fullscreen={fullscreen}
          onToggleFullscreen={() => setFullscreen((current) => !current)}
          emptyTitle="Hubungi Admin"
          emptyText="Mulai percakapan dengan tim support kami untuk pertanyaan pesanan atau produk."
          emptyActionLabel="Mulai Chat dengan Admin"
          onEmptyAction={openAdminChat}
          emptyActionBusy={startMutation.isPending}
          className="min-h-0 flex-1"
        />
      </section>
    );
  }

  // Seller/Admin: Full chat with sidebar
  return (
    <section className={cn("flex flex-col overflow-hidden bg-white", fullscreen ? "fixed inset-0 z-[90]" : "h-full min-h-0 border border-slate-200")}>
      {notice && <p className="shrink-0 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{notice}</p>}
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.42fr)_minmax(0,1fr)] lg:grid-cols-[340px_1fr] lg:grid-rows-1">
        <aside className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex min-w-0 flex-col gap-1">
              <h1 className="text-base font-extrabold text-slate-950">Chat</h1>
              <span className={cn("inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", connectionTone(connectionStatus))}>
                <span className="material-symbols-outlined text-[13px]">{connectionStatus === "connected" ? "verified" : "schedule"}</span>
                {connectionLabel(connectionStatus, "seller")}
              </span>
            </div>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari percakapan" className="h-9" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {!listQuery.isLoading && !conversations.length && <p className="p-5 text-sm text-slate-600">Percakapan belum tersedia.</p>}
            {conversations.map((row) => {
              const unread = Number(row.unread_count || 0);
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => selectConversation(row.id)}
                  className={cn(
                    "w-full border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50",
                    Number(selectedId) === Number(row.id) && "border-l-2 border-l-emerald-600 bg-emerald-50",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-extrabold text-slate-900">{chatCounterpartName(row, user?.id, activeRole)}</span>
                    {unread > 0 ? (
                      <span className="min-w-5 shrink-0 rounded-full bg-red-600 px-1.5 text-center text-xs font-extrabold text-white">{unread > 99 ? "99+" : unread}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-600">{row.latest_message?.message || "Belum ada pesan."}</p>
                </button>
              );
            })}
          </div>
        </aside>
        <ChatPanel
          conversation={active}
          messages={messages}
          currentUserId={user?.id}
          role={activeRole}
          connectionStatus={connectionStatus}
          loading={detailQuery.isLoading && Boolean(selectedId)}
          message={message}
          onMessageChange={setMessage}
          onSend={send}
          sendPending={sendMutation.isPending}
          placeholder="Tulis pesan"
          fullscreen={fullscreen}
          onToggleFullscreen={() => setFullscreen((current) => !current)}
          emptyTitle="Pilih percakapan"
          emptyText="Pilih percakapan di samping untuk mulai membaca pesan."
          className="min-h-0"
        />
      </div>
    </section>
  );
}
