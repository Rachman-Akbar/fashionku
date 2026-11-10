import { describe, expect, it } from "vitest";
import { getAssetBaseUrl, resolveMediaUrl } from "@/core/utils/mediaUrl";

describe("resolveMediaUrl", () => {
  it("returns empty string for empty input", () => {
    expect(resolveMediaUrl()).toBe("");
    expect(resolveMediaUrl("")).toBe("");
    expect(resolveMediaUrl(null)).toBe("");
    expect(resolveMediaUrl("   ")).toBe("");
  });

  it("passes through data and blob URIs unchanged", () => {
    const dataUri = "data:image/svg+xml,%3Csvg%3E%3C/svg%3E";
    const blobUri = "blob:http://localhost/abc-123";
    expect(resolveMediaUrl(dataUri)).toBe(dataUri);
    expect(resolveMediaUrl(blobUri)).toBe(blobUri);
  });

  it("passes through remote absolute URLs unchanged", () => {
    expect(resolveMediaUrl("https://cdn.example.com/img.png")).toBe("https://cdn.example.com/img.png");
    expect(resolveMediaUrl("http://assets.example.org/a/b.jpg?w=100")).toBe("http://assets.example.org/a/b.jpg?w=100");
  });

  it("keeps localhost absolute URLs in dev mode", () => {
    expect(resolveMediaUrl("http://localhost:8000/storage/img.png")).toBe("http://localhost:8000/storage/img.png");
    expect(resolveMediaUrl("http://127.0.0.1/storage/img.png")).toBe("http://127.0.0.1/storage/img.png");
  });

  it("resolves protocol-relative URLs against the current protocol", () => {
    expect(resolveMediaUrl("//cdn.example.com/img.png")).toBe(`${window.location.protocol}//cdn.example.com/img.png`);
  });

  it("resolves relative paths under the storage/ prefix", () => {
    const base = getAssetBaseUrl();
    expect(base).toBeTruthy();
    expect(resolveMediaUrl("images/photo.png")).toBe(`${base}/storage/images/photo.png`);
    expect(resolveMediaUrl("storage/photo.png")).toBe(`${base}/storage/photo.png`);
    expect(resolveMediaUrl("/storage/photo.png")).toBe(`${base}/storage/photo.png`);
  });
});