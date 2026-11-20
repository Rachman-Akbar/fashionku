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
  const tickets = useTickets({ per_page: 100, status: "open" });
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
