import React, { useEffect, useState } from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/notifications/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки уведомлений:", err);
        setLoading(false);
      });
  }, []);

  const renderIcon = (n) => {
    if (n.is_read) return <CheckCircle className="text-green-500 w-5 h-5" />;
    switch (n.type) {
      case "warning":
        return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
      case "error":
        return <XCircle className="text-red-500 w-5 h-5" />;
      case "success":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      default:
        return <Info className="text-blue-500 w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Уведомления</h2>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Загрузка уведомлений...
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">Нет уведомлений</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 border rounded-lg px-4 py-3 transition shadow-sm ${
                  n.is_read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="mt-1">{renderIcon(n)}</div>
                <div className="text-sm text-gray-800">
                  <div className="font-medium mb-0.5">{n.title}</div>
                  <div>{n.message}</div>
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
