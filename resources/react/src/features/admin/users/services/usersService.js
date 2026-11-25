import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, unwrapCollection, unwrapApiData, getApiMessage } from "@/core/utils/apiClient";
import { toastSuccess, toastError } from "@/shared/utils/userFeedback";

const BASE_URL = "/api/v1/identity/users";

const keys = {
  list: ["admin", "users"],
};

function normalizeUser(row) {
  return {
    id: row.id ?? row.user_id,
    name: row.name || row.nama || "-",
    email: row.email || "",
    role: String(row.role ?? row.roles?.[0] ?? "buyer"),
    status: row.is_active === false ? "Nonaktif" : "Aktif",
    createdAt: row.created_at || null,
    raw: row,
  };
}

export async function listUsers(params = {}) {
  const response = await apiClient.get(BASE_URL, { params });
  return unwrapCollection(response.data).map(normalizeUser);
}

/**
 * Varian list yang tetap membawa `meta` (total baris) supaya toolbar bisa
 * menampilkan jumlah data di samping switch tab tampilan.
 */
function extractMeta(payload, rowCount) {
  const meta = payload?.meta || payload?.data?.meta || {};
  const total = Number(meta.total ?? payload?.total ?? rowCount);
  return {
    total: Number.isFinite(total) ? total : rowCount,
    current_page: Number(meta.current_page ?? 1) || 1,
    last_page: Number(meta.last_page ?? 1) || 1,
    per_page: Number(meta.per_page ?? rowCount) || rowCount,
  };
}

export async function listUsersPage(params = {}) {
  const response = await apiClient.get(BASE_URL, { params });
  const rows = unwrapCollection(response.data).map(normalizeUser);
  return { rows, meta: extractMeta(response.data, rows.length) };
}

export async function createUser(values) {
  const response = await apiClient.post(BASE_URL, values);
  return normalizeUser(unwrapApiData(response.data));
}

export async function updateUser(id, values) {
  const response = await apiClient.put(`${BASE_URL}/${id}`, values);
  return normalizeUser(unwrapApiData(response.data));
}

export async function removeUser(id) {
  await apiClient.delete(`${BASE_URL}/${id}`);
  return id;
}

export function useUsers(params = {}, options = {}) {
  return useQuery({
    queryKey: [...keys.list, params],
    queryFn: () => listUsers(params),
    staleTime: 60000,
    enabled: options.enabled !== false,
  });
}

export function useUsersPage(params = {}) {
  return useQuery({
    queryKey: [...keys.list, "page", params],
    queryFn: () => listUsersPage(params),
    staleTime: 60000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      toastSuccess("Pengguna", "Pengguna berhasil ditambahkan.");
    },
    onError: (error) => toastError("Pengguna", getApiMessage(error, "Gagal menambahkan pengguna.")),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => updateUser(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      toastSuccess("Pengguna", "Pengguna berhasil diperbarui.");
    },
    onError: (error) => toastError("Pengguna", getApiMessage(error, "Gagal memperbarui pengguna.")),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      toastSuccess("Pengguna", "Pengguna berhasil dihapus.");
    },
    onError: (error) => toastError("Pengguna", getApiMessage(error, "Gagal menghapus pengguna.")),
  });
}
