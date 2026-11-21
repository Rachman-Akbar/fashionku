import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Banknote,
  CalendarClock,
  CreditCard,
  Landmark,
  MapPin,
  QrCode,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { useCart } from "@/features/order/cart/context/CartContext";
import { useAddresses } from "@/features/profile/address/addressService";
import InstantAddressModal from "@/features/profile/address/components/InstantAddressModal";
import {
  getOrderError,
  getShippingError,
  useCreateOrder,
  usePaymentConfig,
  useShippingOptions,
} from "@/features/order/ordering/orderService";
import { OrderFlowStepper } from "@/features/order/ordering/components/OrderFlowStepper";import VoucherSearchSelect from "@/features/order/voucher/components/VoucherSearchSelect";
import {
  useCheckoutVouchers,
  useVoucherPreview,
} from "@/features/order/voucher/services/voucherService";
import {
  calculateCheckoutVoucherDiscount,
  getAvailableCheckoutVouchers,
  getBestCheckoutVoucher,
} from "@/features/order/voucher/utils/checkoutVoucher";
import { Button } from "@/shared/components/ui/Button";
import { toastSuccess } from "@/shared/utils/userFeedback";
import { Separator } from "@/shared/components/ui/Separator";
import { formatPrice } from "@/shared/utils/utils";

const BASE_PAYMENT_METHODS = [
  { id: "midtrans", label: "Midtrans", icon: Landmark },
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "cod", label: "Bayar di Tempat", icon: Banknote },
  { id: "transfer_manual", label: "Transfer Manual", icon: CreditCard },
];

// Opsi "Diambil Pembeli" ditambahkan di sisi klien karena backend hanya
// menghitung opsi pengiriman (haversine). Biaya = 0, tanpa alamat.
const PICKUP_OPTION = {
  id: "pickup",
  courier: "ambil_sendiri",
  service: "PICKUP",
  courier_label: "Diambil Pembeli",
  price: 0,
  cost: 0,
  description: "Ambil sendiri di toko sesuai jadwal survey yang dipilih.",
};

