import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage } from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export async function getCodePatterns(params = {}) {
  const response = await apiClient.get("/api/v1/shared/code-patterns", { params });
  return unwrap(response);
}

export async function saveCodePatterns(payload) {
  const response = await apiClient.put("/api/v1/shared/code-patterns", payload);
  return unwrap(response);
}

export async function previewCodePattern(payload) {
  const response = await apiClient.post("/api/v1/shared/code-patterns/preview", payload);
  return unwrap(response);
}

export function useCodePatterns(options = {}) {
  const { store, isAuthenticated, activeRole } = useAuth();
  const storeId = store?.id || null;
  const isAdmin = activeRole === "admin";
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: ["shared.code-patterns", isAdmin, storeId],
    queryFn: () => getCodePatterns(isAdmin && storeId ? { store_id: storeId } : {}),
    enabled: enabled && Boolean(isAuthenticated),
    staleTime: 60_000,
    ...queryOptions,
  });
}

export function useSaveCodePatterns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCodePatterns,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared.code-patterns"] });
    },
  });
}

export function usePreviewCodePattern() {
  return useMutation({ mutationFn: previewCodePattern });
}

export function getCodePatternError(error) {
  return getApiMessage(error, "Rumus kode unik gagal disimpan.");
}

/**
 * Pratinjau rumus di sisi klien agar responsif.
 * Mengikuti aturan yang sama dengan CodePatternFormatter di backend.
 */
const TOKEN_DEFAULTS = {
  type: "SKU",
  name: "KECAPMANIS",
  brand: "RASA",
  category: "BUMBU",
  store: "ZIIP",
  movement: "MASUK",
  status: "RECEIVABLE",
  year: "26",
  month: "09",
  day: "27",
  date: "260927",
  time: "142530",
  datetime: "20260927142530",
};

export function renderCodePattern(pattern, context = {}, sequence = 1) {
  if (!pattern) return "";

  const rendered = pattern.replace(/\{([a-z_]+)(?::(\d+))?\}/gi, (_match, token, rawWidth) => {
    const key = token.toLowerCase();
    const width = rawWidth ? Math.max(1, Number(rawWidth)) : null;
    let value = "";

    if (key === "seq") value = String(sequence).padStart(width || 4, "0");
    else if (key === "rand") value = randomToken(width || 4);
    else value = codeToken(context[key] ?? TOKEN_DEFAULTS[key] ?? "");

    if (!value) return "X";
    if (width && key !== "seq" && key !== "rand") return String(value).slice(0, width).toUpperCase();
    return String(value).toUpperCase();
  });

  return rendered
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
}

/** Sama dengan CodePatternFormatter::token() di backend. */
export function codeToken(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "");
}

function randomToken(length) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let output = "";
  for (let index = 0; index < length; index += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
}
