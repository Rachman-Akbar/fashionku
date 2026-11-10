import { describe, expect, it } from "vitest";
import { formatEntityName, preserveIdentifier, toTitleCase } from "@/shared/utils/textFormatter";

describe("textFormatter", () => {
  describe("toTitleCase", () => {
    it("title-cases single words", () => {
      expect(toTitleCase("elektronik")).toBe("Elektronik");
      expect(toTitleCase("BAJU")).toBe("Baju");
    });

    it("title-cases multi-word phrases", () => {
      expect(toTitleCase("rumah tangga")).toBe("Rumah Tangga");
    });

    it("capitalizes after separators (space, hyphen, slash, parenthesis)", () => {
      expect(toTitleCase("baju-anak")).toBe("Baju-Anak");
      expect(toTitleCase("a/b")).toBe("A/B");
      expect(toTitleCase("(mini) pasar")).toBe("(Mini) Pasar");
    });

    it("returns empty for empty input", () => {
      expect(toTitleCase()).toBe("");
      expect(toTitleCase("   ")).toBe("");
      expect(toTitleCase(null)).toBe("");
    });
  });

  describe("formatEntityName", () => {
    it("delegates to toTitleCase", () => {
      expect(formatEntityName("pakaian pria")).toBe("Pakaian Pria");
      expect(formatEntityName("")).toBe("");
    });
  });

  describe("preserveIdentifier", () => {
    it("keeps identifiers untouched as strings", () => {
      expect(preserveIdentifier("ORD-2024-001")).toBe("ORD-2024-001");
      expect(preserveIdentifier(1234)).toBe("1234");
      expect(preserveIdentifier(undefined)).toBe("");
      expect(preserveIdentifier(null)).toBe("");
    });
  });
});