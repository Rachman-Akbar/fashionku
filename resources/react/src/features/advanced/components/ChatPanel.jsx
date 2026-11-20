import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/utils/utils";

const CONNECTION_ERROR_STATES = ["disconnected", "failed", "error", "not_configured", "unauthenticated"];

export function connectionLabel(status, scope = "buyer") {
  if (status === "connected") return scope === "seller" ? "Terhubung" : "Terhubung dengan Admin";
  return "Menunggu";
}

export function connectionTone(status) {
  if (status === "connected") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (CONNECTION_ERROR_STATES.includes(status)) return "bg-red-50 text-red-700 ring-red-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

/**
 * Nama lawan bicara: untuk admin/seller tampilkan nama pelanggan, untuk buyer
 * tampilkan toko/admin.
 */
export function chatCounterpartName(row, currentUserId, role) {
  if (role === "buyer") return row?.store_name || "Admin MarketKu";
  const other = (row?.participants || []).find((item) => String(item.id) !== String(currentUserId));
  return other?.name || row?.store_name || "Pelanggan";
}

export function conversationSubtitle(row, role) {
  const values = [];
  if (row?.subject) values.push(row.subject);
  if (row?.order_number) values.push(`Pesanan ${row.order_number}`);
  if (row?.store_name && role === "buyer") values.push(row.store_name);
  return values.join(" · ");
}

const BUBBLE_BASE =
  "max-w-[85%] rounded-2xl border px-4 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[78%]";

function bubbleTone(mine, messageType, pending) {
  if (mine) return cn(BUBBLE_BASE, "rounded-br-md border-emerald-700 bg-emerald-700 text-white", pending && "opacity-70");
  if (messageType === "system") return cn(BUBBLE_BASE, "rounded-bl-md border-sky-200 bg-sky-50 text-sky-950");
  if (messageType === "announcement") return cn(BUBBLE_BASE, "rounded-bl-md border-amber-200 bg-amber-50 text-amber-950");
  return cn(BUBBLE_BASE, "rounded-bl-md border-slate-200 bg-white text-slate-900");
}

function MessageStatus({ message, currentUserId }) {
  if (String(message.sender_id) !== String(currentUserId)) return null;
  if (message.pending) {
    return (
      <span className="ml-1 inline-flex items-center gap-1 align-middle text-emerald-100" title="Mengirim...">
        <span className="material-symbols-outlined text-[13px] leading-none">schedule</span>
      </span>
    );
  }
  const readByOthers = (message.read_by || []).filter((id) => String(id) !== String(currentUserId));
  return (
    <span className={cn("ml-1 align-middle", readByOthers.length ? "font-bold text-white" : "text-emerald-100")} aria-label={readByOthers.length ? "Dibaca" : "Terkirim"}>
      {readByOthers.length ? "\u2713\u2713" : "\u2713"}
    </span>
  );
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function ChatHeader({ conversation, currentUserId, role, connectionStatus, onToggleFullscreen, fullscreen }) {
  const name = chatCounterpartName(conversation, currentUserId, role);
  const subtitle = conversationSubtitle(conversation, role);
  const online = connectionStatus === "connected";
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-sm font-bold uppercase text-white">
          {name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-extrabold text-slate-950">{name}</h2>
          <p className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-xs font-semibold text-slate-500">
            <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", online ? "bg-emerald-500" : "bg-amber-500")} />
            <span className="truncate">{subtitle ? `${subtitle} · ${connectionLabel(connectionStatus, role === "buyer" ? "buyer" : "seller")}` : connectionLabel(connectionStatus, role === "buyer" ? "buyer" : "seller")}</span>
          </p>
        </div>
      </div>
      {onToggleFullscreen ? (
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
          aria-label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200"
        >
          <span className="material-symbols-outlined text-[19px]">{fullscreen ? "fullscreen_exit" : "fullscreen"}</span>
        </button>
      ) : null}
    </header>
  );
}

/**
 * Panel chat bersama untuk admin, seller, dan buyer: header nama pelanggan,
 * daftar bubble, dan composer dengan indikator kirim di dalam bubble.
 */
export function ChatPanel({
  conversation,
  messages = [],
  currentUserId,
  role,
  connectionStatus = "idle",
  loading = false,
  message = "",
  onMessageChange,
  onSend,
  sendPending = false,
  placeholder = "Tulis pesan",
  fullscreen = false,
  onToggleFullscreen,
  emptyTitle = "Pilih percakapan",
  emptyText = "Pilih percakapan di samping untuk mulai membaca pesan.",
  emptyActionLabel,
  onEmptyAction,
  emptyActionBusy = false,
  className,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, conversation?.id]);

  if (!conversation) {
    return (
      <div className={cn("flex min-h-0 min-w-0 flex-col", className)}>
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined text-4xl">support_agent</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">{emptyTitle}</h2>
            <p className="mb-4 text-sm text-slate-600">{emptyText}</p>
            {onEmptyAction ? (
              <Button onClick={onEmptyAction} className="w-full" disabled={emptyActionBusy}>
                {emptyActionBusy ? "Menghubungkan..." : emptyActionLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const readOnly = conversation.type === "announcement" || conversation.type === "system";

  return (
    <div className={cn("flex min-h-0 min-w-0 flex-col", className)}>
      <ChatHeader
        conversation={conversation}
        currentUserId={currentUserId}
        role={role}
        connectionStatus={connectionStatus}
        fullscreen={fullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 sm:p-5">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
              <p className="text-sm font-semibold">Memuat percakapan...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((item) => {
              const mine = String(item.sender_id) === String(currentUserId);
              return (
                <div key={item.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div className={bubbleTone(mine, item.message_type, item.pending)}>
                    <div className={cn("mb-1 flex items-center gap-1.5 text-[11px] font-semibold", mine ? "text-emerald-50" : "text-slate-600")}>
                      {item.sender_identity_type === "store" ? <span className="material-symbols-outlined text-[14px]">store</span> : null}
                      {item.message_type === "system" ? <span className="material-symbols-outlined text-[14px]">notifications</span> : null}
                      <span>{item.message_type === "system" ? "Sistem" : item.sender_name || (mine ? "Anda" : chatCounterpartName(conversation, currentUserId, role))}</span>
                    </div>
                    <p className="whitespace-pre-wrap break-words">{item.message}</p>
                    <p className={cn("mt-1 text-right text-[11px] leading-none", mine ? "text-emerald-100" : "text-slate-500")}>
                      {formatTime(item.created_at)}
                      <MessageStatus message={item} currentUserId={currentUserId} />
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      {readOnly ? (
        <div className="shrink-0 border-t border-slate-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-900">
          {conversation.type === "system"
            ? "Pesan sistem satu arah untuk informasi otomatis."
            : "Pengumuman bersifat satu arah dan hanya dapat dikirim oleh admin."}
        </div>
      ) : (
        <form onSubmit={onSend} className="flex shrink-0 gap-2 border-t border-slate-200 bg-white p-4">
          <Input
            value={message}
            onChange={(event) => onMessageChange?.(event.target.value)}
            placeholder={placeholder}
            required
            autoComplete="off"
          />
          <Button type="submit" disabled={sendPending || !message.trim()}>
            Kirim
          </Button>
        </form>
      )}
    </div>
  );
}
