import { apiClient, getApiMessage, unwrapApiData } from "@/core/utils/apiClient";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

export async function uploadMarketplaceImage(file, scope = "general") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("scope", scope);

  const response = await apiClient.post("/api/v1/catalog/media/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const data = unwrapApiData(response.data) || response.data?.data || {};
  return {
    path: data.path || "",
    url: resolveMediaUrl(data.url || data.public_path || data.path || ""),
    name: data.name || file.name,
    size: Number(data.size || file.size || 0),
    mimeType: data.mime_type || file.type || "",
  };
}

export function getMediaUploadError(error) {
  return getApiMessage(error, "Gambar gagal diunggah.");
}
