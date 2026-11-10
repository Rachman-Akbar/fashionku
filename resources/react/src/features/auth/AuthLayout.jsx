import { Link } from "react-router-dom";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";

const BENEFITS = [
  "Belanja lebih cepat dengan voucher dan promo pilihan",
  "Pantau pesanan, wishlist, dan alamat dalam satu akun",
  "Sesi buyer, seller, chat, dan admin dipisahkan per jendela",
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative hidden min-h-[680px] overflow-hidden bg-gradient-to-br from-[#10B981] via-[#10B981] to-[#008c47] p-10 text-white lg:block">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
              <Link
                to="/"
                className="inline-flex w-fit items-center gap-3 rounded-2xl bg-white/14 px-4 py-3 ring-1 ring-white/20 transition hover:bg-white/20"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-black text-[#10B981]">
                  M
                </span>
                <div>
                  <p className="text-lg font-black leading-none">MarketKu</p>
                  <p className="mt-1 text-xs font-semibold text-white/75">
                    Marketplace terpercaya
                  </p>
                </div>
              </Link>

              <div className="mt-16 max-w-md">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/70">
                  Akun marketplace
                </p>
                <h1 className="mt-4 text-4xl font-black leading-tight">
                  Masuk dan lanjutkan belanja dengan pengalaman yang lebih
                  mudah.
                </h1>
                <p className="mt-5 text-sm leading-7 text-white/78">
                  Nikmati tampilan akun yang bersih, proses masuk yang cepat,
                  dan akses portal yang rapi tanpa mencampurkan sesi
                  antarjendela.
                </p>
              </div>

              <div className="mt-10 space-y-3">
                {BENEFITS.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white/12 p-4 ring-1 ring-white/15"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#10B981]">
                      ✓
                    </span>
                    <p className="text-sm font-semibold leading-6 text-white/88">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
                  <p className="text-2xl font-black">24J</p>
                  <p className="mt-1 text-xs text-white/70">Dukungan</p>
                </div>
                <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
                  <p className="text-2xl font-black">Aman</p>
                  <p className="mt-1 text-xs text-white/70">Transaksi</p>
                </div>
                <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
                  <p className="text-2xl font-black">Cepat</p>
                  <p className="mt-1 text-xs text-white/70">Checkout</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-screen flex-col bg-white lg:min-h-[680px]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-8 lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-base font-black text-white">
                  M
                </span>
                <span className="text-lg font-black text-[#10B981]">
                  MarketKu
                </span>
              </Link>
              <Link
                to="/"
                className="text-sm font-bold text-slate-500 transition hover:text-[#10B981]"
              >
                Kembali
              </Link>
            </div>

            <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
              <div className="w-full max-w-md">
                <RouteOutletBoundary compact />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
