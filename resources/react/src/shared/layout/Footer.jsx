import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#f0eded] border-t border-[#bccbb4] mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-12 max-w-[1200px] mx-auto">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#1b1c1c]">Fashionku</h4>
          <ul className="space-y-2">
            {[
              "Tentang Fashionku",
              "Hak Kekayaan Intelektual",
              "Karir",
              "Blog",
            ].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="text-xs text-[#3e4a39] hover:text-[#047857] transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#1b1c1c]">Beli</h4>
          <ul className="space-y-2">
            {["Kategori Fashion", "Promo & Voucher", "Fashionku COD"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-xs text-[#3e4a39] hover:text-[#047857] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#1b1c1c]">
            Bantuan & Panduan
          </h4>
          <ul className="space-y-2">
            {["Fashionku Care", "Syarat & Ketentuan", "Kebijakan Privasi"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-xs text-[#3e4a39] hover:text-[#047857] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#1b1c1c]">Ikuti Kami</h4>
          <div className="flex gap-4">
            {["public", "photo_camera", "video_library"].map((icon) => (
              <div
                key={icon}
                className="w-8 h-8 rounded-lg bg-[#eae7e7] flex items-center justify-center cursor-pointer hover:bg-[#047857]/20 transition-all"
              >
                <span className="material-symbols-outlined text-[#3e4a39] text-[18px]">
                  {icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#bccbb4] px-6 py-6 max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-lg font-bold text-[#1b1c1c]">Fashionku</div>
        <p className="text-xs text-[#3e4a39]">© 2026, Fashionku.</p>
      </div>
    </footer>
  );
}
