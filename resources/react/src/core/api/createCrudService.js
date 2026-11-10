import { apiClient, unwrapApiData, unwrapCollection } from "@/core/utils/apiClient";

export function createCrudService({
  listUrl,
  createUrl = listUrl,
  itemUrl = (id) => `${createUrl}/${id}`,
  normalize = (row) => row,
  serialize = (values) => values,
  listMethod = "get",
}) {
  return {
    async list(params = {}) {
      const response = await apiClient[listMethod](listUrl, { params });
      return unwrapCollection(response.data).map(normalize);
    },
    async create(values) {
      const response = await apiClient.post(createUrl, serialize(values));
      return normalize(unwrapApiData(response.data));
    },
    async update(id, values) {
      const response = await apiClient.put(itemUrl(id), serialize(values, true));
      return normalize(unwrapApiData(response.data));
    },
    async remove(id) {
      const response = await apiClient.delete(itemUrl(id));
      return response.data;
    },
  };
}
