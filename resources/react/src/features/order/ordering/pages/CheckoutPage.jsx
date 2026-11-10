import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Banknote,
  CreditCard,
  Info,
  Landmark,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart } from "@/features/order/cart/context/CartContext";
import { useAddresses } from "@/features/profile/address/addressService";
import InstantAddressModal from "@/features/profile/address/components/InstantAddressModal";
import {
  getOrderError,
  getShippingError,
  isDestinationShippingOption,
  useCreateOrder,
  useShippingOptions,
} from "@/features/order/ordering/orderService";
import { openMidtransPayment } from "@/features/order/ordering/midtransService";
import VoucherSearchSelect from "@/features/order/voucher/components/VoucherSearchSelect";
import { useCheckoutVouchers } from "@/features/order/voucher/services/voucherService";
import {
  calculateCheckoutVoucherDiscount,
  getAvailableCheckoutVouchers,
  getBestCheckoutVoucher,
} from "@/features/order/voucher/utils/checkoutVoucher";
import { Button } from "@/shared/components/ui/Button";
import { showOrderCreatedAlert } from "@/shared/utils/userFeedback";
import { Separator } from "@/shared/components/ui/Separator";
import { formatPrice } from "@/shared/utils/utils";

const PAYMENT_METHODS = [
  { id: "midtrans", label: "Midtrans", icon: Landmark },
  { id: "cod", label: "Bayar di Tempat", icon: Banknote },
  { id: "transfer_manual", label: "Transfer Manual", icon: CreditCard },
];

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

  return `/cart?tab=order&orderId=${encodeURIComponent(order.id)}`;
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
    storeId: Number(item.storeId ?? item.store_id ?? 0),
    storeName: item.storeName || item.store_name || "Toko",
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
  const [payment, setPayment] = useState("midtrans");
  const [orderType, setOrderType] = useState("normal");
  const [preorderReleaseAt, setPreorderReleaseAt] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
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
  const effectiveOrderType = anyOutOfStock ? "preorder" : orderType;
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
  const checkoutStoreIds = useMemo(
    () =>
      [...new Set(selectedItems.map((item) => String(item.storeId || "")))]
        .filter(Boolean),
    [selectedItems],
  );
  const vouchersQuery = useCheckoutVouchers(checkoutStoreIds, {
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
  const destinationValue = String(
    selectedAddress?.komerceDestinationId || "",
  ).trim();
  const hasDestinationId = Boolean(
    destinationValue && destinationValue.toLowerCase() !== "null",
  );
  const shippingOptions = useMemo(
    () => mergeShippingOptions(remoteShippingOptions),
    [remoteShippingOptions],
  );
  const hasRajaOngkirOption = shippingOptions.some((option) =>
    isDestinationShippingOption(option),
  );
  const hasHaversineOption = shippingOptions.some(
    (option) => String(option.courier || "").toLowerCase() === "haversine",
  );
  const shipping =
    shippingOptions.find(
      (option) => String(option.id) === String(shippingId),
    ) || shippingOptions[0];
  const availablePaymentMethods = useMemo(() => PAYMENT_METHODS, []);
  const shippingPrice = Number(shipping?.price || shipping?.cost || 0);
  const shippingBreakdown = shipping?.storeBreakdown || shipping?.store_breakdown || null;
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
        shippingBreakdown,
      }),
    [availableVouchers, selectedItems, shippingBreakdown, shippingPrice],
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
  const voucherCalculation = useMemo(
    () =>
      calculateCheckoutVoucherDiscount({
        voucher: selectedVoucher,
        items: selectedItems,
        shippingPrice,
        shippingBreakdown,
      }),
    [selectedItems, selectedVoucher, shippingBreakdown, shippingPrice],
  );
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
    if (
      shippingOptions.some((option) => String(option.id) === String(shippingId))
    ) {
      return;
    }

    setShippingId(String(shippingOptions[0]?.id || ""));
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

  const validateCheckout = () => {
    if (!shipping) {
      setError("Pilih layanan pengiriman terlebih dahulu.");
      return false;
    }

    if (!addressId) {
      setError("Pilih alamat pengiriman untuk layanan kurir.");
      return false;
    }

    if (effectiveOrderType === "booking" && !scheduledAt) {
      setError("Tentukan jadwal kirim atau slot pickup untuk pesanan booking.");
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
        addressId,
        cartItemIds: effectiveCartItemIds,
        items: effectiveCartItemIds.length ? [] : directItems,
        courier: shipping.courier,
        service: shipping.service,
        paymentMethod: payment,
        voucherCode: selectedVoucher?.code || null,
        orderType: effectiveOrderType,
        preorderReleaseAt: preorderReleaseAt
          ? new Date(preorderReleaseAt).toISOString()
          : null,
        scheduledAt:
          effectiveOrderType === "booking" && scheduledAt
            ? new Date(scheduledAt).toISOString()
            : null,
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

    await showOrderCreatedAlert({
      orderNumber: order?.order_number || order?.orderNumber || "",
      orderId: order?.id || "",
      totalLabel: formatPrice(total),
      requiresPayment,
    });

    if (payment !== "midtrans") {
      navigate(orderRoute, {
        replace: true,
        state: { orderCreated: true },
      });
      return;
    }

    try {
      setSubmitStage("payment");
      await openMidtransPayment(order, {
        onSuccess: () =>
          navigate(orderRoute, {
            replace: true,
            state: { orderCreated: true },
          }),
        onPending: () =>
          navigate(orderRoute, {
            replace: true,
            state: { orderCreated: true },
          }),
        onError: () =>
          navigate(orderRoute, {
            replace: true,
            state: {
              orderCreated: true,
              paymentError:
                "Pembayaran Midtrans belum berhasil. Pesanan tetap tersimpan.",
            },
          }),
        onClose: () =>
          navigate(orderRoute, {
            replace: true,
            state: { orderCreated: true },
          }),
      });
    } catch (paymentError) {
      navigate(orderRoute, {
        replace: true,
        state: {
          orderCreated: true,
          paymentError: paymentError.message,
        },
      });
    }
  };

  if (isPreviewPage) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex items-center gap-3 text-sm text-slate-500">
          <button
            type="button"
            disabled={checkoutSubmitting}
            onClick={() => navigate("/checkout", { state: location.state })}
            className="flex items-center gap-2 rounded-lg px-2 py-1 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#047857] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke Checkout
          </button>
          <span>/</span>
          <span className="font-semibold text-[#047857]">Preview Pesanan</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10B981]">Tahap 2 dari 3</p>
                <h1 className="mt-1 text-2xl font-black text-slate-900">Periksa pesanan sebelum dikirim</h1>
                <p className="mt-1 text-sm leading-6 text-slate-500">Pastikan produk, alamat, pengiriman, pembayaran, dan voucher sudah benar.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[#047857]">Checkout selesai diisi</span>
                <span className="rounded-full bg-[#10B981] px-3 py-1.5 text-white">Preview</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-2">
            <section className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Penerima</p>
              <p className="mt-2 font-bold text-slate-900">{selectedAddress?.recipientName || "-"}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{selectedAddress ? formatAddress(selectedAddress) : "-"}</p>
            </section>

            <section className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Pengiriman dan Pembayaran</p>
              <p className="mt-2 font-bold text-slate-900">{shipping?.courier_label || shipping?.courier} {shipping?.service}</p>
              <p className="mt-1 text-sm text-slate-600">{PAYMENT_METHODS.find((method) => method.id === payment)?.label || payment}</p>
              <p className="mt-2 text-xs font-black uppercase text-[#047857]">{effectiveOrderType}</p>
              {effectiveOrderType === "preorder" && preorderReleaseAt ? <p className="mt-1 text-xs text-slate-500">Perkiraan rilis {new Date(preorderReleaseAt).toLocaleString("id-ID")}</p> : null}
              {effectiveOrderType === "preorder" && !preorderReleaseAt ? <p className="mt-1 text-xs text-slate-500">Preorder otomatis, tanpa kuota</p> : null}
              {effectiveOrderType === "booking" && scheduledAt ? <p className="mt-1 text-xs text-slate-500">Jadwal kirim/pickup {new Date(scheduledAt).toLocaleString("id-ID")}</p> : null}
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
    <div className="mx-auto max-w-7xl px-4 py-6"><div className="mb-5 grid grid-cols-3 gap-2 text-center text-xs font-bold"><div className="bg-emerald-600 px-3 py-2 text-white">1 Informasi</div><div className="bg-slate-100 px-3 py-2 text-slate-500">2 Review & Konfirmasi</div><div className="bg-slate-100 px-3 py-2 text-slate-500">3 Detail Order</div></div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#10B981]">
          Checkout
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">
          Step 1 · Informasi Checkout
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Isi alamat, pengiriman, pembayaran, voucher, dan tipe pesanan. Setelah itu lanjut ke review sebelum konfirmasi.
        </p>
      </div>

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
            !hasDestinationId &&
            !hasRajaOngkirOption ? (
              <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                <Info size={16} className="mt-0.5 shrink-0" />
                <span>
                  Ongkir kurir nasional tidak tersedia untuk area ini. Kamu
                  tetap dapat memilih metode pengiriman lain.
                </span>
              </div>
            ) : null}

            {shippingWarnings.length ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-600">
                {shippingWarnings.join(" ")}
              </div>
            ) : null}

            {selectedAddress &&
            !shippingQuery.isLoading &&
            !shippingQuery.error &&
            !shippingWarnings.length &&
            !remoteShippingOptions.length ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-600">
                Ongkir tidak tersedia untuk area ini. Periksa kembali alamat
                pengiriman atau coba area lain.
              </div>
            ) : null}

            {shippingQuery.error && shippingErrorMessage ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-600">
                Ongkir sementara tidak tersedia untuk alamat ini. Coba lagi atau
                periksa alamat pengiriman.
              </div>
            ) : null}

            {!shippingQuery.isLoading &&
            !shippingQuery.error &&
            !hasHaversineOption &&
            remoteShippingOptions.length > 0 ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                Haversine belum tersedia karena koordinat toko atau alamat
                penerima belum lengkap.
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
                    onChange={() => setShippingId(String(option.id))}
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
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <ShoppingBag size={18} className="text-[#10B981]" />
              Tipe Pesanan
            </h2>
            {anyOutOfStock ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                Sebagian produk stok habis, sehingga pesanan ini otomatis menjadi{" "}
                <strong>preorder (tanpa kuota)</strong>. Preorder ini tidak
                ditampilkan sebagai stok di marketplace dan akan diproses setelah
                toko selesai memproduksi.
              </div>
            ) : (
              <label
                className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  orderType === "booking"
                    ? "border-[#10B981] bg-emerald-50"
                    : "border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#10B981]"
                  checked={orderType === "booking"}
                  onChange={(event) =>
                    setOrderType(event.target.checked ? "booking" : "normal")
                  }
                />
                <span className="text-sm font-bold text-slate-800">
                  Jadwalkan kirim/pickup (Booking)
                </span>
                <span className="ml-auto text-[11px] leading-4 text-slate-500 sm:max-w-[220px]">
                  Pilih tanggal kirim (kurir) atau slot tanggal & jam (ambil
                  sendiri) untuk pesanan stok tersedia.
                </span>
              </label>
            )}
            {effectiveOrderType === "preorder" ? (
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
            {effectiveOrderType === "booking" ? (
              <label className="mt-4 grid gap-1.5 text-sm font-bold text-slate-700">
                Tanggal Kirim
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                  className="h-10 rounded-md border border-slate-300 px-3 text-sm"
                  required
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
                emptyMessage="Belum ada voucher yang aktif dan memenuhi syarat untuk toko dalam pesanan ini."
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
