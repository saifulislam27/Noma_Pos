const db = require("../config/db"); // Sesuaikan dengan konfigurasi koneksi database Anda

exports.getDashboardSummary = async (req, res) => {
  try {
    // 1. Hitung Total Penjualan (Semua Pendapatan)
    const [salesResult] = await db.query("SELECT SUM(total) as totalSales FROM sales");
    const totalSales = salesResult[0].totalSales || 0;

    // 2. Hitung Transaksi Hari Ini
    const [transactionsResult] = await db.query(
      "SELECT COUNT(*) as todayTransactions FROM sales WHERE DATE(created_at) = CURRENT_DATE()"
    );
    const todayTransactions = transactionsResult[0].todayTransactions || 0;

    // 3. Hitung Total Produk di Toko
    const [productsResult] = await db.query("SELECT COUNT(*) as totalProducts FROM products");
    const totalProducts = productsResult[0].totalProducts || 0;

    // 4. Hitung Kasir Aktif (User dengan role cashier)
    const [cashiersResult] = await db.query("SELECT COUNT(*) as activeCashiers FROM users WHERE role = 'cashier'");
    const activeCashiers = cashiersResult[0].activeCashiers || 0;

    // 5. Ambil 5 Aktivitas Transaksi Terbaru untuk Log Aktivitas
    const [recentSales] = await db.query(
      `SELECT s.id, s.total, u.name as cashier_name, DATE_FORMAT(s.created_at, '%H:%i') as time 
       FROM sales s 
       JOIN users u ON s.cashier_id = u.id 
       ORDER BY s.created_at DESC LIMIT 5`
    );

    const recentActivities = recentSales.map((sale) => ({
      description: `Transaksi #${String(sale.id).padStart(3, "0")} oleh ${sale.cashier_name} seharga Rp ${sale.total.toLocaleString("id-ID")}`,
      time: sale.time,
    }));

    // 6. Ambil Data Penjualan per Bulan (12 Bulan Terakhir)
    const query = `
        SELECT 
            DATE_FORMAT(created_at, '%b %Y') as month,
            SUM(total) as sales
        FROM sales
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%b %Y'), YEAR(created_at), MONTH(created_at)
        ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC
    `;
    
    // Eksekusi query ke database
    const [monthlySalesRows] = await db.query(query);

    const formattedMonthlySalesData = monthlySalesRows.map((item) => ({
      month: item.month,
      sales: parseInt(item.sales) || 0,
    }));

    // 7. Ambil Daftar Kategori Produk
    const [categories] = await db.query(
      `SELECT id, name FROM categories ORDER BY name ASC`
    );

    // 8. Ambil Produk Terlaku (Top Seller) - 5 produk teratas
    const [bestSellingProducts] = await db.query(
      `SELECT 
        p.id,
        p.name,
        p.price,
        c.name as category_name,
        COALESCE(SUM(si.qty), 0) as sold_qty
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN sale_items si ON p.id = si.product_id
       GROUP BY p.id, p.name, p.price, c.name
       ORDER BY sold_qty DESC
       LIMIT 5`
    );

    // Kirim semua data ke frontend
    res.status(200).json({
      totalSales,
      todayTransactions,
      totalProducts,
      activeCashiers,
      recentActivities,
      monthlySalesData: formattedMonthlySalesData,
      categories,
      bestSellingProducts,
    });
  } catch (error) {
    console.error("Error pada dashboardController:", error);
    res.status(500).json({ message: "Internal Server Error pada data dashboard" });
  }
};