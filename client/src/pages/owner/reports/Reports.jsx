import { useState, useEffect } from "react";
import { getSalesReport } from "../../../services/reportService"; // Sesuaikan jumlah ../ jika perlu
// Pastikan baris ini ada dan sesuai path filenya
import { getTransactionById, updateTransaction, deleteTransaction } from "../../../services/transactionService";// 🌟 Import ini!
import { formatRupiah } from "../../../utils/formatRupiah";
import { exportExcel, exportPDF } from "../../../utils/exportHelper";

export default function Reports() {
  // Fungsi pembantu untuk mendapatkan format tanggal hari ini (YYYY-MM-DD)
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Fungsi pembantu untuk mendapatkan tanggal 1 bulan ini
  const getFirstDayOfMonthString = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString().split("T")[0];
  };

  // State untuk tanggal filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State untuk menampung data dari backend
  const [reportData, setReportData] = useState({
    summary: { totalRevenue: 0, totalTransactions: 0, totalItemsSold: 0 },
    transactions: [],
  });
  const [loading, setLoading] = useState(false);
// Tambahkan baris ini
const [editingTrx, setEditingTrx] = useState(null);

const handleQtyChange = (itemId, newQty) => {
  // Pastikan qty tidak kurang dari 1
  if (newQty < 1) return; 

  setEditingTrx((prev) => {
    // Buat salinan items agar tidak merusak state asli
    const updatedItems = prev.items.map((item) =>
      item.id === itemId ? { ...item, qty: newQty } : item
    );

    // Update state editingTrx dengan array items yang baru
    return { ...prev, items: updatedItems };
  });
};

const handleEditClick = async (id) => {
  try {
    const detail = await getTransactionById(id); // Pastikan import sudah ada
    setEditingTrx(detail);
  } catch (err) {
    console.error(err);
    alert("Gagal mengambil detail transaksi. Periksa console.");
  }
};

const handleDeleteTransaction = async (id) => {
  if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh transaksi ini? Data tidak dapat dikembalikan.")) {
    return;
  }
  try {
    // Pastikan Anda sudah memiliki service deleteTransaction
    await deleteTransaction(id); 
    alert("Transaksi berhasil dihapus.");
    fetchReport(); // Refresh tabel setelah hapus
  } catch (err) {
    alert("Gagal menghapus transaksi.");
    console.error(err);
  }
};

