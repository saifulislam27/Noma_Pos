import { useEffect, useState } from "react";
import { getTransactions, getTransactionById, updateTransaction } from "../../services/transactionService";
import { formatRupiah } from "../../utils/formatRupiah";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrx, setEditingTrx] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Gagal ambil transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const detail = await getTransactionById(id);
      setEditingTrx(detail);
    } catch (err) {
      alert("Gagal memuat detail transaksi. Pastikan Anda memiliki akses.");
    }
  };

  const handleSave = async () => {
    try {
      // Menyiapkan payload sesuai struktur yang diharapkan controller
      const payload = {
        items: editingTrx.items.map(i => ({ 
          product_id: i.product_id, 
          qty: i.qty, 
          price: i.price 
        })),
        payment_method: editingTrx.transaction.payment_method
      };

      await updateTransaction(editingTrx.transaction.id, payload);
      alert("Transaksi berhasil diupdate!");
      setEditingTrx(null);
      fetchData(); // Refresh daftar
    } catch (err) {
      alert("Gagal mengupdate transaksi. Cek izin akses Anda.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Riwayat Transaksi</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Total</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
            ) : transactions.map((trx) => (
              <tr key={trx.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-mono">#{trx.id}</td>
                <td className="p-3">{new Date(trx.created_at).toLocaleString()}</td>
                <td className="p-3 font-semibold">{formatRupiah(trx.total)}</td>
                <td className="p-3">
                  <button 
                    onClick={() => handleEditClick(trx.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT */}
      {editingTrx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Edit Transaksi #{editingTrx.transaction.id}</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-6">
              {editingTrx.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-sm truncate w-1/2">{item.product_name}</span>
                  <input 
                    type="number" 
                    value={item.qty} 
                    min="1"
                    onChange={(e) => {
                      const newItems = [...editingTrx.items];
                      newItems[idx].qty = parseInt(e.target.value) || 0;
                      setEditingTrx({...editingTrx, items: newItems});
                    }}
                    className="w-16 border rounded p-1 text-center text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setEditingTrx(null)} 
                className="flex-1 bg-slate-200 hover:bg-slate-300 p-2 rounded-xl text-sm font-semibold"
              >
                Batal
              </button>
              <button 
                onClick={handleSave} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl text-sm font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}