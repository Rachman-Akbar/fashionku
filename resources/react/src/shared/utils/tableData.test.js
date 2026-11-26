import { describe, expect, it } from "vitest";
import {
  buildRawColumns,
  formatTableValue,
  humanizeColumnKey,
  isColumnFilterEmpty,
  isEmptyValue,
  matchesColumnFilter,
  mergeColumns,
  normalizeFilterText,
  parseNumericValue,
  sortRowsBy,
  toComparableDate,
} from "@/shared/utils/tableData";

describe("tableData", () => {
  describe("humanizeColumnKey", () => {
    it("inserts spaces between camelCase words", () => {
      expect(humanizeColumnKey("productName")).toBe("Product Name");
    });

    it("replaces underscores and dashes with spaces", () => {
      expect(humanizeColumnKey("product_name")).toBe("Product Name");
      expect(humanizeColumnKey("is-active")).toBe("Is Active");
    });

    it("capitalizes the first letter of each word", () => {
      expect(humanizeColumnKey("jumlah penjualan")).toBe("Jumlah Penjualan");
    });

    it("handles empty input", () => {
      expect(humanizeColumnKey("")).toBe("");
      expect(humanizeColumnKey(null)).toBe("");
    });
  });

  describe("formatTableValue", () => {
    it("renders a dash for empty values", () => {
      expect(formatTableValue(null)).toBe("-");
      expect(formatTableValue(undefined)).toBe("-");
      expect(formatTableValue("")).toBe("-");
    });

    it("renders booleans in Indonesian", () => {
      expect(formatTableValue(true)).toBe("Ya");
      expect(formatTableValue(false)).toBe("Tidak");
    });

    it("renders arrays as joined labels", () => {
      expect(formatTableValue(["A", "B"])).toBe("A, B");
      expect(formatTableValue([])).toBe("-");
    });

    it("renders arrays of objects using a preferred field", () => {
      const rows = [{ name: "Merah" }, { code: "X1" }];
      expect(formatTableValue(rows)).toBe("Merah, X1");
    });

    it("renders objects using a preferred field", () => {
      expect(formatTableValue({ name: "Toko A" })).toBe("Toko A");
      expect(formatTableValue({ label: "Label" })).toBe("Label");
      expect(formatTableValue({ id: 7 })).toBe('{"id":7}');
    });

    it("stringifies primitive values", () => {
      expect(formatTableValue(42)).toBe("42");
    });
  });

  describe("buildRawColumns", () => {
    it("excludes system keys by default", () => {
      const columns = buildRawColumns([{ id: 1, name: "A", created_at: "x", raw: { market_price: 100 } }]);
      const rawKeys = columns.map((column) => column.rawKey);
      expect(rawKeys).toContain("market_price");
      expect(rawKeys).not.toContain("id");
      expect(rawKeys).not.toContain("created_at");
    });

    it("reads from row.raw when present", () => {
      const columns = buildRawColumns([{ name: "A", raw: { hidden_field: 1 } }]);
      const rawKeys = columns.map((column) => column.rawKey);
      expect(rawKeys).toContain("hidden_field");
    });

    it("respects omittedKeys", () => {
      const columns = buildRawColumns([{ secret: 1, name: "A" }], ["secret"]);
      const rawKeys = columns.map((column) => column.rawKey);
      expect(rawKeys).not.toContain("secret");
      expect(rawKeys).toContain("name");
    });

    it("shapes columns with a raw: prefix", () => {
      const [column] = buildRawColumns([{ name: "A" }]);
      expect(column.key).toBe("raw:name");
      expect(column.label).toBe("Name");
      expect(column.rawKey).toBe("name");
      expect(column.defaultVisible).toBe(false);
    });
  });

  describe("mergeColumns", () => {
    it("deduplicates raw columns already present in base columns", () => {
      const base = [{ key: "name", label: "Nama" }];
      const raw = [
        { key: "raw:name", rawKey: "name", label: "Name" },
        { key: "raw:sku", rawKey: "sku", label: "SKU" },
      ];
      const merged = mergeColumns(base, raw);
      expect(merged).toHaveLength(2);
      expect(merged.map((column) => column.rawKey)).toEqual(["name", "sku"]);
    });

    it("returns base columns normalized with rawKey when there are no raw columns", () => {
      const base = [{ key: "name", label: "Nama" }];
      expect(mergeColumns(base, [])).toEqual([{ key: "name", label: "Nama", rawKey: "name" }]);
    });
  });

  describe("matchesColumnFilter", () => {
    it("keeps all rows when the filter is empty", () => {
      expect(matchesColumnFilter("A", "", "text")).toBe(true);
      expect(matchesColumnFilter(5, { min: "", max: "" }, "range")).toBe(true);
    });

    it("matches text filters case-insensitively as substring", () => {
      expect(matchesColumnFilter("Sari Kelapa", "kelapa", "text")).toBe(true);
      expect(matchesColumnFilter("Sari Kelapa", "minyak", "text")).toBe(false);
    });

    it("matches select filters exactly, ignoring case", () => {
      expect(matchesColumnFilter("published", "Published", "select")).toBe(true);
      expect(matchesColumnFilter("draft", "published", "select")).toBe(false);
    });

    it("matches boolean values against select values", () => {
      expect(matchesColumnFilter(true, "active", "select")).toBe(true);
      expect(matchesColumnFilter(false, "active", "select")).toBe(false);
    });

    it("filters numeric ranges", () => {
      expect(matchesColumnFilter(45000, { min: "10000", max: "50000" }, "range")).toBe(true);
      expect(matchesColumnFilter(8000, { min: "10000", max: "50000" }, "range")).toBe(false);
      expect(matchesColumnFilter(60000, { min: "10000", max: "50000" }, "range")).toBe(false);
    });
  });


  describe("helper nilai filter", () => {
    it("menormalkan keyword (trim, spasi berlebih, huruf besar)", () => {
      expect(normalizeFilterText("  Kopi   Arabika  ")).toBe("kopi arabika");
      expect(normalizeFilterText(null)).toBe("");
    });

    it("membedakan filter kosong dan terisi", () => {
      expect(isColumnFilterEmpty("", "text")).toBe(true);
      expect(isColumnFilterEmpty("   ", "text")).toBe(true);
      expect(isColumnFilterEmpty({ min: "", max: "" }, "range")).toBe(true);
      expect(isColumnFilterEmpty({ min: "1", max: "" }, "range")).toBe(false);
      expect(isColumnFilterEmpty("a", "text")).toBe(false);
    });

    it("mengenali nilai kosong (null, string kosong, array kosong)", () => {
      expect(isEmptyValue(null)).toBe(true);
      expect(isEmptyValue(undefined)).toBe(true);
      expect(isEmptyValue("   ")).toBe(true);
      expect(isEmptyValue([])).toBe(true);
      expect(isEmptyValue(0)).toBe(false);
      expect(isEmptyValue(false)).toBe(false);
    });

    it("mengubah format rupiah/ribuan menjadi angka", () => {
      expect(parseNumericValue("Rp 1.500.000")).toBe(1500000);
      expect(parseNumericValue("1.500,50")).toBe(1500.5);
      expect(parseNumericValue("1500.50")).toBe(1500.5);
      expect(parseNumericValue("-2.000")).toBe(-2000);
      expect(parseNumericValue("Kopi")).toBeNull();
      expect(parseNumericValue(null)).toBeNull();
    });

    it("menormalkan tanggal dari berbagai format", () => {
      expect(toComparableDate("2026-11-25T08:30:00+07:00")).toBe("2026-11-25");
      expect(toComparableDate("25/11/2026")).toBe("2026-11-25");
      expect(toComparableDate("25-11-2026")).toBe("2026-11-25");
      expect(toComparableDate("25 Nov 2026")).toBe("2026-11-25");
      expect(toComparableDate("bukan tanggal")).toBeNull();
    });
  });

  describe("akurasi filter kolom", () => {
    it("mengabaikan spasi di awal/akhir keyword", () => {
      expect(matchesColumnFilter("Kopi Arabika", "  kopi  ", "text")).toBe(true);
    });

    it("mencocokkan teks tanpa membedakan huruf besar/kecil", () => {
      expect(matchesColumnFilter("Pesanan DIBATALKAN", "dibatalkan", "text")).toBe(true);
      expect(matchesColumnFilter("Pesanan DIBATALKAN", "DIBATALKAN", "text")).toBe(true);
    });

    it("mencocokkan angka yang tampil berformat rupiah", () => {
      expect(matchesColumnFilter(1500000, "Rp 1.500.000", "text")).toBe(true);
      expect(matchesColumnFilter(1500000, "1.500.000", "text")).toBe(true);
      expect(matchesColumnFilter(1500000, "1.400.000", "text")).toBe(false);
    });

    it("mencocokkan tanggal yang tampil dalam format lokal", () => {
      expect(matchesColumnFilter("2026-11-25T08:30:00+07:00", "25/11/2026", "text")).toBe(true);
      expect(matchesColumnFilter("25/11/2026", "2026-11-25", "text")).toBe(true);
      expect(matchesColumnFilter("25/11/2026", "24/11/2026", "text")).toBe(false);
    });

    it("tidak membuang baris bernilai null saat filter rentang angka", () => {
      // Number(null) = 0 sebelumnya membuat baris kosong ikut lolos filter.
      expect(matchesColumnFilter(null, { min: "0", max: "" }, "range")).toBe(false);
      expect(matchesColumnFilter(undefined, { min: "", max: "100" }, "range")).toBe(false);
      expect(matchesColumnFilter("", { min: "0", max: "" }, "range")).toBe(false);
      expect(matchesColumnFilter(50, { min: "0", max: "" }, "range")).toBe(true);
    });

    it("menerima batas rentang berformat ribuan", () => {
      expect(matchesColumnFilter(1500000, { min: "1.000.000", max: "2.000.000" }, "range")).toBe(true);
      expect(matchesColumnFilter(900000, { min: "1.000.000", max: "" }, "range")).toBe(false);
    });

    it("mencocokkan pilihan boolean dengan label apa pun", () => {
      expect(matchesColumnFilter(true, "true", "select")).toBe(true);
      expect(matchesColumnFilter(true, "Aktif", "select")).toBe(true);
      expect(matchesColumnFilter(true, "Ya", "select")).toBe(true);
      expect(matchesColumnFilter(false, "Nonaktif", "select")).toBe(true);
      expect(matchesColumnFilter(false, "Tidak", "select")).toBe(true);
      expect(matchesColumnFilter(true, "Nonaktif", "select")).toBe(false);
    });

    it("mencocokkan pilihan teks tanpa membedakan huruf besar/kecil dan spasi", () => {
      expect(matchesColumnFilter("published", " Published ", "select")).toBe(true);
      expect(matchesColumnFilter("draft", "published", "select")).toBe(false);
    });

    it("dapat menyaring sel kosong lewat tanda '-' atau (Kosong)", () => {
      expect(matchesColumnFilter(null, "-", "text")).toBe(true);
      expect(matchesColumnFilter("", "(Kosong)", "text")).toBe(true);
      expect(matchesColumnFilter("", "__empty__", "text")).toBe(true);
      expect(matchesColumnFilter("Ada isi", "-", "text")).toBe(false);
    });

    it("aman untuk karakter khusus", () => {
      expect(matchesColumnFilter("Diskon 50% + bonus", "50%", "text")).toBe(true);
      expect(matchesColumnFilter("Harga (promo)", "(", "text")).toBe(true);
      expect(matchesColumnFilter("Kopi", "'; DROP TABLE users; --", "text")).toBe(false);
    });
  });

  describe("sortRowsBy lanjutan", () => {
    const valueOf = (row, key) => row[key];

    it("mengurutkan tanggal ISO dengan benar", () => {
      const rows = [{ at: "2026-11-25T08:30:00+07:00" }, { at: "2026-11-02T11:00:00+07:00" }, { at: "2026-11-18T09:30:00+07:00" }];
      expect(sortRowsBy(rows, "at", "asc", valueOf).map((row) => row.at.slice(0, 10))).toEqual(["2026-11-02", "2026-11-18", "2026-11-25"]);
    });

    it("menaruh nilai kosong di urutan terakhir", () => {
      const rows = [{ v: 5 }, { v: null }, { v: 1 }, { v: "" }];
      expect(sortRowsBy(rows, "v", "asc", valueOf).map((row) => row.v)).toEqual([1, 5, null, ""]);
    });

    it("mengurutkan angka berformat ribuan secara numerik", () => {
      const rows = [{ v: "1.500" }, { v: "900" }, { v: "12.000" }];
      expect(sortRowsBy(rows, "v", "asc", valueOf).map((row) => row.v)).toEqual(["900", "1.500", "12.000"]);
    });
  });

  describe("sortRowsBy", () => {
    const valueOf = (row, key) => row[key];

    it("sorts numbers ascending and descending", () => {
      const rows = [{ price: 3 }, { price: 1 }, { price: 2 }];
      expect(sortRowsBy(rows, "price", "asc", valueOf).map((row) => row.price)).toEqual([1, 2, 3]);
      expect(sortRowsBy(rows, "price", "desc", valueOf).map((row) => row.price)).toEqual([3, 2, 1]);
    });

    it("sorts text using Indonesian locale", () => {
      const rows = [{ name: "B" }, { name: "a" }, { name: "C" }];
      expect(sortRowsBy(rows, "name", "asc", valueOf).map((row) => row.name)).toEqual(["a", "B", "C"]);
    });

    it("returns rows unchanged when no sort key is given", () => {
      const rows = [{ price: 2 }, { price: 1 }];
      expect(sortRowsBy(rows, null, "asc", valueOf)).toBe(rows);
    });
  });
});