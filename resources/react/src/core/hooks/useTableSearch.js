import { useDeferredValue, useMemo, useState } from "react";

export function useTableSearch(rows = [], keys = []) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const keySignature = keys.join("\u0000");
  const searchableKeys = useMemo(() => keySignature.split("\u0000").filter(Boolean), [keySignature]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) return rows;

    return rows.filter((row) => searchableKeys.some((key) => (
      String(row?.[key] ?? "")
        .toLowerCase()
        .includes(normalizedQuery)
    )));
  }, [deferredQuery, rows, searchableKeys]);

  return {
    query,
    setQuery,
    filteredRows,
    searching: query !== deferredQuery,
  };
}
