import { useEffect, useMemo, useState } from "react";
import { CrudDialog } from "@/shared/components/crud";
import { Input } from "@/shared/components/ui/Input";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { useSellerProducts } from "@/features/seller/product/services/sellerProductService";
import { createManualOrder, getManualOrderError } from "@/features/seller/order/services/manualOrderService";
import { useCustomers } from "@/features/advanced/services/advancedMarketplaceService";
import { cn, formatPrice } from "@/shared/utils/utils";
import { inputClassName } from "@/shared/components/form/FormField";
import { FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { toastError } from "@/shared/utils/userFeedback";

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
  { value: "normal", label: "Langsung" },
  { value: "preorder", label: "Preorder" },
  { value: "booking", label: "Booking" },
];

function emptyLine() {
  return { key: Math.random().toString(36).slice(2), variantId: "", label: "", price: 0, stock: 0, quantity: 1 };
}

export function ManualOrderForm({ open = true, onClose, onSaved }) {
  const productsQuery = useSellerProducts({ per_page: 100 });
  const customersQuery = useCustomers({ per_page: 100 }, { enabled: open });
  const [lines, setLines] = useState([emptyLine()]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [guestCustomer, setGuestCustomer] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [courier, setCourier] = useState("manual");
  const [service, setService] = useState("");
  const [shippingCost, setShippingCost] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("tunai_toko");
  const [status, setStatus] = useState("processing");
  const [purchaseType, setPurchaseType] = useState("normal");
  const [preorderReleaseAt, setPreorderReleaseAt] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [busy, setBusy] = useState(false);

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
    { value: "guest", label: "Customer Guest (Pelanggan Umum)", keywords: "guest tamu pelanggan umum walk-in", phone: "", address: "" },
    ...(customersQuery.data?.rows || []).map((customer) => ({
      value: String(customer.id),
      label: customer.name || "Pelanggan",
      keywords: [customer.name, customer.phone, customer.address, customer.email].filter(Boolean).join(" ").toLowerCase(),
      phone: customer.phone || "",
      address: customer.address || "",
    })),
  ], [customersQuery.data]);

  const pickCustomer = (value) => {
    if (String(value) === "guest") {
      setGuestCustomer(true);
      setCustomerEmail("");
      return;
    }
    setGuestCustomer(false);
    const customer = customerOptions.find((option) => option.value === String(value));
    if (!customer) return;
    setCustomerName(customer.label);
    setCustomerPhone(customer.phone);
    setAddress(customer.address);
  };

  useEffect(() => {
    if (open) {
      setLines([emptyLine()]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setAddress("");
      setGuestCustomer(false);
      setCourier("manual");
      setService("");
      setShippingCost("0");
      setPaymentMethod("tunai_toko");
      setOrderNumber("");
      setStatus("processing");
      setPurchaseType("normal");
      setPreorderReleaseAt("");
      setScheduledAt("");
      setBusy(false);
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
    if (purchaseType === "booking" && !scheduledAt) {
      toastError("Order Manual", "Tanggal kirim wajib diisi untuk metode pembelian booking.");
      return;
    }
    setBusy(true);
    try {
      const isPickup = courier === "ambil_sendiri";
      const payload = {
        order_number: orderNumber.trim().toUpperCase() || null,
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
        order_type: purchaseType,
        preorder_release_at: purchaseType === "preorder" ? preorderReleaseAt || null : null,
        scheduled_at: purchaseType === "booking" ? scheduledAt || null : null,
        items: validLines.map((line) => ({ variant_id: Number(line.variantId), quantity: Number(line.quantity || 0) })),
      };
      const saved = await createManualOrder(payload);
      onSaved?.(saved);
            onClose?.();
    } catch (error) {
      toastError("Order Manual", getManualOrderError(error));
      setBusy(false);
    }
  };

  return (
    <CrudDialog open={open} onClose={onClose} title="Tambah Order Manual" subtitle="Order dicatat langsung sebagai kasir — produk, customer, ongkir, dan metode bayar ditentukan di sini." size="max-w-3xl">
      <form onSubmit={submit}>
        <FormEditorLayout
          actions={
            <FormActionDock tone="emerald" save={{ icon: "add", label: "Buat Order" }} disabled={busy} />
          }
        >
          <div className="space-y-5">
          <section className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Produk</p>
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
                  <input
                    type="number"
                    min="1"
                    max={line.stock || 999999}
                    value={line.quantity}
                    onChange={(event) => changeLine(line.key, { quantity: Math.max(1, Number(event.target.value || 0)) })}
                    className={cn(inputClassName, "text-center font-bold")}
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

          <section className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Customer</p>
            <div className="rounded-[10px] border border-emerald-100 bg-emerald-50/50 px-3 py-2.5">
              <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700">Pilih penerima tersimpan (seperti checkout)</div>
              <SearchableSelect
                value={guestCustomer ? "guest" : null}
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

          <section className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Pengiriman & Pembayaran</p>
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
                <Input type="number" min="0" value={shippingCost} onChange={(event) => setShippingCost(event.target.value)} placeholder="0" />
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
              {purchaseType === "preorder" ? (
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Perkiraan rilis preorder (opsional)</span>
                  <Input type="date" min={new Date().toISOString().slice(0, 10)} value={preorderReleaseAt} onChange={(event) => setPreorderReleaseAt(event.target.value)} placeholder="Tanggal rilis" />
                </label>
              ) : null}
              {purchaseType === "booking" ? (
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
        </FormEditorLayout>

        <FormEditorFooter onCancel={onClose} submitLabel="Buat Order" submitIcon="add" disabled={busy} tone="emerald" />
      </form>
    </CrudDialog>
  );
}