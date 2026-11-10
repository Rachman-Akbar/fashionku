import { useCallback, useEffect, useMemo, useState } from "react";

function defaultGetRowId(row) {
  return row.id;
}

function equalSets(left, right) {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
}

export function useTableSelection(rows = [], getRowId = defaultGetRowId) {
  const [enabled, setEnabled] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const rowIds = useMemo(
    () => rows.map((row) => String(getRowId(row))).filter(Boolean),
    [getRowId, rows],
  );

  useEffect(() => {
    setSelectedIds((current) => {
      const allowed = new Set(rowIds);
      const next = new Set([...current].filter((id) => allowed.has(id)));
      return equalSets(current, next) ? current : next;
    });
  }, [rowIds]);

  const toggleEnabled = useCallback(() => {
    setEnabled((current) => {
      if (current) setSelectedIds(new Set());
      return !current;
    });
  }, []);

  const toggleRow = useCallback((id) => {
    const key = String(id);
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const allSelected = Boolean(rowIds.length && rowIds.every((id) => selectedIds.has(id)));

  const toggleAll = useCallback(() => {
    setSelectedIds((current) => {
      const all = rowIds.length > 0 && rowIds.every((id) => current.has(id));
      return all ? new Set() : new Set(rowIds);
    });
  }, [rowIds]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);
  const selectedRows = useMemo(
    () => rows.filter((row) => selectedIds.has(String(getRowId(row)))),
    [getRowId, rows, selectedIds],
  );

  return {
    enabled,
    selectedIds,
    selectedRows,
    selectedCount: selectedIds.size,
    allSelected,
    toggleEnabled,
    toggleRow,
    toggleAll,
    clear,
  };
}
