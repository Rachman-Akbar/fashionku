import { Component } from "react";

/**
 * Batas error tingkat halaman.
 *
 * Sebelumnya satu error di dalam sebuah halaman membuat seluruh aplikasi
 * (navbar, footer, tab) diganti layar "Terjadi Kesalahan". Dengan boundary
 * ini hanya area konten yang diganti, navigasi tetap bisa dipakai.
 */
export default class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PageErrorBoundary caught:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const detail = String(this.state.error?.message || this.state.error || "");
    const showDetail = Boolean(import.meta.env?.DEV) && detail;

    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-lg font-black text-slate-900">Halaman gagal dimuat</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Bagian ini mengalami gangguan. Navigasi lain tetap bisa dipakai —
          coba muat ulang bagian ini, atau kembali ke halaman sebelumnya.
        </p>
        {showDetail ? (
          <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-slate-50 p-3 text-left text-[11px] leading-5 text-slate-500">
            {detail}
          </pre>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="rounded-xl bg-[#10B981] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#059669]"
          >
            Coba lagi
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#047857]"
          >
            Muat ulang
          </button>
        </div>
      </div>
    );
  }
}
