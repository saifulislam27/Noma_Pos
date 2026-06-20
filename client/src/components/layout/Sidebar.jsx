import { NavLink } from "react-router-dom";

export default function Sidebar({ role }) {
  // Fungsi helper untuk style menu aktif & tidak aktif
  const linkStyle = ({ isActive }) =>
    `p-3 rounded-lg transition-colors ${
      isActive 
        ? "bg-blue-600 text-white font-semibold" 
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen shadow-xl">
      
      {/* LOGO */}
      <div className="p-6 text-2xl font-bold tracking-wide border-b border-slate-800">
        NOMA POS
      </div>

      {/* MENU */}
      <nav className="flex flex-col p-3 gap-1 text-sm">

        {role === "owner" && (
          <>
            <NavLink className={linkStyle} to="/owner/dashboard">
              📊 Dashboard
            </NavLink>

            <NavLink className={linkStyle} to="/owner/products">
              📦 Produk
            </NavLink>

            <NavLink className={linkStyle} to="/owner/categories">
              🗂 Kategori
            </NavLink>

            <NavLink className={linkStyle} to="/owner/cashiers">
              👤 Kasir
            </NavLink>

            <NavLink className={linkStyle} to="/owner/reports">
              📈 Laporan
            </NavLink>
          </>
        )}

        {role === "cashier" && (
          <>
            <NavLink className={linkStyle} to="/cashier" end>
              🛒 Transaksi Baru
            </NavLink>

            <NavLink className={linkStyle} to="/cashier/history">
              🧾 Riwayat
            </NavLink>
          </>
        )}

        {/* Jika role kosong atau salah kirim props */}
        {!role && (
          <div className="p-3 text-xs text-red-400 italic">
            Role tidak terdeteksi! Cek file Layout.
          </div>
        )}

      </nav>
    </aside>
  );
}