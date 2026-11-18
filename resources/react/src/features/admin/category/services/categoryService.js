import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, unwrapCollection, unwrapApiData, getApiMessage } from "@/core/utils/apiClient";
import { toastSuccess, toastError } from "@/shared/utils/userFeedback";

const BASE_URL = "/api/v1/catalog/categories";

const keys = {
  list: ["admin", "categories"],
};

function normalizeCategory(row) {
  return {
    id: row.id ?? row.category_id,
    name: row.name || row.nama || "Kategori",
    slug: row.slug || row.full_slug || "",
    parentId: row.parent_id ?? row.parentId ?? null,
    sortOrder: Number(row.sort_order ?? row.sortOrder ?? 0),
    isActive: row.is_active !== false,
    isVisibleInMenu: row.is_visible_in_menu !== false,
    description: row.description || "",
    imageUrl: row.image_url || "",
    iconUrl: row.icon_url || "",
    productsCount: Number(row.products_count ?? 0),
    level: Number(row.level ?? 0),
    raw: row,
  };
}

export async function listCategories(params = {}) {
  try {
    const response = await apiClient.get(`${BASE_URL}/manage`, { params });
    return unwrapCollection(response.data).map(normalizeCategory);
  } catch {
    const response = await apiClient.get(BASE_URL, { params });
    return unwrapCollection(response.data).map(normalizeCategory);
  }
}

export async function createCategory(values) {
  const response = await apiClient.post(BASE_URL, values);
  return normalizeCategory(unwrapApiData(response.data));
}

export async function updateCategory(id, values) {
  const response = await apiClient.put(`${BASE_URL}/${id}`, values);
  return normalizeCategory(unwrapApiData(response.data));
}

export async function removeCategory(id) {
  await apiClient.delete(`${BASE_URL}/${id}`);
  return id;
}

export function useCategories(params = {}) {
  return useQuery({
    queryKey: [...keys.list, params],
    queryFn: () => listCategories(params),
    staleTime: 60000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      toastSuccess("Kategori", "Kategori berhasil ditambahkan.");
    },
    onError: (error) => toastError("Kategori", getApiMessage(error, "Gagal menambahkan kategori.")),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => updateCategory(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      toastSuccess("Kategori", "Kategori berhasil diperbarui.");
    },
    onError: (error) => toastError("Kategori", getApiMessage(error, "Gagal memperbarui kategori.")),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
      toastSuccess("Kategori", "Kategori berhasil dihapus.");
    },
    onError: (error) => toastError("Kategori", getApiMessage(error, "Gagal menghapus kategori.")),
  });
}
