import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Wallet,
  BarChart3,
} from "lucide-react";

const menu = [
  { label: "Панель управления", icon: <LayoutDashboard size={18} />, to: "" },
  { label: "Выписки", icon: <FileText size={18} />, to: "transactions" },
  { label: "Долги", icon: <CreditCard size={18} />, to: "debts" },
  { label: "Налоги", icon: <Wallet size={18} />, to: "taxes" },
  { label: "Отчёты", icon: <BarChart3 size={18} />, to: "reports" },
];

const AccountantSidebar = () => {
  return (
    <aside className="w-64 h-screen border-r bg-white fixed top-0 left-0">
      <div className="p-4 text-lg font-bold border-b">Финансы</div>
      <nav className="flex flex-col gap-1 p-4">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={`/accountant/${item.to}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm ${
                isActive ? "bg-gray-100 font-semibold" : "text-gray-700"
              }`
            }
            end={item.to === ""}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AccountantSidebar;
