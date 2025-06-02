import React from "react";
import { Routes, Route } from "react-router-dom";
import SalesSidebar from "../components/layout/SalesSidebar";

import Clients from "../pages/dashboard/sales/Client/Clients";
import Analytics from "../pages/dashboard/sales/Analytics";
import Home from "../pages/dashboard/sales/Home/Home";
import Suppliers from "../pages/dashboard/sales/Supplier/Suppliers";
import Products from "../pages/dashboard/sales/Product/Products";
import Booking from "../pages/dashboard/sales/Booking/Booking";
import Orders from "../pages/dashboard/sales/Order/Orders";
import Notifications from "../pages/dashboard/sales/Home/Notifications";
import Settings from "../pages/dashboard/sales/Settings";

const SalesRoutes = () => {
  return (
    <div className="flex">
      <SalesSidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="clients" element={<Clients />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="booking" element={<Booking />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default SalesRoutes;
