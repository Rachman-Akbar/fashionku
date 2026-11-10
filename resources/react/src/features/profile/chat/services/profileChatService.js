import { useQuery } from "@tanstack/react-query";
import { unwrapCollection } from "@/core/utils/apiClient";
import { communicationRequest } from "@/features/communication/communicationApi";

function normalizeThread(thread = {}) {
  const messages = Array.isArray(thread.messages) ? thread.messages : [];
  const name = thread.store_name || thread.name || thread.title || thread.subject || "Percakapan";
  return {
    id: String(thread.id),
    store: name,
    name,
    initials: name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase(),
    avatar: "from-slate-500 to-slate-700",
    status: thread.status || "offline",
    lastMessage: thread.latest_message?.message || thread.last_message || messages.at(-1)?.message || messages.at(-1)?.text || "",
    unread: Number(thread.unread_count || 0),
    time: thread.updated_at ? new Date(thread.updated_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "",
    memberCount: Number(thread.member_count || thread.participants?.length || 0),
    messages: messages.map((message) => ({
      id: String(message.id),
      sender: message.sender_name || message.sender || "User",
      role: message.is_mine ? "me" : "store",
      text: message.message || message.text || "",
      time: message.created_at ? new Date(message.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "",
    })),
  };
}

async function getThreads(params = {}) {
  const payload = await communicationRequest("/conversations", { params });
  return unwrapCollection(payload).map(normalizeThread);
}

export function useProfileChatThreads() {
  return useQuery({
    queryKey: ["profile", "chat", "conversations"],
    queryFn: () => getThreads({ per_page: 100 }),
    staleTime: 30000,
  });
}

export function useGroupChatThreads() {
  return useQuery({
    queryKey: ["profile", "group-chat", "conversations"],
    queryFn: () => getThreads({ per_page: 100, type: "group" }),
    staleTime: 30000,
  });
}
