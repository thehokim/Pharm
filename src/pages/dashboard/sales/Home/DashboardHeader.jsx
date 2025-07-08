import { BarChart3Icon, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DashboardHeader = () => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { t } = useTranslation("sales_home");

  useEffect(() => {
    const wasViewed = localStorage.getItem("notifications_read") === "true";
    setHasUnreadNotifications(!wasViewed);
  }, []);

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl">
      <div className="flex items-center gap-2">
        <BarChart3Icon />
        <h2 className="text-2xl font-semibold text-gray-800">
          {t("dashboard_title")}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/sales/notifications"
          onClick={() => {
            setHasUnreadNotifications(false);
            localStorage.setItem("notifications_read", "true");
          }}
          className="relative"
        >
          <button className="bg-blue-100 rounded-full p-2.5 relative">
            <Bell className="w-5 h-5 text-blue-600" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            )}
          </button>
        </Link>
        <Link to="/sales/settings">
          <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center text-blue-600 justify-center">
            AD
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
