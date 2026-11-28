import { useEffect, useRef, useState } from "react";

// Cache hasil import per runId (level modul). Jika komponen di-remount (mis.
// berpindah menu lalu kembali, atau StrictMode), hasil dipulihkan dari sini
// alih-alih menjalankan ulang proses import.
const importRunCache = new Map();

export function ImportProgressTab({ 
  module, 
  label, 
  file, 
  importMode, 
  createMissingRelations,
  onComplete,
  onError,
  onCancel,
  onClose,
  runId,
}) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("preparing");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const [logs, setLogs] = useState([]);
  const abortControllerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const logsRef = useRef([]);

  const addLog = (message, type = "info") => {
    const entry = { id: Date.now(), message, type, time: new Date().toLocaleTimeString() };
    logsRef.current = [...logsRef.current, entry];
    setLogs((prev) => [...prev, entry]);
  };

  const animateProgress = (targetProgress, duration = 500) => {
    const start = progress;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      setProgress(Math.round(start + (targetProgress - start) * eased));
      if (progressRatio < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const executeImport = async () => {
    if (!file) return;
    
    abortControllerRef.current = new AbortController();
    setStatus("uploading");
    setProgress(0);
    setStats({ total: 0, success: 0, failed: 0 });
    setLogs([]);
    addLog("Memulai proses import...", "info");

    try {
      const { importExcel, previewExcelImport, getExcelError } = await import("@/shared/excel/excelService");
      
      animateProgress(10);
      addLog("Mengunggah file...", "info");
      
      const preview = await previewExcelImport(module, file, { importMode });
      addLog(`Preview selesai: ${preview.total_rows || 0} baris data`, "info");
      
      const blocking = preview.blocking_relations || [];
      const missing = preview.missing_relations || [];
      
      if (blocking.length) {
        const details = blocking.slice(0, 5).map((item) => `${item.type}: ${item.name}`).join(", ");
        throw new Error(`Relasi wajib dibuat manual: ${details}${blocking.length > 5 ? ` dan ${blocking.length - 5} lainnya` : ""}`);
      }

      if (preview.requires_confirmation && missing.length && !createMissingRelations) {
        setStatus("waiting_confirmation");
        addLog(`Relasi belum tersedia: ${missing.slice(0, 6).map((item) => `${item.type}: ${item.name}`).join(", ")}${missing.length > 6 ? ` dan ${missing.length - 6} lainnya` : ""}`, "warning");
        addLog("Menunggu konfirmasi untuk membuat relasi otomatis...", "info");
        const confirmEvent = runId ? `import-confirm:${runId}` : "import-confirm";
        const cancelEvent = runId ? `import-cancel:${runId}` : "import-cancel";
        const confirmed = await new Promise((resolve) => {
          const handleConfirm = () => {
            window.removeEventListener(confirmEvent, handleConfirm);
            window.removeEventListener(cancelEvent, handleCancel);
            resolve(true);
          };
          const handleCancel = () => {
            window.removeEventListener(confirmEvent, handleConfirm);
            window.removeEventListener(cancelEvent, handleCancel);
            resolve(false);
          };
          window.addEventListener(confirmEvent, handleConfirm);
          window.addEventListener(cancelEvent, handleCancel);
        });
        
        if (!confirmed) {
          addLog("Import dibatalkan oleh pengguna", "info");
          setStatus("cancelled");
          onCancel?.();
          return;
        }
        addLog("Melanjutkan import dengan pembuatan relasi otomatis...", "info");
      }

      animateProgress(30);
      addLog("Memproses import...", "info");
      
      const result = await importExcel(module, file, (event) => {
        if (event.total) {
          const uploadProgress = Math.round((event.loaded / event.total) * 40);
          animateProgress(30 + uploadProgress);
        }
      }, { createMissingRelations: true, importMode });
      
      animateProgress(80);
      addLog("Menyimpan data...", "info");
      
      setStats({
        total: result.total_rows || 0,
        success: result.success_count || result.inserted_count || 0,
        failed: result.failed_count || result.error_count || 0
      });
      
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((err) => addLog(`${err.row}: ${err.message}`, "error"));
      }
      
      animateProgress(100);
      setStatus("completed");
      setResult(result);
      addLog(`Import selesai: ${result.message}`, "success");
      
      if (result.download_error_url) {
        addLog("File error tersedia untuk diunduh", "warning");
      }

      if (runId) {
        importRunCache.set(runId, {
          status: "completed",
          progress: 100,
          stats: { total: result.total_rows || 0, success: result.success_count || result.inserted_count || 0, failed: result.failed_count || result.error_count || 0 },
          result,
          logs: logsRef.current,
          error: null,
        });
      }
      
      onComplete?.(result);
      
    } catch (err) {
      const { getExcelError } = await import("@/shared/excel/excelService");
      const message = getExcelError(err);
      setError(message);
      setStatus("error");
      addLog(`Error: ${message}`, "error");
      if (runId) {
        importRunCache.set(runId, {
          status: "error",
          progress: 0,
          stats: { total: 0, success: 0, failed: 0 },
          result: null,
          logs: logsRef.current,
          error: message,
        });
      }
      onError?.(message);
    }
  };

  useEffect(() => {
    if (!file) return undefined;
    // Tunda 1 tick: React StrictMode menjalankan mount → cleanup → mount lagi
    // untuk tiap mount. Timer instance pertama dibatalkan sebelum berjalan,
    // sehingga import hanya dieksekusi sekali (tidak berulang).
    const timer = setTimeout(() => {
      const cached = runId ? importRunCache.get(runId) : null;
      if (cached) {
        setStatus(cached.status);
        setProgress(cached.progress ?? 100);
        setStats(cached.stats);
        setResult(cached.result);
        setError(cached.error || null);
        logsRef.current = cached.logs || [];
        setLogs(cached.logs || []);
        return;
      }
      executeImport();
    }, 0);
    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleRetry = () => {
    setError(null);
    setStatus("preparing");
    executeImport();
  };

  const handleClose = () => {
    if (status === "processing" || status === "uploading") {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
    onClose?.();
  };

  const isProcessing = ["preparing", "uploading", "processing", "waiting_confirmation"].includes(status);
  const isCompleted = status === "completed";
  const isError = status === "error";
  const isCancelled = status === "cancelled";

  return (
    <div className="overflow-hidden border border-slate-200 bg-white flex flex-col h-full">
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className={`material-symbols-outlined flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isError ? "bg-rose-50 text-rose-700" : 
            isCompleted ? "bg-emerald-50 text-emerald-700" : 
            isCancelled ? "bg-slate-100 text-slate-600" :
            "bg-blue-50 text-blue-700 animate-pulse"
          }`}>
            {isError ? "error" : isCompleted ? "check_circle" : isCancelled ? "cancel" : "cloud_upload"}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Import Excel</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Import {label}</h2>
            <p className="mt-1 text-sm text-slate-500">{file?.name || "Memproses..."}</p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={handleClose}
          disabled={isProcessing}
          className="inline-flex h-10 items-center justify-center gap-[5px] bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          {isProcessing ? "Proses Berjalan" : "Tutup"}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
        <div className="bg-slate-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Progress</h3>
            <span className="text-sm font-bold text-slate-700">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isError ? "bg-rose-500" : isCompleted ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Total: {stats.total}</span>
            <span className="text-emerald-600 font-bold">Berhasil: {stats.success}</span>
            <span className="text-rose-600 font-bold">Gagal: {stats.failed}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <h3 className="px-4 py-3 border-b border-slate-200 text-sm font-extrabold text-slate-900 bg-slate-50">Log Proses</h3>
          <div className="max-h-96 overflow-y-auto p-4 font-mono text-xs space-y-1">
            {logs.length === 0 ? (
              <div className="text-slate-400 text-center py-8">Menunggu proses dimulai...</div>
            ) : (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`flex gap-2 p-2 rounded ${
                    log.type === "error" ? "bg-rose-50 text-rose-700" :
                    log.type === "warning" ? "bg-amber-50 text-amber-700" :
                    log.type === "success" ? "bg-emerald-50 text-emerald-700" :
                    "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-slate-400 shrink-0">[{log.time}]</span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {isCompleted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
              <div>
                <p className="font-bold text-emerald-800">Import Selesai</p>
                <p className="text-sm text-emerald-700 mt-1">
                  {stats.success} data berhasil diimport <span className="text-emerald-400">|</span> {stats.failed} gagal diimport
                </p>
              </div>
            </div>
            {result?.download_error_url && (
              <a 
                href={result.download_error_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:underline"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Unduh File Error
              </a>
            )}
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-600 text-2xl">error</span>
              <div>
                <p className="font-bold text-rose-800">Import Gagal</p>
                <p className="text-sm text-rose-700 mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={handleRetry}
              className="mt-4 inline-flex h-10 items-center justify-center gap-[5px] bg-rose-600 px-5 text-sm font-bold text-white hover:bg-rose-700"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Coba Lagi
            </button>
          </div>
        )}

        {isCancelled && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-bold text-slate-800">Import dibatalkan</p>
            <p className="mt-1 text-sm text-slate-600">Tidak ada data yang dilanjutkan untuk diimport.</p>
          </div>
        )}

        {status === "waiting_confirmation" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600 text-2xl">help</span>
              <div className="flex-1">
                <p className="font-bold text-amber-800">Konfirmasi Diperlukan</p>
                <p className="text-sm text-amber-700 mt-1">Beberapa relasi belum tersedia. Lanjutkan untuk membuat relasi otomatis?</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => window.dispatchEvent(new Event(runId ? `import-confirm:${runId}` : "import-confirm"))}
                className="inline-flex h-10 items-center justify-center gap-[5px] bg-amber-600 px-5 text-sm font-bold text-white hover:bg-amber-700"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Lanjutkan
              </button>
              <button 
                onClick={() => window.dispatchEvent(new Event(runId ? `import-cancel:${runId}` : "import-cancel"))}
                className="inline-flex h-10 items-center justify-center gap-[5px] bg-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-300"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Batalkan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}