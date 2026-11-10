import { useState } from "react";
import { StatusBadge } from "@/shared/components/feedback/StatusBadge";
import { ConfirmDialog } from "@/shared/components/crud";
import { FormPageLayout } from "@/shared/components/crud/FormPageLayout";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { Input } from "@/shared/components/ui/Input";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { formatPrice } from "@/shared/utils/utils";
import { getOrderManagementError, useDeleteOrder, useUpdateOrder } from "@/features/admin/order/services/orderManagementService";
import { useAuth } from "@/features/auth/context/AuthContext";
import { FormActionDock, FormEditorLayout } from "@/shared/components/crud";
import OrderPrintSheet from "@/features/seller/order/components/OrderPrintSheet";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "received", label: "Diterima" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const COURIER_OPTIONS = [
  { value: "jne", label: "JNE" },
  { value: "jnt", label: "J&T Express" },
  { value: "sicepat", label: "SiCepat" },
  { value: "pos", label: "POS Indonesia" },
  { value: "anteraja", label: "AnterAja" },
  { value: "manual", label: "Kurir / Manual" },
];

const MANUAL_COURIER_OPTIONS = [
  ...COURIER_OPTIONS,
  { value: "ambil_sendiri", label: "Ambil Sendiri" },
];

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("id-ID");
}

function itemsOf(row) {
  if (Array.isArray(row?.items) && row.items.length) {
    return row.items.map((item, index) => {
      const unitPrice = Number(item.unitPrice ?? item.unit_price ?? item.price ?? 0);
      const quantity = Number(item.quantity || 0);
      return {
        id: item.id ?? index,
        name: item.productName || item.product_name || item.name || `Item ${index + 1}`,
        sku: item.sku || "-",
        thumbnail: resolveMediaUrl(item.thumbnail || item.image_url || item.image || ""),
        quantity,
        unitPrice,
        subtotal: Number(item.subtotal) || unitPrice * quantity,
      };
    });
  }
  const raw = row?.raw || {};
  if (Array.isArray(raw.items)) {
    return raw.items.map((item, index) => {
      const unitPrice = Number(item.unit_price ?? item.price ?? 0);
      const quantity = Number(item.quantity || 0);
      return {
        id: item.id ?? index,
        name: item.product_name || item.name || item.product?.name || `Item ${index + 1}`,
        sku: item.sku || "-",
        thumbnail: resolveMediaUrl(item.thumbnail || item.image_url || item.image || ""),
        quantity,
        unitPrice,
        subtotal: Number(item.subtotal) || unitPrice * quantity,
      };
    });
  }
  return [];
}

import { parseShipping } from "@/shared/utils/shipping";

