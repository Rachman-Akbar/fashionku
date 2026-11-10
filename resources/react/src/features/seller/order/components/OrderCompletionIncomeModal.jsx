import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Field, FormModal } from "@/features/advanced/components/FormModal";
import { advancedKeys } from "@/features/advanced/services/advancedMarketplaceService";
import { apiClient, getApiMessage } from "@/core/utils/apiClient";
import { updateOrderStatus } from "@/features/admin/order/services/orderManagementService";
import { Input } from "@/shared/components/ui/Input";
import OrderPrintSheet from "@/features/seller/order/components/OrderPrintSheet";

function formatInputValue(date) {
  const d = new Date(date || Date.now());
  const pad = (value) => String(value).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function OrderCompletionIncomeModal({ rows = [], open, onClose, onCompleted, onError }) {
  const queryClient = useQueryClient();
  const focus = rows[0] || null;
  const rest = rows.slice(1);
  const totalCount = rows.length;

  const defaultTitle = useMemo(() => {
    if (!focus) return "";
    const orderNumber = focus.orderNumber || focus.subOrderNumber || focus.orderId || "";
    return orderNumber ? `Pemasukan sesuai dengan no order ${orderNumber}` : "";
  }, [focus]);

  const defaultAmount = useMemo(() => {
    if (!focus) return "";
    const raw = focus.raw || {};
    const value = Number(raw.total_items_price || raw.total || focus.total || 0);
    return Number.isFinite(value) && value > 0 ? String(value) : "";
  }, [focus]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setBusy(false);
      setError("");
      setPrintOpen(false);
      return;
    }
    setTitle(defaultTitle);
    setAmount(defaultAmount);
    setDescription("");
    setOccurredAt(formatInputValue(new Date()));
    setError("");
    setBusy(false);
  }, [open, defaultTitle, defaultAmount]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!focus) return;
    if (!title.trim() || !occurredAt) {
      setError("Keterangan dan tanggal transaksi wajib diisi.");
      return;
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Nominal pemasukan harus lebih dari 0.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await apiClient.post("/api/v1/seller/finance", {
        order_id: focus.orderId,
        type: "income",
        title: title.trim(),
        description: description.trim() || null,
        amount: numericAmount,
        paid_amount: 0,
        status: "posted",
        occurred_at: new Date(occurredAt).toISOString(),
        is_active: true,
      });
      for (const row of [focus, ...rest]) {
        await updateOrderStatus(row.id, "completed", row.trackingNumber);
      }
      await queryClient.invalidateQueries({ queryKey: advancedKeys.finance });
      onCompleted?.(totalCount);
    } catch (caught) {
      const message = getApiMessage(caught, "Pemasukan gagal dicatat. Coba lagi.");
      setError(message);
      onError?.(caught);
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormModal
      open={open}
      title="Selesaikan Pesanan"
      subtitle="Mencatat pemasukan otomatis saat pesanan diselesaikan. Ubah isian bila perlu."
      onClose={onClose}
      onSubmit={handleSubmit}
      busy={busy}
      submitLabel="Selesaikan & Catat Pemasukan"
      extraActions={focus ? [{ icon: "print", label: "Cetak Nota", onClick: () => setPrintOpen(true) }] : []}
    >
      <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <p className="font-bold text-slate-700">{totalCount} pesanan akan diselesaikan.</p>
        <p className="mt-1 text-xs text-slate-500">
          {rows.map((row) => row.subOrderNumber || row.orderNumber).filter(Boolean).join(", ") || "Tanpa nomor pesanan"}
          {rest.length ? ` — pesanan lain dicatat dengan nominal & keterangan default.` : ""}
        </p>
      </div>
      {error ? <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <Field label="Keterangan" required>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Pemasukan sesuai dengan no order" />
      </Field>
      <Field label="Nominal Pemasukan (Rp)" required>
        <Input type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" />
      </Field>
      <Field label="Tanggal Transaksi" required>
        <Input type="datetime-local" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} />
      </Field>
      <Field label="Deskripsi" hint="Opsional. Detail tambahan transaksi.">
        <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ringkasan pemasukan" />
      </Field>
      {printOpen && focus ? <OrderPrintSheet row={focus} onClose={() => setPrintOpen(false)} /> : null}
    </FormModal>
  );
}