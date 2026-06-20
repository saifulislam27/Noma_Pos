import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";

// Import Layouts
import OwnerLayout from "../layouts/OwnerLayout";
import CashierLayout from "../layouts/CashierLayout";

// Import Halaman Owner (Sesuaikan path folder jika ada sedikit perbedaan)
import Dashboard from "../pages/owner/dashboard/Dashboard";
import Categories from "../pages/owner/categories/Categories";
import Products from "../pages/owner/products/Products";
import Cashiers from "../pages/owner/cashiers/Cashiers";
import Reports from "../pages/owner/reports/Reports";
// Jika halaman transactions belum ada file .jsx nya, kamu bisa buat dulu atau comment baris ini
// import Transactions from "../pages/owner/transactions/Transactions"; 

// Import Halaman Cashier
import NewTransaction from "../pages/cashier/NewTransaction";
import TransactionHistory from "../pages/cashier/TransactionHistory";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik: Login */}
        <Route path="/" element={<Login />} />

        {/* Rute Khusus OWNER (Menggunakan OwnerLayout) */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          {/* Halaman anak akan otomatis merender diri di dalam <Outlet /> milik OwnerLayout */}
          <Route index element={<Dashboard />} /> {/* Menangani /owner */}
          <Route path="dashboard" element={<Dashboard />} /> {/* Menangani /owner/dashboard */}
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="cashiers" element={<Cashiers />} />
          <Route path="reports" element={<Reports />} />
          {/* <Route path="transactions" element={<Transactions />} /> */}
        </Route>

        {/* Rute Khusus CASHIER (Menggunakan CashierLayout) */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute>
              <CashierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<NewTransaction />} /> {/* Menangani /cashier */}
          <Route path="history" element={<TransactionHistory />} />
        </Route>

        {/* Redirect jika rute tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}