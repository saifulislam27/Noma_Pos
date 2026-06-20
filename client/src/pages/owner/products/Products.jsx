import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { getCategories } from "../../../services/categoryService";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/productService";
import { formatRupiah } from "../../../utils/formatRupiah";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  
  // State Form fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(""); 
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      const prodData = await getProducts();
      const catData = await getCategories();
      setProducts(prodData || []);
      setCategories(catData || []);
    } catch (err) {
      console.error("Gagal ambil data produk/kategori:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const submit = async () => {
    if (!name.trim() || !categoryId || !price) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", name);
      payload.append("category_id", categoryId);
      payload.append("price", Number(price));
      
      if (imageFile) {
        payload.append("image", imageFile); 
      }

      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
      alert("Terjadi kesalahan sistem saat menyimpan produk.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setCategoryId(item.category_id || item.categoryId);
    setPrice(item.price);
    setPreviewUrl(item.image ? `http://localhost:5000/uploads/products/${item.image}` : "");
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus produk ini?")) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (err) {
        console.error("Gagal hapus produk:", err);
      }
    }
  };

  const resetForm = () => {
    setOpen(false);
    setEditId(null);
    setName("");
    setCategoryId("");
    setPrice("");
    setImageFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Kelola Produk</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setOpen(true)}
        >
          + Tambah Produk
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
            <tr>
              <th className="p-4 w-20">Foto</th>
              <th className="p-4">Nama Produk</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga Jual</th>
              <th className="p-4 w-40 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-400 italic">
                  Belum ada produk. Silakan tambahkan produk baru.
                </td>
              </tr>
            ) : (
              products.map((item) => {
                const currentCategory = categories.find(c => c.id === (item.category_id || item.categoryId));
                const imageUrl = item.image ? `http://localhost:5000/uploads/products/${item.image}` : null;
                
                return (
                  <tr key={item.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border overflow-hidden flex items-center justify-center text-xs text-slate-400">
                        {item.image ? (
                          <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          "No Pic"
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{item.name}</td>
                    <td className="p-4 text-slate-600">{currentCategory ? currentCategory.name : "-"}</td>
                    <td className="p-4 font-semibold text-slate-800">{formatRupiah(item.price)}</td>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      <Modal open={open} title={editId ? "Edit Produk" : "Tambah Produk"} onClose={resetForm}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
            <input
              className="border p-2.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
              value={name}
              placeholder="Contoh: Es Kopi Susu Noma"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kategori</label>
            <select
              className="border p-2.5 rounded-lg w-full bg-white outline-none focus:border-blue-500 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual (Rp)</label>
            <input
              type="number"
              className="border p-2.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
              value={price}
              placeholder="Contoh: 15000"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Foto Produk</label>
            <input
              type="file"
              key={editId || "add"} 
              accept="image/*"
              className="border p-2 rounded-lg w-full text-sm bg-slate-50 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
            
            {previewUrl && (
              <div className="mt-3 flex items-center gap-3 border p-2 rounded-lg bg-slate-50">
                <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded border bg-white" />
                <span className="text-xs text-emerald-600 font-medium">Pratinjau Foto</span>
              </div>
            )}
          </div>

          <button
            onClick={submit}
            className="bg-blue-600 text-white w-full p-3 rounded-lg hover:bg-blue-700 font-medium transition mt-2"
          >
            {editId ? "Simpan Perubahan" : "Simpan Produk"}
          </button>
        </div>
      </Modal>
    </div>
  );
}