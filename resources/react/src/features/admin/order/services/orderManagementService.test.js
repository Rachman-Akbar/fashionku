import { describe, expect, it } from "vitest";
import {
  normalizeOrder,
  normalizeOrderItem,
} from "@/features/admin/order/services/orderManagementService";

describe("normalizeOrderItem", () => {
  it("maps api item fields and keeps the thumbnail", () => {
    const item = normalizeOrderItem({
      id: 9,
      product_id: 3,
      variant_id: 7,
      product_name: "Kopi Arabika",
      sku: "KOP-001",
      thumbnail: "products/kopi.png",
      quantity: "2",
      unit_price: "45000",
      subtotal: "90000",
    });

    expect(item).toMatchObject({
      id: 9,
      productId: 3,
      variantId: 7,
      productName: "Kopi Arabika",
      sku: "KOP-001",
      thumbnail: "products/kopi.png",
      quantity: 2,
      unitPrice: 45000,
      subtotal: 90000,
    });
  });

  it("falls back gracefully for empty items", () => {
    const item = normalizeOrderItem({}, 4);
    expect(item).toMatchObject({ id: 4, productName: "", thumbnail: "", quantity: 0, unitPrice: 0 });
  });
});

describe("normalizeOrder", () => {
  it("normalizes the admin order payload including items", () => {
    const order = normalizeOrder({
      id: 12,
      order_number: "INV-12",
      grand_total: "150000",
      shipping_cost: "20000",
      status: "processing",
      items: [
        { id: 1, product_name: "Produk A", quantity: 1, thumbnail: "products/a.png" },
        { id: 2, product_name: "Produk B", quantity: 3, thumbnail: null },
      ],
    });

    expect(order).toMatchObject({ id: 12, orderNumber: "INV-12", total: 170000, status: "processing" });
    expect(order.items).toHaveLength(2);
    expect(order.items[0]).toMatchObject({ productName: "Produk A", thumbnail: "products/a.png" });
    expect(order.items[1]).toMatchObject({ productName: "Produk B", thumbnail: "" });
  });

  it("defaults items to an empty array when missing", () => {
    expect(normalizeOrder({ id: 1 }).items).toEqual([]);
  });
});
