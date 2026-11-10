import { describe, expect, it } from "vitest";
import { getApiMessage, unwrapApiData, unwrapCollection } from "@/core/utils/apiClient";

describe("getApiMessage", () => {
  it("returns the response message when present", () => {
    const error = { response: { data: { message: "Data tidak valid" } } };
    expect(getApiMessage(error, "fallback")).toBe("Data tidak valid");
  });

  it("returns the first flat validator error", () => {
    const error = {
      response: { data: { message: "", errors: { name: ["Nama wajib diisi.", "Minimal 3 karakter."] } } },
    };
    expect(getApiMessage(error, "fallback")).toBe("Nama wajib diisi.");
  });

  it("returns the fallback when the response has no usable message", () => {
    expect(getApiMessage({ response: { data: {} } }, "fallback")).toBe("fallback");
    expect(getApiMessage({}, "fallback")).toBe("fallback");
    expect(getApiMessage(undefined, "fallback")).toBe("fallback");
  });

  it("ignores an empty/whitespace message", () => {
    expect(getApiMessage({ response: { data: { message: "   " } } }, "fallback")).toBe("fallback");
  });

  it("uses the default fallback when none is provided", () => {
    expect(getApiMessage({})).toBe("Terjadi kesalahan. Silakan coba lagi.");
  });
});

describe("unwrapApiData", () => {
  it("prefers the nested data.data", () => {
    expect(unwrapApiData({ data: { data: { id: 1 }, message: "ok" } })).toEqual({ id: 1 });
  });

  it("unwraps a single data wrapper", () => {
    expect(unwrapApiData({ data: { id: 1 } })).toEqual({ id: 1 });
  });

  it("returns the payload unchanged when there is no wrapper", () => {
    const payload = { id: 1 };
    expect(unwrapApiData(payload)).toBe(payload);
  });
});

describe("unwrapCollection", () => {
  it("returns the array from data.data", () => {
    expect(unwrapCollection({ data: { data: [1, 2] } })).toEqual([1, 2]);
  });

  it("returns the array from data", () => {
    expect(unwrapCollection({ data: [1, 2] })).toEqual([1, 2]);
  });

  it("returns the array from data.data.data", () => {
    expect(unwrapCollection({ data: { data: { data: [1] } } })).toEqual([1]);
  });

  it("returns an empty array otherwise", () => {
    expect(unwrapCollection({ data: { foo: 1 } })).toEqual([]);
    expect(unwrapCollection(null)).toEqual([]);
    expect(unwrapCollection(undefined)).toEqual([]);
  });
});