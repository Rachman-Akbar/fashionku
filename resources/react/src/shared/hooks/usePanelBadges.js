import { useMemo } from "react";
import { useConversations, useTickets } from "@/features/advanced/services/advancedMarketplaceService";

export function useUnreadChatCount() {
  const conversations = useConversations({ per_page: 100 });
  return useMemo(
    () => (conversations.data?.rows || []).reduce((total, row) => total + Math.max(0, Number(row.unread_count || 0)), 0),
    [conversations.data],
  );
}

export function useUnreadHelpCount() {
  // Banyak peran (mis. admin) tidak punya akses endpoint tiket → 403 dan
  // request-nya mahal. Tanpa setelan ini setiap panel dibuka request 403
  // dikirim ulang dan menahan request lain di server dev single-thread.
  const tickets = useTickets(
    { per_page: 100, status: "open" },
    { retry: false, retryOnMount: false, staleTime: 5 * 60 * 1000 },
  );
  return useMemo(() => (tickets.data?.rows || []).length, [tickets.data]);
}

export function usePanelBadges(chatHref) {
  const chat = useUnreadChatCount();
  const help = useUnreadHelpCount();
  return {
    chatUnread: chat,
    helpUnread: help,
    badges: {
      ...(chatHref ? { [chatHref]: chat } : {}),
      "/admin/help": help,
      "/seller/help": help,
    },
  };
}
