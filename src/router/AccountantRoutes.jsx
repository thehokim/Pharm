import React from "react";
import { Routes, Route } from "react-router-dom";
import AccountantSidebar from "../components/layout/AccountantSidebar";

import Home from "../pages/dashboard/accountant/Home/Home";
import Transactions from "../pages/dashboard/accountant/Transactions";
import Debts from "../pages/dashboard/accountant/Debts/Debts";
import Taxes from "../pages/dashboard/accountant/Taxes/Taxes";
import Reports from "../pages/dashboard/accountant/Reports/Reports";
import Settings from "../pages/dashboard/accountant/Settings/Settings";

const AccountantRoutes = () => {
  return (
    <div className="flex">
      <AccountantSidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="debts" element={<Debts />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default AccountantRoutes;
