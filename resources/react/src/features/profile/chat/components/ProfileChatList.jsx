import {
  Archive,
  Laptop,
  MoreVertical,
  Search,
  SquarePlus,
} from "lucide-react";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { cn } from "@/shared/utils/utils";

export function ProfileChatList({ threads = [], activeId, onSelect }) {
  return (
    <aside className={profileLayout.sidebar} aria-label="Daftar chat pribadi">
      <div className={profileLayout.sidebarHeader}>
        <h1 className={profileLayout.sidebarTitle}>Chat</h1>
        <div className="flex items-center gap-3 text-slate-500">
          <button
            type="button"
            className="transition hover:text-[#10B981]"
            aria-label="Chat baru"
          >
            <SquarePlus size={20} />
          </button>
          <button
            type="button"
            className="transition hover:text-[#10B981]"
            aria-label="Menu"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className={profileLayout.sidebarSearch}>
        <label className="flex h-10 w-full items-center rounded-lg bg-[#f0f2f5] px-3">
          <Search size={16} className="mr-3 shrink-0 text-slate-400" />
          <input
            type="search"
            placeholder="Cari atau mulai obrolan baru"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className={profileLayout.filterRow}>
        <button
          type="button"
          className="shrink-0 rounded-full bg-[#D1FAE5] px-3 py-1 font-semibold text-[#10B981]"
        >
          Semua
        </button>
        <button
          type="button"
          className="shrink-0 rounded-full bg-[#f0f2f5] px-3 py-1 font-semibold text-slate-500 transition hover:bg-[#D1FAE5] hover:text-[#10B981]"
        >
          Belum dibaca
        </button>
        <button
          type="button"
          className="shrink-0 rounded-full bg-[#f0f2f5] px-3 py-1 font-semibold text-slate-500 transition hover:bg-[#D1FAE5] hover:text-[#10B981]"
        >
          Favorit
        </button>
      </div>

      <button
        type="button"
        className="flex h-[52px] shrink-0 items-center px-4 text-left text-sm font-medium text-slate-800 transition hover:bg-[#f7f8fa]"
      >
        <Archive size={17} className="mr-6 text-[#10B981]" />
        <span className="flex-1">Diarsipkan</span>
      </button>
      <hr className={profileLayout.divider} />

      <div className={profileLayout.listScroll}>
        {threads.map((thread) => {
          const active = thread.id === activeId;
          const initials = thread.initials || thread.store.slice(0, 1);

          return (
            <button
              key={thread.id}
              type="button"
              onClick={() => onSelect(thread.id)}
              className={cn(
                profileLayout.listItem,
                active ? "bg-[#ECFDF5]" : "hover:bg-[#f7f8fa]",
              )}
            >
              <div
                className={cn(
                  "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                  thread.avatar || "from-emerald-500 to-green-600",
                )}
              >
                {initials}
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white",
                    thread.status === "online"
                      ? "bg-[#25d366]"
                      : "bg-slate-300",
                  )}
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {thread.store}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {thread.lastMessage}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 pt-0.5">
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    thread.unread > 0 ? "text-[#10B981]" : "text-slate-400",
                  )}
                >
                  {thread.time}
                </span>
                {thread.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#10B981] px-1.5 text-[11px] font-bold text-white">
                    {thread.unread}
                  </span>
                )}
              </div>
              <hr className={profileLayout.listDivider} />
            </button>
          );
        })}
      </div>

      <div className="flex h-14 shrink-0 items-center gap-3 border-t border-[#e5e7eb] bg-white px-4 text-xs font-medium text-[#10B981]">
        <Laptop size={16} />
        <span className="cursor-pointer hover:underline">
          Gunakan chat marketplace versi desktop
        </span>
      </div>
    </aside>
  );
}
