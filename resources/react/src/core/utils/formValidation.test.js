import { describe, expect, it } from "vitest";
import {
  minimumNumber,
  required,
  validAppUrl,
  validUrl,
  validateFields,
} from "@/core/utils/formValidation";

describe("formValidation", () => {
  describe("required", () => {
    it("returns empty string when value is present", () => {
      expect(required("Nama")("Baju")).toBe("");
      expect(required("Nama")(0)).toBe("");
    });

    it("returns label wajib diisi when value is empty or whitespace", () => {
      expect(required("Nama")(undefined)).toBe("Nama wajib diisi.");
      expect(required("Nama")(null)).toBe("Nama wajib diisi.");
      expect(required("Nama")("")).toBe("Nama wajib diisi.");
      expect(required("Nama")("   ")).toBe("Nama wajib diisi.");
    });
  });

  describe("minimumNumber", () => {
    it("returns empty string when number meets the minimum", () => {
      expect(minimumNumber("Harga", 1000)(1500)).toBe("");
      expect(minimumNumber("Harga", 1000)("1000")).toBe("");
    });

    it("returns error when number is below the minimum", () => {
      expect(minimumNumber("Harga", 1000)(999)).toBe("Harga minimal 1000.");
    });

    it("uses 0 as the default minimum", () => {
      expect(minimumNumber("Stok")(-5)).toBe("Stok minimal 0.");
      expect(minimumNumber("Stok")(5)).toBe("");
    });
  });

  describe("validUrl", () => {
    it("accepts a real URL", () => {
      expect(validUrl("Link")("https://example.com/path?a=1")).toBe("");
    });

    it("rejects malformed strings", () => {
      expect(validUrl("Link")("not-a-url")).toBe("Link harus berupa URL valid.");
      expect(validUrl("Link")("https://")).toBe("Link harus berupa URL valid.");
    });

    it("treats empty value as valid (optional field)", () => {
      expect(validUrl("Link")("")).toBe("");
      expect(validUrl("Link")(null)).toBe("");
    });
  });

  describe("validAppUrl", () => {
    it("accepts internal root-relative paths that start with a single slash", () => {
      expect(validAppUrl("Alamat")("/category/elektronik")).toBe("");
    });

    it("rejects protocol-relative paths (//host)", () => {
      expect(validAppUrl("Alamat")("//evil.example.com/x")).toBe("Alamat harus berupa URL valid.");
    });

    it("accepts absolute URLs", () => {
      expect(validAppUrl("Alamat")("https://example.com/x")).toBe("");
    });

    it("treats empty value as valid", () => {
      expect(validAppUrl("Alamat")("")).toBe("");
    });
  });

  describe("validateFields", () => {
    it("collects errors per field", () => {
      const errors = validateFields(
        { name: "Kaos", price: 0 },
        {
          name: required("Nama"),
          price: [required("Harga"), minimumNumber("Harga", 1000)],
          url: validUrl("Link"),
        },
      );

      expect(errors).toEqual({
        price: "Harga minimal 1000.",
      });
    });

    it("returns empty object when everything passes", () => {
      const errors = validateFields(
        { price: "1000" },
        { price: [required("Harga"), minimumNumber("Harga", 1000)] },
      );

      expect(errors).toEqual({});
    });

    it("stops at the first failing validator for a field", () => {
      const errors = validateFields(
        { price: null },
        { price: [required("Harga"), minimumNumber("Harga", 1000)] },
      );

      expect(errors).toEqual({ price: "Harga wajib diisi." });
    });

    it("runs validators with values for cross-field checks", () => {
      const rules = {
        confirm: (value, values) =>
          value === values.password ? "" : "Konfirmasi kata sandi tidak sama.",
      };

      expect(validateFields({ password: "abc", confirm: "abc" }, rules)).toEqual({});
      expect(validateFields({ password: "abc", confirm: "abd" }, rules)).toEqual({
        confirm: "Konfirmasi kata sandi tidak sama.",
      });
    });
  });
});