function OrderDetailForm({ row, onDeleted, onSaved }) {
  const { activeRole } = useAuth();
  const [printOpen, setPrintOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [statusOverride, setStatusOverride] = useState(null);
  const deleteMutation = useDeleteOrder();
  const updateMutation = useUpdateOrder();

  const raw = row?.raw || {};
  const shipping = parseShipping(raw.shipping_address || row.shippingAddress);
  const items = itemsOf(row);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = Number(raw.discount_amount ?? raw.discountAmount ?? 0);
  const shippingDiscount = Number(raw.shipping_discount_amount ?? raw.shippingDiscountAmount ?? 0);
  const isManual = row?.is_manual === true
    || row?.orderType === "manual"
    || raw.order_type === "manual"
    || raw.is_manual === true
    || String(row?.orderNumber || raw.order_number || row?.subOrderNumber || raw.sub_order_number || "").startsWith("MAN-");

  const [status, setStatus] = useState(row?.status || "pending");
  const [tracking, setTracking] = useState((raw.tracking_number || row?.trackingNumber || "").trim());
  const [customerName, setCustomerName] = useState(shipping.name || row?.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(shipping.phone || "");
  const [customerEmail, setCustomerEmail] = useState(raw.user_email || raw.customer_email || "");
  const [address, setAddress] = useState(shipping.address || "");
  const [courier, setCourier] = useState(raw.courier || "manual");
  const [service, setService] = useState(raw.service || "");
  const [shippingCost, setShippingCost] = useState(String(raw.shipping_cost ?? row?.shippingCost ?? 0));
  const paymentMethod = raw.payment_method || "-";

  if (!row) return null;

  const savedStatus = statusOverride?.status || "";
  const orderStatus = statusOverride?.status || row.status || "pending";
  const printRow = { ...row, status: savedStatus || orderStatus, trackingNumber: statusOverride?.trackingNumber || tracking };
  const grandTotal = Math.max(0, subtotal + Number(shippingCost || 0) - discount - shippingDiscount);
  const canEditItems = isManual && ["pending", "processing"].includes(orderStatus);
  const customerLocked = !isManual;
  const isSeller = activeRole === "seller";
  const canDelete = isManual || !isSeller;

  const handleDelete = async () => {
    setDeleteMessage("");
    try {
      await deleteMutation.mutateAsync(row.id);
      setDeleteOpen(false);
      onDeleted?.();
    } catch (error) {
      setDeleteMessage(getOrderManagementError(error));
    }
  };

  const handleSave = async (event) => {
    if (event) event.preventDefault();
    setBusy(true);
    try {
      const result = await updateMutation.mutateAsync({
        id: row.id,
        payload: {
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email: customerEmail.trim() || null,
          address: address.trim(),
          courier,
          service: service.trim() || null,
          shipping_cost: Number(shippingCost || 0),
          status,
          tracking_number: tracking.trim() || null,
        },
      });
      setStatusOverride({ status: result?.data?.status || status, trackingNumber: result?.data?.tracking_number || tracking });
      onSaved?.({ status: result?.data?.status || status, trackingNumber: result?.data?.tracking_number || tracking });
      toastSuccess("Ubah Detail Pesanan", "Detail pesanan berhasil diperbarui.");
    } catch (error) {
      toastError("Ubah Detail Pesanan", getOrderManagementError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <FormEditorLayout
        actions={
          <FormActionDock
            tone="emerald"
            save={{ icon: "save", label: "Simpan" }}
            onSave={handleSave}
            disabled={busy}
            extraActions={[{ icon: "print", label: "Cetak Nota", onClick: () => setPrintOpen(true) }]}
            onDelete={canDelete ? () => setDeleteOpen(true) : undefined}
            deleteLabel="Hapus Pesanan"
          />
        }
      >
        <FormPageLayout
          title="Detail Pesanan"
          subtitle={`${raw.sub_order_number || row.subOrderNumber || `#${row.id}`} · Order ${raw.order_number || row.orderNumber || "-"} · ${formatDate(raw.created_at || row.createdAt)}`}
          lead={
            <div className="flex items-center gap-[5px]">
              <StatusBadge status={orderStatus} label={STATUS_OPTIONS.find((option) => option.value === orderStatus)?.label || orderStatus} />
              {savedStatus ? <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase text-amber-700">Baru saja diubah</span> : null}
            </div>
          }
        >
          <div className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
            <div className="flex items-center gap-[5px]">
              <span className="material-symbols-outlined text-slate-400">inventory_2</span>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Produk dalam Pesanan</h2>
            </div>

            {!canEditItems ? (
              <div className="mt-3 flex items-start gap-2.5 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px]">info</span>
                <div className="space-y-0.5">
                  <p className="font-extrabold uppercase tracking-wide text-[11px]">Tidak dapat mengubah produk</p>
                  <p>
                    {!isManual
                      ? "Order ini masuk dari marketplace sehingga barangnya tidak dapat diedit. Edit produk hanya tersedia untuk order yang dicatat manual oleh toko."
                      : "Produk hanya dapat diubah saat pesanan masih berstatus Menunggu atau Diproses."}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-3 overflow-hidden rounded-[10px] ring-1 ring-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-extrabold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Produk</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Harga</th>
                      <th className="px-4 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 pr-2">
                          <div className="flex items-center gap-3">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={item.name} className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-slate-200" loading="lazy" />
                            ) : (
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-800">{item.name}</p>
                              <p className="text-[11px] text-slate-400">SKU: {item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{formatPrice(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-extrabold text-slate-800">{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                    {!items.length ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">Item tidak tersedia pada data pesanan.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
            <div className="flex items-center gap-[5px]">
              <span className="material-symbols-outlined text-slate-400">person</span>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Customer</h2>
            </div>

            {customerLocked ? (
              <div className="mt-3 flex items-start gap-2.5 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px]">lock</span>
                <div className="space-y-0.5">
                  <p className="font-extrabold uppercase tracking-wide text-[11px]">Data pembeli tidak dapat diubah</p>
                  <p>Identitas dan alamat pembeli ditetapkan saat checkout. Hubungi admin bila perlu koreksi.</p>
                </div>
              </div>
            ) : null}

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Nama pelanggan{customerLocked ? "" : <span className="ml-1 text-red-500">*</span>}</span>
                <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nama pembeli" disabled={customerLocked} readOnly={customerLocked} />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>No. HP</span>
                <Input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="08xxxxxxxxxx" disabled={customerLocked} readOnly={customerLocked} />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Email</span>
                <Input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Opsional" disabled={customerLocked} readOnly={customerLocked} />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Alamat pengiriman{customerLocked ? "" : <span className="ml-1 text-red-500">*</span>}</span>
                <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Alamat lengkap penerima" disabled={customerLocked} readOnly={customerLocked} />
              </label>
            </div>
          </div>

          <div className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
            <div className="flex items-center gap-[5px]">
              <span className="material-symbols-outlined text-slate-400">local_shipping</span>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Pengiriman & Pembayaran</h2>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Kurir</span>
                <SearchableSelect value={courier} onChange={setCourier} options={isManual ? MANUAL_COURIER_OPTIONS : COURIER_OPTIONS} clearable={false} buttonClassName="h-10" />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Ongkir</span>
                <Input type="number" min="0" value={shippingCost} onChange={(event) => setShippingCost(event.target.value)} placeholder="0" disabled={customerLocked} readOnly={customerLocked} />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Layanan / resi</span>
                <Input value={service} onChange={(event) => setService(event.target.value)} placeholder="Contoh: Reguler atau no. resi (opsional)" />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>No. Resi</span>
                <Input value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="Opsional — contoh: JNE1234567890" />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Status pesanan</span>
                <SearchableSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} clearable={false} buttonClassName="h-10" />
              </label>
              <div className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Metode pembayaran</span>
                <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold uppercase text-slate-700">
                  {paymentMethod} {row?.paymentStatus ? `· ${row.paymentStatus}` : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal ({totalItems} item)</span><span className="font-bold text-slate-800">{formatPrice(subtotal)}</span></div>
            {discount > 0 ? <div className="flex justify-between text-emerald-700"><span>Diskon</span><span className="font-bold">-{formatPrice(discount)}</span></div> : null}
            {shippingDiscount > 0 ? <div className="flex justify-between text-emerald-700"><span>Diskon Ongkir</span><span className="font-bold">-{formatPrice(shippingDiscount)}</span></div> : null}
            <div className="flex justify-between text-slate-600"><span>Ongkir</span><span className="font-bold text-slate-800">{formatPrice(Number(shippingCost || 0))}</span></div>
            <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-black text-slate-900"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
        </FormPageLayout>
      </FormEditorLayout>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Pesanan"
        message="Pesanan belum dibayar berstatus menunggu akan dihapus dan stok dikembalikan. Pesanan yang sudah lunas atau sedang diproses tidak dapat dihapus."
        confirmLabel="Hapus Pesanan"
        pending={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
      {deleteMessage ? <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{deleteMessage}</p> : null}

      {printOpen ? <OrderPrintSheet row={printRow} onClose={() => setPrintOpen(false)} /> : null}
    </>
  );
}

export default OrderDetailForm;
export { OrderDetailForm };