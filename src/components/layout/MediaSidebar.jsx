import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  Video,
  FileText,
  Settings,
  Circle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const menu = [
  { labelKey: "dashboard", icon: <LayoutDashboard size={18} />, to: "" },
  { labelKey: "images", icon: <Image size={18} />, to: "images" },
  { labelKey: "videos", icon: <Video size={18} />, to: "videos" },
  { labelKey: "documents", icon: <FileText size={18} />, to: "documents" },
  { labelKey: "settings", icon: <Settings size={18} />, to: "settings" },
];

const MediaSidebar = () => {
  const { t } = useTranslation("sidebar");

  return (
    <aside className="w-66 rounded-r-xl h-screen bg-white fixed top-0 left-0">
      <div className="p-4 text-lg font-bold border-b border-dashed border-gray-100 flex items-center justify-center gap-2">
        <Circle /> {t("companyName")}
      </div>
      <nav className="flex flex-col gap-1 px-2 py-1">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={`/media/${item.to}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-3 rounded-xl transition-colors duration-200 hover:bg-blue-50 text-sm ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-600"
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

export default MediaSidebar; 