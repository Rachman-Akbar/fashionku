import { Link } from "react-router-dom";
import { Badge } from "@/features/admin/dashboard/components/SectionCard";
import { formatPrice } from "@/shared/utils/utils";

function DeltaBadge({ value }) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return null;
  const percent = Number(value);
  const isUp = percent >= 0;

  return (
    <Badge
      className={
        isUp
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-red-50 text-red-700 ring-red-200"
      }
    >
      <span className="material-symbols-outlined mr-0.5 text-[13px]">
        {isUp ? "trending_up" : "trending_down"}
      </span>
      {isUp ? "+" : ""}
      {percent.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%
    </Badge>
  );
}

function KpiCard({ to, label, value, caption, icon, iconClassName, valueClassName, badge }) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between rounded-[12px] border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className={`mt-2 truncate text-[26px] font-black leading-none ${valueClassName || "text-slate-950"}`}>
            {value}
          </p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${iconClassName}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {badge}
        <p className="min-w-0 flex-1 text-xs font-semibold leading-snug text-slate-400">{caption}</p>
        <span className="material-symbols-outlined text-[16px] text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}

/**
 * Empat kartu ringkasan paling atas. Semuanya bisa diklik untuk langsung
 * menuju halaman terkait, sehingga dashboard berfungsi sebagai pintu masuk.
 */
export default function KpiGrid({ kpi }) {
  const net = Number(kpi.netToday || 0);
  const isSurplus = net >= 0;
  const hasYesterday = Number(kpi.omzetYesterday || 0) > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        to="/admin/orders"
        label="Omzet Hari Ini"
        value={formatPrice(kpi.omzet)}
        caption={
          hasYesterday
            ? `${Number(kpi.omzetOrders || 0).toLocaleString("id-ID")} pesanan · kemarin ${formatPrice(kpi.omzetYesterday)}`
            : `${Number(kpi.omzetOrders || 0).toLocaleString("id-ID")} pesanan masuk (tunai & online)`
        }
        icon="storefront"
        iconClassName="bg-emerald-50 text-emerald-700"
        badge={hasYesterday ? <DeltaBadge value={kpi.omzetDeltaPct} /> : null}
      />

      <KpiCard
        to="/admin/orders?status=pending"
        label="Pesanan Online Baru"
        value={`${Number(kpi.newOrders || 0).toLocaleString("id-ID")}`}
        caption={`${Number(kpi.pendingOrders || 0).toLocaleString("id-ID")} menunggu dikonfirmasi`}
        icon="shopping_bag"
        iconClassName="bg-blue-50 text-blue-700"
        badge={
          Number(kpi.pendingOrders || 0) > 0 ? (
            <Badge className="bg-blue-50 text-blue-700 ring-blue-200">Perlu diproses</Badge>
          ) : null
        }
      />

      <KpiCard
        to="/admin/cashflow"
        label="Selisih Kas Hari Ini"
        value={formatPrice(net)}
        caption={`Masuk ${formatPrice(kpi.incomeToday)} · Keluar ${formatPrice(kpi.expenseToday)}`}
        icon={isSurplus ? "account_balance_wallet" : "money_off"}
        iconClassName={isSurplus ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}
        valueClassName={isSurplus ? "text-emerald-600" : "text-red-600"}
        badge={
          <Badge className={isSurplus ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}>
            {isSurplus ? "Surplus" : "Minus"}
          </Badge>
        }
      />

      <KpiCard
        to="/admin/receivables-payables"
        label="Kasbon Berjalan"
        value={formatPrice(kpi.receivable)}
        caption={`${Number(kpi.receivableCount || 0).toLocaleString("id-ID")} pelanggan masih berhutang`}
        icon="handshake"
        iconClassName="bg-amber-50 text-amber-700"
      />
    </div>
  );
}
