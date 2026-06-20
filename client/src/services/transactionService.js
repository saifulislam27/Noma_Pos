import api from "./api";

// MENGAMBIL SEMUA RIWAYAT TRANSAKSI
export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

// MENGAMBIL DETAIL TRANSAKSI BERDASARKAN ID (Untuk keperluan Edit)
export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

// SIMPAN TRANSAKSI BARU (CHECKOUT)
export const createTransaction = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/transactions", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// UPDATE TRANSAKSI (Fungsi untuk edit)
export const updateTransaction = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/transactions/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// HAPUS TRANSAKSI
export const deleteTransaction = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/transactions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};