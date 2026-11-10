import { useCallback, useEffect, useRef } from "react";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { registerFeedbackSink } from "@/shared/utils/userFeedback";

const DEFAULT_BRIEF_MS = 2000;
const CLOSE_GRACE_MS = 120;

export function NotificationFeedbackBridge({ briefMs = DEFAULT_BRIEF_MS }) {
  const center = useNotificationCenter();
  const centerRef = useRef(center);
  const timersRef = useRef(new Map());
  const closeTimerRef = useRef(null);
  const seenIdsRef = useRef(null);
  const surfacedIdsRef = useRef(new Set());
  const handledIdsRef = useRef(new Set());

  centerRef.current = center;

  const clearTimer = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) window.clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      const live = centerRef.current;
      const hasRunning = live.queueItems.some((item) => item.status === "processing");
      if (live.open && live.openMode === "panel" && !hasRunning) {
        live.closePanel();
      }
    }, briefMs + CLOSE_GRACE_MS);
  }, [briefMs]);

  const showAsBriefQueue = useCallback((id) => {
    const live = centerRef.current;
    handledIdsRef.current.add(id);
    live.update(id, { status: "brief", brief: true, briefTotal: briefMs, expiresAt: Date.now() + briefMs });
    clearTimer(id);
    timersRef.current.set(id, window.setTimeout(() => {
      timersRef.current.delete(id);
      const current = centerRef.current;
      if (current.items.some((item) => item.id === id)) {
        current.update(id, { status: "done", brief: false, briefTotal: 0, expiresAt: null });
      }
    }, briefMs));
  }, [briefMs, clearTimer]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => registerFeedbackSink((payload) => {
    const current = centerRef.current;
    const key = `${payload.type}|${payload.title}|${payload.message}`.trim().toLowerCase();
    const existing = current.items.find((item) => item.brief && item.briefKey === key);

    const id = existing
      ? (current.update(existing.id, { count: (existing.count || 1) + 1, expiresAt: Date.now() + briefMs, briefTotal: briefMs }), existing.id)
      : current.push({
        type: payload.type,
        title: payload.title,
        message: payload.message,
        status: "brief",
        brief: true,
        briefKey: key,
        count: 1,
        expiresAt: Date.now() + briefMs,
        briefTotal: briefMs,
      });

    clearTimer(id);
    timersRef.current.set(id, window.setTimeout(() => {
      timersRef.current.delete(id);
      centerRef.current.remove(id);
    }, briefMs));

    current.openPanel("queue");
    scheduleClose();

    return true;
  }), [briefMs, clearTimer, scheduleClose]);

  useEffect(() => {
    const items = center.items;
    const seen = seenIdsRef.current;

    if (!seen) {
      seenIdsRef.current = new Set(items.map((item) => item.id));
      return;
    }

    const liveIds = new Set(items.map((item) => item.id));
    seen.forEach((id) => {
      if (liveIds.has(id)) return;
      seen.delete(id);
      surfacedIdsRef.current.delete(id);
      handledIdsRef.current.delete(id);
    });

    const fresh = items.filter((item) => !seen.has(item.id));
    fresh.forEach((item) => {
      seen.add(item.id);
      surfacedIdsRef.current.add(item.id);
    });

    const finished = items.filter((item) => surfacedIdsRef.current.has(item.id)
      && (item.status === "done" || item.status === "failed")
      && !handledIdsRef.current.has(item.id));

    const targets = [...fresh, ...finished];
    if (!targets.length) return;

    targets.forEach((item) => {
      if (item.status === "done") {
        showAsBriefQueue(item.id);
        return;
      }
      if (item.status === "failed") handledIdsRef.current.add(item.id);
    });

    const hasSucceeded = targets.some((item) => item.status === "done");
    const hasError = targets.some((item) => item.status === "failed");
    center.openPanel(hasSucceeded || !hasError ? "queue" : "info");
    scheduleClose();
  }, [center, center.items, showAsBriefQueue, scheduleClose]);

  return null;
}
