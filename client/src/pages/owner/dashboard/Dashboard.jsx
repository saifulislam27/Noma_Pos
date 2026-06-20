import { useEffect, useState } from "react";
import StatCard from "../../../components/ui/StatCard";
import SalesChart from "../../../components/charts/SalesChart";
import api from "../../../services/api";
import { formatRupiah } from "../../../utils/formatRupiah";

export default function Dashboard() {
  // State untuk menampung data dari backend
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    todayTransactions: 0,
    totalProducts: 0,
    activeCashiers: 0,
    recentActivities: []
  });
  
  const [loading, setLoading] = useState(true);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    const getDashboardSummary = async () => {
      try {
        setLoading(true);
        // Mengambil data dari endpoint /dashboard
        const response = await api.get("/dashboard");
        
        setDashboardData({
          totalSales: response.data.totalSales || 0,
          todayTransactions: response.data.todayTransactions || 0,
          totalProducts: response.data.totalProducts || 0,
          activeCashiers: response.data.activeCashiers || 0,
          recentActivities: response.data.recentActivities || []
        });

        // Ambil data penjualan bulanan untuk grafik
        if (response.data.monthlySalesData) {
          setMonthlySalesData(response.data.monthlySalesData);
        }

        // Ambil data kategori dan produk terlaku
        if (response.data.categories) {
          setProductCategories(response.data.categories);
        }
        if (response.data.bestSellingProducts) {
          setBestSellingProducts(response.data.bestSellingProducts);
        }
      } catch (err) {
        console.error("Gagal memuat data statistik dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardSummary();
  }, []);

  // Memetakan state ke format array StatCard milikmu
  const stats = [
    {
      title: "Total Penjualan",
      value: loading ? "Memuat..." : formatRupiah(dashboardData.totalSales),
      icon: "💰",
    },
    {
      title: "Transaksi Hari Ini",
      value: loading ? "..." : String(dashboardData.todayTransactions),
      icon: "🛒",
    },
    {
      title: "Total Produk",
      value: loading ? "..." : String(dashboardData.totalProducts),
      icon: "📦",
      onClick: () => setShowProductModal(true),
    },
    {
      title: "Kasir Aktif",
      value: loading ? "..." : String(dashboardData.activeCashiers),
      icon: "👤",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Ringkasan aktivitas toko hari ini</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      {/* CONTENT GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-slate-800">Grafik Penjualan (12 Bulan Terakhir)</h2>
          {monthlySalesData.length > 0 ? (
            <SalesChart data={monthlySalesData} />
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400 border border-dashed rounded-xl bg-slate-50">
              <div className="text-center">
                <span className="text-2xl">📈</span>
                <p className="text-xs mt-1">Memuat data grafik penjualan...</p>
              </div>
            </div>
          )}
        </div>

        {/* ACTIVITY */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-slate-800">Aktivitas Terbaru</h2>
          <div className="space-y-4 text-sm">
            {dashboardData.recentActivities.length === 0 ? (
              <p className="text-slate-400 italic text-center py-4">Belum ada aktivitas hari ini</p>
            ) : (
              dashboardData.recentActivities.map((activity, index) => (
                <div key={index} className="border-b pb-2 text-slate-600 flex justify-between items-center">
                  <span>{activity.description}</span>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL DAFTAR PRODUK & KATEGORI */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Daftar Produk & Kategori</h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-500 hover:text-slate-800 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Kategori Produk */}
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">📂 Kategori yang Tersedia</h3>
                {productCategories.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {productCategories.map((cat) => (
                      <div key={cat.id} className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="font-medium text-slate-800">{cat.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-sm">Tidak ada kategori</p>
                )}
              </div>

              {/* Produk Terlaku */}
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">🔥 Produk Terlaku (Top Seller)</h3>
                {bestSellingProducts.length > 0 ? (
                  <div className="space-y-2">
                    {bestSellingProducts.map((product, index) => (
                      <div key={product.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-800">{index + 1}. {product.name}</p>
                          <p className="text-xs text-slate-500">{product.category_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">{product.sold_qty || 0} terjual</p>
                          <p className="text-xs text-slate-500">{formatRupiah(product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-sm">Belum ada data penjualan</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowProductModal(false)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}