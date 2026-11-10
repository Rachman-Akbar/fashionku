import { useEffect, useMemo, useState } from "react";
import {
  Lock,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  Users,
  UsersRound,
} from "lucide-react";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { useGroupChatThreads } from "@/features/profile/chat/services/profileChatService";

export default function GroupChatPage() {
  const groupsQuery = useGroupChatThreads();
  const groups = groupsQuery.data || [];
  const [activeId, setActiveId] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!activeId && groups[0]?.id) setActiveId(groups[0].id);
  }, [activeId, groups]);

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === activeId),
    [groups, activeId],
  );

  return (
    <div className={profileLayout.page}>
      <aside className={profileLayout.sidebar}>
        <div className={profileLayout.sidebarHeader}>
          <h1 className={profileLayout.sidebarTitle}>Grup Komunitas</h1>
          <div className="flex items-center gap-3 text-slate-500">
            <Users size={20} />
            <MoreVertical size={20} />
          </div>
        </div>
        <div className={profileLayout.sidebarSearch}>
          <label className="flex h-10 w-full items-center rounded-lg bg-[#f0f2f5] px-3">
            <Search size={16} className="mr-3 shrink-0 text-slate-400" />
            <input
              type="search"
              placeholder="Cari grup"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
        <div className={profileLayout.listScroll}>
          
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveId(group.id)}
              className={`${profileLayout.listItem} ${group.id === activeId ? "bg-[#ECFDF5]" : "hover:bg-[#f7f8fa]"}`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${group.avatar}`}
              >
                {group.initials}
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {group.name}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {group.lastMessage}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {group.memberCount} anggota
                </p>
              </div>
              <hr className={profileLayout.listDivider} />
            </button>
          ))}
          {!groupsQuery.isLoading && !groups.length ? (
            <p className="p-6 text-sm text-slate-500">
              Backend belum menyediakan percakapan grup.
            </p>
          ) : null}
        </div>
      </aside>

      <section className={profileLayout.chatPanel}>
        {activeGroup ? (
          <>
            <header className={profileLayout.chatHeader}>
              <div className="flex min-w-0 items-center">
                <div
                  className={`mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${activeGroup.avatar}`}
                >
                  {activeGroup.initials}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-slate-950">
                    {activeGroup.name}
                  </h2>
                  <p className="truncate text-xs text-slate-400">
                    {activeGroup.memberCount} anggota
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-slate-500">
                <Search size={20} />
                <MoreVertical size={20} />
              </div>
            </header>
            <div className={profileLayout.chatBody}>
              <div className="relative mx-auto mb-5 flex w-fit items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs text-slate-400 shadow-sm">
                <Lock size={13} />
                Pesan grup
              </div>
              <div className="relative flex flex-col gap-2">
                {activeGroup.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] px-4 py-2 text-sm leading-6 shadow-sm ${message.role === "me" ? "rounded-l-2xl rounded-tr-2xl bg-[#d9fdd3]" : "rounded-r-2xl rounded-tl-2xl bg-white"}`}
                    >
                      <p>{message.text}</p>
                      <time className="mt-1 block text-right text-[10px] text-slate-400">
                        {message.time}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <footer className={profileLayout.chatFooter}>
              <Paperclip size={20} className="text-slate-500" />
              <Smile size={20} className="text-slate-500" />
              <form
                className="flex flex-1 items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  setDraft("");
                }}
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  type="text"
                  placeholder="Ketik pesan grup"
                  className="h-10 w-full rounded-lg border-0 bg-[#f0f2f5] px-4 text-sm text-slate-800 outline-none"
                />
              </form>
              <Send size={20} className="text-[#10B981]" />
            </footer>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f2f5] text-slate-400">
                <UsersRound size={40} />
              </div>
              <h2 className="mb-2 text-2xl font-light text-slate-950">
                Grup Marketplace
              </h2>
              <p className="text-sm leading-6 text-slate-500">
                Endpoint grup chat belum tersedia pada backend yang diberikan.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
