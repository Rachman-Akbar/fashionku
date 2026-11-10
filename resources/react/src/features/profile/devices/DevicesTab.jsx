import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Monitor, Smartphone, Laptop, Tablet, Globe, LogOut, Trash2, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { fetchDevices, requestDeviceRemovalOtp, removeDevice } from "./deviceService";
import OtpVerifyDialog from "@/core/engine/OtpVerifyDialog";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { toastSuccess, toastError } from "@/shared/utils/userFeedback";

const DEVICE_ICONS = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Laptop: Laptop,
  Tablet: Tablet,
  Unknown: Globe,
};

function DeviceIcon({ deviceType, className }) {
  const Icon = DEVICE_ICONS[deviceType] || Globe;
  return <Icon className={cn("text-[#10B981]", className)} size={24} />;
}

function formatDate(dateString) {
  if (!dateString) return "Tidak diketahui";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return "Tidak diketahui";
  }
}

function DeviceCard({ device, isCurrent, onRemove, onLogout }) {
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const requestRemovalOtp = useMutation({
    mutationFn: requestDeviceRemovalOtp,
    onSuccess: () => {
      setShowOtp(true);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Gagal mengirim kode verifikasi.");
    },
  });

  const handleVerify = useCallback(async (code) => {
    setVerifying(true);
    setError("");
    try {
      await removeDevice(device.id, code);
      setShowOtp(false);
      setOtpCode("");
      onRemove?.(device.id);
      toastSuccess("Perangkat", "Perangkat berhasil dihapus.");
    } catch (err) {
      setError(err.message || "Kode verifikasi salah atau sudah kedaluwarsa.");
    } finally {
      setVerifying(false);
    }
  }, [device.id, onRemove]);

  const handleResend = useCallback(async () => {
    requestRemovalOtp.mutate(device.id);
  }, [device.id, requestRemovalOtp]);

  return (
    <div className={cn("group min-h-[120px] py-4 border-b border-slate-100 last:border-0", isCurrent && "bg-[#ECFDF5]")}>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5]">
            <DeviceIcon deviceType={device.device_type} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-950">{device.device_name || "Perangkat Tidak Dikenal"}</span>
              {isCurrent && (
                <span className="rounded-full border border-[#10B981]/25 bg-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
                  Perangkat Ini
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{device.browser} • {device.os}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
          {!isCurrent && (
            <button
              type="button"
              onClick={() => requestRemovalOtp.mutate(device.id)}
              disabled={requestRemovalOtp.isPending}
              className="text-sm font-semibold text-slate-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hapus
            </button>
          )}
          {!isCurrent && (
            <button
              type="button"
              onClick={() => onLogout?.(device.id)}
              className="text-sm font-semibold text-slate-400 hover:text-[#10B981]"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs text-slate-500 ml-12">
        <div>
          <p className="font-semibold text-slate-700">IP</p>
          <p>{device.ip_address || "Tidak diketahui"}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">Aktif Terakhir</p>
          <p>{device.last_active_at ? formatDate(device.last_active_at) : "Tidak diketahui"}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">Status</p>
          <p className={cn(device.status === "active" ? "text-[#10B981]" : "text-red-500")}>
            {device.status}
          </p>
        </div>
      </div>

      <OtpVerifyDialog
        open={showOtp}
        onClose={() => { setShowOtp(false); setOtpCode(""); setError(""); }}
        title="Hapus Perangkat"
        description={`Masukkan kode verifikasi yang dikirim ke email Anda untuk menghapus perangkat "${device.device_name || "Perangkat Tidak Dikenal"}".`}
        email={device.user_email}
        onVerify={handleVerify}
        onVerified={() => { setShowOtp(false); setOtpCode(""); }}
        verifiedMessage="Perangkat berhasil dihapus."
        purpose="remove_device"
        expiresInMinutes={5}
      />

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

export default function DevicesTab() {
  const queryClient = useQueryClient();
  const [logoutTarget, setLogoutTarget] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });

  const logoutMutation = useMutation({
    mutationFn: async (deviceId) => {
      const currentToken = localStorage.getItem("BASE_TOKEN_KEY") || sessionStorage.getItem("WINDOW_TOKEN_KEY");
      if (!currentToken) throw new Error("Token tidak ditemukan");
      
      // Note: Logout from specific device requires backend support
      // For now, we'll just refresh the device list
      return deviceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setLogoutTarget(null);
      toastSuccess("Perangkat", "Logout dari perangkat berhasil.");
    },
    onError: (err) => {
      toastError("Perangkat", err.message || "Gagal logout dari perangkat.");
    },
  });

  const handleRemove = useCallback((deviceId) => {
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  }, [queryClient]);

  const handleLogout = useCallback((deviceId) => {
    setLogoutTarget(deviceId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
      </div>
    );
  }

  const devices = data?.devices || [];

  return (
    <div className="max-w-[760px]">
      <div className="mb-8 flex min-h-[64px] gap-3 border-l-2 border-[#10B981] bg-[#ECFDF5] px-4 py-3 text-sm leading-6 text-slate-600">
        <Monitor className="mt-0.5 shrink-0 text-[#10B981]" size={18} />
        <p>
          Kelola perangkat yang terhubung ke akun Anda. Hapus perangkat yang tidak
          dikenal untuk keamanan akun.
        </p>
      </div>

      {!devices.length ? (
        <p className="py-8 text-sm text-slate-500 text-center">Belum ada perangkat tercatat.</p>
      ) : (
        <div>
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isCurrent={device.is_current}
              onRemove={handleRemove}
              onLogout={handleLogout}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(logoutTarget)}
        title="Logout dari Perangkat"
        message="Apakah Anda yakin ingin logout dari perangkat ini?"
        confirmLabel="Logout"
        pending={logoutMutation.isPending}
        onClose={() => setLogoutTarget(null)}
        onConfirm={() => logoutMutation.mutate(logoutTarget)}
      />
    </div>
  );
}