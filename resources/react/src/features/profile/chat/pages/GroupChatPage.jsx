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
    <div className="flex h-full min-w-0 flex-1 overflow-hidden">
      {activeGroup ? (
        <>
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
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
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-100 p-5">
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
            <div ref={(el) => { if (el) el.scrollIntoView({ behavior: "smooth" }); }} />
          </div>
          <footer className="flex items-center gap-2 border-t border-slate-200 bg-white p-4">
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
    </div>
  );
}