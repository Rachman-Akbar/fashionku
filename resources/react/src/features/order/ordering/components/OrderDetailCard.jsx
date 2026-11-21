import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import {
  useConfirmOrderReceived,
  useOrderDetail,
} from "@/features/order/ordering/orderService";
import { advancedError } from "@/features/advanced/services/advancedMarketplaceService";
import { openMidtransPayment } from "@/features/order/ordering/midtransService";
import { Skeleton, SkeletonLine } from "@/shared/components/feedback/Skeleton";
import { formatPrice } from "@/shared/utils/utils";
import { parseShipping } from "@/shared/utils/shipping";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M180 385h240l-74-94-54 68-42-52-70 78Z' fill='%23d1d5db'/%3E%3Ccircle cx='235' cy='235' r='35' fill='%23d1d5db'/%3E%3C/svg%3E";

function onImageError(event) {
  event.currentTarget.src = PLACEHOLDER_SVG;
}

function toNotice(value) {
  if (!value) return "";
  return typeof value === "string" ? value : String(value?.message || "");
}

/**
 * Kartu detail satu pesanan. Dipakai halaman /orders/:id (langkah 3 alur
 * pesanan) supaya markup detail tidak lagi menumpang di halaman keranjang.
 */
export default function OrderDetailCard({ orderId, onBack, paymentNotice = "", autoPay = false }) {
  const orderQuery = useOrderDetail(orderId);
  const order = orderQuery.data;
  const [paying, setPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const confirmMutation = useConfirmOrderReceived();
  const notice = toNotice(paymentNotice);
  const autoPayRef = useRef(false);

  // Callback stabil dipakai tombol "Bayar Sekarang" sekaligus pembayaran
  // otomatis setelah pesanan dibuat dari halaman review.
  const handlePayNow = async () => {
    const target = orderQuery.data;

    if (!target) return;

    try {
      setPaying(true);
      setPaymentMessage("");
      await openMidtransPayment(target, {
        onSuccess: () => orderQuery.refetch(),
        onPending: () => orderQuery.refetch(),
        onError: () => {
          setPaymentMessage("Pembayaran gagal. Silakan coba kembali.");
          orderQuery.refetch();
        },
        onClose: () => orderQuery.refetch(),
      });
    } catch (error) {
      setPaymentMessage(error?.message || "Pembayaran tidak dapat dibuka.");
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    const target = orderQuery.data;

    if (!autoPay || autoPayRef.current || !target) return;

    const paid = ["paid", "settlement", "success"].includes(
      String(target.paymentStatus || "").toLowerCase(),
    );

    if (paid || !(target.snapToken || target.paymentUrl || target.redirectUrl)) return;

    autoPayRef.current = true;
    handlePayNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPay, orderQuery.data?.id]);

  if (orderQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6" aria-busy="true">
        <div className="mb-5 flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="space-y-3">
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (orderQuery.error || !order) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
        <p className="text-sm font-semibold text-slate-500">Detail pesanan tidak ditemukan.</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
          {onBack ? (
            <button type="button" onClick={onBack} className="text-[#047857] hover:text-[#10B981]">
              Kembali
            </button>
          ) : null}
          <Link to="/cart?tab=order" className="text-[#047857] hover:text-[#10B981]">
            Lihat Riwayat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const subOrders = Array.isArray(order.subOrders) ? order.subOrders : [];
  const directItems = Array.isArray(order.items) ? order.items : [];
  const orderItems = directItems.length ? directItems : subOrders.flatMap((sub) => sub.items || []);
  const paymentStatus = String(order.paymentStatus || "").toLowerCase();
  const orderStatus = String(order.status || "").toLowerCase();
  const success =
    ["paid", "settlement", "success"].includes(paymentStatus) ||
    ["processing", "shipped", "completed", "delivered"].includes(orderStatus);
  const failed =
    ["cancelled", "failed", "expired"].includes(orderStatus) || paymentStatus === "failed";
  const StatusIcon = failed ? XCircle : success ? CheckCircle2 : Clock3;
  const statusColor = failed
    ? "text-red-500 bg-red-50"
    : success
      ? "text-[#047857] bg-emerald-50"
      : "text-amber-600 bg-amber-50";
  const title = failed ? "Dibatalkan" : success ? "Berhasil" : "Dibuat";
  const canPay =
    !["paid", "settlement", "success"].includes(paymentStatus) &&
    Boolean(order.snapToken || order.paymentUrl || order.redirectUrl);
  const noticeIsWarning =
    Boolean(paymentMessage) || /belum|gagal|error/i.test(notice);
  const statusLabel = noticeIsWarning ? "warning" : "success";


  const handleReceived = async () => {
    try {
      setActionMessage("");
      await confirmMutation.mutateAsync(order.id);
      setActionMessage("Pesanan diterima. Anda dapat memberikan review.");
      orderQuery.refetch();
    } catch (error) {
      setActionMessage(advancedError(error));
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#047857] hover:text-[#10B981]"
        >
          <ArrowLeft size={15} /> Kembali
        </button>
      ) : null}

      {notice || paymentMessage || actionMessage ? (
        <div
          className={`mb-4 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
            noticeIsWarning
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-emerald-200 bg-emerald-50 text-[#047857]"
          }`}
          data-tone={statusLabel}
        >
          {paymentMessage || actionMessage || notice}
        </div>
      ) : null}

      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${statusColor}`}>
          <StatusIcon size={22} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400">{order.orderNumber}</p>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              {order.orderType === "terjadwal"
                ? "Pesanan Terjadwal"
                : order.orderType === "manual"
                  ? "Pesanan Manual"
                  : "Pesanan Reguler"}
            </span>
            {order.isPreorder ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                Menunggu Produk
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {order.createdAt ? new Date(order.createdAt).toLocaleString("id-ID") : "-"}
          </p>
        </div>
      </div>

      <div className="grid gap-5 py-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Produk</h4>
          <div className="mt-2 divide-y divide-slate-50">
            {orderItems.map((item, index) => (
              <div
                key={`${item.id ?? index}-${item.productId}-${item.variantId}`}
                className="flex items-center gap-3 py-3"
              >
                {item.imageUrl ? (
                  <img
                    src={resolveMediaUrl(item.imageUrl)}
                    alt={item.productName}
                    className="h-12 w-12 rounded-xl object-cover"
                    loading="lazy"
                    onError={onImageError}
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-slate-800">{item.productName}</p>
                  <p className="text-xs text-slate-400">
                    {item.variantLabel || item.sku || "-"} x{item.quantity}
                  </p>
                </div>
                <strong className="shrink-0 text-sm text-slate-800">
                  {formatPrice(item.subtotal || item.price * item.quantity)}
                </strong>
              </div>
            ))}
            {!orderItems.length ? (
              <p className="py-3 text-xs text-slate-400">Rincian produk tidak tersedia.</p>
            ) : null}
          </div>
        </div>

        <aside className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ringkasan</h4>
          <div className="mt-3 space-y-2 text-sm text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal || Math.max(0, order.grandTotal - order.shippingCost))}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkir</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Diskon</span>
              <span>-{formatPrice(order.discountAmount + order.shippingDiscountAmount)}</span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between font-bold text-slate-800">
              <span>Total</span>
              <span className="text-[#047857]">{formatPrice(order.grandTotal)}</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alamat</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {parseShipping(order.shippingAddress).display || "-"}
            </p>
          </div>

          {order.orderType === "terjadwal" && order.scheduledAt ? (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jadwal Kirim</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {new Date(String(order.scheduledAt).replace(" ", "T")).toLocaleString("id-ID")}
              </p>
            </div>
          ) : null}

          {order.pickupAt ? (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jadwal Pengambilan</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {new Date(String(order.pickupAt).replace(" ", "T")).toLocaleString("id-ID")}
                {order.pickupNote ? ` — ${order.pickupNote}` : ""}
              </p>
            </div>
          ) : null}

          {order.isPreorder && order.preorderReleaseAt ? (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Perkiraan Rilis Produk</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {new Date(String(order.preorderReleaseAt).replace(" ", "T")).toLocaleString("id-ID")}
              </p>
            </div>
          ) : null}

          <p className="mt-3 text-[11px] text-slate-400">Bayar: {order.paymentMethod || "-"}</p>

          {orderStatus === "shipped" ? (
            <button
              type="button"
              disabled={confirmMutation.isPending}
              onClick={handleReceived}
              className="mt-3 w-full rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-white hover:bg-[#059669] disabled:opacity-60"
            >
              Sudah Diterima
            </button>
          ) : null}

          {canPay ? (
            <button
              type="button"
              disabled={paying}
              onClick={handlePayNow}
              className="mt-3 w-full rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-white hover:bg-[#059669] disabled:opacity-60"
            >
              {paying ? "Membuka Midtrans..." : "Bayar Sekarang"}
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
