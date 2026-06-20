import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  // 1. READ (Ambil Data)
  const loadData = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []); // Antisipasi jika data null/undefined
    } catch (err) {
      console.error("Gagal load kategori:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. CREATE & UPDATE (Simpan / Edit Data)
  const submit = async () => {
    if (!name.trim()) return;

    try {
      if (editId) {
        // Mode Edit
        await updateCategory(editId, { name });
      } else {
        // Mode Tambah Baru
        await createCategory({ name });
      }

      setOpen(false);
      setName("");
      setEditId(null);
      loadData(); // Refresh data setelah sukses
    } catch (err) {
      console.error("Gagal simpan kategori:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setOpen(true);
  };

  // 3. DELETE (Hapus Data)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus kategori ini?");
    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      loadData(); // Refresh data setelah sukses
    } catch (err) {
      console.error("Gagal hapus kategori:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Kategori Produk</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setOpen(true)}
        >
          + Tambah Kategori
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
            <tr>
              <th className="p-4">Nama Kategori</th>
              <th className="p-4 w-40 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-4 text-center text-slate-400 italic">
                  Belum ada kategori. Silakan tambahkan terlebih dahulu.
                </td>
              </tr>
            ) : (
              categories.map((item) => (
                <tr key={item.id} className="border-t hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-800">{item.name}</td>
                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      <Modal
        open={open}
        title={editId ? "Edit Kategori" : "Tambah Kategori"}
        onClose={() => {
          setOpen(false);
          setName("");
          setEditId(null);
        }}
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Nama Kategori</label>
          <input
            className="border p-3 rounded-lg w-full outline-none focus:border-blue-500 transition"
            value={name}
            placeholder="Contoh: Makanan, Minuman, Snak"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={submit}
            className="bg-blue-600 text-white w-full p-3 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            {editId ? "Simpan Perubahan" : "Tambah Baru"}
          </button>
        </div>
      </Modal>
    </div>
  );
}