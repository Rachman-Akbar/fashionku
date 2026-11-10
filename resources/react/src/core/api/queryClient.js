import { QueryClient } from "@tanstack/react-query";

function shouldRetry(failureCount, error) {
  const status = Number(error?.response?.status || 0);

  if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
    return false;
  }

  return failureCount < 2;
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: shouldRetry,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
