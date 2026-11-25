import { describe, expect, it } from "vitest";
import { buildColumnFilterConfig, filterRowsByColumnFilters } from "@/shared/utils/columnFilters";

const rows = [
  { id: 1, name: "Kaos", price: 100, is_active: true, status: "published", created_at: "2025-01-01" },
  { id: 2, name: "Jaket", price: 250, is_active: false, status: "draft", created_at: "2025-02-01" },
  { id: 3, name: "Sepatu", price: 400, is_active: true, status: "published", created_at: "2025-03-01" },
];

const columns = [
  { key: "name", label: "Nama" },
  { key: "price", label: "Harga" },
  { key: "is_active", label: "Aktif" },
  { key: "status", label: "Status", filterType: "select" },
  { key: "created_at", label: "Dibuat" },
  { key: "actions", label: "Aksi", filterable: false },
];

describe("buildColumnFilterConfig", () => {
  it("memberi tipe teks, rentang, dan pilihan sesuai data", () => {
    const config = buildColumnFilterConfig(columns, rows);
    expect(config.types.name).toBe("text");
    expect(config.types.price).toBe("range");
    expect(config.types.is_active).toBe("select");
    expect(config.types.status).toBe("select");
    // Tanggal tetap difilter sebagai teks, bukan angka.
    expect(config.types.created_at).toBe("text");
    expect(config.types.actions).toBeUndefined();
  });

  it("mengisi opsi pilihan untuk kolom boolean dan kolom ber-options", () => {
    const config = buildColumnFilterConfig(columns, rows);
    expect(config.options.is_active.map((option) => option.value)).toEqual(["true", "false"]);
    expect(config.options.status.map((option) => option.value)).toEqual(["draft", "published"]);
  });
});

describe("filterRowsByColumnFilters", () => {
  const { types } = buildColumnFilterConfig(columns, rows);
  const getValue = (row, key) => row[key];

  it("tidak menyaring apa pun saat tidak ada filter aktif", () => {
    expect(filterRowsByColumnFilters(rows, { name: "" }, types, { getValue })).toHaveLength(3);
  });

  it("menyaring teks, rentang, dan pilihan sekaligus", () => {
    const result = filterRowsByColumnFilters(
      rows,
      { name: "a", price: { min: "150", max: "" }, is_active: "true" },
      types,
      { getValue },
    );
    expect(result.map((row) => row.name)).toEqual(["Sepatu"]);
  });

  it("melewati kolom yang sudah ditangani server", () => {
    const result = filterRowsByColumnFilters(rows, { name: "tidak-ada", price: { min: "150", max: "" } }, types, {
      getValue,
      excludeKeys: ["name"],
    });
    expect(result.map((row) => row.name)).toEqual(["Jaket", "Sepatu"]);
  });
});
