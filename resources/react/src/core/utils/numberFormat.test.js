import { describe, expect, it } from "vitest";
import { formatCompactNumber, formatDate, formatPercent } from "@/core/utils/numberFormat";
import { formatPrice } from "@/shared/utils/utils";

describe("numberFormat", () => {
  describe("formatCompactNumber", () => {
    it("formats thousands", () => {
      expect(formatCompactNumber(1500)).toBe("1.5rb");
      expect(formatCompactNumber(2500)).toBe("2.5rb");
    });

    it("formats millions as jt", () => {
      expect(formatCompactNumber(1000000)).toBe("1.0jt");
      expect(formatCompactNumber(1500000)).toBe("1.5jt");
    });

    it("formats billions as M", () => {
      expect(formatCompactNumber(1000000000)).toBe("1.0M");
      expect(formatCompactNumber(2500000000)).toBe("2.5M");
    });

    it("returns plain string for small numbers", () => {
      expect(formatCompactNumber(0)).toBe("0");
      expect(formatCompactNumber(999)).toBe("999");
    });

    it("treats falsy values as zero", () => {
      expect(formatCompactNumber(undefined)).toBe("0");
      expect(formatCompactNumber(null)).toBe("0");
    });
  });

  describe("formatPercent", () => {
    it("prefixes positive values with plus sign", () => {
      expect(formatPercent(5)).toBe("+5.0%");
    });

    it("formats negative values without plus sign", () => {
      expect(formatPercent(-5)).toBe("-5.0%");
    });

    it("formats zero without plus sign", () => {
      expect(formatPercent(0)).toBe("0.0%");
      expect(formatPercent(-0)).toBe("0.0%");
    });
  });

  describe("formatDate", () => {
    it("returns a dash for falsy values", () => {
      expect(formatDate(null)).toBe("-");
      expect(formatDate("")).toBe("-");
      expect(formatDate(undefined)).toBe("-");
    });

    it("formats a date using id-ID locale", () => {
      const result = formatDate("2024-06-15T00:00:00Z");
      expect(result).not.toBe("-");
      expect(result).toMatch(/Jun/i);
      expect(result).toContain("2024");
    });

    it("returns a dash for invalid date strings", () => {
      expect(formatDate("not-a-date")).toBe("-");
    });
  });

  describe("formatPrice", () => {
    it("formats IDR currency with no decimals and no spaces", () => {
      expect(formatPrice(1500000)).toBe("Rp1.500.000");
    });

    it("formats zero", () => {
      expect(formatPrice(0)).toBe("Rp0");
    });

    it("treats missing value as zero", () => {
      expect(formatPrice(undefined)).toBe("Rp0");
      expect(formatPrice(null)).toBe("Rp0");
    });
  });
});