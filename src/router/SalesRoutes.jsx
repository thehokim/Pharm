import React from "react";
import { Routes, Route } from "react-router-dom";
import SalesSidebar from "../components/layout/SalesSidebar";

import Home from "../pages/dashboard/sales/Home";
import Products from "../pages/dashboard/sales/Products";
import Clients from "../pages/dashboard/sales/Clients";
import Orders from "../pages/dashboard/sales/Orders";
import Booking from "../pages/dashboard/sales/Booking";
import Analytics from "../pages/dashboard/sales/Analytics";

const SalesRoutes = () => {
  return (
    <div className="flex">
      <SalesSidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="clients" element={<Clients />} />
          <Route path="orders" element={<Orders />} />
          <Route path="booking" element={<Booking />} />
          <Route path="analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default SalesRoutes;
