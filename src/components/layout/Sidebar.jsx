import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ClipboardList,
  FileSearch,
  Settings,
  UserCog,
  BookLockIcon,
  Circle,
  BellDotIcon,
  LucideAudioLines,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Ключи меню — для перевода через i18next
const menu = [
  { labelKey: "dashboard", icon: <LayoutDashboard size={18} />, to: "" },
  { labelKey: "booking", icon: <BookLockIcon size={18} />, to: "booking" },
  { labelKey: "users", icon: <Users size={18} />, to: "users" },
  { labelKey: "analytics", icon: <LucideAudioLines size={18} />, to: "analytics" },
  { labelKey: "products", icon: <Package size={18} />, to: "products" },
  { labelKey: "clients", icon: <UserCog size={18} />, to: "clients" },
  { labelKey: "suppliers", icon: <ClipboardList size={18} />, to: "suppliers" },
  { labelKey: "orders", icon: <ShoppingCart size={18} />, to: "orders" },
  { labelKey: "logs", icon: <FileSearch size={18} />, to: "logs" },
  { labelKey: "parser", icon: <FileSearch size={18} />, to: "parser" },
  { labelKey: "notifications", icon: <BellDotIcon size={18} />, to: "notifications" },
  { labelKey: "settings", icon: <Settings size={18} />, to: "settings" },
];

const Sidebar = () => {
  const { t } = useTranslation("sidebar");

  return (
    <aside className="w-66 rounded-r-xl h-screen bg-white fixed top-0 left-0 overflow-y-auto">
      <div className="p-4 text-lg font-bold border-b border-dashed border-gray-100 flex items-center justify-center gap-2">
        <Circle />
        {t("companyName")}
      </div>
      <nav className="flex flex-col gap-1 px-2 py-1">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={`/admin/${item.to}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-3 rounded-xl transition-colors duration-200 hover:bg-blue-50 text-sm ${
                isActive
                  ? "bg-blue-50 rounded-xl font-semibold text-blue-600"
                  : "text-gray-700"
              }`
            }
            end={item.to === ""}
          >
            {item.icon}
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
