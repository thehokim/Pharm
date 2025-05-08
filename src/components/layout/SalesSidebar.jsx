import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  CalendarCheck,
  BarChart,
} from "lucide-react";

const menu = [
  { label: "Панель", icon: <LayoutDashboard size={18} />, to: "" },
  { label: "Товары", icon: <Package size={18} />, to: "products" },
  { label: "Клиенты", icon: <Users size={18} />, to: "clients" },
  { label: "Заказы", icon: <ShoppingCart size={18} />, to: "orders" },
  { label: "Бронирование", icon: <CalendarCheck size={18} />, to: "booking" },
  { label: "Аналитика", icon: <BarChart size={18} />, to: "analytics" },
];

const SalesSidebar = () => {
  return (
    <aside className="w-64 h-screen border-r bg-white fixed top-0 left-0">
      <div className="p-4 text-lg font-bold border-b">Фармацевтика: Продажи</div>
      <nav className="flex flex-col gap-1 p-4">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={`/sales/${item.to}`}
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

export default SalesSidebar;
