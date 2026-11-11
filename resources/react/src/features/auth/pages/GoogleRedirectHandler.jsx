import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleRedirect } from "@/features/auth/services/authService";
import { Loader2, AlertCircle } from "lucide-react";

export default function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handledRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    if (handledRef.current) return undefined;
    handledRef.current = true;

    (async () => {
      try {
        const session = await handleGoogleRedirect({
          role: "buyer",
          deviceName: "marketplace-web-buyer",
          storageScope: "base",
        });
        if (!mounted) return;
        if (!session) {
          navigate("/auth/login", { replace: true });
          return;
        }
        window.dispatchEvent(new CustomEvent("marketku:session-changed"));
        navigate("/", { replace: true });
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Login Google gagal. Silakan coba lagi.");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-950 mb-2">Login Google Gagal</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">{error}</p>
          <button
            onClick={() => navigate("/auth/login", { replace: true })}
            className="rounded-xl bg-[#10B981] px-6 py-2.5 text-sm font-black text-white hover:bg-[#059669]"
          >
            Kembali ke Masuk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="animate-spin text-[#10B981]" />
        <p className="text-sm text-slate-600">Memproses login Google...</p>
      </div>
    </div>
  );
}
