import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      const detail = String(
        this.state.error?.message || this.state.error || "",
      );
      const showDetail = Boolean(import.meta.env?.DEV) && detail;

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <h2 className="text-xl font-bold text-[#181c1f]">Terjadi Kesalahan</h2>
          <p className="mt-2 max-w-md text-sm text-[#5f5e5e]">
            Aplikasi mengalami gangguan tak terduga. Silakan muat ulang halaman.
          </p>
          {showDetail ? (
            <pre className="mt-3 max-h-40 w-full max-w-md overflow-auto rounded-xl bg-slate-50 p-3 text-left text-[11px] leading-5 text-slate-500">
              {detail}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-[10px] bg-[#10B981] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
