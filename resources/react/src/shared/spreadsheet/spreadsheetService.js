import { apiClient, getApiMessage } from "@/core/utils/apiClient";

const MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function filenameFromHeaders(headers, fallback) {
  const disposition = headers?.["content-disposition"] || "";
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  return decodeURIComponent(encoded || plain || fallback);
}

async function normalizeBlobError(error, fallback) {
  const blob = error?.response?.data;

  if (blob instanceof Blob) {
    try {
      const text = await blob.text();
      const payload = JSON.parse(text || "{}");
      const message = payload?.message || payload?.error || fallback;
      const normalized = new Error(message);
      normalized.cause = error;
      return normalized;
    } catch {
      return new Error(fallback);
    }
  }

  return error;
}

async function requestBlob(request, fallback) {
  try {
    return await request();
  } catch (error) {
    throw await normalizeBlobError(error, fallback);
  }
}

async function assertSpreadsheetResponse(response, fallback) {
  const contentType = String(response?.headers?.["content-type"] || "").toLowerCase();
  const blob = response?.data;

  if (contentType.includes("application/json") && blob instanceof Blob) {
    const text = await blob.text();
    const payload = JSON.parse(text || "{}");
    throw new Error(payload?.message || payload?.error || fallback);
  }

  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error(fallback);
  }

  return response;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadSpreadsheetTemplate(module) {
  const response = await requestBlob(
    () => apiClient.get(`/api/v1/catalog/spreadsheets/${module}/template`, {
      responseType: "blob",
      params: { download: Date.now() },
      headers: {
        Accept: MIME_XLSX,
        "Cache-Control": "no-cache",
      },
    }),
    "Template Excel gagal dibuat oleh backend.",
  );
  await assertSpreadsheetResponse(response, "Template Excel kosong atau gagal dibuat oleh backend.");
  const filename = filenameFromHeaders(response.headers, `${module}-template.xlsx`);
  downloadBlob(new Blob([response.data], { type: MIME_XLSX }), filename);
  return filename;
}

export async function exportSpreadsheet(module, ids = []) {
  const response = await requestBlob(
    () => apiClient.post(
      `/api/v1/catalog/spreadsheets/${module}/export`,
      { ids },
      {
        responseType: "blob",
        headers: { Accept: MIME_XLSX },
      },
    ),
    "File export Excel gagal dibuat oleh backend.",
  );
  await assertSpreadsheetResponse(response, "File export Excel kosong atau gagal dibuat oleh backend.");
  const filename = filenameFromHeaders(response.headers, `${module}-export.xlsx`);
  downloadBlob(new Blob([response.data], { type: MIME_XLSX }), filename);
  return { filename, count: ids.length };
}

export async function previewSpreadsheetImport(module, file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("import_mode", options.importMode || "create");
  const response = await apiClient.post(`/api/v1/catalog/spreadsheets/${module}/import/preview`, formData);
  return response.data?.data || { total_rows: 0, requires_confirmation: false, can_continue: true, missing_relations: [], blocking_relations: [] };
}

export async function importSpreadsheet(module, file, onUploadProgress, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("import_mode", options.importMode || "create");
  formData.append("create_missing_relations", options.createMissingRelations ? "1" : "0");

  let response;
  try {
    response = await apiClient.post(`/api/v1/catalog/spreadsheets/${module}/import`, formData, {
      responseType: "blob",
      onUploadProgress,
    });
  } catch (error) {
    throw await normalizeBlobError(error, "Proses import Excel gagal.");
  }

  const contentType = String(response.headers?.["content-type"] || "");
  const successCount = Number(response.headers?.["x-import-success-count"] || 0);
  const errorCount = Number(response.headers?.["x-import-error-count"] || 0);

  if (contentType.includes("application/json")) {
    const text = await response.data.text();
    const payload = JSON.parse(text || "{}");
    return {
      successCount: Number(payload?.data?.success_count || 0),
      errorCount: Number(payload?.data?.error_count || 0),
      message: payload?.message || "Import selesai.",
      errorFile: false,
    };
  }

  const filename = filenameFromHeaders(response.headers, `${module}-import-error.xlsx`);
  downloadBlob(new Blob([response.data], { type: MIME_XLSX }), filename);
  return {
    successCount,
    errorCount,
    message: `${successCount} data berhasil dan ${errorCount} data gagal. File error otomatis diunduh.`,
    errorFile: true,
    filename,
  };
}

export async function bulkDeleteSpreadsheet(module, ids) {
  const response = await apiClient.post(`/api/v1/catalog/spreadsheets/${module}/bulk-delete`, { ids });
  return response.data?.data || { deleted_count: ids.length };
}

export function getSpreadsheetError(error) {
  return getApiMessage(error, error?.message || "Proses Excel gagal.");
}
