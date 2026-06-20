import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    const confirm = window.confirm("Yakin ingin logout?");
    if (!confirm) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">

      {/* LEFT - BRAND */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="NOMA POS" className="h-10 w-auto" />
        <span className="font-bold text-lg text-slate-800">
          NOMA POS
        </span>
      </div>

      {/* RIGHT - USER INFO */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 text-right">
          <FiUser className="text-slate-500" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500 capitalize">
              {user?.role || "role"}
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            bg-red-500 hover:bg-red-600
            text-white px-4 py-2 rounded-xl
            transition
          "
        >
          <FiLogOut />
          Logout
        </button>

      </div>

    </div>
  );
}