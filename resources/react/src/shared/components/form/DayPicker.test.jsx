import { describe, expect, it } from "vitest";
import { compactRange, parseDays } from "./DayPicker";

describe("parseDays", () => {
  it("mengurai hari individual", () => {
    expect(parseDays("Senin, Selasa, Jumat")).toEqual(["senin", "selasa", "jumat"]);
  });

  it("mengurai rentang dan memperluas hari tengah", () => {
    expect(parseDays("Senin - Rabu")).toEqual(["senin", "selasa", "rabu"]);
    expect(parseDays("Sabtu - Minggu")).toEqual(["sabtu", "minggu"]);
  });

  it("mengembalikan kosong untuk nilai kosong", () => {
    expect(parseDays("")).toEqual([]);
    expect(parseDays(null)).toEqual([]);
  });

  it("abaikan separator yang tidak dikenal", () => {
    expect(parseDays("kamus, jumat")).toEqual(["jumat"]);
  });
});

describe("compactRange", () => {
  it("meringkas hari berurutan menjadi rentang", () => {
    expect(compactRange(["senin", "selasa", "rabu", "jumat"])).toBe("Senin - Rabu, Jumat");
  });

  it("round-trip rentang penuh", () => {
    expect(compactRange(parseDays("Senin - Jumat"))).toBe("Senin - Jumat");
  });

  it("mempertahankan hari terpisah", () => {
    expect(compactRange(["senin", "rabu", "jumat"])).toBe("Senin, Rabu, Jumat");
  });

  it("kosong untuk tanpa hari", () => {
    expect(compactRange([])).toBe("");
  });
});
