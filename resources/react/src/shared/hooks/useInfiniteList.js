import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

function defaultGetNextPageParam(lastPage) {
  const meta = lastPage?.meta || {};
  const current = Number(meta.current_page || 1);
  const last = Number(meta.last_page || meta.total_pages || 1);
  if (!Number.isFinite(current) || !Number.isFinite(last)) return undefined;
  return current < last ? current + 1 : undefined;
}

function dedupeRows(pages) {
  const seen = new Set();
  const rows = [];
  pages.forEach((page) => {
    (page?.rows || []).forEach((row) => {
      const key = row?.id ?? row?.orderId ?? row?.order_id;
      if (key !== undefined && key !== null) {
        const normalized = String(key);
        if (seen.has(normalized)) return;
        seen.add(normalized);
      }
      rows.push(row);
    });
  });
  return rows;
}

export function useInfiniteList({
  queryKey,
  queryFn,
  params = {},
  enabled = true,
  staleTime,
  gcTime,
  perPage,
  getNextPageParam,
  initialPage = 1,
  placeholderData,
}) {
  const page = Number(params?.page) || initialPage;
  const restParams = useMemo(() => {
    if (!params || params.page === undefined) return params || {};
    const clone = { ...params };
    delete clone.page;
    return clone;
  }, [params]);

  const resolvedPerPage = perPage || restParams.per_page;

  const query = useInfiniteQuery({
    queryKey: [...queryKey, params],
    queryFn: ({ pageParam = page }) =>
      queryFn({
        ...restParams,
        page: pageParam,
        ...(resolvedPerPage ? { per_page: resolvedPerPage } : {}),
      }),
    initialPageParam: page,
    getNextPageParam: getNextPageParam || defaultGetNextPageParam,
    enabled,
    staleTime,
    gcTime,
    placeholderData,
  });

  const data = useMemo(() => {
    if (!query.data) return undefined;
    const pages = query.data.pages || [];
    const firstPage = pages[0] || {};
    const extra = {};
    Object.keys(firstPage).forEach((key) => {
      if (!["rows", "meta", "page"].includes(key)) extra[key] = firstPage[key];
    });
    return {
      rows: dedupeRows(pages),
      meta: pages[pages.length - 1]?.meta || {},
      ...extra,
    };
  }, [query.data]);

  return { ...query, data, rows: data?.rows || [], meta: data?.meta || {} };
}
