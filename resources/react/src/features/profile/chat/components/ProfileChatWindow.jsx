import {
  Lock,
  MessageCircle,
  Mic,
  MoreVertical,
  Plus,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { cn } from "@/shared/utils/utils";

export function ProfileChatWindow({ thread }) {
  if (!thread) {
    return (
      <section
        className="relative flex h-full min-w-0 flex-1 flex-col bg-[#f7f8fa]"
        aria-label="Ruang chat kosong"
      >
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f2f5] text-slate-400">
              <MessageCircle size={40} />
            </div>
            <h2 className="mb-2 text-2xl font-light text-slate-950">
              Chat Marketplace
            </h2>
            <p className="mb-8 text-sm leading-6 text-slate-500">
              Pilih percakapan di sebelah kiri untuk mulai melihat pesan
              penjual, bantuan pembelian, atau update pesanan.
            </p>
            <div className="mt-12 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Lock size={14} />
              <span>Terenkripsi secara end-to-end</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const initials = thread.initials || thread.store.slice(0, 1);

  return (
    <section className={profileLayout.chatPanel} aria-label="Ruang chat">
      <header className={profileLayout.chatHeader}>
        <div className="flex min-w-0 items-center">
          <div
            className={cn(
              "mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
              thread.avatar || "from-emerald-500 to-green-600",
            )}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-950">
              {thread.store}
            </h2>
            <p className="truncate text-xs text-slate-400">
              {thread.status === "online"
                ? "online"
                : "terakhir dilihat belum lama ini"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-slate-500">
          <button
            type="button"
            className="transition hover:text-[#10B981]"
            aria-label="Video"
          >
            <Video size={20} />
          </button>
          <button
            type="button"
            className="transition hover:text-[#10B981]"
            aria-label="Cari"
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            className="transition hover:text-[#10B981]"
            aria-label="Menu"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <div className={profileLayout.chatBody}>
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(18,18,18,0.12)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative flex flex-col gap-2">
          {thread.messages.map((message) => {
            const mine = message.sender === "me";

            return (
              <div
                key={message.id}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[78%] px-4 py-2 text-sm leading-6 shadow-sm",
                    mine
                      ? "rounded-l-2xl rounded-tr-2xl bg-[#d9fdd3] text-slate-900"
                      : "rounded-r-2xl rounded-tl-2xl bg-white text-slate-800",
                  )}
                >
                  <p>{message.text}</p>
                  <time
                    className={cn(
                      "mt-1 block text-right text-[10px] font-medium",
                      mine ? "text-[#128c7e]" : "text-slate-400",
                    )}
                  >
                    {message.time}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className={profileLayout.chatFooter}>
        <div className="flex items-center gap-3 text-slate-500">
          <button
            type="button"
            className="transition hover:text-[#10B981]"
            aria-label="Tambah"
          >
            <Plus size={20} />
          </button>
          <button
            type="button"
            className="transition hover:text-[#10B981]"
            aria-label="Emoji"
          >
            <Smile size={20} />
          </button>
        </div>
        <form className="flex flex-1 items-center">
          <input
            type="text"
            autoComplete="off"
            placeholder="Ketik pesan"
            className="h-10 w-full rounded-lg border-0 bg-[#f0f2f5] px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </form>
        <button
          type="button"
          className="text-slate-500 transition hover:text-[#10B981]"
          aria-label="Rekam"
        >
          <Mic size={20} />
        </button>
        <button
          type="button"
          className="text-[#10B981] transition hover:text-[#059669]"
          aria-label="Kirim"
        >
          <Send size={20} />
        </button>
      </footer>
    </section>
  );
}
