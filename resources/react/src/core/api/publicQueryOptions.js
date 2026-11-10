export const PUBLIC_QUERY_REFRESH_MS = 30000;

// Shared options for public (non-authenticated) product/catalog queries.
// Tuned for lightness: cached data is kept fresh for a short window so
// navigating between marketplace pages does not re-download the whole
// catalog every time, while window focus / reconnect still refresh it.
// Do NOT poll in the background; add an explicit `refetchInterval` only to
// queries that genuinely need live updates (e.g. vouchers, PPOB balance).
export const publicQueryOptions = {
  staleTime: 60000,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: false,
  refetchIntervalInBackground: false,
};
