import { describe, expect, it } from "vitest";
import { computeCostingTotals } from "@/features/seller/product/utils/costingMath";

describe("computeCostingTotals (HPP & harga jual saran)", () => {
  it("margin 0% membuat harga jual saran sama dengan HPP", () => {
    const totals = computeCostingTotals({ materialCost: 13200, marginPercent: 0 });

    expect(totals.hpp).toBe(13200);
    expect(totals.suggested).toBe(13200);
    expect(totals.suggestedWhole).toBe(13200);
    expect(totals.profitPerUnit).toBe(0);
  });

  it("menjumlahkan biaya bahan, tenaga kerja, overhead, dan biaya lain", () => {
    const totals = computeCostingTotals({ materialCost: 10000, laborCost: 1500, overheadCost: 1000, otherCost: 700, marginPercent: 0 });

    expect(totals.batchCost).toBe(13200);
    expect(totals.hpp).toBe(13200);
    expect(totals.suggestedWhole).toBe(13200);
  });

  it("margin 30% menaikkan harga saran sesuai persentase margin", () => {
    const totals = computeCostingTotals({ materialCost: 10000, marginPercent: 30 });

    expect(totals.hpp).toBe(10000);
    expect(totals.suggestedWhole).toBe(13000);
    expect(totals.profitPerUnit).toBe(3000);
  });

  it("hasil jadi membagi total biaya produksi menjadi HPP per unit", () => {
    // Satu kali produksi: bahan 60.000 + tenaga kerja 30.000 = 90.000,
    // menghasilkan 12 unit -> HPP per unit 7.500.
    const totals = computeCostingTotals({ materialCost: 60000, laborCost: 30000, marginPercent: 0, yieldQuantity: 12 });

    expect(totals.batchCost).toBe(90000);
    expect(totals.hpp).toBe(7500);
    expect(totals.suggestedWhole).toBe(7500);
  });

  it("hasil jadi 0 / kosong dianggap 1 unit agar HPP tidak rusak", () => {
    const totals = computeCostingTotals({ materialCost: 5000, marginPercent: 0, yieldQuantity: 0 });

    expect(totals.yieldQuantity).toBe(1);
    expect(totals.hpp).toBe(5000);
  });

  it("harga saran tidak pernah lebih kecil dari HPP walau margin negatif dikirim", () => {
    const totals = computeCostingTotals({ materialCost: 8000, marginPercent: -50 });

    expect(totals.marginPercent).toBe(0);
    expect(totals.suggestedWhole).toBe(8000);
  });

  it("mengabaikan nilai kosong / null dari input form", () => {
    const totals = computeCostingTotals({ materialCost: 5460, laborCost: "", overheadCost: null, otherCost: undefined, marginPercent: "" });

    expect(totals.hpp).toBe(5460);
    expect(totals.suggestedWhole).toBe(5460);
  });
});
