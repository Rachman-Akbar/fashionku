import { CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { useOrders } from "@/features/order/ordering/orderService";
import { formatPrice } from "@/shared/utils/utils";
import { Badge } from "@/shared/components/ui/Badge";

const TYPE_LABELS = {
  order: { label: "Pesanan", className: "bg-orange-100 text-orange-700" },
};

function labelStatus(value = "") {
  const status = String(value).toLowerCase();
  if (["paid", "success", "settlement", "completed"].includes(status)) return "Berhasil";
  if (["failed", "cancelled", "expired"].includes(status)) return "Gagal";
  return "Diproses";
}

export default function PaymentsPage() {
  const ordersQuery = useOrders({ per_page: 50 });
  const orders = ordersQuery.data?.data || [];

  const allTransactions = [
    ...orders.map((o) => ({
      id: o.id,
      type: "order",
      reference: o.orderNumber,
      product: o.orderNumber,
      method: o.paymentMethod || "-",
      status: o.paymentStatus,
      total: o.grandTotal,
      date: o.createdAt,
    })),
  ].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return (
    <section
      className={profileLayout.contentShell}
      aria-label="Halaman pembayaran"
    >
      <div className={profileLayout.contentInner}>
        <div className={profileLayout.contentHeader}>
          <div>
            <span className={profileLayout.contentEyebrow}>Payment center</span>
            <h2 className={profileLayout.contentTitle}>Pembayaran</h2>
            <p className={`mt-2 ${profileLayout.contentDesc}`}>
              Riwayat pembayaran dari transaksi pesanan Anda.
            </p>
          </div>
        </div>

        <hr className={profileLayout.divider} />
        <div className="grid gap-8 py-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <span className="text-sm font-semibold text-slate-500">
              Gateway pembayaran
            </span>
            <strong className="mt-2 block text-4xl font-light tracking-tight text-slate-950">
              Midtrans
            </strong>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Status pembayaran diperbarui oleh notification webhook Midtrans
              dan ditampilkan dari data transaksi.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Metode yang Didukung
            </h3>
            {[
              "Midtrans Snap",
              "Cash on Delivery",
              "Transfer Manual",
              "Tunai di Toko",
            ].map((method) => (
              <div key={method} className="py-4">
                <div className="flex min-h-[52px] items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D1FAE5] text-[#10B981]">
                    <CreditCard size={20} />
                  </div>
                  <b className="text-sm font-semibold text-slate-950">
                    {method}
                  </b>
                </div>
                <hr className="mt-4 border-[#e5e7eb]" />
              </div>
            ))}
          </div>
        </div>

        <hr className={profileLayout.divider} />
        <div className="py-8">
          <div className="mb-4 flex min-h-[56px] items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Riwayat Transaksi
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Status dan nilai transaksi dari pesanan Anda.
              </p>
            </div>
            <Link
              to="/cart?tab=order"
              className="text-sm font-semibold text-[#10B981] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-2 py-3">Jenis</th>
                  <th className="px-2 py-3">Tanggal</th>
                  <th className="px-2 py-3">Referensi</th>
                  <th className="px-2 py-3">Metode</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((tx) => {
                  const typeInfo = TYPE_LABELS[tx.type] || TYPE_LABELS.order;
                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-[#eef0f2] text-sm text-slate-600"
                    >
                      <td className="px-2 py-4">
                        <Badge className={typeInfo.className}>{typeInfo.label}</Badge>
                      </td>
                      <td className="px-2 py-4">
                        {tx.date
                          ? new Date(tx.date).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-2 py-4 font-semibold text-slate-950">
                        {tx.reference || tx.product || "-"}
                      </td>
                      <td className="px-2 py-4">{tx.method}</td>
                      <td className="px-2 py-4">
                        {labelStatus(tx.status)}
                      </td>
                      <td className="px-2 py-4 text-right font-semibold text-slate-950">
                        {formatPrice(tx.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!ordersQuery.isLoading && !allTransactions.length ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Belum ada transaksi pembayaran.
            </p>
          ) : null}
        </div>

        <div className="mt-2 flex items-start gap-3 rounded-2xl bg-[#f7f8fa] p-4 text-sm text-slate-500">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#10B981]" />
          <p>
            Jangan mengubah status pembayaran dari frontend. Status final harus
            berasal dari webhook Midtrans yang tervalidasi.
          </p>
        </div>
      </div>
    </section>
  );
}
