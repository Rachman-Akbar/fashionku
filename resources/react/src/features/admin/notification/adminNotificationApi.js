import { apiClient } from "@/core/utils/apiClient";

const PREFIX = "/api/v1/admin/notifications";

export async function fetchAdminNotifications(params = {}) {
  const response = await apiClient.get(PREFIX, { params });
  const body = response.data || {};

  return {
    items: Array.isArray(body.data) ? body.data : [],
    state: body.state || null,
    meta: body.meta || null,
  };
}

export async function fetchAdminNotificationState() {
  const response = await apiClient.get(`${PREFIX}/state`);
  const body = response.data || {};

  return body.data || { unread_count: 0, module_counts: {} };
}

export async function markAdminNotificationRead(id) {
  const response = await apiClient.post(`${PREFIX}/${id}/read`);

  return response.data || {};
}

export async function markAllAdminNotificationsRead(module = null) {
  const response = await apiClient.post(
    `${PREFIX}/read-all`,
    module ? { module } : {},
  );

  return response.data || {};
}

export async function deleteAdminNotification(id) {
  const response = await apiClient.delete(`${PREFIX}/${id}`);

  return response.data || {};
}

export async function deleteAllAdminNotifications(module = null) {
  const response = await apiClient.delete(PREFIX, {
    data: module ? { module } : {},
  });

  return response.data || {};
}