import { useEffect, useMemo, useState } from "react";
import { ProfileChatList } from "@/features/profile/chat/components/ProfileChatList";
import { ProfileChatWindow } from "@/features/profile/chat/components/ProfileChatWindow";
import { useProfileChatThreads } from "@/features/profile/chat/services/profileChatService";

export default function ChatPage() {
  const threadsQuery = useProfileChatThreads();
  const threads = threadsQuery.data || [];
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!activeId && threads[0]?.id) setActiveId(threads[0].id);
  }, [activeId, threads]);

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeId), [threads, activeId]);

  return (
    <div className="flex h-full min-w-0 flex-1 overflow-hidden">
      <ProfileChatList threads={threads} activeId={activeId} onSelect={setActiveId} />
      <ProfileChatWindow thread={activeThread} />
    </div>
  );
}
