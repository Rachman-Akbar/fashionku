import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function greetingFor(date) {
  const hour = date.getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

/**
 * Sapaan singkat, tanggal hari ini, dan tombol aksi cepat.
 * Di bawahnya ada strip "perlu perhatian" yang menyorot hal mendesak
 * (stok menipis, pesanan menunggu, kasbon jatuh tempo) sekali lihat.
 */
export default function DashboardHeader({ userName, attention = [], onRefresh, refreshing = false }) {
  const now = new Date();

  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-600">Ringkasan Warung</p>
          <h1 className="mt-1 text-xl font-black leading-tight text-slate-950 sm:text-2xl">
            {greetingFor(now)}, {userName || "Pemilik Warung"}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {format(now, "EEEE, d MMMM yyyy", { locale: id })}
            </span>
            <span className="hidden text-slate-300 sm:inline">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {format(now, "HH:mm")} WIB
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/receivables-payables?new=receivable"
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-emerald-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700 sm:flex-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Catat Transaksi/Kasbon
          </Link>
          <Link
            to="/admin/cashflow?new=expense"
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-slate-300 bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
            Catat Pengeluaran
          </Link>
          <button
            type="button"
            onClick={onRefresh}
            title="Muat ulang data"
            aria-label="Muat ulang data dashboard"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <span className={`material-symbols-outlined text-[20px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
          </button>
        </div>
      </div>

      {attention.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-3.5 py-3">
          <span className="material-symbols-outlined text-[20px] text-amber-700">priority_high</span>
          <p className="text-sm font-extrabold text-amber-900">Perlu perhatian hari ini:</p>
          {attention.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-amber-800 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-100"
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
