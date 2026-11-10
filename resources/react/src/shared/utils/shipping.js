export function parseShipping(value) {
  const text = String(value || "").trim();
  if (!text) return { name: "", phone: "", address: "", display: "" };
  if (text.startsWith("Ambil sendiri")) return { name: "Ambil sendiri di toko", phone: "", address: "", display: "Ambil sendiri di toko" };
  if (text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        const name = parsed.recipient || parsed.name || parsed.recipient_name || "";
        const phone = parsed.phone || "";
        const address = [parsed.address, parsed.detail, parsed.district, parsed.city_or_regency, parsed.postal_code].filter(Boolean).join(", ");
        return {
          name: String(name || ""),
          phone: String(phone || ""),
          address: String(address || ""),
          display: [name, phone, address].filter(Boolean).join(" • "),
        };
      }
    } catch {
      // not JSON, fall back to text
    }
  }
  const [name, phone, ...rest] = text.split(" - ");
  const address = rest.join(" - ") || "";
  return { name: name || "", phone: phone || "", address, display: [name, phone, address].filter(Boolean).join(" • ") };
}