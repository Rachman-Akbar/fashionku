function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getVoucherEligibleSubtotal(_voucher, items = []) {
  return items.reduce(
    (sum, item) => sum + toNumber(item.price) * Math.max(1, toNumber(item.quantity, 1)),
    0,
  );
}

export function calculateCheckoutVoucherDiscount({
  voucher,
  items = [],
  shippingPrice = 0,
}) {
  if (!voucher) {
    return { discount: 0, productDiscount: 0, shippingDiscount: 0, eligibleSubtotal: 0, eligible: false, message: "" };
  }

  const eligibleSubtotal = getVoucherEligibleSubtotal(voucher, items);
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
