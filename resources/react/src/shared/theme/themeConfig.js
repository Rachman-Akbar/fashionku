export const THEME_MODE_STORAGE_KEY = "ziip.profile.theme.mode";
export const THEME_PALETTE_STORAGE_KEY = "ziip.profile.theme.palette";

export const THEME_MODES = [
  {
    value: "light",
    label: "Terang",
    description: "Tampilan terang sepanjang waktu.",
  },
  {
    value: "dark",
    label: "Gelap",
    description: "Warna gelap yang lebih nyaman untuk mata.",
  },
  {
    value: "system",
    label: "Ikuti Sistem",
    description: "Menyesuaikan pengaturan tema perangkat.",
  },
];

export const COLOR_PALETTES = [
  { value: "emerald", label: "Emerald", color: "#10b981", soft: "#ecfdf5" },
  { value: "ocean", label: "Ocean", color: "#2563eb", soft: "#eff6ff" },
  { value: "violet", label: "Violet", color: "#7c3aed", soft: "#f5f3ff" },
  { value: "amber", label: "Amber", color: "#d97706", soft: "#fffbeb" },
  { value: "rose", label: "Rose", color: "#e11d48", soft: "#fff1f2" },
  { value: "teal", label: "Teal", color: "#0d9488", soft: "#f0fdfa" },
];

export const DEFAULT_THEME_MODE = "light";
export const DEFAULT_THEME_PALETTE = "emerald";

export const THEME_MODE_VALUES = THEME_MODES.map((item) => item.value);
export const THEME_PALETTE_VALUES = COLOR_PALETTES.map((item) => item.value);
