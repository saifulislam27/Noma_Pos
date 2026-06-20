import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// layouts
import OwnerLayout from "./layouts/OwnerLayout";
import CashierLayout from "./layouts/CashierLayout";

// pages
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

// owner pages
import Dashboard from "./pages/owner/dashboard/Dashboard";
import Products from "./pages/owner/products/Products";
import Categories from "./pages/owner/categories/Categories";
import Cashiers from "./pages/owner/cashiers/Cashiers";
import Reports from "./pages/owner/reports/Reports";

// cashier pages
import NewTransaction from "./pages/cashier/NewTransaction";
import TransactionHistory from "./pages/cashier/TransactionHistory";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>

      {/* ROOT REDIRECT */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : user.role === "owner" ? (
            <Navigate to="/owner" />
          ) : (
            <Navigate to="/cashier" />
          )
        }
      />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* OWNER ROUTES */}
<Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
  <Route path="/owner" element={<OwnerLayout />}>
    <Route index element={<Dashboard />} /> {/* Menangani /owner */}
    <Route path="dashboard" element={<Dashboard />} /> {/* 🌟 TAMBAHKAN BARIS INI untuk menangani /owner/dashboard */}
    <Route path="products" element={<Products />} />
    <Route path="categories" element={<Categories />} />
    <Route path="cashiers" element={<Cashiers />} />
    <Route path="reports" element={<Reports />} />
  </Route>
</Route>

      {/* CASHIER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["cashier"]} />}>
        <Route element={<CashierLayout />}>

          <Route path="/cashier" element={<NewTransaction />} />
          <Route path="/cashier/history" element={<TransactionHistory />} />

        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404 Not Found</h1>} />

    </Routes>
  );
}