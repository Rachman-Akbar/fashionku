function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getStoreIds(items = []) {
  return new Set(items.map((item) => String(item.storeId ?? item.store_id ?? "").trim()).filter(Boolean));
}

function voucherStoreId(voucher) {
  return String(voucher?.storeId ?? voucher?.store_id ?? "").trim();
}

function voucherScope(voucher) {
  return String(voucher?.voucherScope || voucher?.voucher_scope || (voucherStoreId(voucher) ? "store" : "platform")).toLowerCase();
}

function shippingForStore(shippingBreakdown, storeId, fallback) {
  if (!storeId) return Math.max(0, toNumber(fallback));
  if (!shippingBreakdown) return Math.max(0, toNumber(fallback));

  if (Array.isArray(shippingBreakdown)) {
    const row = shippingBreakdown.find((item) => String(item.storeId ?? item.store_id ?? item.id ?? "") === storeId);
    return Math.max(0, toNumber(row?.price ?? row?.cost ?? row?.shippingCost ?? row?.shipping_cost));
  }

  if (typeof shippingBreakdown === "object") {
    const row = shippingBreakdown[storeId] ?? shippingBreakdown[Number(storeId)];
    if (row && typeof row === "object") {
      return Math.max(0, toNumber(row.price ?? row.cost ?? row.shippingCost ?? row.shipping_cost));
    }
    return Math.max(0, toNumber(row));
  }

  return Math.max(0, toNumber(fallback));
}

export function getVoucherEligibleSubtotal(voucher, items = []) {
  const storeId = voucherScope(voucher) === "store" ? voucherStoreId(voucher) : "";

  return items.reduce((sum, item) => {
    const itemStoreId = String(item.storeId ?? item.store_id ?? "").trim();
    if (storeId && itemStoreId !== storeId) return sum;
    return sum + toNumber(item.price) * Math.max(1, toNumber(item.quantity, 1));
  }, 0);
}

export function calculateCheckoutVoucherDiscount({
  voucher,
  items = [],
  shippingPrice = 0,
  shippingBreakdown = null,
}) {
  if (!voucher) {
    return { discount: 0, productDiscount: 0, shippingDiscount: 0, eligibleSubtotal: 0, eligible: false, message: "" };
  }

  const eligibleSubtotal = getVoucherEligibleSubtotal(voucher, items);
  const scope = voucherScope(voucher);
  const storeId = scope === "store" ? voucherStoreId(voucher) : "";
  const checkoutStoreCount = getStoreIds(items).size;
  const eligibleShipping = scope === "store" && checkoutStoreCount > 1 && !shippingBreakdown
    ? 0
    : shippingForStore(shippingBreakdown, storeId, shippingPrice);
  const minimumSpend = Math.max(0, toNumber(voucher.minSpend));

  if (eligibleSubtotal < minimumSpend) {
    return {
      discount: 0,
      productDiscount: 0,
      shippingDiscount: 0,
      eligibleSubtotal,
      eligible: false,
      message: "Minimum belanja voucher belum terpenuhi.",
    };
  }

  const target = String(voucher.discountTarget || voucher.discount_target || "product").trim().toLowerCase();
  const type = String(voucher.discountType || voucher.discount_type || "fixed").trim().toLowerCase();
  const value = Math.max(0, toNumber(voucher.discountValue));
  const maximumDiscount = Math.max(0, toNumber(voucher.maxDiscount));
  const base = target === "shipping" ? eligibleShipping : eligibleSubtotal;
  let discount = type === "percentage" ? base * (value / 100) : value;

  if (maximumDiscount > 0) discount = Math.min(discount, maximumDiscount);
  discount = Math.min(Math.max(0, discount), base);

  return {
    discount,
    productDiscount: target === "product" ? discount : 0,
    shippingDiscount: target === "shipping" ? discount : 0,
    eligibleSubtotal,
    eligibleShipping,
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
  if (["inactive", "expired", "banned", "rejected", "archived"].includes(status)) {
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
  if (usageLimit > 0 && usedCount >= usageLimit) return { valid: false, reason: "Kuota voucher sudah habis." };

  const checkoutStoreIds = getStoreIds(items);
  const storeId = voucherStoreId(voucher);
  const scope = voucherScope(voucher);
  if (scope === "store" && (!storeId || !checkoutStoreIds.has(storeId))) {
    return { valid: false, reason: "Voucher tidak berlaku untuk toko ini." };
  }
  if (scope === "platform" && storeId) {
    return { valid: false, reason: "Konfigurasi voucher platform tidak valid." };
  }

  const eligibleSubtotal = getVoucherEligibleSubtotal(voucher, items);
  if (eligibleSubtotal < Math.max(0, toNumber(voucher.minSpend))) {
    return { valid: false, reason: "Minimum belanja voucher belum terpenuhi." };
  }

  return { valid: true, reason: "" };
}

export function getAvailableCheckoutVouchers(vouchers = [], items = []) {
  const now = new Date();
  return vouchers.filter((voucher) => getCheckoutVoucherValidity(voucher, items, now).valid);
}

export function getBestCheckoutVoucher({ vouchers = [], items = [], shippingPrice = 0, shippingBreakdown = null }) {
  return vouchers.reduce((best, voucher) => {
    const calculation = calculateCheckoutVoucherDiscount({ voucher, items, shippingPrice, shippingBreakdown });
    if (!calculation.eligible) return best;
    if (!best || calculation.discount > best.calculation.discount) return { voucher, calculation };
    if (calculation.discount === best.calculation.discount && toNumber(voucher.minSpend) < toNumber(best.voucher.minSpend)) {
      return { voucher, calculation };
    }
    return best;
  }, null);
}
