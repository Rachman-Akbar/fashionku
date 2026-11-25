import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PRODUCT_TABLE_COLUMNS, SellerProductTable } from "@/features/seller/product/components/SellerProductTable";

const rows = [{
  id: 1,
  name: "Kaos Basic",
  sku: "PRD-1",
  status: "published",
  isActive: true,
  mode: "simple",
  price: 1000,
  stock: 5,
  poStock: 0,
  minStock: 0,
  totalStock: 5,
  variants: [],
  raw: { id: 1, code: "PRD-1", name: "Kaos Basic", status: "published", is_active: true, store_name: "Fashionku", max_order_qty: 999999 },
}];

function renderTable({ admin = false } = {}) {
  const columns = PRODUCT_TABLE_COLUMNS.filter((column) => admin || column.key !== "status");
  return render(
    <SellerProductTable
      rows={rows}
      columns={columns}
      visibleSet={new Set(columns.map((column) => column.key))}
      columnOrder={columns.map((column) => column.key)}
      portal={admin ? "admin" : "seller"}
    />,
  );
}

function headers() {
  return screen.getAllByRole("columnheader").map((header) => header.textContent.trim());
}

describe("SellerProductTable headers", () => {
  it("only shows the curated single-store columns", () => {
    renderTable();
    const labels = headers();
    expect(labels).toEqual(expect.arrayContaining(["Produk", "Mode", "Harga", "Stok", "Status Seller"]));
    // Kolom teknis / multi-store tidak lagi dirender.
    expect(labels).not.toContain("Toko");
    expect(labels).not.toContain("Kode");
    expect(labels).not.toContain("Kota Toko");
    expect(labels).not.toContain("Maks. Order");
    expect(labels).not.toContain("Merek");
    expect(labels).not.toContain("Dibuat");
    expect(labels.filter((label) => label === "Status Seller")).toHaveLength(1);
  });

  it("shows the admin-only status column only on the admin portal", () => {
    renderTable({ admin: true });
    expect(headers()).toContain("Status Admin");

    cleanup();
    renderTable();
    expect(headers()).not.toContain("Status Admin");
  });
});
