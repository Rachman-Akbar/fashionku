import { useEffect, useMemo, useState } from "react";
import { CrudDialog } from "@/shared/components/crud";
import { Input } from "@/shared/components/ui/Input";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { useSellerProducts } from "@/features/seller/product/services/sellerProductService";
import { createManualOrder, getManualOrderError, useCreateManualOrder } from "@/features/seller/order/services/manualOrderService";
import { useCustomers } from "@/features/advanced/services/advancedMarketplaceService";
import { cn, formatPrice } from "@/shared/utils/utils";
import { inputClassName } from "@/shared/components/form/FormField";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { QuantityInput } from "@/shared/components/form/QuantityInput";
import { FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { FormPageLayout } from "@/shared/components/crud/FormPageLayout";
import { ImageFilePicker } from "@/shared/components/form/ImageFilePicker";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";

const COURIER_OPTIONS = [
  { value: "ambil_sendiri", label: "Ambil Sendiri" },
  { value: "jne", label: "JNE" },
  { value: "jnt", label: "J&T Express" },
  { value: "sicepat", label: "SiCepat" },
  { value: "pos", label: "POS Indonesia" },
  { value: "anteraja", label: "AnterAja" },
  { value: "manual", label: "Kurir / Manual" },
];

const PAYMENT_OPTIONS = [
  { value: "tunai_toko", label: "Tunai di Toko" },
  { value: "transfer_manual", label: "Transfer Manual" },
  { value: "cod", label: "COD" },
  { value: "manual", label: "Metode Lainnya" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
];

const PURCHASE_TYPE_OPTIONS = [
  { value: "reguler", label: "Reguler" },
  { value: "terjadwal", label: "Pesanan Terjadwal" },
];

function emptyLine() {
  return { key: Math.random().toString(36).slice(2), variantId: "", label: "", price: 0, stock: 0, quantity: 1 };
}

function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return "-";
    }
  };

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

