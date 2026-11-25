import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SectionCard, PanelEmpty, Badge } from "@/features/admin/dashboard/components/SectionCard";
import { useUpdateOrderStatus } from "@/features/admin/order/services/orderManagementService";
import { PAYMENT_LABELS, STATUS_LABELS, NEXT_STATUS } from "@/features/admin/services/adminDashboardService";
import { formatPrice } from "@/shared/utils/utils";
import { getApiMessage } from "@/core/utils/apiClient";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const STATUS_BADGE = {
  pending: "bg-blue-50 text-blue-700 ring-blue-200",
  processing: "bg-amber-50 text-amber-700 ring-amber-200",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  received: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "processing", label: "Disiapkan" },
  { key: "shipped", label: "Diantar" },
];

const COLLAPSED_COUNT = 3;

function itemSummary(order) {
  const names = order.items.map((item) => item.productName).filter(Boolean);
  if (!names.length) return "Belum ada rincian item";
  const first = names[0];
  return names.length > 1 ? `${first} +${names.length - 1} lainnya` : first;
}

function paymentLabel(method) {
  return PAYMENT_LABELS[method] || String(method || "-");
}

function timeLabel(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/**
 * Action center: pesanan online aktif dengan tombol ubah status cepat.
 * Status bisa disaring dan daftar diringkas agar tidak memanjang ke bawah.
 */
export default function OrderQueuePanel({ orders = [], total = 0 }) {
  const updateStatus = useUpdateOrderStatus();
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(
    () =>
      orders.reduce(
        (result, order) => ({ ...result, [order.status]: (result[order.status] || 0) + 1 }),
        { all: orders.length },
      ),
    [orders],
  );

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter],
  );

  const visible = expanded ? filtered : filtered.slice(0, COLLAPSED_COUNT);
  const remaining = filtered.length - visible.length;

  const handleChangeStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next || updateStatus.isPending) return;

    setPendingId(order.id);
    try {
      await updateStatus.mutateAsync({ id: order.orderId || order.id, status: next.status });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toastSuccess("Status pesanan diperbarui", `Pesanan ${order.orderNumber || order.id} kini "${STATUS_LABELS[next.status] || next.status}".`);
    } catch (error) {
      toastError("Gagal memperbarui status", getApiMessage(error, "Perubahan status pesanan gagal disimpan."));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <SectionCard
      title="Antrean Pesanan Online"
      subtitle={total > 0 ? `${total} pesanan aktif menunggu tindakan` : "Tidak ada pesanan yang menunggu"}
      icon="pending_actions"
      iconClassName="bg-blue-50 text-blue-700"
      action={
        <Link
          to="/admin/orders"
          className="inline-flex h-9 items-center gap-1 rounded-[10px] px-3 text-xs font-extrabold text-emerald-600 transition hover:bg-emerald-50"
        >
          Lihat semua
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      }
    >
      {!orders.length ? (
        <PanelEmpty icon="task_alt" text="Tidak ada pesanan yang menunggu" hint="Semua pesanan online sudah diproses." />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {FILTERS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setFilter(option.key);
                  setExpanded(false);
                }}
                aria-pressed={filter === option.key}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold ring-1 ring-inset transition ${
                  filter === option.key
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {option.label}
                <span className={`text-[10px] ${filter === option.key ? "text-slate-300" : "text-slate-400"}`}>
                  {counts[option.key] || 0}
                </span>
              </button>
            ))}
          </div>

          {!filtered.length ? (
            <PanelEmpty icon="inbox" text="Tidak ada pesanan di status ini" hint="Coba pilih status lain." />
          ) : (
            <ul className="space-y-2">
              {visible.map((order) => {
                const next = NEXT_STATUS[order.status];
                const isUpdating = pendingId === (order.orderId || order.id);

                return (
                  <li key={order.orderId || order.id} className="rounded-[10px] border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-extrabold text-slate-950">{order.customerName || "Pelanggan"}</p>
                        <Badge className={STATUS_BADGE[order.status] || "bg-slate-100 text-slate-600 ring-slate-200"}>
                          {STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-black text-slate-950">{formatPrice(order.total)}</p>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-600">{itemSummary(order)}</p>
                        <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-400">
                          {order.orderNumber || "-"} · {paymentLabel(order.raw?.payment_method)} · {timeLabel(order.createdAt)}
                        </p>
                      </div>
                      {next ? (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus(order)}
                          disabled={isUpdating}
                          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] bg-emerald-600 px-3 text-[11px] font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span className={`material-symbols-outlined text-[15px] ${isUpdating ? "animate-spin" : ""}`}>
                            {isUpdating ? "progress_activity" : next.icon}
                          </span>
                          {next.label}
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {remaining > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-2 w-full rounded-[8px] border border-dashed border-slate-300 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50"
            >
              Tampilkan {remaining} pesanan lainnya
            </button>
          ) : filtered.length > COLLAPSED_COUNT && expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-2 w-full rounded-[8px] border border-dashed border-slate-300 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50"
            >
              Ringkas daftar
            </button>
          ) : null}
        </>
      )}
    </SectionCard>
  );
}
