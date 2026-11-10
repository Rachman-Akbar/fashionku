import { describe, expect, it } from "vitest";
import {
  flattenProductPages,
  normalizeProduct,
  normalizeVariant,
} from "@/features/catalog/product/services/productService";

describe("normalizeVariant", () => {
  it("normalizes a simple variant", () => {
    const variant = normalizeVariant({
      id: 10,
      sku: "SKU-1",
      price: "125000",
      stock: "5",
      is_default: 1,
    });

    expect(variant).toMatchObject({
      id: 10,
      sku: "SKU-1",
      price: 125000,
      stock: 5,
      is_default: true,
    });
  });

  it("normalizes variant values", () => {
    const variant = normalizeVariant({
      values: [
        { id: 1, attribute_id: 3, attribute: { name: "Warna" }, value: "Merah" },
        { id: 2, attribute_id: 4, value: "L" },
      ],
    });

    expect(variant.values).toEqual([
      { id: 1, attribute_id: 3, attribute_name: "Warna", value: "Merah", raw: expect.any(Object) },
      { id: 2, attribute_id: 4, attribute_name: "Atribut 4", value: "L", raw: expect.any(Object) },
    ]);
  });

  it("falls back gracefully for empty variants", () => {
    const variant = normalizeVariant({});
    expect(variant.name).toBe("Varian Produk");
    expect(variant.price).toBe(0);
    expect(variant.values).toEqual([]);
  });
});

describe("normalizeProduct", () => {
  it("normalizes a full product payload", () => {
    const product = normalizeProduct({
      id: 7,
      name: "Kaos Polos",
      title: "Kaos Polos",
      slug: "kaos-polos",
      status: "published",
      is_active: 1,
      price: "50000",
      stock: "10",
      store: { id: 2, name: "Toko Ku", slug: "toko-ku", city: "Jakarta" },
      images: [{ id: 1, url: "/images/a.jpg", is_primary: true }],
      rating: "4.5",
      review_count: "12",
      sold: "3",
    });

    expect(product).toMatchObject({
      id: 7,
      slug: "kaos-polos",
      name: "Kaos Polos",
      status: "published",
      is_active: true,
      price: 50000,
      stock: 10,
      rating: 4.5,
      reviewCount: 12,
      sold: "3+",
    });
    expect(product.store_id).toBe(2);
    expect(product.store.name).toBe("Toko Ku");
    expect(product.store.city).toBe("Jakarta");
    expect(product.thumbnail).toMatch(/storage\/images\/a\.jpg$/);
    expect(product.price_label).toMatch(/Rp/);
  });

  it("derives price from the default variant when flat price is missing", () => {
    const product = normalizeProduct({
      variants: [{ id: 1, price: 75000, is_default: true }],
    });
    expect(product.price).toBe(75000);
    expect(product.default_variant.id).toBe(1);
  });

  it("deduplicates and prefixes the direct thumbnail image", () => {
    const product = normalizeProduct({
      name: "Produk",
      image_url: "/media/thumb.jpg",
      images: [{ id: 1, url: "/media/photo.jpg" }],
    });
    expect(product.images[0].url).toMatch(/storage\/media\/thumb\.jpg$/);
    expect(product.images[0].is_primary).toBe(true);
    expect(product.images).toHaveLength(2);
  });

  it("falls back to a placeholder image", () => {
    const product = normalizeProduct({ name: "Produk Tanpa Gambar" });
    expect(product.images[0].id).toBe("placeholder");
    expect(product.thumbnail).toMatch(/^data:image/);
  });

  it("normalizes categories and picks the primary one", () => {
    const product = normalizeProduct({
      categories: [
        { id: 1, name: "Pakaian", slug: "pakaian" },
        { id: 2, name: "Kaos", slug: "kaos", is_primary: true },
      ],
    });
    expect(product.categories).toHaveLength(2);
    expect(product.primary_category.name).toBe("Kaos");
  });

  it("formats sold count with rb suffix for thousands", () => {
    expect(normalizeProduct({ sold: 1500 }).sold).toBe("1rb+");
    expect(normalizeProduct({ sold_count: 500 }).sold).toBe("500+");
  });

  it("handles an empty product gracefully", () => {
    const product = normalizeProduct({});
    expect(product.name).toBe("Produk");
    expect(product.is_active).toBe(true);
    expect(product.images).toHaveLength(1);
    expect(product.variants).toEqual([]);
  });
});

describe("flattenProductPages", () => {
  it("flattens pages and deduplicates by id/slug", () => {
    const pages = {
      pages: [
        { data: [{ id: 1, slug: "a" }, { id: 2, slug: "b" }] },
        { data: [{ id: 1, slug: "a" }, { id: 3, slug: "c" }] },
      ],
    };
    const result = flattenProductPages(pages);
    expect(result.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it("returns an empty array for missing pages", () => {
    expect(flattenProductPages(undefined)).toEqual([]);
    expect(flattenProductPages({ pages: [] })).toEqual([]);
  });
});