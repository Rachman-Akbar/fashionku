import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  Info,
  KeyRound,
  Lock,
  LogOut,
  MapPinCheck,
  Monitor,
  Plus,
  ShieldCheck,
  Trash2,
  X,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context/AuthContext";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import EmailVerifyDialog from "@/core/engine/EmailVerifyDialog";
import {
  getAddressError,
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/features/profile/address/addressService";
import { apiClient, getApiMessage } from "@/core/utils/apiClient";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import {
  getMediaUploadError,
  uploadMarketplaceImage,
} from "@/shared/services/mediaUploadService";
import AddressMapTracker from "@/features/profile/address/components/AddressMapTracker";
import { resolveKomerceDestination } from "@/features/profile/address/destinationService";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { cn } from "@/shared/utils/utils";
import { confirmLogout, toastError, toastSuccess } from "@/shared/utils/userFeedback";
import DevicesTab from "@/features/profile/devices/DevicesTab";
import AccountDeletionTab from "@/features/profile/devices/AccountDeletionTab";

const TABS = [
  { key: "biodata", label: "Biodata" },
  { key: "alamat", label: "Alamat" },
  { key: "keamanan", label: "Keamanan" },
  { key: "perangkat", label: "Perangkat" },
  { key: "hapus-akun", label: "Hapus Akun" },
];

const EMPTY_ADDRESS = {
  label: "Rumah",
  recipientName: "",
  phoneNumber: "",
  country: "Indonesia",
  province: "",
  cityOrRegency: "",
  district: "",
  subdistrict: "",
  postalCode: "",
  fullAddress: "",
  notes: "",
  latitude: "",
  longitude: "",
  komerceDestinationId: "",
  isPrimary: false,
};

function Field({ label, children }) {
  return (
    <label className="block min-h-[74px] border-b border-[#e5e7eb] pb-3">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function BiodataTab({ user, refreshMe }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
  });
  const [message, setMessage] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async ({ verification_code } = {}) => {
      const response = await apiClient.put(
        `/api/v1/identity/users/${user.id}`,
        {
          ...form,
          verification_code,
        },
      );
      return response.data;
    },
    onSuccess: async () => {
      await refreshMe?.();
      toastSuccess("Biodata", "Biodata berhasil diperbarui.");
    },
    onError: (error) =>
      toastError("Biodata", getApiMessage(error, "Biodata gagal diperbarui.")),
  });

  const handleSave = () => {
    setMessage("");

    if (!form.name.trim()) {
      setMessage("Nama lengkap wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      setMessage("Email wajib diisi.");
      return;
    }

    setVerifyOpen(true);
  };

  return (
    <div className="max-w-[640px] space-y-6">
      <Field label="Nama Lengkap">
        <input
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="h-8 w-full border-0 bg-transparent p-0 text-[15px] font-medium text-slate-900 outline-none"
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="h-8 w-full border-0 bg-transparent p-0 text-[15px] font-medium text-slate-900 outline-none"
        />
      </Field>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
      <button
        type="button"
        disabled={mutation.isPending}
        onClick={handleSave}
        className={profileLayout.primaryButton}
      >
        "Simpan Perubahan"
      </button>

      <EmailVerifyDialog
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        title="Verifikasi perubahan biodata"
        description="Masukkan kode verifikasi yang dikirim ke email kamu untuk menyimpan perubahan biodata."
        onVerify={async (code) => {
          await mutation.mutateAsync({ verification_code: code });
        }}
        onVerified={() => setVerifyOpen(false)}
      />
    </div>
  );
}

