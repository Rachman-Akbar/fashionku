import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionCard } from "@/features/admin/dashboard/components/SectionCard";
import { LowStockList } from "@/features/admin/dashboard/components/StockPanels";
import { KasbonList } from "@/features/admin/dashboard/components/FinancePanels";

/**
 * Satu panel untuk dua hal yang butuh tindakan: stok menipis dan kasbon.
 * Tab membuat dashboard tetap ringkas tanpa informasi penting tersembunyi.
 */
export default function AttentionPanel({ lowStock = [], kasbon = [] }) {
  const [tab, setTab] = useState(lowStock.length ? "stock" : "kasbon");

  const tabs = [
    { key: "stock", label: "Stok Menipis", icon: "warning", count: lowStock.length, href: "/admin/stock" },
    { key: "kasbon", label: "Kasbon", icon: "handshake", count: kasbon.length, href: "/admin/receivables-payables" },
  ];
  const active = tabs.find((item) => item.key === tab) || tabs[0];
  const overdue = kasbon.filter((entry) => entry.overdueDays > 0).length;

  return (
    <SectionCard
      title="Perlu Tindakan"
      subtitle={
        active.key === "stock"
          ? lowStock.length
            ? `${lowStock.length} barang di bawah stok minimum`
            : "Semua stok aman"
          : overdue
            ? `${overdue} kasbon sudah jatuh tempo`
            : "Tidak ada kasbon terlambat"
      }
      icon="priority_high"
      iconClassName="bg-amber-50 text-amber-700"
      action={
        <Link
          to={active.href}
          className="inline-flex h-9 items-center gap-1 rounded-[10px] px-3 text-xs font-extrabold text-emerald-600 transition hover:bg-emerald-50"
        >
          Kelola
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      }
    >
      <div className="mb-3 flex items-center gap-1 rounded-[10px] bg-slate-100 p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            aria-pressed={tab === item.key}
            className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[7px] text-xs font-extrabold transition ${
              tab === item.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
            {item.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                item.count > 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"
              }`}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "stock" ? <LowStockList products={lowStock} /> : <KasbonList entries={kasbon.slice(0, 5)} />}
    </SectionCard>
  );
}
