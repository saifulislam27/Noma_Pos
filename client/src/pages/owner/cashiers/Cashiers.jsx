import { useEffect, useState } from "react";
import { register, getCashiers } from "../../../services/authService";
import api from "../../../services/api";

export default function Cashiers() {
  const [cashiersList, setCashiersList] = useState([]); // State untuk menampung daftar kasir
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  // Fungsi untuk mengambil data kasir dari backend
  const loadCashiers = async () => {
    try {
      setLoadingFetch(true);
      const data = await getCashiers();
      setCashiersList(data || []);
    } catch (err) {
      console.error("Gagal memuat daftar kasir:", err);
    } finally {
      setLoadingFetch(false);
    }
  };

  // Jalankan load data saat halaman pertama kali dibuka
  useEffect(() => {
    loadCashiers();
  }, []);

  // Fungsi untuk menonaktifkan kasir
  const handleDeactivateCashier = async (id) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menonaktifkan akun kasir ini?"
      )
    )
      return;

    try {
      await api.put(`/cashiers/deactivate/${id}`);
      alert("Kasir berhasil dinonaktifkan.");
      loadCashiers(); // Refresh data
    } catch (err) {
      alert("Gagal menonaktifkan kasir.");
    }
  };

  // Fungsi untuk menghapus kasir
  const handleDeleteCashier = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus akun kasir ini? Aksi ini tidak dapat dibatalkan.")) return;

    try {
      await api.delete(`/cashiers/${id}`);
      alert("Kasir berhasil dihapus.");
      loadCashiers(); // Refresh data
    } catch (err) {
      alert("Gagal menghapus kasir.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      await register(formData);
      alert("Kasir baru berhasil didaftarkan!");
      setFormData({ name: "", username: "", password: "" });
      setIsOpen(false);

      // Refresh daftar kasir secara otomatis setelah berhasil tambah data
      loadCashiers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mendaftarkan kasir.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      {/* Header dengan tombol tambah */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Kasir</h1>
          <p className="text-sm text-slate-500">
            Kelola dan daftarkan staf kasir tokomu
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
        >
          + Tambah Kasir
        </button>
      </div>
      {/* Daftar Kasir Aktif */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">
            Daftar Akun Staf Kasir Aktif
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="p-4 w-16 text-center">No</th>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">Username</th>
                <th className="p-4 text-center">Tanggal Dibuat</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingFetch ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-400 italic"
                  >
                    Memuat data staf kasir...
                  </td>
                </tr>
              ) : cashiersList.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-400 italic"
                  >
                    Belum ada staf kasir yang didaftarkan.
                  </td>
                </tr>
              ) : (
                cashiersList.map((cashier, index) => (
                  <tr key={cashier.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-center">{index + 1}</td>
                    <td className="p-4">{cashier.name}</td>
                    <td className="p-4 font-mono text-slate-600">
                      {cashier.username}
                    </td>
                    <td className="p-4 text-center">
                      {new Date(cashier.created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDeactivateCashier(cashier.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase transition"
                        >
                          Nonaktifkan
                        </button>
                        <button
                          onClick={() => handleDeleteCashier(cashier.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah Kasir */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100 relative">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Daftarkan Kasir Baru
              </h2>
              <p className="text-xs text-slate-500">
                Buat akses akun agar staf kasir bisa login ke aplikasi NOMA
                POS.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Kasir"
                  className="w-full border p-2.5 rounded-xl text-sm outline-none focus:border-blue-500 transition"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Username Login
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ahmad_noma"
                  className="w-full border p-2.5 rounded-xl text-sm outline-none focus:border-blue-500 transition"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full border p-2.5 rounded-xl text-sm outline-none focus:border-blue-500 transition"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition disabled:bg-slate-300 shadow-sm"
                >
                  {loadingSubmit ? "Menyimpan..." : "Daftarkan Staf"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}