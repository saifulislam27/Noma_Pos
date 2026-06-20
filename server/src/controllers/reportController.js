const pool = require("../config/db");

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Parameter startDate dan endDate wajib diisi (Format: YYYY-MM-DD)" 
      });
    }

    // KONFIGURASI NAMA TABEL & KOLOM
    const tableName = "sales"; 
    const detailsTableName = "sale_items"; // Sesuai dengan hasil temuan Anda
    const foreignKey = "sale_id";   // Pastikan ini benar (bisa 'sale_id' tergantung database Anda)
    const dateColumn = "created_at";

    // 1. Ambil Ringkasan
    const [summaryResult] = await pool.query(
      `SELECT IFNULL(SUM(total), 0) as totalRevenue, COUNT(id) as totalTransactions
       FROM ${tableName} WHERE DATE(${dateColumn}) BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    // 2. Ambil daftar transaksi BESERTA detail produknya
    let salesListWithItems = [];
    try {
      const [rows] = await pool.query(
        `SELECT 
          t.id, 
          t.total, 
          t.payment_method, 
          t.${dateColumn} as created_at, 
          u.name as cashier_name,
          GROUP_CONCAT(CONCAT(p.name, '|', dt.qty) SEPARATOR '||') as items_data
         FROM ${tableName} t
         JOIN users u ON t.cashier_id = u.id
         LEFT JOIN ${detailsTableName} dt ON t.id = dt.${foreignKey}
         LEFT JOIN products p ON dt.product_id = p.id
         WHERE DATE(t.${dateColumn}) BETWEEN ? AND ?
         GROUP BY t.id, t.total, t.payment_method, t.${dateColumn}, u.name
         ORDER BY t.${dateColumn} DESC`,
        [startDate, endDate]
      );
      salesListWithItems = rows;
    } catch (err) {
      console.error("ERROR PADA QUERY PRODUK:", err.message);
      // Fallback: Jika query detail gagal, ambil transaksi dasar saja
      const [rows] = await pool.query(
        `SELECT t.id, t.total, t.payment_method, t.${dateColumn} as created_at, u.name as cashier_name
         FROM ${tableName} t
         JOIN users u ON t.cashier_id = u.id
         WHERE DATE(t.${dateColumn}) BETWEEN ? AND ?
         ORDER BY t.${dateColumn} DESC`,
        [startDate, endDate]
      );
      salesListWithItems = rows;
    }

    // Format data untuk dikirim ke frontend
    const formattedTransactions = salesListWithItems.map(trx => ({
      ...trx,
      items: trx.items_data ? trx.items_data.split('||').map(item => {
        const [product_name, qty] = item.split('|');
        return { product_name, qty: parseInt(qty) || 0 };
      }) : []
    }));

    return res.json({
      summary: summaryResult[0],
      transactions: formattedTransactions
    });

  } catch (error) {
    console.error("REPORT CONTROLLER ERROR:", error.sqlMessage || error.message);
    return res.status(500).json({ 
      message: "Gagal menarik laporan penjualan", 
      error: error.sqlMessage || error.message 
    });
  }
};
// Hapus satu item dari transaksi
exports.deleteItem = async (req, res) => {
  const { itemId } = req.params; // ID dari tabel sale_items
  await pool.query("DELETE FROM sale_items WHERE id = ?", [itemId]);
  res.json({ message: "Produk berhasil dihapus" });
};

// Update jumlah (qty) produk
exports.updateItemQty = async (req, res) => {
  const { itemId } = req.params;
  const { qty } = req.body;
  await pool.query("UPDATE sale_items SET qty = ? WHERE id = ?", [qty, itemId]);
  res.json({ message: "Jumlah berhasil diupdate" });
};