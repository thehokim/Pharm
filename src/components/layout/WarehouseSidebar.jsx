import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  QrCode,
  AlertTriangle,
} from "lucide-react";

const WarehouseSidebar = () => {
  const links = [
    { to: "", label: "Панель управления", icon: <LayoutDashboard size={18} /> },
    { to: "inventory", label: "Инвентарь", icon: <Package size={18} /> },
    { to: "orders", label: "Заказы", icon: <ShoppingCart size={18} /> },
    { to: "qr", label: "QR Сканер", icon: <QrCode size={18} /> },
    { to: "expiring", label: "Истекающие товары", icon: <AlertTriangle size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white h-screen border-r hidden md:block">
      <div className="p-6 font-bold text-lg">Управление складом</div>
      <nav className="px-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={`/warehouse/${to}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 ${
                isActive ? "bg-gray-200 text-black" : "text-gray-700"
              }`
            }
            end={to === ""}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default WarehouseSidebar;
