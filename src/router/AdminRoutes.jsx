import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Home from "../pages/dashboard/admin/Home/Home";
import Clients from "../pages/dashboard/admin/Client/Clients";
import Suppliers from "../pages/dashboard/admin/Supplier/Suppliers";
import Orders from "../pages/dashboard/admin/Order/Orders";
import Logs from "../pages/dashboard/admin/LogsAdmin/Logs";
import Settings from "../pages/dashboard/admin/Settings/Settings";
import Booking from "../pages/dashboard/admin/Booking/Booking";
import Products from "../pages/dashboard/admin/Product/Products";
import Users from "../pages/dashboard/admin/User/Users";
import Notifications from "../pages/dashboard/admin/Home/Notifications";
import Analytics from "../pages/dashboard/admin/Analytics/Analytics";

const AdminRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar с кнопкой переключения */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Основной контент */}
      <div
        className={`w-full min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="clients" element={<Clients />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="booking" element={<Booking />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;