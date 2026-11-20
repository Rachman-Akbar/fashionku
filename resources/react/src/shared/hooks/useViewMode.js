import { useCallback, useState } from "react";

export const VIEW_MODE_LIST = "list";
export const VIEW_MODE_GRID = "grid";
export const VIEW_MODE_CHART = "chart";
export const VIEW_MODE_VALUES = [VIEW_MODE_LIST, VIEW_MODE_GRID, VIEW_MODE_CHART];

function storageKeyFor(key) {
  return `panel.viewMode.${key}`;
}

export function useViewMode(key, fallback = VIEW_MODE_LIST) {
  const storageKey = storageKeyFor(key);
  const [viewMode, setViewModeState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return VIEW_MODE_VALUES.includes(stored) ? stored : fallback;
    } catch {
      return fallback;
    }
  });

  const setViewMode = useCallback(
    (next) => {
      if (!VIEW_MODE_VALUES.includes(next)) return;
      setViewModeState(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // localStorage bisa diblokir (mode privat / kebijakan browser).
      }
    },
    [storageKey],
  );

  return [viewMode, setViewMode];
}
