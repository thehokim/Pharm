import React, { useEffect, useState } from "react";
import {
  CheckCircle, Info, AlertTriangle, XCircle, Loader2, Eye, EyeOff
} from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const iconByType = {
  success: <CheckCircle className="text-green-500 w-6 h-6" />,
  error: <XCircle className="text-red-500 w-6 h-6" />,
  warning: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
  info: <Info className="text-blue-500 w-6 h-6" />,
};

const Notifications = () => {
  const { t } = useTranslation("home");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error(t("notifications.loadError"), err);
    }
    setLoading(false);
  };

  // Пометить как прочитанное
  const markAsRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/notifications/${id}/read/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      alert(t("notifications.readError"));
    }
  };

  // Удалить уведомление
  const deleteNotification = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/notifications/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(t("notifications.deleteError"));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="mx-auto bg-white p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("notifications.title")}
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400 text-base">
            <Loader2 className="w-5 h-5 animate-spin" />
            {t("notifications.loading")}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-400 py-6">{t("notifications.empty")}</div>
        ) : (
          <ul className="divide-y">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`py-4 px-3 flex items-start gap-4 rounded-xl transition group ${
                  n.is_read
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "bg-indigo-50 hover:bg-indigo-100 border-l-4 border-indigo-400"
                }`}
              >
                <div className="pt-1">{iconByType[n.type] || iconByType.info}</div>
                <div className="flex-1">
                  <div className="font-semibold text-base text-gray-900">
                    {n.title}
                  </div>
                  <div className="text-sm text-gray-700 mb-1">{n.message}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-2">
                  {!n.is_read && (
                    <button
                      title={t("notifications.markAsRead")}
                      className="text-gray-400 hover:text-indigo-600 transition"
                      onClick={() => markAsRead(n.id)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    title={t("notifications.delete")}
                    className="text-gray-400 hover:text-red-600 transition"
                    onClick={() => deleteNotification(n.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
