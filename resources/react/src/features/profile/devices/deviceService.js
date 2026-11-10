import { apiClient } from "@/core/utils/apiClient";

const DEVICES_PATH = "/api/v1/identity/auth/devices";

export async function fetchDevices() {
  const response = await apiClient.get(DEVICES_PATH);
  return response.data;
}

export async function requestDeviceRemovalOtp(deviceId) {
  const response = await apiClient.post(`${DEVICES_PATH}/${deviceId}/request-removal-otp`);
  return response.data;
}

export async function removeDevice(deviceId, code) {
  const response = await apiClient.delete(`${DEVICES_PATH}/${deviceId}`, {
    data: { code },
  });
  return response.data;
}