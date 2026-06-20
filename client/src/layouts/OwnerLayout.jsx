import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function OwnerLayout() {
  return (
    <div className="flex">
      <Sidebar role="owner" />

      <div className="flex-1 bg-slate-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          <Outlet />   {/* 🔥 INI WAJIB */}
        </div>
      </div>
    </div>
  );
}