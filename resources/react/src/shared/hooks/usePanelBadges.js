import { useMemo, useSyncExternalStore } from "react";
import { useConversations, useTickets, useFinance, useManageableProducts, useRawMaterialCostImpacts } from "@/features/advanced/services/advancedMarketplaceService";
import { useSellerProducts } from "@/features/seller/product/services/sellerProductService";
import { useSchedules } from "@/features/admin/schedule/services/scheduleService";
import { getHppLastSeen, subscribeHppSeen } from "@/shared/utils/hppSeen";

const DUE_SOON_DAYS = 3;
const HPP_NEW_WINDOW_MS = 7 * 86_400_000;

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

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysUntil(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - startOfToday().getTime()) / 86_400_000);
}

function isWithinDays(dateValue, maxDays) {
  const diff = daysUntil(dateValue);
  return diff !== null && diff >= 0 && diff <= maxDays;
}

/**
 * Badge sidebar/menu:
 * - chat belum dibaca & tiket bantuan terbuka (seluruh peran),
 * - stok menipis / perlu restock (produk dengan stok habis atau <= minimum),
 * - keuangan (piutang/hutang) yang jatuh tempo dalam 3 hari,
 * - jadwal yang belum selesai dalam 3 hari.
 */
export function usePanelBadges(chatHref) {
  const isAdmin = String(chatHref || "").startsWith("/admin");
  const chat = useUnreadChatCount();
  const help = useUnreadHelpCount();

  const sellerProducts = useSellerProducts({ per_page: 100 });
  const adminProducts = useManageableProducts({ per_page: 100, is_active: true });
  const finance = useFinance({ per_page: 100 });
  const schedules = useSchedules({ per_page: 100 });
  const hppImpacts = useRawMaterialCostImpacts({ per_page: 100 });

  const hppLastSeen = useSyncExternalStore(subscribeHppSeen, getHppLastSeen, () => 0);

  const lowStock = useMemo(() => {
    const rows = isAdmin ? (adminProducts.data?.rows || []) : (sellerProducts.rows || []);
    return rows.filter((product) => {
      const stock = Number(product.stock ?? 0);
      const minimum = Number(product.minStock ?? product.min_stock ?? product.minimum_stock ?? 0);
      return stock <= 0 || (minimum > 0 && stock <= minimum);
    }).length;
  }, [isAdmin, adminProducts.data, sellerProducts.rows]);

  const financeDue = useMemo(
    () => (finance.rows || []).filter((row) => {
      const status = String(row.status || "").toLowerCase();
      if (["paid", "cancelled"].includes(status)) return false;
      if (!(Number(row.outstanding_amount) > 0)) return false;
      return isWithinDays(row.due_date, DUE_SOON_DAYS);
    }).length,
    [finance.rows],
  );

  const scheduleDue = useMemo(
    () => (schedules.data?.rows || []).filter((item) => (
      item.isActive && !item.isCompleted && isWithinDays(item.date, DUE_SOON_DAYS)
    )).length,
    [schedules.data],
  );

  // Badge "data baru" Laporan HPP: catatan perubahan HPP yang lebih baru dari
  // penanda terakhir dilihat (dan dalam 7 hari terakhir). Penanda di-reset saat
  // laporan dibuka atau notifikasi dikosongkan.
  const hppNew = useMemo(() => {
    const now = Date.now();
    const baseline = hppLastSeen || (now - HPP_NEW_WINDOW_MS);
    return (hppImpacts.data?.rows || []).filter((row) => {
      const when = row.occurred_at ? new Date(row.occurred_at).getTime() : 0;
      return Number.isFinite(when) && when > baseline && when <= now;
    }).length;
  }, [hppImpacts.data, hppLastSeen]);

  const badges = {
    ...(chatHref ? { [chatHref]: chat } : {}),
    "/admin/help": help,
    "/admin/stock": isAdmin ? lowStock : 0,
    "/seller/stock": isAdmin ? 0 : lowStock,
    "/admin/cashflow": isAdmin ? financeDue : 0,
    "/seller/cashflow": isAdmin ? 0 : financeDue,
    "/seller/receivables-payables": isAdmin ? 0 : financeDue,
    "/admin/planner": isAdmin ? scheduleDue : 0,
    "/admin/hpp-report": isAdmin ? hppNew : 0,
    "/seller/hpp-report": isAdmin ? 0 : hppNew,
  };

  return {
    chatUnread: chat,
    helpUnread: help,
    lowStock,
    financeDue,
    scheduleDue,
    hppNew,
    badges,
  };
}