import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function CashierLayout() {
  return (
    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar role="cashier" />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}