function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeProductId(item) {
  return Number(item?.productId ?? item?.product_id ?? 0) || 0;
}

/**
 * Scope produk: voucher bersyarat (ada `productIds`) hanya dihitung dari item
 * yang masuk daftar produknya — item lain di keranjang yang sama tidak ikut
 * menghitung subtotal/min item, sehingga voucher tidak "tercampur".
 */
export function getVoucherEligibleSubtotal(voucher, items = []) {
  const scopedIds = Array.isArray(voucher?.productIds)
    ? voucher.productIds.map(Number).filter((id) => id > 0)
    : [];

  return items.reduce((sum, item) => {
    if (scopedIds.length && !scopedIds.includes(normalizeProductId(item))) {
      return sum;
    }

    return (
      sum + toNumber(item.price) * Math.max(1, toNumber(item.quantity, 1))
    );
  }, 0);
}

function getMaxSameProductQty(items = []) {
  const quantities = new Map();

  items.forEach((item) => {
    const productId = normalizeProductId(item);
    if (!productId) return;
    const quantity = Math.max(1, toNumber(item.quantity, 1));
    quantities.set(productId, (quantities.get(productId) || 0) + quantity);
  });

  return quantities.size ? Math.max(...quantities.values()) : 0;
}

function getVoucherEligibleItems(voucher, items = []) {
  const scopedIds = Array.isArray(voucher?.productIds)
    ? voucher.productIds.map(Number).filter((id) => id > 0)
    : [];

  if (!scopedIds.length) return items;

  return items.filter((item) => scopedIds.includes(normalizeProductId(item)));
}

export function calculateCheckoutVoucherDiscount({
  voucher,
  items = [],
  shippingPrice = 0,
}) {
  if (!voucher) {
    return { discount: 0, productDiscount: 0, shippingDiscount: 0, eligibleSubtotal: 0, eligible: false, message: "" };
  }

  const eligibleItems = getVoucherEligibleItems(voucher, items);
  const eligibleSubtotal = getVoucherEligibleSubtotal(voucher, items);

  if (!eligibleItems.length) {
    return {
      discount: 0,
      productDiscount: 0,
      shippingDiscount: 0,
      eligibleSubtotal,
      eligible: false,
      message: "Voucher ini hanya berlaku untuk produk tertentu yang tidak ada di pesanan Anda.",
    };
  }

  const minimumSpend = Math.max(0, toNumber(voucher.minSpend));

  if (eligibleSubtotal < minimumSpend) {
    return {
      discount: 0,
      productDiscount: 0,
      shippingDiscount: 0,
      eligibleSubtotal,
      eligible: false,
      message: "Minimal belanja voucher belum terpenuhi.",
    };
  }

  const itemCount = eligibleItems.reduce(
    (sum, item) => sum + Math.max(1, toNumber(item.quantity, 1)),
    0,
  );
  const distinctProducts = new Set(
    eligibleItems.map(normalizeProductId).filter(Boolean),
  ).size;
  const minItems = Math.max(0, toNumber(voucher.minItems));
  const minDistinct = Math.max(0, toNumber(voucher.minDistinctProducts));
  const minSameProductQty = Math.max(0, toNumber(voucher.minSameProductQty));
  const maxSameProductQty = getMaxSameProductQty(eligibleItems);

  if (minItems > 0 && itemCount < minItems) {
    return {
      discount: 0,
      productDiscount: 0,
      shippingDiscount: 0,
      eligibleSubtotal,
      eligible: false,
      message: `Voucher membutuhkan minimal ${minItems} item dalam pesanan.`,
    };
  }

  if (minDistinct > 0 && distinctProducts < minDistinct) {
    return {
      discount: 0,
      productDiscount: 0,
      shippingDiscount: 0,
      eligibleSubtotal,
      eligible: false,
      message: `Voucher hanya berlaku untuk minimal ${minDistinct} item produk berbeda.`,
    };
  }

  if (minSameProductQty > 0 && maxSameProductQty < minSameProductQty) {
    return {
      discount: 0,
      productDiscount: 0,
      shippingDiscount: 0,
      eligibleSubtotal,
      eligible: false,
      message: `Voucher hanya berlaku jika membeli minimal ${minSameProductQty} pcs untuk satu produk yang sama.`,
    };
  }

  const target = String(voucher.discountTarget || voucher.discount_target || "product").trim().toLowerCase();
  const type = String(voucher.discountType || voucher.discount_type || "fixed").trim().toLowerCase();
  const value = Math.max(0, toNumber(voucher.discountValue));
  const maximumDiscount = Math.max(0, toNumber(voucher.maxDiscount));
  const base = target === "shipping" ? Math.max(0, toNumber(shippingPrice)) : eligibleSubtotal;
  let discount = type === "percentage" ? base * (value / 100) : value;

  if (maximumDiscount > 0) discount = Math.min(discount, maximumDiscount);
  discount = Math.min(Math.max(0, discount), base);

  return {
    discount,
    productDiscount: target === "product" ? discount : 0,
    shippingDiscount: target === "shipping" ? discount : 0,
    eligibleSubtotal,
    eligibleShipping: Math.max(0, toNumber(shippingPrice)),
    eligible: discount > 0,
    message: discount > 0
      ? ""
      : target === "shipping"
        ? "Voucher ongkir aktif setelah memilih layanan pengiriman berbayar."
        : "Voucher belum memberikan potongan untuk pesanan ini.",
  };
}

