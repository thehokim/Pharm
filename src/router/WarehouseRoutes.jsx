import React from "react";
import { Routes, Route } from "react-router-dom";

import WarehouseSidebar from "../components/layout/WarehouseSidebar";
import Home from "../pages/dashboard/warehouse/Home/Home";
import Inventory from "../pages/dashboard/warehouse/Inventory";
import Orders from "../pages/dashboard/warehouse/Orders";
import ExpiringItems from "../pages/dashboard/warehouse/ExpiringItems";
import QrScanner from "../pages/dashboard/warehouse/QrScanner";
import Settings from "../pages/dashboard/warehouse/Settings/Settings";



const WarehouseRoutes = () => {
  return (
    <div className="flex">
      <WarehouseSidebar />
      <main className="flex-1 min-h-screen bg-gray-50 p-6">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="expiring" element={<ExpiringItems />} />
          <Route path="qr" element={<QrScanner />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default WarehouseRoutes;