export function ManualOrderForm({ open = true, onClose, onSaved }) {
  const productsQuery = useSellerProducts({ per_page: 100 });
  const customersQuery = useCustomers({ per_page: 100 }, { enabled: open });
  const createMutation = useCreateManualOrder();
  const notifications = useNotificationCenter();

  const [lines, setLines] = useState([emptyLine()]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("guest");
  const [guestCustomer, setGuestCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [courier, setCourier] = useState("manual");
  const [service, setService] = useState("");
  const [shippingCost, setShippingCost] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("tunai_toko");
  const [status, setStatus] = useState("processing");
  const [purchaseType, setPurchaseType] = useState("reguler");
  const [waitingProduct, setWaitingProduct] = useState(false);
  const [preorderReleaseAt, setPreorderReleaseAt] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState(null);

  const variantOptions = useMemo(() => {
    const options = [];
    (productsQuery.data?.rows || []).forEach((product) => {
      (product.variants || []).forEach((variant) => {
        options.push({
          value: String(variant.id),
          label: `${product.name}${variant.name ? ` - ${variant.name}` : ""}`,
          keywords: `${product.name} ${variant.sku || ""} ${(variant.values || []).map((value) => value.value).join(" ")}`,
          price: Number(variant.price || 0),
          stock: Number(variant.stock || 0),
        });
      });
    });
    return options;
  }, [productsQuery.data]);

  const customerOptions = useMemo(() => [
    { value: "guest", label: "Pelanggan Umum (Walk-in)", keywords: "guest tamu pelanggan umum walk-in", phone: "", address: "", email: "", name: "Pelanggan Umum", code: null },
    ...(customersQuery.data?.rows || []).map((customer) => ({
      value: String(customer.id),
      label: customer.name || "Pelanggan",
      keywords: [customer.name, customer.phone, customer.address, customer.email].filter(Boolean).join(" ").toLowerCase(),
      phone: customer.phone || "",
      address: customer.address || "",
      email: customer.email || "",
      name: customer.name || "",
      code: customer.code || null,
      avatar: customer.avatar || null,
      is_manual: customer.is_manual || false,
      is_active: customer.is_active !== false,
      orders_count: customer.orders_count || 0,
      total_spent: customer.total_spent || 0,
      last_order_at: customer.last_order_at || null,
      registered_at: customer.registered_at || null,
    })),
  ], [customersQuery.data]);

  const pickCustomer = (value) => {
    const val = String(value);
    if (val === "guest") {
      setGuestCustomer(true);
      setCustomerEmail("");
      setSelectedCustomerId("guest");
      setCustomerName("Pelanggan Umum");
      setCustomerPhone("");
      setAddress("");
      return;
    }
    setGuestCustomer(false);
    setSelectedCustomerId(val);
    const customer = customerOptions.find((option) => option.value === val);
    if (!customer) return;
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setAddress(customer.address);
    setCustomerEmail(customer.email);
  };

  const openCustomerDetail = () => {
    const customer = customerOptions.find((option) => option.value === selectedCustomerId);
    if (customer && customer.value !== "guest") {
      setDetailCustomer(customer);
    }
  };

  useEffect(() => {
    if (open) {
      setLines([emptyLine()]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setAddress("");
      setGuestCustomer(false);
      setSelectedCustomerId("guest");
      setCourier("manual");
      setService("");
      setShippingCost("0");
      setPaymentMethod("tunai_toko");
      setOrderNumber("");
      setStatus("processing");
      setPurchaseType("reguler");
      setWaitingProduct(false);
      setPreorderReleaseAt("");
      setScheduledAt("");
      setBusy(false);
      setDetailCustomer(null);
    }
  }, [open]);

  const changeLine = (key, patch) => {
    setLines((current) => current.map((line) => (line.key === key ? { ...line, ...patch } : line)));
  };

  const selectVariant = (key, value) => {
    const option = variantOptions.find((item) => item.value === String(value));
    changeLine(key, {
      variantId: value,
      label: option ? option.label : "",
      price: option ? option.price : 0,
      stock: option ? option.stock : 0,
      quantity: 1,
    });
  };

  const itemsTotal = lines.reduce((sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 0), 0);
  const shippingTotal = Number(shippingCost || 0);
  const grandTotal = itemsTotal + shippingTotal;
  const validLines = lines.filter((line) => line.variantId);

  const submit = async (event) => {
    event.preventDefault();
    if (!validLines.length) {
      toastError("Order Manual", "Pilih minimal satu produk untuk order manual.");
      return;
    }
    if (!guestCustomer && !customerName.trim()) {
      toastError("Order Manual", "Nama pelanggan wajib diisi.");
      return;
    }
    if (!guestCustomer && courier !== "ambil_sendiri" && !address.trim()) {
      toastError("Order Manual", "Alamat pengiriman wajib diisi.");
      return;
    }
    if (purchaseType === "terjadwal" && !scheduledAt) {
      toastError("Order Manual", "Tanggal kirim wajib diisi untuk pesanan terjadwal.");
      return;
    }
    setBusy(true);
    try {
      const isPickup = courier === "ambil_sendiri";
      const payload = {
        order_number: orderNumber.trim().toUpperCase() || null,
        customer_id: guestCustomer ? null : selectedCustomerId,
        customer_name: customerName.trim() || "Pelanggan Umum",
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || null,
        address: isPickup ? null : address.trim() || "Datang langsung ke toko",
        courier,
        service: service.trim() || null,
        shipping_cost: shippingTotal,
        payment_method: paymentMethod,
        payment_status: "paid",
        status,
        order_type: purchaseType === "reguler" && waitingProduct ? "preorder" : purchaseType,
        preorder_release_at: purchaseType === "reguler" && waitingProduct ? preorderReleaseAt || null : null,
        scheduled_at: purchaseType === "terjadwal" ? scheduledAt || null : null,
        items: validLines.map((line) => ({ variant_id: Number(line.variantId), quantity: Number(line.quantity || 0) })),
      };
      const saved = await createMutation.mutateAsync(payload);
      const task = notifications.startTask({ title: "Order Manual", message: `Membuat order manual "${saved.orderNumber || "#" + saved.id}"...` });
      task.success("Order manual berhasil dibuat.");
      onSaved?.(saved);
      onClose?.();
    } catch (error) {
      toastError("Order Manual", getManualOrderError(error));
      setBusy(false);
    }
  };

  return (
    <CrudDialog open={open} onClose={onClose} title="Tambah Order Manual" subtitle="Order dicatat langsung sebagai kasir — produk, customer, ongkir, dan metode bayar ditentukan di sini." size="max-w-4xl">
      <form onSubmit={submit}>
        <FormEditorLayout
          actions={
            <FormActionDock tone="emerald" save={{ icon: "add", label: "Buat Order" }} disabled={busy || createMutation.isPending} />
          }
        >
          <FormPageLayout
            header={
              <div className="sticky top-0 z-30 -mx-3 -mt-px bg-slate-50 sm:-mx-4">
                <div className="px-3 pt-2 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">point_of_sale</span>
                    <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Form Order Manual</h2>
                  </div>
                </div>
              </div>
            }
          >
            <div className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center gap-[5px]">
                  <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Produk</h2>
                </div>
                <p className="text-xs text-slate-500">Pilih produk/varian dan tentukan jumlah. Stok otomatis terisi dari data produk.</p>

                {lines.map((line) => (
                  <div key={line.key} className="grid grid-cols-1 gap-[5px] rounded-[10px] border border-slate-200 p-3 sm:grid-cols-[minmax(0,1fr)_96px_40px]">
                    <SearchableSelect
                      value={line.variantId}
                      onChange={(value) => selectVariant(line.key, value)}
                      options={variantOptions}
                      placeholder="Pilih produk / varian"
                      searchPlaceholder={`${variantOptions.length} produk tersedia — cari nama atau SKU`}
                      emptyText="Produk tidak ditemukan atau belum tersedia"
                      className="w-full"
                      buttonClassName="h-10 !text-xs"
                    />
                    <div className="flex items-center gap-[5px]">
                      <label className="sr-only" htmlFor={undefined}>Qty</label>
                      <QuantityInput
                        min="1"
                        max={line.stock || 999999}
                        value={line.quantity}
                        onChange={(value) => changeLine(line.key, { quantity: Math.max(1, Number(value || 0)) })}
                        className={cn(inputClassName, "text-center font-bold")}
                        ariaLabel="Jumlah"
                      />
                      {line.variantId ? <p className="w-20 text-right text-[10px] font-bold text-slate-400">stok {line.stock}</p> : null}
                    </div>
                    <button type="button" onClick={() => setLines((current) => (current.length > 1 ? current.filter((item) => item.key !== line.key) : current))} className="flex h-10 w-10 items-center justify-center self-center text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Hapus produk">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setLines((current) => [...current, emptyLine()])} className="inline-flex h-10 items-center gap-[5px] rounded-lg border border-emerald-200 px-3 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Tambah Produk
                </button>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-[5px]">
                  <span className="material-symbols-outlined text-slate-400">person</span>
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Customer</h2>
                </div>

                <div className="rounded-[10px] border border-emerald-100 bg-emerald-50/50 px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-emerald-700">Pilih pelanggan tersimpan</p>
                    {selectedCustomerId !== "guest" && (
                      <button type="button" onClick={openCustomerDetail} className="inline-flex items-center gap-1 rounded-[10px] border border-emerald-200 bg-white px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50">
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Lihat Detail
                      </button>
                    )}
                  </div>
                  <SearchableSelect
                    value={selectedCustomerId}
                    onChange={pickCustomer}
                    options={customerOptions}
                    placeholder="Cari nama / no. HP / alamat pelanggan"
                    searchPlaceholder={`${customerOptions.length} pilihan tersedia`}
                    emptyText="Pelanggan tidak ditemukan"
                    clearable
                    buttonClassName="h-10 bg-white text-xs"
                  />
                  {guestCustomer ? (
                    <p className="mt-2 text-xs font-semibold text-emerald-700">
                      Pelanggan umum — order diisi otomatis sebagai tamu. Anda tidak perlu mengisi data apa pun; kosongkan saja untuk transaksi walk-in.
                    </p>
                  ) : null}
                </div>

                {guestCustomer ? (
                  <div className="flex items-center gap-[5px] rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                    Data otomatis terisi "Pelanggan Umum" — Nama, No. HP, Email, dan Alamat tidak diwajibkan.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      <span>Nama pelanggan<span className="ml-1 text-red-500">*</span></span>
                      <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nama pembeli / tamu" />
                    </label>
                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      <span>No. HP</span>
                      <Input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="08xxxxxxxxxx" />
                    </label>
                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      <span>Email</span>
                      <Input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Opsional" />
                      <span className="text-xs font-normal text-slate-500">Jika diisi dan sudah terdaftar, order dikaitkan ke akun tersebut.</span>
                    </label>
                    {courier === "ambil_sendiri" ? (
                      <div className="flex items-center gap-[5px] rounded-[10px] border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm font-semibold text-emerald-700 sm:col-span-2">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        Ambil sendiri di toko — alamat pengiriman tidak digunakan.
                      </div>
                    ) : (
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                        <span>Alamat pengiriman<span className="ml-1 text-red-500">*</span></span>
                        <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Alamat lengkap penerima" />
                      </label>
                    )}
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-[5px]">
                  <span className="material-symbols-outlined text-slate-400">local_shipping</span>
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Pengiriman & Pembayaran</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                    <span>No. Pesanan</span>
                    <Input value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} placeholder="Kosongkan agar sistem membuat nomor otomatis (mis. MAN-20260927-1A2B3C)" />
                    <span className="text-[11px] font-medium text-slate-500">Isi nomor manual bila toko sudah punya nomor sendiri, atau kosongkan untuk nomor otomatis.</span>
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    <span>Kurir</span>
                    <SearchableSelect value={courier} onChange={setCourier} options={COURIER_OPTIONS} clearable={false} buttonClassName="h-10" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    <span>Ongkir</span>
                    <FormattedNumberInput min="0" value={shippingCost} onChange={(value) => setShippingCost(value)} placeholder="0" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                    <span>Layanan / catatan kirim</span>
                    <Input value={service} onChange={(event) => setService(event.target.value)} placeholder="Contoh: Reguler, Same Day, atau catatan lain (opsional)" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    <span>Metode pembayaran</span>
                    <SearchableSelect value={paymentMethod} onChange={setPaymentMethod} options={PAYMENT_OPTIONS} clearable={false} buttonClassName="h-10" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    <span>Metode pembelian</span>
                    <SearchableSelect value={purchaseType} onChange={setPurchaseType} options={PURCHASE_TYPE_OPTIONS} clearable={false} buttonClassName="h-10" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    <span>Status pesanan</span>
                    <SearchableSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} clearable={false} buttonClassName="h-10" />
                  </label>
                  {purchaseType === "reguler" ? (
                    <div className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                      <span>Status persiapan barang</span>
                      <label className="flex items-center gap-[5px] rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-600">
                        <input
                          type="checkbox"
                          checked={waitingProduct}
                          onChange={(event) => setWaitingProduct(event.target.checked)}
                          className="h-4 w-4 accent-emerald-600"
                        />
                        Tandai menunggu produk (preorder)
                      </label>
                      <p className="text-[11px] font-medium text-slate-500">Pesanan menunggu produksi karena stok habis — tampil sebagai "Menunggu Produk" di daftar pesanan.</p>
                    </div>
                  ) : null}
                  {purchaseType === "reguler" && waitingProduct ? (
                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      <span>Perkiraan rilis (opsional)</span>
                      <Input type="date" min={new Date().toISOString().slice(0, 10)} value={preorderReleaseAt} onChange={(event) => setPreorderReleaseAt(event.target.value)} placeholder="Tanggal rilis" />
                    </label>
                  ) : null}
                  {purchaseType === "terjadwal" ? (
                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      <span>Tanggal kirim<span className="ml-1 text-red-500">*</span></span>
                      <Input type="date" min={new Date().toISOString().slice(0, 10)} value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
                    </label>
                  ) : null}
                </div>
                <div className="rounded-[10px] border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-xs font-semibold text-emerald-700">
                  Pembayaran dicatat lunas otomatis (kasir). Anda dapat mencetak nota setelah pesanan dibuat.
                </div>
              </section>

              <section className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-bold text-slate-800">{formatPrice(itemsTotal)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Ongkir</span><span className="font-bold text-slate-800">{formatPrice(shippingTotal)}</span></div>
                <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-black text-slate-900"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
              </section>
            </div>
          </FormPageLayout>
        </FormEditorLayout>

        <FormEditorFooter onCancel={onClose} submitLabel="Buat Order" submitIcon="add" disabled={busy || createMutation.isPending} tone="emerald" />
      </form>

      <CustomerDetailModal customer={detailCustomer} onClose={() => setDetailCustomer(null)} />
    </CrudDialog>
  );
}