import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/utils/apiClient", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, apiClient: { get: vi.fn() } };
});

import { apiClient } from "@/core/utils/apiClient";
import { listUsersPage } from "@/features/admin/users/services/usersService";

const response = {
  data: {
    data: [
      { id: "u1", name: "Rangga", email: "rangga@example.com", is_active: true },
      { id: "u2", name: "Nadia", email: "nadia@example.com", is_active: false },
    ],
    meta: { current_page: 1, last_page: 1, per_page: 100, total: 98 },
  },
};

describe("listUsersPage", () => {
  beforeEach(() => {
    apiClient.get.mockReset();
    apiClient.get.mockResolvedValue(response);
  });

  it("mengembalikan baris pengguna beserta meta total dari API", async () => {
    const result = await listUsersPage({ per_page: 100 });
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0].name).toBe("Rangga");
    expect(result.meta.total).toBe(98);
  });

  it("memakai jumlah baris sebagai total bila meta tidak tersedia", async () => {
    apiClient.get.mockResolvedValue({ data: response.data.data });
    const result = await listUsersPage({ per_page: 100 });
    expect(result.meta.total).toBe(2);
  });
});
