import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getEcho, subscribeEchoStatus } from "@/core/realtime/echo";
import {
  fetchAdminNotifications,
  fetchAdminNotificationState,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification,
} from "./adminNotificationApi";

const CHANNEL_SUFFIX = ".notifications";
const CREATED_EVENT = ".admin.notification.created";
const PAGE_SIZE = 20;

function normalizeEvent(event = {}) {
  return {
    id: event.id,
    module: event.module || "",
    type: event.type || "",
    title: event.title || "Notifikasi",
    message: event.message || "",
    url: event.url || null,
    reference_type: event.reference_type || null,
    reference_id: event.reference_id ?? null,
    actor: event.actor || null,
    read_at: event.read_at || null,
    created_at: event.created_at || new Date().toISOString(),
  };
}

function bumpModule(counts, module, delta) {
  const next = { ...(counts || {}) };
  if (!module) return next;
  next[module] = Math.max(0, (next[module] || 0) + delta);
  return next;
}

/**
 * Notifikasi admin realtime yang ringan:
 * - Memuat state + daftar notifikasi sekali saat master (tanpa polling).
 * - Berlangganan channel privat `admin.{userId}.notifications` via Reverb.
 * - Event `admin.notification.created` langsung memperbarui badge & daftar.
 * - Data halaman lain tidak ikut ter-reload; admin refresh manual bila perlu.
 */
export function useAdminNotifications() {
  const { user, isAuthenticated } = useAuth();
  const userId = isAuthenticated && user?.id ? String(user.id) : "";

  const [items, setItems] = useState([]);
  const [state, setState] = useState({ unread_count: 0, module_counts: {} });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!userId) return;
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        const [list, nextState] = await Promise.all([
          fetchAdminNotifications({ per_page: PAGE_SIZE }),
          fetchAdminNotificationState(),
        ]);
        setItems(Array.isArray(list.items) ? list.items : []);
        if (nextState) {
          setState({
            unread_count: Number(nextState.unread_count) || 0,
            module_counts: nextState.module_counts || {},
          });
        }
      } catch (err) {
        setError(
          err?.response?.data?.message || "Gagal memuat notifikasi.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!userId) return undefined;
    const echo = getEcho();
    if (!echo) return undefined;

    const channelName = `admin.${userId}${CHANNEL_SUFFIX}`;
    const channel = echo.private(channelName);

    const handleChange = (event) => {
      const item = normalizeEvent(event);
      const delta = item.read_at ? 0 : 1;

      setItems((current) =>
        [
          item,
          ...current.filter((row) => String(row.id) !== String(item.id)),
        ].slice(0, 100),
      );
      setState((current) => ({
        unread_count: Math.max(0, (current.unread_count || 0) + delta),
        module_counts: delta
          ? bumpModule(current.module_counts, item.module, 1)
          : current.module_counts || {},
      }));
    };

    channel.listen(CREATED_EVENT, handleChange);
    const unsubscribeStatus = subscribeEchoStatus((status) =>
      setConnected(status === "connected"),
    );

    return () => {
      if (typeof unsubscribeStatus === "function") unsubscribeStatus();
      try {
        echo.leave(channelName);
      } catch {
        // noop: channel mungkin sudah ditutup saat unmount.
      }
    };
  }, [userId]);

  const refresh = useCallback(() => load({ silent: true }), [load]);

  const markRead = useCallback(async (id) => {
    try {
      const result = await markAdminNotificationRead(id);
      setItems((current) =>
        current.map((row) =>
          String(row.id) === String(id)
            ? { ...row, read_at: result?.data?.read_at || new Date().toISOString() }
            : row,
        ),
      );
      if (result?.state) {
        setState({
          unread_count: Number(result.state.unread_count) || 0,
          module_counts: result.state.module_counts || {},
        });
      }
    } catch {
      // noop: biarkan state lama bila gagal.
    }
  }, []);

  const markAllRead = useCallback(async (module = null) => {
    try {
      const result = await markAllAdminNotificationsRead(module);
      const now = new Date().toISOString();
      setItems((current) =>
        current.map((row) =>
          (!module || row.module === module) && !row.read_at
            ? { ...row, read_at: now }
            : row,
        ),
      );
      const data = result?.data || {};
      setState({
        unread_count: Number(data.unread_count) || 0,
        module_counts: data.module_counts || {},
      });
    } catch {
      // noop
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await deleteAdminNotification(id);
      setItems((current) => current.filter((row) => String(row.id) !== String(id)));
    } catch {
      // noop
    }
  }, []);

  return {
    userId,
    connected,
    items,
    state,
    loading,
    refreshing,
    error,
    unreadCount: state.unread_count || 0,
    refresh,
    markRead,
    markAllRead,
    deleteNotification,
  };
}