// Fungsi untuk menghapus baris produk dari modal
const handleDeleteRow = (itemId) => {
  if (window.confirm("Apakah Anda yakin ingin menghapus produk ini dari transaksi?")) {
    setEditingTrx((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  }
};

const handleSave = async () => {
  try {
    await updateTransaction(editingTrx.transaction.id, {
      items: editingTrx.items,
      payment_method: editingTrx.transaction.payment_method
    });
    alert("Transaksi berhasil diupdate!");
    setEditingTrx(null);
    fetchReport(); // Refresh data setelah simpan
  } catch (err) {
    alert("Gagal menyimpan perubahan.");
  }
};
  // Fungsi pengaman lokal jika utilitas formatRupiah bawaan proyek eror
  const safeFormatRupiah = (value) => {
    try {
      if (formatRupiah) return formatRupiah(value || 0);
    } catch (e) {
      console.warn("Menggunakan fallback format mata uang lokal");
    }
    return `Rp ${(value || 0).toLocaleString("id-ID")}`;
  };

  // Fungsi mengambil data laporan dari service
  const fetchReport = async () => {
  if (!startDate || !endDate) return alert("Pilih rentang tanggal terlebih dahulu!");
  setLoading(true);
  try {
    const data = await getSalesReport(startDate, endDate);
    
    // 🌟 TAMBAHKAN BARIS INI UNTUK MELIHAT DATA DI CONSOLE
    console.log("Struktur data dari API:", data);
    
    setReportData({
      summary: data?.summary || { totalRevenue: 0, totalTransactions: 0, totalItemsSold: 0 },
      transactions: data?.transactions || []
    });
  } catch (err) {
    console.error("Gagal memuat laporan:", err);
    alert("Terjadi kesalahan saat memuat data laporan.");
  } finally {
    setLoading(false);
  }
};

  // Muat laporan otomatis saat komponen dipasang atau saat date berubah
  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [startDate, endDate]);

  // Initialize tanggal saat halaman dibuka/di-refresh - SELALU set ke hari ini
  useEffect(() => {
    const todayString = getTodayDateString();
    const firstDayString = getFirstDayOfMonthString();
    
    setStartDate(firstDayString);
    setEndDate(todayString);
  }, []);

  return (
    <>
      {/* HEADER & ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Laporan Penjualan</h1>
          <p className="text-sm text-slate-500">Analisis pembukuan dan riwayat transaksi masuk</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => exportExcel(reportData.transactions || [], `laporan-${startDate}-to-${endDate}`)}
            disabled={!reportData.transactions || reportData.transactions.length === 0}
            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:bg-slate-300"
          >
            Export Excel
          </button>
          <button
            onClick={() => exportPDF(reportData.transactions || [], `Laporan Penjualan (${startDate} s.d ${endDate})`)}
            disabled={!reportData.transactions || reportData.transactions.length === 0}
            className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:bg-slate-300"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap items-end gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal Mulai</label>
          <input
            type="date"
            className="w-full border p-2 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal Sampai</label>
          <input
            type="date"
            className="w-full border p-2 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition shadow-sm"
        >
          {loading ? "Memuat..." : "Filter Laporan"}
        </button>
      </div>

      {/* SUMMARY STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
          <h2 className="text-2xl font-black text-blue-600 mt-1">
            {safeFormatRupiah(reportData.summary?.totalRevenue)}
          </h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Transaksi</span>
          <h2 className="text-2xl font-black text-slate-800 mt-1">
            {reportData.summary?.totalTransactions || 0} <span className="text-sm font-normal text-slate-500">Struk</span>
          </h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Produk Terjual</span>
          <h2 className="text-2xl font-black text-emerald-600 mt-1">
            {reportData.summary?.totalItemsSold || 0} <span className="text-sm font-normal text-slate-500">Pcs</span>
          </h2>
        </div>
      </div>

      {/* DATA REPORT TABLE */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
            <tr>
              <th className="p-4 text-center w-12">No</th>
              <th className="p-4">No. Struk</th>
              <th className="p-4">Nama Kasir</th>
              <th className="p-4">Metode</th>
              <th className="p-4">Detail Produk</th>
              <th className="p-4">Waktu</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="8" className="p-8 text-center italic">Memproses...</td></tr>
            ) : !reportData.transactions?.length ? (
              <tr><td colSpan="8" className="p-8 text-center italic">Tidak ada data.</td></tr>
            ) : (
              reportData.transactions.map((trx, index) => (
                <tr key={trx.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4 font-mono font-bold text-blue-600">#{String(trx.id).padStart(5, "0")}</td>
                  <td className="p-4">{trx.cashier_name}</td>
                  <td className="p-4"><span className="capitalize text-xs font-bold px-2 py-1 bg-slate-100 rounded-md">{trx.payment_method}</span></td>
                  <td className="p-4 text-xs">
                    {trx.items?.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {trx.items.slice(0, 2).map((item, i) => (
                          <li key={i}>{item.product_name} <span className="font-bold">x{item.qty}</span></li>
                        ))}
                      </ul>
                    ) : "-"}
                  </td>
                  <td className="p-4 text-xs">{new Date(trx.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="p-4 text-right font-bold">{safeFormatRupiah(trx.total)}</td>
                  
                  {/* KOLOM AKSI DIPERBARUI */}
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button 
                      onClick={() => handleEditClick(trx.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase"
                    >Edit</button>
                    <button 
                      onClick={() => handleDeleteTransaction(trx.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase"
                    >Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* MODAL EDIT (Sama seperti sebelumnya) */}
    {editingTrx && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
          <h2 className="text-lg font-bold mb-4">Edit Item Transaksi</h2>
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {editingTrx.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 border-b pb-2">
                <span className="flex-1 text-sm truncate">{item.product_name}</span>
                <button onClick={() => handleQtyChange(item.id, Math.max(1, item.qty - 1))} className="bg-slate-100 w-8 h-8 rounded-full font-bold">-</button>
                <span className="w-8 text-center font-bold">{item.qty}</span>
                <button onClick={() => handleQtyChange(item.id, item.qty + 1)} className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full font-bold">+</button>
                <button onClick={() => handleDeleteRow(item.id)} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold ml-2">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditingTrx(null)} className="flex-1 bg-slate-100 py-2 rounded-lg">Batal</button>
            <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold">Simpan</button>
          </div>
        </div>
      </div>
    )}
  </>
);
}