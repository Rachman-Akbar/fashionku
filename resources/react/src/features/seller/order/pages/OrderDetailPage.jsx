import { useState } from "react";
import { StatusBadge } from "@/shared/components/feedback/StatusBadge";
import { ConfirmDialog } from "@/shared/components/crud";
import { FormPageLayout } from "@/shared/components/crud/FormPageLayout";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { Input } from "@/shared/components/ui/Input";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { parseShipping } from "@/shared/utils/shipping";
import { formatPrice } from "@/shared/utils/utils";
import { getOrderManagementError, orderTypeLabel, useDeleteOrder, useUpdateOrder, useUpdateOrderStatus } from "@/features/admin/order/services/orderManagementService";
import { useAuth } from "@/features/auth/context/AuthContext";
import { isOperatorRole } from "@/shared/utils/roles";
import { FormActionDock, FormEditorLayout } from "@/shared/components/crud";
import OrderPrintSheet from "@/features/seller/order/components/OrderPrintSheet";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { useCustomers } from "@/features/advanced/services/advancedMarketplaceService";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { CrudDialog } from "@/shared/components/crud/CrudDialog";

const STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "received", label: "Diterima" },
  { value: "completed", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
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

function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <CrudDialog open onClose={onClose} title="Detail Pelanggan" subtitle={customer.email || "Data pelanggan"} size="max-w-md" presentation="modal">
      <div className="space-y-5">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-xl font-black text-white">
            {customer.avatar ? <img src={customer.avatar} alt={customer.name || "Customer"} className="h-14 w-14 rounded-full object-cover" /> : (customer.name || "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold text-slate-900">{customer.name || "-"}</h2>
            <p className="truncate text-sm text-slate-500">{customer.email || "-"}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">Kode: {customer.code || "-"}</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${customer.is_manual ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
              {customer.is_manual ? "Manual" : "Transaksi"}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${customer.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {customer.is_active ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">No. HP</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{customer.phone || "-"}</p>
          </div>
          <div className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Alamat</p>
            <p className="mt-1 text-sm font-semibold text-slate-800 truncate">{customer.address || "-"}</p>
          </div>
          <div className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Jumlah Pesanan</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">{customer.orders_count || 0}</p>
          </div>
          <div className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Total Belanja</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">{formatPrice(customer.total_spent)}</p>
          </div>
          <div className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Pesanan Terakhir</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{customer.last_order_at ? formatDate(customer.last_order_at) : "-"}</p>
          </div>
          <div className="rounded-[10px] bg-white p-4 ring-1 ring-slate-200 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Terdaftar</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{customer.registered_at ? formatDate(customer.registered_at) : "-"}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="h-10 rounded-[10px] bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700">
            Tutup
          </button>
        </div>
      </div>
    </CrudDialog>
  );
}

export function OrderDetailForm({ row, onDeleted, onSaved }) {
  const { activeRole } = useAuth();
  const [printOpen, setPrintOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [statusOverride, setStatusOverride] = useState(null);
  const [activeTab, setActiveTab] = useState("produk");
  const [detailCustomer, setDetailCustomer] = useState(null);
  const deleteMutation = useDeleteOrder();
  const updateMutation = useUpdateOrder();
  const statusMutation = useUpdateOrderStatus();
  const customersQuery = useCustomers({ per_page: 100 }, { enabled: true });

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
  const isPreorder = Boolean(row?.isPreorder ?? raw.is_preorder ?? false)
    || String(raw.order_type || row?.orderType || "").trim().toLowerCase() === "preorder";
  const pickupAt = raw.pickup_at || row?.pickupAt || null;
  const pickupNote = raw.pickup_note || row?.pickupNote || "";

  const [status, setStatus] = useState(row?.status || "pending");
  const [statusReason, setStatusReason] = useState("");
  const [tracking, setTracking] = useState((raw.tracking_number || row?.trackingNumber || "").trim());
  const [customerName, setCustomerName] = useState(shipping.name || row?.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(shipping.phone || "");
  const [customerEmail, setCustomerEmail] = useState(raw.user_email || raw.customer_email || "");
  const [address, setAddress] = useState(shipping.address || "");
  const [courier, setCourier] = useState(raw.courier || "manual");
  const [service, setService] = useState(raw.service || "");
  const [shippingCost, setShippingCost] = useState(String(raw.shipping_cost ?? row?.shippingCost ?? 0));
  const paymentMethod = raw.payment_method || "-";
  const customerId = raw.customer_id || row?.customerId || raw.user_id || row?.userId || null;

  if (!row) return null;

  const savedStatus = statusOverride?.status || "";
  const orderStatus = statusOverride?.status || row.status || "pending";
  const printRow = { ...row, status: savedStatus || orderStatus, trackingNumber: statusOverride?.trackingNumber || tracking };
  const grandTotal = Math.max(0, subtotal + Number(shippingCost || 0) - discount - shippingDiscount);
  const canEditItems = isManual && ["pending", "processing"].includes(orderStatus);
  const customerLocked = !isManual;
  const canDelete = isManual || !isOperatorRole(activeRole);

  const findCustomer = () => {
    if (!customerId) return null;
    return customersQuery.data?.rows?.find((c) => String(c.id) === String(customerId)) || null;
  };

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
      if (!isManual) {
        await statusMutation.mutateAsync({ id: row.id, status, trackingNumber: tracking.trim(), reason: statusReason.trim() });
        setStatusOverride({ status, trackingNumber: tracking });
        onSaved?.({ status, trackingNumber: tracking });
        toastSuccess("Ubah Status Pesanan", "Status pesanan berhasil diperbarui.");
        return;
      }

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

  const openCustomerDetail = () => {
    const customer = findCustomer();
    if (customer) {
      setDetailCustomer(customer);
    }
  };

  return (
    <>
      <FormEditorLayout
        actions={
          <FormActionDock
            tone="emerald"
            save={{ icon: "save", label: isManual ? "Simpan" : "Simpan Status" }}
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
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase text-slate-700">{orderTypeLabel(raw.order_type || row?.orderType)}</span>
              {isPreorder ? <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase text-amber-700">Menunggu Produk</span> : null}
              {savedStatus ? <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase text-amber-700">Baru saja diubah</span> : null}
            </div>
          }
        >
          <div className="space-y-5">
            <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
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

              <div className="mt-3 overflow-x-clip rounded-[10px] ring-1 ring-slate-200">
                <div className="overflow-x-auto lg:overflow-x-clip">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="sticky top-[var(--list-toolbar-h,0px)] z-20 bg-slate-50 text-xs font-extrabold uppercase text-slate-500">
                      <tr>
                        <th className="bg-slate-50 px-4 py-2.5 shadow-[inset_0_-1px_0_0_#e2e8f0]">Produk</th>
                        <th className="bg-slate-50 px-4 py-2.5 text-center shadow-[inset_0_-1px_0_0_#e2e8f0]">Qty</th>
                        <th className="bg-slate-50 px-4 py-2.5 text-right shadow-[inset_0_-1px_0_0_#e2e8f0]">Harga</th>
                        <th className="bg-slate-50 px-4 py-2.5 text-right shadow-[inset_0_-1px_0_0_#e2e8f0]">Subtotal</th>
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
            </section>

            <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
              <div className="flex items-center gap-[5px]">
                <span className="material-symbols-outlined text-slate-400">person</span>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Customer</h2>
                {customerId && (
                  <button type="button" onClick={openCustomerDetail} className="ml-auto inline-flex items-center gap-1 rounded-[10px] border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50">
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    Lihat Detail
                  </button>
                )}
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
            </section>

            <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
              <div className="flex items-center gap-[5px]">
                <span className="material-symbols-outlined text-slate-400">local_shipping</span>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Pengiriman & Pembayaran</h2>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Kurir</span>
                  <SearchableSelect value={courier} onChange={setCourier} options={isManual ? MANUAL_COURIER_OPTIONS : COURIER_OPTIONS} clearable={false} disabled={!isManual} buttonClassName="h-10" />
                </label>
                {pickupAt ? (
                  <div className="flex items-center gap-[5px] rounded-[10px] border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700 sm:col-span-2">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    Ambil di Toko · {formatDate(pickupAt)}{pickupNote ? ` — ${pickupNote}` : ""}
                  </div>
                ) : null}
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Ongkir</span>
                  <Input type="number" min="0" value={shippingCost} onChange={(event) => setShippingCost(event.target.value)} placeholder="0" disabled={customerLocked} readOnly={customerLocked} />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Layanan / resi</span>
                  <Input value={service} onChange={(event) => setService(event.target.value)} placeholder="Contoh: Reguler atau no. resi (opsional)" disabled={!isManual} readOnly={!isManual} />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>No. Resi</span>
                  <Input value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="Opsional — contoh: JNE1234567890" />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Status pesanan</span>
                  <SearchableSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} clearable={false} buttonClassName="h-10" />
                </label>
                {["rejected", "cancelled"].includes(status) ? (
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                    <span>Alasan {status === "rejected" ? "penolakan" : "pembatalan"}</span>
                    <Input value={statusReason} onChange={(event) => setStatusReason(event.target.value)} placeholder="Alasan akan dikirim ke buyer melalui chat dan email" />
                  </label>
                ) : null}
                <div className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Metode pembayaran</span>
                  <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold uppercase text-slate-700">
                    {paymentMethod} {row?.paymentStatus ? `· ${row.paymentStatus}` : ""}
                  </div>
                </div>
              </div>
            </section>

            <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal ({totalItems} item)</span><span className="font-bold text-slate-800">{formatPrice(subtotal)}</span></div>
              {discount > 0 ? <div className="flex justify-between text-emerald-700"><span>Diskon</span><span className="font-bold">-{formatPrice(discount)}</span></div> : null}
              {shippingDiscount > 0 ? <div className="flex justify-between text-emerald-700"><span>Diskon Ongkir</span><span className="font-bold">-{formatPrice(shippingDiscount)}</span></div> : null}
              <div className="flex justify-between text-slate-600"><span>Ongkir</span><span className="font-bold text-slate-800">{formatPrice(Number(shippingCost || 0))}</span></div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-black text-slate-900"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
            </div>
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

      <CustomerDetailModal customer={detailCustomer} onClose={() => setDetailCustomer(null)} />
    </>
  );
}