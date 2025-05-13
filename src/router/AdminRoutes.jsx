import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

import Home from "../pages/dashboard/admin/Home/Home";
import Clients from "../pages/dashboard/admin/Client/Clients";
import Suppliers from "../pages/dashboard/admin/Supplier/Suppliers";
import Orders from "../pages/dashboard/admin/Order/Orders";
import Activities from "../pages/dashboard/admin/Activities";
import Logs from "../pages/dashboard/admin/Logs";
import Reports from "../pages/dashboard/admin/Reports";
import Settings from "../pages/dashboard/admin/Settings";
import Analytics from "../pages/dashboard/admin/Analytics";
import Booking from "../pages/dashboard/admin/Booking";
import Products from "../pages/dashboard/admin/Product/Products";
import Users from "../pages/dashboard/admin/User/Users";

const AdminRoutes = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="clients" element={<Clients />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="activities" element={<Activities />} />
          <Route path="logs" element={<Logs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="booking" element={<Booking />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