function AddressForm({ initialValue, onClose }) {
  const [form, setForm] = useState(initialValue || EMPTY_ADDRESS);
  const [message, setMessage] = useState("");
  const [destinationStatus, setDestinationStatus] = useState({
    loading: false,
    message: "",
  });
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const isEdit = Boolean(initialValue?.id);
  const pending = createMutation.isPending || updateMutation.isPending;

  const addressValues = useMemo(
    () => ({
      country: form.country,
      province: form.province,
      cityOrRegency: form.cityOrRegency,
      district: form.district,
      subdistrict: form.subdistrict,
      postalCode: form.postalCode,
      fullAddress: form.fullAddress,
    }),
    [
      form.cityOrRegency,
      form.country,
      form.district,
      form.fullAddress,
      form.postalCode,
      form.province,
      form.subdistrict,
    ],
  );

  const update = (key, value) => {
    const resetDestination = [
      "province",
      "cityOrRegency",
      "district",
      "subdistrict",
      "postalCode",
    ].includes(key);

    setMessage("");
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(resetDestination ? { komerceDestinationId: "" } : {}),
    }));
  };

  const resolveDestination = async (values) => {
    setDestinationStatus({
      loading: true,
      message: "Mencocokkan tujuan logistik...",
    });

    try {
      const destination = await resolveKomerceDestination(values);
      setForm((current) => ({
        ...current,
        komerceDestinationId: destination.id,
      }));
      setDestinationStatus({
        loading: false,
        message: `Tujuan logistik ditemukan: ${destination.label || destination.subdistrict || destination.id}`,
      });
      return destination.id;
    } catch (error) {
      setDestinationStatus({
        loading: false,
        message: error.message,
      });
      return "";
    }
  };

  useEffect(() => {
    if (
      !form.subdistrict ||
      !form.district ||
      !form.cityOrRegency ||
      !form.province
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      resolveDestination(addressValues);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [
    addressValues,
    form.cityOrRegency,
    form.district,
    form.postalCode,
    form.province,
    form.subdistrict,
  ]);

  const resolveAddress = (address) => {
    setForm((current) => ({
      ...current,
      country: address.country || current.country,
      province: address.province || current.province,
      cityOrRegency: address.cityOrRegency || current.cityOrRegency,
      district: address.district || current.district,
      subdistrict: address.subdistrict || current.subdistrict,
      postalCode: address.postalCode || current.postalCode,
      fullAddress: address.fullAddress || current.fullAddress,
      komerceDestinationId: "",
    }));
  };

  const setCoordinate = ({ latitude, longitude }) => {
    setForm((current) => ({
      ...current,
      latitude,
      longitude,
    }));
  };

  const submit = async () => {
    const requiredValues = [
      form.label,
      form.recipientName,
      form.phoneNumber,
      form.province,
      form.cityOrRegency,
      form.district,
      form.subdistrict,
      form.postalCode,
      form.fullAddress,
      form.latitude,
      form.longitude,
    ];

    if (requiredValues.some((value) => String(value ?? "").trim() === "")) {
      setMessage(
        "Lengkapi identitas penerima, wilayah, alamat, dan pinpoint lokasi.",
      );
      return;
    }

    try {
      setMessage("");
      const values = { ...form };

      if (isEdit) {
        await updateMutation.mutateAsync({
          id: initialValue.id,
          values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }

      toastSuccess("Simpan Alamat", isEdit ? "Alamat berhasil diperbarui." : "Alamat berhasil ditambahkan.");
      onClose();
    } catch (error) {
      toastError("Simpan Alamat", getAddressError(error));
    }
  };

  return (
    <div className="max-w-[760px] space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { key: "label", label: "Label Alamat" },
          { key: "recipientName", label: "Nama Penerima" },
          { key: "phoneNumber", label: "Nomor Telepon" },
          { key: "country", label: "Negara" },
          { key: "province", label: "Provinsi" },
          { key: "cityOrRegency", label: "Kota / Kabupaten" },
          { key: "district", label: "Kecamatan" },
          { key: "subdistrict", label: "Kelurahan / Desa" },
          { key: "postalCode", label: "Kode Pos" },
        ].map((field) => (
          <label key={field.key} className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500">
              {field.label}
            </span>
            <input
              value={form[field.key]}
              onChange={(event) => update(field.key, event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#10B981]"
            />
          </label>
        ))}
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-500">
          Alamat Lengkap
        </span>
        <textarea
          value={form.fullAddress}
          onChange={(event) => update("fullAddress", event.target.value)}
          className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#10B981]"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-500">
          Catatan / Patokan
        </span>
        <input
          value={form.notes}
          onChange={(event) => update("notes", event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#10B981]"
        />
      </label>

      <AddressMapTracker
        latitude={form.latitude}
        longitude={form.longitude}
        addressValues={addressValues}
        onCoordinateChange={setCoordinate}
        onAddressResolved={resolveAddress}
      />

      <div className="rounded-2xl border border-[#10B981]/20 bg-[#ECFDF5] px-4 py-3">
        <p className="text-sm font-black text-slate-800">
          Tujuan logistik terisi otomatis
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {destinationStatus.message ||
            "OpenStreetMap mengisi wilayah dan backend mencocokkan ID tujuan kurir secara otomatis."}
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-500">
          Komerce Destination ID (opsional)
        </span>
        <input
          readOnly
          value={form.komerceDestinationId}
          placeholder="Terisi otomatis dari backend"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-500">Latitude</span>
          <input
            readOnly
            value={form.latitude}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-500">
            Longitude
          </span>
          <input
            readOnly
            value={form.longitude}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={form.isPrimary}
          onChange={(event) => update("isPrimary", event.target.checked)}
          className="accent-[#10B981]"
        />
        Jadikan alamat utama
      </label>

      {message ? <p className="text-sm text-red-500">{message}</p> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={profileLayout.secondaryButton}
        >
          Batal
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className={profileLayout.primaryButton}
        >
          "Simpan Alamat"
        </button>
      </div>
    </div>
  );
}

function AlamatTab() {
  const addressesQuery = useAddresses();
  const deleteMutation = useDeleteAddress();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const addresses = addressesQuery.data || [];

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  if (showForm)
    return (
      <AddressForm
        initialValue={editing}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );

  return (
    <div className="max-w-[760px]">
      <div className="mb-4 flex h-10 justify-end">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#10B981] hover:underline"
        >
          <Plus size={16} />
          Tambah Alamat
        </button>
      </div>
      
      {!addressesQuery.isLoading && !addresses.length ? (
        <p className="py-8 text-sm text-slate-500">
          Belum ada alamat tersimpan.
        </p>
      ) : null}
      <div>
        {addresses.map((address) => (
          <div key={address.id} className="group min-h-[152px] py-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-950">
                  {address.label}
                </span>
                {address.isPrimary ? (
                  <span className="rounded-full border border-[#10B981]/25 bg-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
                    Utama
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-3 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(address);
                    setShowForm(true);
                  }}
                  className="text-sm font-semibold text-slate-400 hover:text-[#10B981]"
                >
                  Ubah
                </button>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeleteTarget(address)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h4 className="text-[15px] font-semibold text-slate-950">
              {address.recipientName}
            </h4>
            <p className="mt-1 text-sm text-slate-500">{address.phoneNumber}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {[
                address.fullAddress,
                address.subdistrict,
                address.district,
                address.cityOrRegency,
                address.province,
                address.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            {address.notes ? (
              <p className="mt-1 text-xs font-medium text-slate-400">
                {address.notes}
              </p>
            ) : null}
            {address.latitude && address.longitude ? (
              <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-[#10B981]">
                <MapPinCheck size={15} />
                Pinpoint akurat
              </p>
            ) : null}
            <hr className="mt-5 border-[#e5e7eb]" />
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Alamat"
        message={`Alamat ${deleteTarget?.label ? `“${deleteTarget.label}” ` : ""}akan dihapus dari daftar alamat kamu.`}
        confirmLabel="Hapus Alamat"
        pending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function PasswordModal({ open, userId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    password: "",
    confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      password: "",
      confirmation: "",
    });
    setMessage("");
    setVerifyOpen(false);
    setSuccess(false);
  }, [open]);

  const handleSubmit = () => {
    setMessage("");

    if (form.password.length < 8) {
      setMessage("Kata sandi minimal 8 karakter.");
      return;
    }

    if (form.password !== form.confirmation) {
      setMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setVerifyOpen(true);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#10B981]">
                Keamanan akun
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Tambahkan kata sandi
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>

          {success ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5]">
                <CheckCircle2 size={34} className="text-[#10B981]" />
              </span>
              <h3 className="mt-4 text-lg font-black text-slate-950">
                Kata Sandi Berhasil Ditambahkan
              </h3>
              <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-500">
                Sekarang akun kamu juga bisa masuk menggunakan email dan kata sandi
                tanpa menghapus koneksi Google.
              </p>
            </div>
          ) : (
          <div className="space-y-4 px-6 py-5">
            <p className="text-sm leading-6 text-slate-500">
              Kata sandi memungkinkan akun Google ini masuk menggunakan email dan
              kata sandi tanpa menghapus koneksi Google.
            </p>

            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">
                Kata sandi baru
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10"
                autoComplete="new-password"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">
                Konfirmasi kata sandi
              </span>
              <input
                type="password"
                value={form.confirmation}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    confirmation: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10"
                autoComplete="new-password"
              />
            </label>

            {message ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {message}
              </p>
            ) : null}
          </div>
          )}

          {!success ? (
          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className={profileLayout.secondaryButton}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className={profileLayout.primaryButton}
            >
              "Simpan Kata Sandi"
            </button>
          </div>
          ) : null}
        </div>
      </div>

      <EmailVerifyDialog
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        title="Verifikasi tambah kata sandi"
        description="Masukkan kode verifikasi yang dikirim ke email kamu untuk menambahkan kata sandi akun."
        onVerify={async (code) => {
          setSaving(true);
          try {
            await apiClient.put(`/api/v1/identity/users/${userId}`, {
              password: form.password,
              verification_code: code,
            });
          } finally {
            setSaving(false);
          }
        }}
        onVerified={() => {
          setVerifyOpen(false);
          setSuccess(true);
          onSuccess?.();
          window.setTimeout(() => {
            setSuccess(false);
            onClose?.();
          }, 1800);
        }}
      />
    </>
  );
}

function KeamananTab({ onLogout, onAddPassword }) {
  const { changePassword } = useAuth();
  const authUser = useAuth()?.user;
  const hasPassword = Boolean(authUser?.has_password);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);

  const currentDevice = `${navigator.userAgent.includes("Windows") ? "Windows" : "Perangkat"} • ${navigator.language}`;

  const handleChangePassword = () => {
    setMessage("");

    if (!form.current_password) {
      setMessage("Password saat ini wajib diisi.");
      return;
    }
    if (!form.new_password || form.new_password.length < 8) {
      setMessage("Password baru minimal 8 karakter.");
      return;
    }
    if (form.new_password !== form.new_password_confirmation) {
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setVerifyOpen(true);
  };

  return (
    <div className="max-w-[760px]">
      <div className="mb-8 flex min-h-[64px] gap-3 border-l-2 border-[#10B981] bg-[#ECFDF5] px-4 py-3 text-sm leading-6 text-slate-600">
        <Info className="mt-0.5 shrink-0 text-[#10B981]" size={18} />
        <p>
          Bila terdapat aktivitas tidak dikenal, segera keluar dari perangkat
          dan perbarui kata sandi melalui pengaturan keamanan.
        </p>
      </div>

      {!hasPassword && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-red-500" size={18} />
          <div className="flex-1">
            <p className="text-sm font-black text-red-700">
              Anda saat ini belum punya sandi
            </p>
            <p className="mt-1 text-xs leading-5 text-red-500">
              Tambahkan kata sandi agar akun tetap bisa diakses dengan email dan
              kata sandi.
            </p>
            <button
              type="button"
              onClick={onAddPassword}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-600 px-4 text-xs font-bold text-white transition hover:bg-red-700"
            >
              <KeyRound size={14} />
              Tambahkan Sandi
            </button>
          </div>
        </div>
      )}

      {hasPassword && (
        <div className="mb-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Ubah Kata Sandi
          </h3>
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6">
            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">Password saat ini</span>
              <input
                type="password"
                value={form.current_password}
                onChange={(e) => setForm((p) => ({ ...p, current_password: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10"
                autoComplete="current-password"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">Password baru</span>
              <input
                type="password"
                value={form.new_password}
                onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10"
                autoComplete="new-password"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">Konfirmasi password baru</span>
              <input
                type="password"
                value={form.new_password_confirmation}
                onChange={(e) => setForm((p) => ({ ...p, new_password_confirmation: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10"
                autoComplete="new-password"
              />
            </label>

            {message && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{message}</p>
            )}

            <button
              type="button"
              onClick={handleChangePassword}
              className="h-11 rounded-xl bg-[#10B981] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Ubah Password
            </button>
          </div>
        </div>
      )}

      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        Perangkat Aktif
      </h3>
      <div className="group flex min-h-[72px] items-center gap-5 py-4">
        <Monitor className="text-[#10B981]" size={24} />
        <div>
          <b className="block text-[15px] font-medium text-slate-950">
            Browser saat ini
          </b>
          <span className="text-xs text-slate-400">
            {currentDevice} •{" "}
            <span className="text-[#10B981]">Sedang aktif</span>
          </span>
        </div>
      </div>
      <hr className="border-[#e5e7eb]" />
      <button
        type="button"
        onClick={onLogout}
        className="mt-8 inline-flex h-10 items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600"
      >
        <LogOut size={16} />
        Logout Device Ini
      </button>

      <EmailVerifyDialog
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        title="Verifikasi ubah password"
        description="Masukkan kode verifikasi yang dikirim ke email kamu untuk mengubah password."
        onVerify={async (code) => {
          await changePassword({
            current_password: form.current_password,
            new_password: form.new_password,
            new_password_confirmation: form.new_password_confirmation,
            verification_code: code,
          });
        }}
        onVerified={() => {
          setVerifyOpen(false);
          setForm({ current_password: "", new_password: "", new_password_confirmation: "" });
          toastSuccess("Ubah Password", "Password berhasil diubah! Semua sesi lain telah logout.");
        }}
      />
    </div>
  );
}

export default function ProfilePage({ defaultTab = "biodata" }) {
  const { user: authUser, logout, refreshMe } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState("");
  const [avatarVerifyOpen, setAvatarVerifyOpen] = useState(false);

  useEffect(() => setActiveTab(defaultTab), [defaultTab]);

  const user = {
    id: authUser?.id || "",
    name: authUser?.name || "User",
    email: authUser?.email || "",
    username:
      authUser?.username || String(authUser?.email || "user").split("@")[0],
    avatar: authUser?.avatar || authUser?.photoURL || "",
  };
  const initial = user.name.slice(0, 1).toUpperCase();
  const avatarUrl = resolveMediaUrl(user.avatar);
  const hasPassword = Boolean(authUser?.has_password);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || photoBusy || !user.id) return;
    setPhotoBusy(true);
    setPhotoError("");
    try {
      const uploaded = await uploadMarketplaceImage(file, "profiles");
      setPendingAvatarUrl(uploaded?.url || "");
      setAvatarVerifyOpen(true);
    } catch (error) {
      setPhotoError(getMediaUploadError(error));
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!(await confirmLogout())) return;
    await logout?.();
    queryClient.clear();
    window.close();
    window.setTimeout(() => {
      if (!window.closed) navigate("/", { replace: true });
    }, 120);
  };


  return (
    <section className={profileLayout.page}>
      <aside
        className="hidden h-full w-[360px] shrink-0 flex-col overflow-y-auto border-r border-[#e5e7eb] bg-white md:flex"
        aria-label="Profil pengguna"
      >
        <div className="flex min-h-[300px] flex-col items-center border-b border-[#e5e7eb] px-8 py-8 text-center">
          <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#10B981] text-5xl font-bold text-white shadow-inner">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {user.name}
          </h2>
          <span className="mb-6 text-sm font-medium text-[#10B981]">
            @{user.username}
          </span>
          <button
            type="button"
            disabled={photoBusy}
            onClick={() => document.getElementById("profile-avatar-input")?.click()}
            className={profileLayout.secondaryButton}
          >
            <input
              id="profile-avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {photoBusy ? "Mengunggah..." : "Ubah Foto"}
          </button>

          {photoError ? (
            <p className="mt-3 max-w-[260px] text-xs font-semibold text-red-600">
              {photoError}
            </p>
          ) : null}

          {!hasPassword ? (
            <div className="mt-6 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center">
              <AlertTriangle className="mx-auto mb-1 text-red-500" size={18} />
              <p className="text-sm font-black text-red-700">
                Anda saat ini belum punya sandi
              </p>
              <p className="mt-1 text-xs leading-5 text-red-500">
                Tambahkan kata sandi agar akun tetap bisa diakses tanpa Google.
              </p>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-600 px-4 text-xs font-bold text-white transition hover:bg-red-700"
              >
                <KeyRound size={14} />
                Tambahkan Sandi
              </button>
            </div>
          ) : null}
        </div>
        <div className="py-2">
          {!hasPassword ? (
            <div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="flex h-14 w-full items-center justify-between px-8 text-left text-sm font-medium text-slate-800 transition hover:bg-[#ECFDF5] hover:text-[#10B981]"
              >
                <span className="flex items-center gap-3">
                  <KeyRound size={16} className="text-slate-400" />
                  Tambah Kata Sandi
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
              <hr className="border-[#e5e7eb]" />
            </div>
          ) : null}

          {[
            { label: "PIN Marketplace", icon: Lock },
            { label: "Verifikasi Instan", icon: Fingerprint },
          ].map(({ label, icon: Icon }) => (
            <div key={label}>
              <button
                type="button"
                className="flex h-14 w-full items-center justify-between px-8 text-left text-sm font-medium text-slate-800 transition hover:bg-[#ECFDF5] hover:text-[#10B981]"
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} className="text-slate-400" />
                  {label}
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
              <hr className="border-[#e5e7eb]" />
            </div>
          ))}

          <Link
            to="/profile/notifications"
            className="flex h-14 w-full items-center justify-between px-8 text-left text-sm font-medium text-slate-800 transition hover:bg-[#ECFDF5] hover:text-[#10B981]"
          >
            <span className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-slate-400" />
              Pusat Keamanan
            </span>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>
        </div>

        <div className="mt-auto border-t border-[#e5e7eb] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout Device Ini
          </button>
        </div>
      </aside>

      <div className={profileLayout.contentShell}>
        <div className={profileLayout.contentInner}>
          <div className={profileLayout.contentHeader}>
            <div>
              <span className={profileLayout.contentEyebrow}>
                Account settings
              </span>
              <h1 className={profileLayout.contentTitle}>Pengaturan Akun</h1>
              <p className={`mt-2 ${profileLayout.contentDesc}`}>
                Kelola profil pembeli, alamat, dan keamanan akun marketplace.
              </p>
            </div>
          </div>
          <div
            className="mb-8 flex h-12 gap-8 overflow-x-auto border-b border-[#e5e7eb]"
            role="tablist"
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "shrink-0 border-b-2 pb-3 text-sm font-semibold transition",
                  activeTab === tab.key
                    ? "border-[#10B981] text-[#10B981]"
                    : "border-transparent text-slate-400 hover:text-slate-900",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === "biodata" ? (
            <BiodataTab user={user} refreshMe={refreshMe} />
          ) : null}
          {activeTab === "alamat" ? <AlamatTab /> : null}
          {activeTab === "keamanan" ? (
            <KeamananTab
              onLogout={handleLogout}
              onAddPassword={() => setShowPasswordModal(true)}
            />
          ) : null}
          {activeTab === "perangkat" ? <DevicesTab /> : null}
          {activeTab === "hapus-akun" ? <AccountDeletionTab onLogout={handleLogout} navigate={navigate} /> : null}
        </div>
      </div>

      <PasswordModal
        open={showPasswordModal}
        userId={user.id}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={refreshMe}
      />

      <EmailVerifyDialog
        open={avatarVerifyOpen}
        onClose={() => {
          setAvatarVerifyOpen(false);
          setPendingAvatarUrl("");
        }}
        title="Verifikasi perubahan foto"
        description="Masukkan kode verifikasi yang dikirim ke email kamu untuk menyimpan foto profil baru."
        onVerify={async (code) => {
          if (!pendingAvatarUrl) {
            throw new Error("Foto baru tidak ditemukan. Silakan unggah ulang.");
          }

          await apiClient.put(`/api/v1/identity/users/${user.id}`, {
            avatar: pendingAvatarUrl,
            verification_code: code,
          });
        }}
        onVerified={async () => {
          setPendingAvatarUrl("");
          await refreshMe?.();
          queryClient.invalidateQueries({ queryKey: ["auth"] });
        }}
      />
    </section>
  );
}
