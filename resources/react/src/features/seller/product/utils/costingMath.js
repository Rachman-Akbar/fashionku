/**
 * Perhitungan HPP & harga jual saran dipakai tab HPP produk.
 *
 * Aturan yang dijaga di sini:
 * - Biaya resep (bahan + tenaga kerja + overhead + biaya lain) adalah biaya
 *   untuk SATU kali produksi.
 * - `yieldQuantity` = berapa unit yang dihasilkan dari satu kali produksi.
 *   HPP per unit = total biaya produksi / hasil jadi.
 * - Harga jual saran SELALU HPP per unit x (1 + margin); tidak pernah memakai
 *   nilai harga jual tersimpan yang bisa basi (dulu nilai lama membuat margin
 *   0% menampilkan harga jual lebih kecil dari HPP).
 */
export function computeCostingTotals({ materialCost = 0, laborCost = 0, overheadCost = 0, otherCost = 0, marginPercent = 0, yieldQuantity = 1 } = {}) {
  const material = Number(materialCost) || 0;
  const labor = Number(laborCost) || 0;
  const overhead = Number(overheadCost) || 0;
  const other = Number(otherCost) || 0;
  const margin = Math.max(0, Number(marginPercent) || 0);
  const yieldQty = Number(yieldQuantity) > 0 ? Number(yieldQuantity) : 1;

  const batchCost = material + labor + overhead + other;
  const hpp = batchCost / yieldQty;
  const suggested = hpp * (1 + margin / 100);

  return {
    materialCost: material,
    batchCost,
    yieldQuantity: yieldQty,
    hpp,
    marginPercent: margin,
    suggested,
    suggestedWhole: Math.round(suggested),
    profitPerUnit: suggested - hpp,
  };
}
