import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { useOrders } from "@/features/order/ordering/orderService";
import { formatPrice } from "@/shared/utils/utils";

const STATUS_META = {
  Berhasil: { className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Gagal: { className: "bg-red-50 text-red-600", dot: "bg-red-500" },
  Diproses: { className: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

function labelStatus(value = "") {
  const status = String(value).toLowerCase();
  if (["paid", "success", "settlement", "completed"].includes(status)) return "Berhasil";
  if (["failed", "cancelled", "expired"].includes(status)) return "Gagal";
  return "Diproses";
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Diproses;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {status}
    </span>
  );
}

export default function PaymentsPage() {
  const ordersQuery = useOrders({ per_page: 50 });
  const orders = ordersQuery.data?.data || [];

  const transactions = orders
    .map((order) => ({
      id: order.id,
      reference: order.orderNumber || `Pesanan #${order.id}`,
      method: order.paymentMethod || "-",
      status: labelStatus(order.paymentStatus),
      total: Number(order.grandTotal || 0),
      date: order.createdAt,
    }))
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

  const summary = transactions.reduce(
    (acc, tx) => {
      acc.total += tx.total;
      if (tx.status === "Berhasil") acc.paid += tx.total;
      if (tx.status === "Diproses") acc.pending += 1;
      return acc;
    },
    { total: 0, paid: 0, pending: 0 },
  );

  const stats = [
    { label: "Transaksi", value: String(transactions.length) },
    { label: "Total nilai", value: formatPrice(summary.total) },
    { label: "Sudah dibayar", value: formatPrice(summary.paid) },
    { label: "Menunggu", value: `${summary.pending} transaksi` },
  ];

  return (
    <section className={profileLayout.contentShell} aria-label="Halaman pembayaran">
      <div className={profileLayout.contentInner}>
        <div className={profileLayout.contentHeader}>
          <div>
            <span className={profileLayout.contentEyebrow}>Pembayaran</span>
            <h2 className={profileLayout.contentTitle}>Riwayat pembayaran</h2>
            <p className={`mt-2 ${profileLayout.contentDesc}`}>
              Semua transaksi dari pesanan Anda, dari metode hingga status terakhir.
            </p>
          </div>
          <Link to="/cart?tab=order" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            Lihat pesanan <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="grid gap-6 border-y border-slate-100 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
              <p className="mt-1.5 text-xl font-light text-slate-950">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="py-8">
          <div className="hidden grid-cols-[110px_minmax(0,1fr)_140px_120px_140px] gap-4 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:grid">
            <span>Tanggal</span>
            <span>Referensi</span>
            <span>Metode</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>

          {ordersQuery.isLoading ? (
            <div className="space-y-3 py-6">
              {[0, 1, 2].map((row) => (
                <div key={row} className="h-12 animate-pulse rounded-lg bg-slate-50" />
              ))}
            </div>
          ) : null}

          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 py-4 sm:grid-cols-[110px_minmax(0,1fr)_140px_120px_140px]"
              >
                <span className="hidden text-xs text-slate-400 sm:block">{formatDate(tx.date)}</span>
                <span className="min-w-0 truncate text-sm font-semibold text-slate-950">{tx.reference}</span>
                <span className="hidden truncate text-sm text-slate-500 sm:block">{tx.method}</span>
                <span className="order-3 sm:order-none">
                  <StatusPill status={tx.status} />
                </span>
                <span className="text-right text-sm font-semibold text-slate-950">{formatPrice(tx.total)}</span>
                <span className="order-4 text-[11px] text-slate-400 sm:hidden">{formatDate(tx.date)} · {tx.method}</span>
              </div>
            ))}
          </div>

          {!ordersQuery.isLoading && !transactions.length ? (
            <div className="py-20 text-center">
              <h3 className="text-lg font-light text-slate-950">Belum ada transaksi</h3>
              <p className="mt-2 text-sm text-slate-500">Pembayaran dari pesanan Anda akan muncul di sini.</p>
            </div>
          ) : null}

          {ordersQuery.error ? (
            <p className="py-10 text-center text-sm text-slate-500">Riwayat pembayaran belum dapat dimuat. Coba muat ulang halaman.</p>
          ) : null}
        </div>

        <div className="flex items-start gap-3 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-400">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
          <p>Status pembayaran diperbarui otomatis oleh gateway dan tidak dapat diubah manual.</p>
        </div>
      </div>
    </section>
  );
}
