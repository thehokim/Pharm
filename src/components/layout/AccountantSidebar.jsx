import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Wallet,
  BarChart3,
  Circle,
  Settings,
} from "lucide-react";

const menu = [
  { label: "Панель управления", icon: <LayoutDashboard size={18} />, to: "" },
  { label: "Выписки", icon: <FileText size={18} />, to: "transactions" },
  { label: "Долги", icon: <CreditCard size={18} />, to: "debts" },
  { label: "Налоги", icon: <Wallet size={18} />, to: "taxes" },
  { label: "Отчёты", icon: <BarChart3 size={18} />, to: "reports" },
  { label: "Настройки", icon: <Settings size={18} />, to: "settings" },
];

const AccountantSidebar = () => {
  return (
    <aside className="w-66 rounded-r-xl h-screen top-0 left-0 z-50 border-r border-gray-100 fixed hidden md:block bg-white">
      {/* Header */}
      <div className="p-4 text-lg font-bold border-b border-dashed border-gray-100 flex items-center justify-center gap-2">
        <Circle /> Бухгалтерия
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2 py-2">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={`/accountant/${item.to}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-3 rounded-xl transition-colors duration-200 text-sm ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
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
