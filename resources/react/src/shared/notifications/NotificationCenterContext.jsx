import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationCenterContext = createContext(null);
const QUEUE_STATUSES = ["processing", "waiting", "brief"];

function createItem(input = {}) {
  return {
    id: input.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: input.type || "info",
    title: input.title || "Informasi",
    message: input.message || "",
    status: input.status || "done",
    progress: Number.isFinite(input.progress) ? input.progress : null,
    createdAt: input.createdAt || new Date().toISOString(),
    actionLabel: input.actionLabel || "",
    onAction: input.onAction || null,
    secondaryActionLabel: input.secondaryActionLabel || "",
    onSecondaryAction: input.onSecondaryAction || null,
    brief: Boolean(input.brief),
    briefKey: input.briefKey || "",
    count: Number.isFinite(input.count) ? input.count : 1,
    expiresAt: input.expiresAt || null,
    briefTotal: Number.isFinite(input.briefTotal) ? input.briefTotal : 0,
  };
}

export function NotificationCenterProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("queue");
  const [openMode, setOpenMode] = useState("modal");
  const [panelOpenToken, setPanelOpenToken] = useState(0);

  const push = useCallback((input) => {
    const item = createItem(input);
    setItems((current) => [item, ...current].slice(0, 100));
    return item.id;
  }, []);

  const update = useCallback((id, values) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...values } : item));
  }, []);

  const remove = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback((tab) => {
    if (!tab) {
      setItems([]);
      return;
    }
    setItems((current) => current.filter((item) => {
      const queued = QUEUE_STATUSES.includes(item.status);
      if (tab === "queue") return item.status === "processing";
      return queued;
    }));
  }, []);

  const requestOpen = useCallback((next) => {
    if (next) setOpenMode("modal");
    setOpen(next);
  }, []);

  const openPanel = useCallback((tab = "queue") => {
    setOpenMode("panel");
    setActiveTab(tab);
    setOpen(true);
    setPanelOpenToken((current) => current + 1);
  }, []);

  const closePanel = useCallback(() => {
    setOpenMode((mode) => (mode === "panel" ? "modal" : mode));
    setOpen(false);
  }, []);

  const startTask = useCallback((input = {}) => {
    const id = push({ ...input, status: "processing", type: input.type || "queue" });
    setActiveTab("queue");
    return {
      id,
      success(message, extra = {}) {
        update(id, { status: "done", type: "success", message, progress: 100, ...extra });
      },
      fail(message, extra = {}) {
        update(id, { status: "failed", type: "error", message, progress: null, ...extra });
      },
      progress(progress, message) {
        update(id, { progress, ...(message ? { message } : {}) });
      },
    };
  }, [push, update]);

  const queueItems = useMemo(() => items.filter((item) => QUEUE_STATUSES.includes(item.status)), [items]);
  const infoItems = useMemo(() => items.filter((item) => !QUEUE_STATUSES.includes(item.status)), [items]);
  const clearableCount = useMemo(() => (activeTab === "queue"
    ? queueItems.filter((item) => item.status !== "processing").length
    : infoItems.length), [activeTab, infoItems.length, queueItems]);

  const value = useMemo(() => ({
    items,
    queueItems,
    infoItems,
    clearableCount,
    open,
    activeTab,
    openMode,
    setOpen: requestOpen,
    setOpenMode,
    setActiveTab,
    openPanel,
    closePanel,
    panelOpenToken,
    push,
    update,
    remove,
    clear,
    startTask,
  }), [activeTab, clear, clearableCount, closePanel, infoItems, items, open, openMode, openPanel, panelOpenToken, push, queueItems, remove, requestOpen, startTask, update]);

  return <NotificationCenterContext.Provider value={value}>{children}</NotificationCenterContext.Provider>;
}

export function useNotificationCenter() {
  const context = useContext(NotificationCenterContext);
  if (!context) throw new Error("useNotificationCenter harus digunakan di dalam NotificationCenterProvider");
  return context;
}
