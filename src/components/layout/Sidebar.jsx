import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ClipboardList,
  Activity,
  FileText,
  Settings,
  BarChart,
  FileSearch,
  UserCog,
  BookLockIcon,
  Circle,
} from "lucide-react";

const menu = [
  { label: "Панель управления", icon: <LayoutDashboard size={18} />, to: "" },
  { label: "Аналитика", icon: <BarChart size={18} />, to: "analytics" },
  { label: "Бронирование", icon: <BookLockIcon size={18} />, to: "booking" },
  { label: "Пользователи", icon: <Users size={18} />, to: "users" },
  { label: "Товары", icon: <Package size={18} />, to: "products" },
  { label: "Клиенты", icon: <UserCog size={18} />, to: "clients" },
  { label: "Поставщики", icon: <ClipboardList size={18} />, to: "suppliers" },
  { label: "Заказы", icon: <ShoppingCart size={18} />, to: "orders" },
  { label: "Активность пользователей", icon: <Activity size={18} />, to: "activities" },
  { label: "Журнал действий", icon: <FileSearch size={18} />, to: "logs" },
  { label: "Отчеты", icon: <FileText size={18} />, to: "reports" },
  { label: "Парсер FOM.UZ", icon: <FileSearch size={18} />, to: "parser" },
  { label: "Настройки", icon: <Settings size={18} />, to: "settings" },
];

const Sidebar = () => {
  return (
    <aside className="w-66 rounded-r-xl h-screen bg-white fixed top-0 left-0">
      <div className="p-4 text-lg font-bold border-b border-dashed border-gray-100 flex items-center justify-center gap-2"><Circle/>CompanyName</div>
      <nav className="flex flex-col gap-1 px-2 py-1">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={`/admin/${item.to}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-3 rounded-xl transition-colors duration-200 hover:bg-blue-50 text-sm ${
                isActive ? "bg-blue-50 rounded-xl transition-colors duration-200 font-semibold text-blue-600" : "text-gray-700"
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

export default Sidebar;
