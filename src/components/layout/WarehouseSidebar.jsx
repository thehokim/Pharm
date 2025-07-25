import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  QrCode,
  AlertTriangle,
  Circle,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const WarehouseSidebar = () => {
  const { t } = useTranslation("warehouse");
  const links = [
    { to: "", label: t("dashboard_title"), icon: <LayoutDashboard size={18} /> },
    { to: "inventory", label: t("inventory"), icon: <Package size={18} /> },
    { to: "orders", label: t("orders"), icon: <ShoppingCart size={18} /> },
    { to: "qr", label: t("qr_scanner"), icon: <QrCode size={18} /> },
    { to: "expiring", label: t("expiring_items"), icon: <AlertTriangle size={18} /> },
    { label: t("settings"), icon: <Settings size={18} />, to: "settings" },
  ];

  return (
    <aside className="w-66 rounded-r-xl h-screen top-0 left-0 z-50 border-r border-gray-100 hidden md:block">
      {/* Header */}
      <div className="p-4 text-lg font-bold border-b border-dashed border-gray-100 flex items-center justify-center gap-2">
        <Circle /> {t("dashboard_title")}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2 py-2">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={`/warehouse/${to}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-3 rounded-xl transition-colors duration-200 text-sm ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
            end={to === ""}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default WarehouseSidebar;