function formatAddress(address) {
  return [
    address.fullAddress,
    address.subdistrict,
    address.district,
    address.cityOrRegency,
    address.province,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

function shippingKey(option) {
  return `${String(option.courier || "").toLowerCase()}:${String(
    option.service || "",
  ).toLowerCase()}:${Number(option.price || option.cost || 0)}`;
}

function mergeShippingOptions(remoteOptions) {
  const rows = remoteOptions;
  const keys = new Set();

  return rows.filter((option) => {
    const key = shippingKey(option);

    if (keys.has(key)) {
      return false;
    }

    keys.add(key);
    return true;
  });
}

function getCreatedOrderRoute(order) {
  if (!order?.id) {
    return "/cart?tab=order";
  }

  return `/orders/${encodeURIComponent(order.id)}`;
}

function normalizeDirectItem(item = {}) {
  const quantity = Math.max(1, Number(item.quantity || 1));
  const price = Number(item.price || 0);

  return {
    cartItemId: null,
    productId: Number(item.productId ?? item.product_id ?? 0),
    variantId: Number(item.variantId ?? item.variant_id ?? 0),
    productName: item.productName || item.product_name || item.name || "Produk",
    variantLabel: item.variantLabel || item.variant_label || item.sku || "",
    sku: item.sku || "",
    price,
    quantity,
    subtotal: Number(item.subtotal ?? price * quantity),
    stock: Number(item.stock ?? 0),
    availableStock: Number(
      item.availableStock ?? item.available_stock ?? item.stock ?? 0,
    ),
    maxOrderQty: Number(item.maxOrderQty ?? item.max_order_qty ?? 0),
    allowsPreorder:
      typeof item.allowsPreorder === "boolean"
        ? item.allowsPreorder
        : typeof item.allows_preorder === "boolean"
          ? item.allows_preorder
          : true,
    imageUrl:
      item.imageUrl || item.image_url || item.image || item.thumbnail || "",
    attributes:
      item.attributes && typeof item.attributes === "object"
        ? item.attributes
        : {},
  };
}

export default function CheckoutPage() {
  const { items, refreshCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const addressesQuery = useAddresses();
  const createOrderMutation = useCreateOrder();
  const [addressId, setAddressId] = useState(null);
  const [shippingId, setShippingId] = useState("");
  const shippingTouchedRef = useRef(false);
  const [payment, setPayment] = useState("midtrans");
  // Tipe pesanan kini hanya `reguler` | `terjadwal`; stok habis otomatis
  // ditandai backend sebagai "menunggu produk" (preorder).
  const [orderType, setOrderType] = useState("reguler");
  const [preorderReleaseAt, setPreorderReleaseAt] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupNote, setPickupNote] = useState("");
  const initialVoucherCode = String(location.state?.voucherCode || "")
    .trim()
    .toUpperCase();
  const [voucherCode, setVoucherCode] = useState(initialVoucherCode);
  const [voucherSelectionMode, setVoucherSelectionMode] = useState(
    initialVoucherCode ? "manual" : "auto",
  );
  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [, setSubmitStage] = useState("");
  const isPreviewPage = location.pathname.endsWith("/preview");
  const addresses = addressesQuery.data || [];
  const directItems = useMemo(
    () =>
      Array.isArray(location.state?.directItems)
        ? location.state.directItems
            .map(normalizeDirectItem)
            .filter((item) => item.productId)
        : [],
    [location.state?.directItems],
  );
  const requestedIds = useMemo(
    () =>
      Array.isArray(location.state?.cartItemIds)
        ? location.state.cartItemIds.map(Number).filter(Boolean)
        : [],
    [location.state?.cartItemIds],
  );
  const selectedItems = useMemo(() => {
    if (directItems.length) {
      return directItems;
    }

    return requestedIds.length
      ? items.filter((item) => requestedIds.includes(item.cartItemId))
      : items;
  }, [directItems, items, requestedIds]);
  const anyOutOfStock = selectedItems.some(
    (item) => Number(item.availableStock ?? item.stock ?? 0) <= 0,
  );
  // Stok habis: pesanan tetap `reguler`, backend yang menandai "menunggu
  // produk" (is_preorder). Pesanan terjadwal ditolak saat stok habis.
  const effectiveOrderType = anyOutOfStock ? "reguler" : orderType;
  const waitingForProduct = anyOutOfStock;
  const cartItemIds = useMemo(
    () =>
      directItems.length
        ? []
        : selectedItems.map((item) => item.cartItemId).filter(Boolean),
    [directItems.length, selectedItems],
  );
  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [selectedItems],
  );
  const vouchersQuery = useCheckoutVouchers({
    enabled: selectedItems.length > 0,
  });
  const vouchers = vouchersQuery.data || [];
  const selectedAddress =
    addresses.find((address) => String(address.id) === String(addressId)) ||
    null;
  const shippingQuery = useShippingOptions(
    {
      addressId,
      cartItemIds,
      items: directItems,
    },
    Boolean(addressId && (cartItemIds.length || directItems.length)),
  );
  const shippingResult = shippingQuery.data || {};
  const remoteShippingOptions = Array.isArray(shippingResult)
    ? shippingResult
    : Array.isArray(shippingResult.options)
      ? shippingResult.options
      : [];
  const shippingWarnings = Array.isArray(shippingResult.warnings)
    ? shippingResult.warnings.filter(Boolean)
    : [];
  const shippingErrorMessage = shippingQuery.error
    ? getShippingError(shippingQuery.error)
    : "";
  const resolvedCartItemIds = Array.isArray(shippingResult.cartItemIds)
    ? shippingResult.cartItemIds.map(Number).filter(Boolean)
    : [];
  const effectiveCartItemIds = cartItemIds.length
    ? cartItemIds
    : resolvedCartItemIds;
  const shippingOptions = useMemo(() => {
    const remote = mergeShippingOptions(remoteShippingOptions);

    if (remote.some((option) => String(option.courier) === "ambil_sendiri")) {
      return remote;
    }

    return [...remote, PICKUP_OPTION];
  }, [remoteShippingOptions]);
  const shipping =
    shippingOptions.find(
      (option) => String(option.id) === String(shippingId),
    ) || shippingOptions[0];
  const isPickup = String(shipping?.courier || "") === "ambil_sendiri";
  const paymentConfigQuery = usePaymentConfig();
  const qris = paymentConfigQuery.data?.qris || {
    enabled: false,
    imageUrl: "",
    merchantName: "",
    notes: "",
  };
  const availablePaymentMethods = useMemo(() => {
    const list = BASE_PAYMENT_METHODS.filter((method) => {
      if (method.id === "qris") {
        return Boolean(qris.enabled && qris.imageUrl);
      }

      // COD tidak berlaku untuk pengambilan sendiri (dilakukan backend).
      if (method.id === "cod") {
        return !isPickup;
      }

      return true;
    }).map((method) =>
      method.id === "qris" ? { ...method, label: `QRIS${qris.merchantName ? ` (${qris.merchantName})` : ""}` } : method,
    );

    if (isPickup) {
      list.push({ id: "tunai_toko", label: "Tunai di Toko", icon: Store });
    }

    return list;
  }, [isPickup, qris.enabled, qris.imageUrl, qris.merchantName]);
  const shippingPrice = isPickup
    ? 0
    : Number(shipping?.price || shipping?.cost || 0);
  const availableVouchers = useMemo(
    () => getAvailableCheckoutVouchers(vouchers, selectedItems),
    [selectedItems, vouchers],
  );
  const bestVoucherResult = useMemo(
    () =>
      getBestCheckoutVoucher({
        vouchers: availableVouchers,
        items: selectedItems,
        shippingPrice,
      }),
    [availableVouchers, selectedItems, shippingPrice],
  );
  const bestVoucher = bestVoucherResult?.voucher || null;
  const selectedVoucher = useMemo(() => {
    const normalizedCode = String(voucherCode || "")
      .trim()
      .toUpperCase();

    if (!normalizedCode) return null;

    return (
      availableVouchers.find(
        (voucher) =>
          String(voucher.code || "")
            .trim()
            .toUpperCase() === normalizedCode,
      ) || null
    );
  }, [availableVouchers, voucherCode]);
  const voucherCodeNormalized = String(voucherCode || "").trim().toUpperCase();
  const voucherPreviewItems = useMemo(
    () =>
      selectedItems.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
      })),
    [selectedItems],
  );
  // Kelayakan + nominal voucher ditentukan backend (tanggal berlaku, kuota,
  // kuota per user, scope produk, minimal belanja/item) — bukan frontend.
  const voucherPreviewQuery = useVoucherPreview({
    enabled: Boolean(voucherCodeNormalized) && voucherPreviewItems.length > 0,
    voucherCode: voucherCodeNormalized,
    items: voucherPreviewItems,
    shippingCost: shippingPrice,
  });
  const voucherPreview = voucherPreviewQuery.data || null;
  const voucherCalculation = useMemo(() => {
    const local = calculateCheckoutVoucherDiscount({
      voucher: selectedVoucher,
      items: selectedItems,
      shippingPrice,
    });

    if (!voucherCodeNormalized || !voucherPreview) {
      return {
        ...local,
        source: "local",
        checking: Boolean(voucherCodeNormalized),
      };
    }

    const discount =
      voucherPreview.productDiscount + voucherPreview.shippingDiscount;

    return {
      discount,
      productDiscount: voucherPreview.productDiscount,
      shippingDiscount: voucherPreview.shippingDiscount,
      eligibleSubtotal: voucherPreview.eligibleSubtotal,
      eligibleShipping: shippingPrice,
      eligible: voucherPreview.valid && discount > 0,
      message: voucherPreview.valid
        ? discount > 0
          ? ""
          : local.message
        : voucherPreview.reason,
      source: "backend",
      checking: voucherPreviewQuery.isFetching,
    };
  }, [
    selectedItems,
    selectedVoucher,
    shippingPrice,
    voucherCodeNormalized,
    voucherPreview,
    voucherPreviewQuery.isFetching,
  ]);
  const voucherDiscount = voucherCalculation.discount;
  const totalBeforeVoucher = subtotal + shippingPrice;
  const total = Math.max(0, totalBeforeVoucher - voucherDiscount);
  const handleVoucherChange = useCallback((code) => {
    setVoucherSelectionMode("manual");
    setVoucherCode(String(code || "").trim().toUpperCase());
  }, []);
  const handleUseRecommendedVoucher = useCallback(() => {
    setVoucherSelectionMode("auto");
    setVoucherCode(String(bestVoucher?.code || "").toUpperCase());
  }, [bestVoucher?.code]);

  useEffect(() => {
    if (!addresses.length || addressId) {
      return;
    }

    const primary =
      addresses.find((address) => address.isPrimary) || addresses[0];
    setAddressId(primary.id);
  }, [addressId, addresses]);

  useEffect(() => {
    const deliveryOption = shippingOptions.find(
      (option) => String(option.courier) !== "ambil_sendiri",
    );
    const preferred = String((deliveryOption || shippingOptions[0])?.id || "");
    const current = shippingOptions.find(
      (option) => String(option.id) === String(shippingId),
    );

    if (!current) {
      if (preferred && preferred !== shippingId) setShippingId(preferred);
      return;
    }

    // "Diambil Pembeli" tidak boleh terpilih otomatis selama masih ada opsi
    // kurir: buyer jadi terhambat validasi jadwal survey tanpa alasan jelas.
    if (
      !shippingTouchedRef.current &&
      String(current.courier) === "ambil_sendiri" &&
      deliveryOption
    ) {
      setShippingId(String(deliveryOption.id));
    }
  }, [shippingId, shippingOptions]);

  useEffect(() => {
    if (availablePaymentMethods.some((method) => method.id === payment)) {
      return;
    }

    setPayment(availablePaymentMethods[0]?.id || "midtrans");
  }, [availablePaymentMethods, payment]);

  useEffect(() => {
    if (voucherSelectionMode !== "auto" || vouchersQuery.isLoading) {
      return;
    }

    const nextCode = String(bestVoucher?.code || "").toUpperCase();
    setVoucherCode((current) =>
      String(current || "").toUpperCase() === nextCode ? current : nextCode,
    );
  }, [bestVoucher?.code, voucherSelectionMode, vouchersQuery.isLoading]);

  if (selectedItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-600">Keranjang kosong</h2>
        <p className="mt-2 text-sm text-slate-500">
          Produk yang sudah menjadi pesanan dapat dilihat pada tab Order.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Link to="/">
            <Button variant="outline">Kembali Belanja</Button>
          </Link>
          <Link to="/cart?tab=order">
            <Button>Lihat Order</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Jadwal dikirim dalam format lokal (tanpa zona) agar sesuai parser backend.
  const scheduledAt =
    scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}` : "";
  const pickupAt =
    pickupDate && pickupTime ? `${pickupDate}T${pickupTime}` : "";

  const validateCheckout = () => {
    if (!shipping) {
      setError("Pilih layanan pengiriman terlebih dahulu.");
      return false;
    }

    if (!isPickup && !addressId) {
      setError("Pilih alamat pengiriman untuk layanan kurir.");
      return false;
    }

    if (isPickup && !pickupAt) {
      setError(
        "Tentukan tanggal & jam pengambilan (survey) untuk metode Diambil Pembeli.",
      );
      return false;
    }

    if (effectiveOrderType === "terjadwal" && !scheduledAt) {
      setError("Tentukan tanggal & jam kirim untuk pesanan terjadwal.");
      return false;
    }

    setError("");
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateCheckout() || checkoutSubmitting) return;

    let order;

    try {
      setCheckoutSubmitting(true);
      setSubmitStage("creating");
      setError("");
      order = await createOrderMutation.mutateAsync({
        addressId: isPickup ? null : addressId,
        cartItemIds: effectiveCartItemIds,
        items: effectiveCartItemIds.length ? [] : directItems,
        courier: shipping.courier,
        service: shipping.service,
        paymentMethod: payment,
        // Bila preview backend menyatakan voucher tidak berlaku, jangan kirim
        // kode voucher agar pesanan tetap dapat dibuat.
        voucherCode:
          voucherPreview && !voucherPreview.valid
            ? null
            : selectedVoucher?.code || null,
        orderType: effectiveOrderType,
        preorderReleaseAt:
          waitingForProduct && preorderReleaseAt ? preorderReleaseAt : null,
        scheduledAt:
          effectiveOrderType === "terjadwal" && scheduledAt
            ? scheduledAt
            : null,
        pickupAt: isPickup ? pickupAt : null,
        pickupNote: isPickup ? pickupNote : null,
      });
    } catch (requestError) {
      setError(getOrderError(requestError));
      setCheckoutSubmitting(false);
      setSubmitStage("");
      return;
    }

    refreshCart().catch(() => null);

    const orderRoute = getCreatedOrderRoute(order);
    const requiresPayment = payment === "midtrans";

    // Langsung pindah ke langkah 3 (detail pesanan). Sebelumnya buyer harus
    // menutup popup dulu dan halaman review berubah jadi "Keranjang kosong"
    // karena keranjang sudah dikosongkan setelah order dibuat.
    navigate(orderRoute, {
      replace: true,
      state: { orderCreated: true, autoPay: requiresPayment },
    });
    toastSuccess(
      "Pesanan berhasil dibuat",
      requiresPayment
        ? "Lanjutkan pembayaran untuk menyelesaikan pesanan."
        : "Pesanan sedang diproses oleh toko.",
    );
  };

  if (isPreviewPage) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:py-8">
        <OrderFlowStepper
          currentStep={2}
          title="Review & Konfirmasi"
          subtitle="Periksa pesanan sebelum dikirim"
          backLabel="Perbaiki Informasi"
          onBack={() => {
            if (!checkoutSubmitting) navigate("/checkout", { state: location.state });
          }}
        />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h1 className="text-lg font-black text-slate-900 sm:text-xl">Periksa pesanan sebelum dikirim</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">Pastikan produk, alamat, pengiriman, pembayaran, dan voucher sudah benar.</p>
          </div>

          <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-2">
            <section className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{isPickup ? "Pengambilan" : "Penerima"}</p>
              {isPickup ? (
                <>
                  <p className="mt-2 font-bold text-slate-900">Diambil pembeli di toko</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    {pickupAt ? `Jadwal ${new Date(pickupAt.replace(" ", "T")).toLocaleString("id-ID")}` : "Jadwal belum dipilih"}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 font-bold text-slate-900">{selectedAddress?.recipientName || "-"}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{selectedAddress ? formatAddress(selectedAddress) : "-"}</p>
                </>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Pengiriman dan Pembayaran</p>
              <p className="mt-2 font-bold text-slate-900">{isPickup ? "Diambil Pembeli" : `${shipping?.courier_label || shipping?.courier} ${shipping?.service}`}</p>
              <p className="mt-1 text-sm text-slate-600">{availablePaymentMethods.find((method) => method.id === payment)?.label || payment}</p>
              <p className="mt-2 text-xs font-black uppercase text-[#047857]">{effectiveOrderType === "terjadwal" ? "Pesanan Terjadwal" : "Reguler"}</p>
              {waitingForProduct ? <p className="mt-1 text-xs font-semibold text-amber-600">Menunggu produk (preorder otomatis, stok habis)</p> : null}
              {waitingForProduct && preorderReleaseAt ? <p className="mt-1 text-xs text-slate-500">Perkiraan rilis {new Date(preorderReleaseAt).toLocaleString("id-ID")}</p> : null}
              {effectiveOrderType === "terjadwal" && scheduledAt ? <p className="mt-1 text-xs text-slate-500">Jadwal kirim {new Date(scheduledAt.replace(" ", "T")).toLocaleString("id-ID")}</p> : null}
              {isPickup && pickupAt ? <p className="mt-1 text-xs text-slate-500">Jadwal ambil {new Date(pickupAt.replace(" ", "T")).toLocaleString("id-ID")}</p> : null}
              {isPickup && pickupNote ? <p className="mt-1 text-xs text-slate-500">Catatan: {pickupNote}</p> : null}
            </section>

            <section className="rounded-xl border border-slate-200 p-4 md:col-span-2">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Produk</p>
              <div className="mt-3 divide-y divide-slate-100">
                {selectedItems.map((item) => (
                  <div key={`preview-${item.productId}-${item.variantId}`} className="flex items-center gap-3 py-3">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" /> : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{item.productName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.variantLabel || "Varian utama"} ×{item.quantity}</p>
                    </div>
                    <strong className="text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-slate-50 p-4 md:col-span-2">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-3"><span className="text-slate-500">Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Ongkir</span><strong>{formatPrice(shippingPrice)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Voucher</span><strong>{selectedVoucher?.code || "Tidak digunakan"}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Diskon</span><strong className="text-[#047857]">-{formatPrice(voucherDiscount)}</strong></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="font-black text-slate-900">Total Pembayaran</span>
                <span className="text-xl font-black text-[#047857]">{formatPrice(total)}</span>
              </div>
            </section>
          </div>

          {error ? (
            <div className="mx-5 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600 sm:mx-7">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <Button
              variant="outline"
              disabled={checkoutSubmitting}
              onClick={() => navigate("/checkout", { state: location.state })}
            >
              Kembali Perbaiki
            </Button>
            <Button
              disabled={checkoutSubmitting}
              onClick={handleConfirmOrder}
              className="min-w-[190px]"
            >
{payment === "midtrans" ? "Konfirmasi & Bayar" : "Konfirmasi Pesanan"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:py-8">
      <OrderFlowStepper
        currentStep={1}
        title="Informasi Checkout"
        subtitle="Alamat, pengiriman, pembayaran, dan voucher"
        backLabel="Keranjang"
        onBack={() => navigate("/cart")}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-bold text-slate-900">
                <MapPin size={18} className="text-[#10B981]" />
                Alamat Pengiriman
              </h2>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="text-xs font-bold text-[#047857] hover:text-[#10B981]"
              >
                + Tambah Alamat
              </button>
            </div>

            {isPickup ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-800">
                Metode <strong>Diambil Pembeli</strong> dipilih — alamat tidak
                wajib. Cukup tentukan jadwal survey pengambilan di bagian
                pengiriman.
              </div>
            ) : null}

            {!addresses.length ? (
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="mt-4 w-full rounded-xl border-2 border-dashed border-slate-300 p-5 text-sm font-semibold text-slate-500 transition hover:border-[#10B981] hover:text-[#047857]"
              >
                Tambahkan alamat untuk menggunakan pengiriman Haversine
              </button>
            ) : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    String(addressId) === String(address.id)
                      ? "border-[#10B981] bg-emerald-50"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      className="mt-1 accent-[#10B981]"
                      checked={String(addressId) === String(address.id)}
                      onChange={() => setAddressId(address.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-sm text-slate-900">
                          {address.recipientName}
                        </p>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#047857] ring-1 ring-emerald-100">
                          {address.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {address.phoneNumber}
                      </p>
                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-600">
                        {formatAddress(address)}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <Truck size={18} className="text-[#10B981]" />
              Metode Pengiriman
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Semua metode yang valid ditampilkan bersamaan.
            </p>

            {selectedAddress &&
            !shippingQuery.isLoading &&
            !shippingQuery.error &&
            !shippingWarnings.length &&
            !shippingOptions.length ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-600">
                Ongkir belum tersedia. Pastikan koordinat toko dan alamat penerima sudah diisi (pengaturan ongkir Haversine di admin).
              </div>
            ) : null}

            {shippingQuery.error && shippingErrorMessage ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                {shippingErrorMessage}
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    String(shipping?.id) === String(option.id)
                      ? "border-[#10B981] bg-emerald-50"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <input
                    type="radio"
                    className="accent-[#10B981]"
                    checked={String(shipping?.id) === String(option.id)}
                    onChange={() => {
                      shippingTouchedRef.current = true;
                      setShippingId(String(option.id));
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {option.courier_label ||
                        String(option.courier || "").toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                      {option.service}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {option.description ||
                        "Estimasi mengikuti layanan pengiriman"}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-[#047857]">
                    {formatPrice(Number(option.price || option.cost || 0))}
                  </p>
                </label>
              ))}

            </div>

            {isPickup ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <CalendarClock size={16} className="text-[#047857]" />
                  Jadwal Survey Pengambilan
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Pesanan disiapkan dan diambil di toko sesuai tanggal & jam
                  yang kamu pilih.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    Tanggal Pengambilan
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={pickupDate}
                      onChange={(event) => setPickupDate(event.target.value)}
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                      required
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    Jam Pengambilan
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(event) => setPickupTime(event.target.value)}
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                      required
                    />
                  </label>
                </div>
                <label className="mt-3 grid gap-1.5 text-sm font-bold text-slate-700">
                  Catatan survey (opsional)
                  <input
                    type="text"
                    maxLength={255}
                    placeholder="Contoh: cek ukuran dan bahan sebelum ambil"
                    value={pickupNote}
                    onChange={(event) => setPickupNote(event.target.value)}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                  />
                </label>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <ShoppingBag size={18} className="text-[#10B981]" />
              Tipe Pesanan
            </h2>
            {waitingForProduct ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                Sebagian produk stok habis, sehingga pesanan ini otomatis
                ditandai <strong>Menunggu Produk (preorder)</strong> oleh
                sistem. Pilihan pesanan terjadwal tidak tersedia saat stok
                habis; pesanan diproses setelah toko selesai memproduksi.
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    id: "reguler",
                    label: "Reguler",
                    desc: "Diproses sesuai ketersediaan stok toko.",
                  },
                  {
                    id: "terjadwal",
                    label: "Pesanan Terjadwal",
                    desc: "Dikirim pada tanggal & jam yang kamu tentukan.",
                  },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      effectiveOrderType === option.id
                        ? "border-[#10B981] bg-emerald-50"
                        : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        name="order-type"
                        className="mt-0.5 accent-[#10B981]"
                        checked={effectiveOrderType === option.id}
                        onChange={() => setOrderType(option.id)}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">
                          {option.label}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                          {option.desc}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {effectiveOrderType === "terjadwal" && !waitingForProduct ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  Tanggal Kirim
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={scheduledDate}
                    onChange={(event) => setScheduledDate(event.target.value)}
                    className="h-10 rounded-md border border-slate-300 px-3 text-sm"
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  Jam Kirim
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                    className="h-10 rounded-md border border-slate-300 px-3 text-sm"
                    required
                  />
                </label>
              </div>
            ) : null}
            {waitingForProduct ? (
              <label className="mt-4 grid gap-1.5 text-sm font-bold text-slate-700">
                Perkiraan Tanggal Rilis (opsional)
                <input
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  value={preorderReleaseAt}
                  onChange={(event) => setPreorderReleaseAt(event.target.value)}
                  className="h-10 rounded-md border border-slate-300 px-3 text-sm"
                />
              </label>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <CreditCard size={18} className="text-[#10B981]" />
              Metode Pembayaran
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {availablePaymentMethods.map((method) => {
                const Icon = method.icon;

                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      payment === method.id
                        ? "border-[#10B981] bg-emerald-50"
                        : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="radio"
                      className="accent-[#10B981]"
                      checked={payment === method.id}
                      onChange={() => setPayment(method.id)}
                    />
                    <Icon size={18} className="text-slate-600" />
                    <span className="text-sm font-bold text-slate-700">
                      {method.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {payment === "qris" ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                {qris.imageUrl ? (
                  <img
                    src={qris.imageUrl}
                    alt="QRIS Pembayaran"
                    className="mx-auto max-h-60 w-auto rounded-lg border border-slate-200 bg-white object-contain p-2"
                  />
                ) : (
                  <p className="text-center text-xs text-slate-500">
                    Gambar QRIS belum tersedia. Pilih metode pembayaran lain.
                  </p>
                )}
                <p className="mt-2 text-center text-sm font-bold text-slate-900">
                  {qris.merchantName || "QRIS"}
                </p>
                <p className="mt-1 text-center text-xs leading-5 text-slate-600">
                  {qris.notes ||
                    "Scan kode QRIS menggunakan aplikasi pembayaranmu, lalu kirim bukti pembayaran."}
                </p>
                <p className="mt-2 text-center text-[11px] leading-4 text-slate-500">
                  Pesanan diproses setelah pembayaran dikonfirmasi toko.
                </p>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <ShoppingBag size={18} className="text-[#10B981]" />
              Produk dan Voucher
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {selectedItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center gap-3 py-3"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-14 w-14 rounded-xl border border-slate-100 object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-bold text-slate-900">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.variantLabel || "Varian utama"} ×{item.quantity}
                    </p>
                  </div>
                  <strong className="shrink-0 text-sm text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <VoucherSearchSelect
                value={voucherCode}
                onChange={handleVoucherChange}
                label="Cari dan pilih voucher"
                vouchers={availableVouchers}
                loading={false}
                error={vouchersQuery.error}
                recommendedVoucher={bestVoucher}
                onUseRecommended={handleUseRecommendedVoucher}
                allowManualInput={false}
                emptyMessage="Belum ada voucher aktif yang memenuhi syarat untuk pesanan ini."
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
          <h3 className="font-black text-slate-900">Ringkasan Pesanan</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between gap-3">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Ongkir</span>
              <span>{formatPrice(shippingPrice)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="min-w-0">
                Diskon Voucher
                {selectedVoucher ? (
                  <span className="ml-1 font-semibold text-slate-800">
                    ({selectedVoucher.code})
                  </span>
                ) : null}
              </span>
              <span
                className={`shrink-0 font-semibold ${
                  voucherDiscount > 0 ? "text-[#047857]" : "text-slate-500"
                }`}
              >
                -{formatPrice(voucherDiscount)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Pengiriman</span>
              <span className="text-right font-semibold text-slate-800">
                {shipping?.courier_label || shipping?.courier}{" "}
                {shipping?.service}
              </span>
            </div>
          </div>

          {selectedVoucher && voucherCalculation.message ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
              {voucherCalculation.message}
            </div>
          ) : null}

          {selectedVoucher && voucherDiscount > 0 ? (
            <>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3 text-slate-500">
                  <span>Total sebelum voucher</span>
                  <span>{formatPrice(totalBeforeVoucher)}</span>
                </div>
                <div className="flex justify-between gap-3 font-semibold text-[#047857]">
                  <span>Total penghematan</span>
                  <span>-{formatPrice(voucherDiscount)}</span>
                </div>
              </div>
            </>
          ) : null}

          <Separator className="my-4" />
          <div className="flex items-center justify-between gap-4">
            <span className="font-black text-slate-900">Total</span>
            <span className="text-xl font-black text-[#047857]">
              {formatPrice(total)}
            </span>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-600">
              {error}
            </div>
          ) : null}

          <Button
            disabled={!shipping}
            onClick={() => {
              if (validateCheckout()) {
                navigate("/checkout/preview", { state: location.state });
              }
            }}
            className="mt-5 w-full"
          >
            Lanjut ke Preview
          </Button>
          <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
            Pesanan tetap tersimpan jika popup pembayaran Midtrans ditutup atau
            gagal dimuat.
          </p>
        </aside>
      </div>

      <InstantAddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        defaultPrimary={addresses.length === 0}
        onCreated={(address) => {
          setAddressId(address.id);
          setShowAddressModal(false);
        }}
      />
    </div>
  );
}
