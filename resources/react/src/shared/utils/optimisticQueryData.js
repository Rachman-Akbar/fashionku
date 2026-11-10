function updateRow(row, id, updater) {
  if (!row || typeof row !== "object") return row;
  if (String(row.id) !== String(id)) return row;
  return updater(row);
}

export function updateEntityInQueryData(data, id, updater) {
  if (Array.isArray(data)) {
    return data.map((row) => updateRow(row, id, updater));
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data.pages)) {
    return {
      ...data,
      pages: data.pages.map((page) => updateEntityInQueryData(page, id, updater)),
    };
  }

  if (Array.isArray(data.rows)) {
    return {
      ...data,
      rows: data.rows.map((row) => updateRow(row, id, updater)),
    };
  }

  if (Array.isArray(data.data)) {
    return {
      ...data,
      data: data.data.map((row) => updateRow(row, id, updater)),
    };
  }

  if (String(data.id) === String(id)) {
    return updater(data);
  }

  return data;
}

export async function beginOptimisticEntityUpdate(queryClient, queryKey, id, updater) {
  await queryClient.cancelQueries({ queryKey });
  const snapshots = queryClient.getQueriesData({ queryKey });

  snapshots.forEach(([key, data]) => {
    queryClient.setQueryData(key, updateEntityInQueryData(data, id, updater));
  });

  return { snapshots };
}

export function rollbackOptimisticEntityUpdate(queryClient, context) {
  (context?.snapshots || []).forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
  });
}

export function mergeOptimisticValues(row, values = {}) {
  const isActive = values.isActive ?? values.is_active;
  const next = {
    ...row,
    ...values,
  };

  if (isActive !== undefined) {
    next.isActive = Boolean(isActive);
    next.is_active = Boolean(isActive);
    next.raw = {
      ...(row.raw || {}),
      is_active: Boolean(isActive),
    };
  }

  return next;
}