export function getCheckoutVoucherValidity(voucher, items = [], now = new Date()) {
  if (!voucher?.isActive) return { valid: false, reason: "Voucher tidak aktif." };

  if (voucher?.isLocked) {
    return { valid: false, reason: "Voucher hanya tersedia setelah misi diselesaikan." };
  }

  const status = String(voucher.status || "active").toLowerCase();
  if (["inactive", "expired", "rejected", "archived"].includes(status)) {
    return { valid: false, reason: "Voucher tidak tersedia." };
  }

  const approvalStatus = String(voucher.approvalStatus || "approved").toLowerCase();
  if (approvalStatus && !["approved", "active"].includes(approvalStatus)) {
    return { valid: false, reason: "Voucher belum dapat digunakan." };
  }

  const startsAt = normalizeDate(voucher.startsAt);
  if (startsAt && now < startsAt) return { valid: false, reason: "Voucher belum memasuki periode penggunaan." };

  const endsAt = normalizeDate(voucher.endsAt);
  if (endsAt && now > endsAt) return { valid: false, reason: "Voucher sudah berakhir." };

  const usageLimit = Math.max(0, toNumber(voucher.usageLimit));
  const usedCount = Math.max(0, toNumber(voucher.usedCount));
  if (usageLimit > 0 && usedCount >= usageLimit) return { valid: false, reason: "Kuota penggunaan voucher sudah habis." };

  // Kuota per user (dikontrol backend/`vouchers.usage_limit_per_user`).
  const usageLimitPerUser = Math.max(0, toNumber(voucher.usageLimitPerUser));
  const usedByUser = Math.max(0, toNumber(voucher.usedByUser));
  if (usageLimitPerUser > 0 && usedByUser >= usageLimitPerUser) {
    return {
      valid: false,
      reason: `Voucher ini sudah digunakan maksimal ${usageLimitPerUser} kali oleh akun Anda.`,
    };
  }

  const eligibleItems = getVoucherEligibleItems(voucher, items);

  if (!eligibleItems.length) {
    return {
      valid: false,
      reason: "Voucher ini hanya berlaku untuk produk tertentu yang tidak ada di pesanan Anda.",
    };
  }

  const eligibleSubtotal = getVoucherEligibleSubtotal(voucher, items);
  if (eligibleSubtotal < Math.max(0, toNumber(voucher.minSpend))) {
    return { valid: false, reason: "Minimal belanja voucher belum terpenuhi." };
  }

  const itemCount = eligibleItems.reduce(
    (sum, item) => sum + Math.max(1, toNumber(item.quantity, 1)),
    0,
  );
  const distinctProducts = new Set(
    eligibleItems.map(normalizeProductId).filter(Boolean),
  ).size;
  const minItems = Math.max(0, toNumber(voucher.minItems));
  const minDistinct = Math.max(0, toNumber(voucher.minDistinctProducts));
  const minSameProductQty = Math.max(0, toNumber(voucher.minSameProductQty));
  const maxSameProductQty = getMaxSameProductQty(eligibleItems);

  if (minItems > 0 && itemCount < minItems) {
    return { valid: false, reason: `Voucher membutuhkan minimal ${minItems} item dalam pesanan.` };
  }

  if (minDistinct > 0 && distinctProducts < minDistinct) {
    return {
      valid: false,
      reason: `Voucher hanya berlaku untuk minimal ${minDistinct} item produk berbeda.`,
    };
  }

  if (minSameProductQty > 0 && maxSameProductQty < minSameProductQty) {
    return {
      valid: false,
      reason: `Voucher hanya berlaku jika membeli minimal ${minSameProductQty} pcs untuk satu produk yang sama.`,
    };
  }

  return { valid: true, reason: "" };
}

export function getAvailableCheckoutVouchers(vouchers = [], items = []) {
  const now = new Date();
  return vouchers.filter((voucher) => getCheckoutVoucherValidity(voucher, items, now).valid);
}

export function getBestCheckoutVoucher({ vouchers = [], items = [], shippingPrice = 0 }) {
  return vouchers.reduce((best, voucher) => {
    const calculation = calculateCheckoutVoucherDiscount({ voucher, items, shippingPrice });
    if (!calculation.eligible) return best;
    if (!best || calculation.discount > best.calculation.discount) return { voucher, calculation };
    if (calculation.discount === best.calculation.discount && toNumber(voucher.minSpend) < toNumber(best.voucher.minSpend)) {
      return { voucher, calculation };
    }
    return best;
  }, null);
}
