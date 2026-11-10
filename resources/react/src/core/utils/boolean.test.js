import { describe, expect, it } from "vitest";
import { toBoolean } from "@/core/utils/boolean";

describe("toBoolean", () => {
  it("uses fallback for empty values", () => {
    expect(toBoolean(undefined, true)).toBe(true);
    expect(toBoolean(null, true)).toBe(true);
    expect(toBoolean("", false)).toBe(false);
  });

  it("passes through booleans", () => {
    expect(toBoolean(true)).toBe(true);
    expect(toBoolean(false)).toBe(false);
  });

  it("treats numbers as 1/0", () => {
    expect(toBoolean(1)).toBe(true);
    expect(toBoolean(0)).toBe(false);
  });

  it("maps active words to true", () => {
    ["1", "true", "yes", "on", "active", "published", "approved"].forEach((value) => {
      expect(toBoolean(value)).toBe(true);
    });
  });

  it("maps inactive words to false", () => {
    ["0", "false", "no", "off", "inactive", "disabled", "draft", "rejected"].forEach((value) => {
      expect(toBoolean(value)).toBe(false);
    });
  });

  it("returns fallback for unknown strings", () => {
    expect(toBoolean("mystery", false)).toBe(false);
    expect(toBoolean("mystery", true)).toBe(true);
  });
});