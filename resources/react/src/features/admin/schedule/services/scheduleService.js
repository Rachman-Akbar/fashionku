import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData } from "@/core/utils/apiClient";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const BASE_URL = "/api/v1/seller/schedules";

const keys = {
  all: ["admin", "schedules"],
  list: (params = {}) => ["admin", "schedules", "list", params],
};

function normalizeSchedule(row = {}) {
  return {
    id: Number(row.id || 0),
    title: row.title || "",
    description: row.description || "",
    type: row.type || "umum",
    status: row.status || (row.is_completed ? "done" : "todo"),
    priority: row.priority || "normal",
    color: row.color || "#10B981",
    date: row.date || "",
    startTime: row.start_time || row.startTime || "",
    endTime: row.end_time || row.endTime || "",
    isAllDay: Boolean(row.is_all_day ?? row.isAllDay),
    isActive: row.is_active !== false,
    isCompleted: Boolean(row.is_completed ?? row.isCompleted),
    capacity: Number(row.capacity ?? 1),
    assignee: row.assignee || "",
    label: row.label || "",
    position: Number(row.position ?? 0),
    recurrence: row.recurrence || "none",
    metadata: row.metadata && typeof row.metadata === "object" ? row.metadata : (typeof row.metadata === "string" ? (() => { try { return JSON.parse(row.metadata); } catch { return null; } })() : null),
    raw: row,
  };
}

function unwrapList(payload) {
  const body = payload?.data ?? payload ?? {};
  const data = body?.data ?? body;
  const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  const meta = body?.meta || data?.meta || payload?.meta || {};
  return { rows: rows.map(normalizeSchedule), meta };
}

export function getScheduleError(error, fallback = "Terjadi kesalahan pada jadwal.") {
  return getApiMessage(error, fallback);
}

export async function listSchedules(params = {}) {
  const response = await apiClient.get(BASE_URL, { params });
  return unwrapList(response.data);
}

export async function createSchedule(values) {
  const response = await apiClient.post(BASE_URL, values);
  return unwrapApiData(response.data);
}

export async function updateSchedule(id, values) {
  const response = await apiClient.put(`${BASE_URL}/${id}`, values);
  return unwrapApiData(response.data);
}

export async function removeSchedule(id) {
  await apiClient.delete(`${BASE_URL}/${id}`);
  return id;
}

export function useSchedules(params = {}) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => listSchedules(params),
    placeholderData: (previous) => previous,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      toastSuccess("Jadwal", "Jadwal berhasil ditambahkan.");
    },
    onError: (error) => toastError("Jadwal", getScheduleError(error, "Gagal menambahkan jadwal.")),
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => updateSchedule(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      toastSuccess("Jadwal", "Jadwal berhasil diperbarui.");
    },
    onError: (error) => toastError("Jadwal", getScheduleError(error, "Gagal memperbarui jadwal.")),
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      toastSuccess("Jadwal", "Jadwal berhasil dihapus.");
    },
    onError: (error) => toastError("Jadwal", getScheduleError(error, "Gagal menghapus jadwal.")),
  });
}
