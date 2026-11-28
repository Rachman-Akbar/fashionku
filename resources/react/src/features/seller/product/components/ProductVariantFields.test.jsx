import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ProductVariantFields } from "@/features/seller/product/components/ProductVariantFields";

const variants = [
  { clientId: "variant-1", id: null, name: "Merah", sku: "", price: "", stock: 0, values: [] },
];

const attributes = [{ id: 1, name: "Warna", type: "text" }];

describe("ProductVariantFields", () => {
  it("tidak lagi menampilkan rumus SKU maupun tombol Buat SKU di samping SKU", () => {
    render(<ProductVariantFields variants={variants} attributes={attributes} onChange={() => {}} />);

    expect(screen.queryByText(/Rumus SKU/i)).toBeNull();
    expect(screen.queryByText(/Dipakai tombol/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /Buat SKU/i })).toBeNull();
    // Input SKU tetap ada supaya SKU bisa diisi manual.
    expect(screen.getByPlaceholderText("Kosongkan untuk otomatis")).toBeTruthy();
    cleanup();
  });

  it("dropdown atribut bisa diketik dan menawarkan penambahan atribut baru", () => {
    render(<ProductVariantFields variants={[{ ...variants[0], values: [{ clientId: "v-1", attributeId: "", value: "" }] }]} attributes={attributes} onChange={() => {}} onCreateAttribute={async (name) => ({ value: "2", label: name })} />);

    expect(screen.getByText("Pilih / ketik atribut")).toBeTruthy();
    cleanup();
  });
});
