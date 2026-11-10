import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_WIDTH = 160;
const MIN_WIDTH = 88;
const MAX_WIDTH = 720;
const EMPTY_ORDER = [];

function clamp(value, min = MIN_WIDTH, max = MAX_WIDTH) {
  return Math.min(max, Math.max(min, Math.round(Number(value) || DEFAULT_WIDTH)));
}

function storageId(key) {
  return `ziip.table-layout.${String(key || "default")}`;
}

function safeRead(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageId(key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeWrite(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageId(key), JSON.stringify(value));
  } catch {
    return;
  }
}

function normalizeColumns(columns) {
  return columns
    .filter((column) => column && column.key)
    .map((column) => ({
      ...column,
      key: String(column.key),
      width: clamp(column.width || DEFAULT_WIDTH, column.minWidth || MIN_WIDTH, column.maxWidth || MAX_WIDTH),
    }));
}

export function useTableColumnLayout({ storageKey, columns, preferredOrder = EMPTY_ORDER }) {
  const normalizedColumns = useMemo(() => normalizeColumns(columns), [columns]);
  const columnMap = useMemo(() => new Map(normalizedColumns.map((column) => [column.key, column])), [normalizedColumns]);
  const validKeys = useMemo(() => normalizedColumns.map((column) => column.key), [normalizedColumns]);
  const initialRef = useRef(null);

  if (!initialRef.current) {
    const saved = safeRead(storageKey) || {};
    const savedOrder = Array.isArray(saved.order) ? saved.order.map(String) : [];
    const preferred = Array.isArray(preferredOrder) && preferredOrder.length ? preferredOrder.map(String) : savedOrder;
    const order = [...preferred.filter((key) => validKeys.includes(key)), ...validKeys.filter((key) => !preferred.includes(key))];
    const widths = {};
    normalizedColumns.forEach((column) => {
      widths[column.key] = clamp(saved.widths?.[column.key] ?? column.width, column.minWidth || MIN_WIDTH, column.maxWidth || MAX_WIDTH);
    });
    initialRef.current = { order, widths };
  }

  const [order, setOrder] = useState(initialRef.current.order);
  const [widths, setWidths] = useState(initialRef.current.widths);
  const [dragKey, setDragKey] = useState("");
  const [dropKey, setDropKey] = useState("");
  const resizeRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    setOrder((current) => [...current.filter((key) => validKeys.includes(key)), ...validKeys.filter((key) => !current.includes(key))]);
    setWidths((current) => {
      const next = {};
      normalizedColumns.forEach((column) => {
        next[column.key] = clamp(current[column.key] ?? column.width, column.minWidth || MIN_WIDTH, column.maxWidth || MAX_WIDTH);
      });
      return next;
    });
  }, [normalizedColumns, validKeys]);

  useEffect(() => {
    const timer = window.setTimeout(() => safeWrite(storageKey, { order, widths }), 160);
    return () => window.clearTimeout(timer);
  }, [order, storageKey, widths]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const orderedColumns = useMemo(
    () => order.map((key) => columnMap.get(key)).filter(Boolean),
    [columnMap, order],
  );

  const moveColumn = useCallback((sourceKey, targetKey) => {
    if (!sourceKey || !targetKey || sourceKey === targetKey) return;
    setOrder((current) => {
      const from = current.indexOf(sourceKey);
      const to = current.indexOf(targetKey);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      next.splice(from, 1);
      next.splice(to, 0, sourceKey);
      return next;
    });
  }, []);

  const applyOrder = useCallback((nextOrder = []) => {
    const requested = [...new Set((Array.isArray(nextOrder) ? nextOrder : []).map(String))].filter((key) => validKeys.includes(key));
    if (!requested.length) return;
    setOrder((current) => (current.length === requested.length && current.every((key, index) => key === requested[index]) ? current : requested));
  }, [validKeys]);

  const getHeaderProps = useCallback((key) => ({
    draggable: true,
    onDragStart: (event) => {
      setDragKey(key);
      setDropKey(key);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", key);
    },
    onDragOver: (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setDropKey(key);
    },
    onDrop: (event) => {
      event.preventDefault();
      const source = event.dataTransfer.getData("text/plain") || dragKey;
      moveColumn(source, key);
      setDragKey("");
      setDropKey("");
    },
    onDragEnd: () => {
      setDragKey("");
      setDropKey("");
    },
  }), [dragKey, moveColumn]);

  const startResize = useCallback((event, key) => {
    event.preventDefault();
    event.stopPropagation();
    const column = columnMap.get(key);
    if (!column) return;
    const startX = event.clientX;
    const startWidth = widths[key] || column.width || DEFAULT_WIDTH;
    resizeRef.current = { key, startX, startWidth, minWidth: column.minWidth || MIN_WIDTH, maxWidth: column.maxWidth || MAX_WIDTH };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (moveEvent) => {
      const state = resizeRef.current;
      if (!state) return;
      const nextWidth = clamp(state.startWidth + moveEvent.clientX - state.startX, state.minWidth, state.maxWidth);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setWidths((current) => current[state.key] === nextWidth ? current : { ...current, [state.key]: nextWidth });
      });
    };

    const onUp = () => {
      resizeRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  }, [columnMap, widths]);

  const resetWidth = useCallback((key) => {
    const column = columnMap.get(key);
    if (!column) return;
    setWidths((current) => ({ ...current, [key]: column.width || DEFAULT_WIDTH }));
  }, [columnMap]);

  const resetLayout = useCallback(() => {
    setOrder(validKeys);
    const next = {};
    normalizedColumns.forEach((column) => {
      next[column.key] = column.width || DEFAULT_WIDTH;
    });
    setWidths(next);
  }, [normalizedColumns, validKeys]);

  const getColumnStyle = useCallback((key) => {
    const width = widths[key] || columnMap.get(key)?.width || DEFAULT_WIDTH;
    return { width, minWidth: width, maxWidth: width };
  }, [columnMap, widths]);

  const totalWidth = useMemo(
    () => orderedColumns.reduce((total, column) => total + (widths[column.key] || column.width || DEFAULT_WIDTH), 0),
    [orderedColumns, widths],
  );

  return {
    orderedColumns,
    widths,
    dragKey,
    dropKey,
    getHeaderProps,
    getColumnStyle,
    startResize,
    resetWidth,
    resetLayout,
    applyOrder,
    totalWidth,
  };
}
