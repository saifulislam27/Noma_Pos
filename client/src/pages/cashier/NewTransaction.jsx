import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { createTransaction } from "../../services/transactionService";
import { formatRupiah } from "../../utils/formatRupiah";

export default function NewTransaction() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("tunai"); // Sudah menggunakan huruf kecil
  const [searchQuery, setSearchQuery] = useState("");
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [qrisData, setQrisData] = useState(null);

  // Load produk dan kategori saat halaman dibuka
  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await getProducts();
        const catData = await getCategories();
        setProducts(prodData || []);
        setCategories(catData || []);
      } catch (err) {
        console.error("Gagal memuat data transaksi:", err);
      }
    };
    loadData();
  }, []);

  // Fungsi Tambah ke Keranjang
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Ubah Jumlah Quantity langsung (+ / -)
  const updateQty = (id, amount) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + amount;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Hitung Total Belanja
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Simpan Transaksi Ke Database
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");

    // Jika QRIS, tampilkan barcode terlebih dahulu
    if (paymentMethod === "qris") {
      // Buat data QRIS (bisa diganti dengan QR code sebenarnya dari payment gateway)
      const qrisPayload = {
        transactionId: Date.now(),
        totalPrice: totalPrice,
        items: cart,
        timestamp: new Date().toLocaleString("id-ID"),
      };
      setQrisData(qrisPayload);
      setShowQrisModal(true);
      return;
    }

    // Untuk pembayaran Tunai, langsung simpan
    await saveTransaction();
  };

  // Fungsi untuk menyimpan transaksi ke database
  const saveTransaction = async () => {
    try {
      const payload = {
        items: cart.map((item) => ({
          product_id: item.id,
          qty: item.qty,
          price: item.price,
        })),
        total_price: totalPrice,
        payment_method: paymentMethod,
      };

      await createTransaction(payload);
      alert("Transaksi Berhasil!");
      setCart([]);
      setShowQrisModal(false);
      setQrisData(null);
    } catch (err) {
      console.error("Transaksi gagal disimpan:", err);
      alert("Gagal memproses transaksi.");
    }
  };

  // Filter produk berdasarkan Kategori & Kolom Pencarian
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category_id === selectedCategory ||
      product.categoryId === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* BAGIAN KIRI: DAFTAR PRODUK */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl shadow-sm">
          <input
            type="text"
            placeholder="Cari produk..."
            className="border p-2 rounded-lg flex-1 outline-none focus:border-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border p-2 rounded-lg bg-white outline-none focus:border-blue-500 text-sm md:w-48"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-white rounded-xl text-slate-400 italic">
              Produk tidak ditemukan
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-blue-500 cursor-pointer transition flex flex-col justify-between"
              >
                <div className="w-full aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center text-slate-400 text-xs">
                  {product.image ? (
                    <img 
                      /* 🌟 PERBAIKAN: Diarahkan ke URL statis Express Server */
                      src={`http://localhost:5000/uploads/products/${product.image}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        // Jaga-jaga jika file fisik terhapus di backend
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150?text=No+Image";
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-blue-600 font-bold text-sm mt-1">{formatRupiah(product.price)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* BAGIAN KANAN: KERANJANG BELANJA */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between min-h-[500px] lg:h-[calc(100vh-120px)] sticky top-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">Keranjang Belanja</h2>
          
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {cart.length === 0 ? (
              <p className="text-center text-slate-400 italic py-8 text-sm">Belum ada item terpilih</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-2 border-b pb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">{formatRupiah(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between font-bold text-lg text-slate-800">
            <span>Total:</span>
            <span>{formatRupiah(totalPrice)}</span>
          </div>

          {/* Opsi Metode Pembayaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("tunai")}
                className={`p-2.5 rounded-lg border font-medium text-sm transition ${
                  paymentMethod === "tunai"
                    ? "bg-blue-50 border-blue-600 text-blue-600 font-semibold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                💵 Tunai
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={`p-2.5 rounded-lg border font-medium text-sm transition ${
                  paymentMethod === "qris"
                    ? "bg-blue-50 border-blue-600 text-blue-600 font-semibold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                📱 QRIS
              </button>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full p-3 rounded-xl text-white font-bold transition shadow ${
              cart.length === 0
                ? "bg-slate-300 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Selesai Transaksi
          </button>
        </div>
      </div>

      {/* MODAL QRIS BARCODE */}
      {showQrisModal && qrisData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran QRIS</h2>
              <p className="text-slate-500 mb-6">Scan QR Code di bawah dengan ponsel Anda</p>

              {/* BARCODE/QR CODE AREA */}
              <div className="bg-slate-100 p-8 rounded-xl mb-6 flex items-center justify-center">
                <div className="w-64 h-64 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">📱</span>
                    <p className="text-xs text-slate-500">QRIS Code</p>
                    <p className="text-xs font-mono text-slate-600 mt-2">
                      ID: {String(qrisData.transactionId).padStart(8, "0")}
                    </p>
                  </div>
                </div>
              </div>

              {/* DETAIL TRANSAKSI */}
              <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Pembayaran:</span>
                    <span className="font-semibold text-slate-800">{formatRupiah(qrisData.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Jumlah Item:</span>
                    <span className="font-semibold text-slate-800">{qrisData.items.length} item</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Waktu:</span>
                    <span className="font-semibold text-slate-800">{qrisData.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowQrisModal(false);
                    setQrisData(null);
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2.5 rounded-lg font-semibold transition"
                >
                  Batal
                </button>
                <button
                  onClick={saveTransaction}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
                >
                  ✓ Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}