import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { parseShipping } from "@/shared/utils/shipping";

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function statusLabel(status) {
  return ({ pending: "Menunggu", processing: "Diproses", shipped: "Dikirim", received: "Diterima", completed: "Selesai", cancelled: "Dibatalkan" })[status] || status;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("id-ID");
}

function itemsOf(row) {
  const raw = row?.raw || {};
  if (Array.isArray(raw.items)) {
    return raw.items.map((item, index) => ({
      id: item.id ?? index,
      name: item.product_name || item.name || item.product?.name || `Item ${index + 1}`,
      sku: item.sku || "-",
      thumbnail: resolveMediaUrl(item.thumbnail || item.image_url || item.image || ""),
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unit_price ?? item.price ?? 0),
      subtotal: Number(item.subtotal ?? item.unit_price ?? item.price ?? 0) * (item.subtotal ? 1 : Number(item.quantity || 0)),
    }));
  }
  return [];
}

export default function OrderPrintSheet({ row, onClose }) {
  const items = useMemo(() => itemsOf(row), [row]);
  const raw = row?.raw || {};
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingCost = Number(raw.shipping_cost ?? row.shippingCost ?? 0);
  const total = Number(raw.grand_total ?? row.total ?? subtotal + shippingCost);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch {
        onCloseRef.current?.();
      }
    }, 150);
    const handleAfterPrint = () => onCloseRef.current?.();
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return createPortal(
    <div className="print-sheet">
      <div id="print-area" className="px-6 py-6 text-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <p className="text-lg font-black uppercase tracking-wide">{raw.store_name || row.storeName || "Toko"}</p>
            <p className="mt-0.5 text-xs text-slate-500">Surat Pesanan / Packing List</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-black">{raw.sub_order_number || row.subOrderNumber || "-"}</p>
            <p className="text-slate-500">Order: {raw.order_number || row.orderNumber || "-"}</p>
            <p className="text-slate-500">{formatDate(raw.created_at || row.createdAt)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="font-black uppercase tracking-wide text-slate-400">Status</p>
            <p className="mt-1 font-bold">{statusLabel(row.status)}</p>
            <p className="mt-1 text-slate-500">
              Pembayaran: {(row.paymentStatus || "pending").toUpperCase()} <br />
              Tipe: {(row.orderType || "normal").toUpperCase()}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="font-black uppercase tracking-wide text-slate-400">Pengiriman</p>
            <p className="mt-1 font-bold">{[raw.courier, raw.service].filter(Boolean).join(" / ") || "-"}</p>
            <p className="text-slate-500">Resi: {raw.tracking_number || row.trackingNumber || "-"}</p>
          </div>
        </div>

        <table className="mt-5 w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b-2 border-slate-300">
              <th className="py-2 font-black uppercase">Produk</th>
              <th className="py-2 text-center font-black uppercase">Qty</th>
              <th className="py-2 text-right font-black uppercase">Harga</th>
              <th className="py-2 text-right font-black uppercase">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-200">
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-[5px]">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" loading="lazy" />
                    ) : null}
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-[10px] text-slate-400">SKU: {item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">{money(item.unitPrice)}</td>
                <td className="py-2 text-right font-bold">{money(item.subtotal)}</td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan="4" className="py-4 text-center text-slate-400">Item tidak tersedia.</td></tr> : null}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal ({totalItems} item)</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Ongkir</span><span>{money(shippingCost)}</span></div>
            <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-black"><span>Total</span><span>{money(total)}</span></div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 text-xs">
          <div>
            <p className="font-black uppercase tracking-wide text-slate-400">Alamat Pengiriman</p>
            <p className="mt-1 whitespace-pre-line leading-relaxed text-slate-600">{parseShipping(raw.shipping_address || row.shippingAddress).display || "-"}</p>
          </div>
          <div>
            <p className="font-black uppercase tracking-wide text-slate-400">Penanggung Jawab</p>
            <div className="mt-16 flex justify-between border-t border-slate-300 pt-1"><span>{raw.store_name || row.storeName || ""}</span><span>Pembeli</span></div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}