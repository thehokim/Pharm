import React, { useEffect, useState } from "react";
import { CheckCircle, Info, Loader2 } from "lucide-react";

const mockNotifications = [
  { id: 1, message: "Заказ #1234 был успешно оформлен", read: false },
  { id: 2, message: "Поставщик “Аптека Акме” обновил информацию", read: true },
  { id: 3, message: "Новый пользователь зарегистрирован", read: false },
  { id: 4, message: "Товар 'Парацетамол' на исходе", read: true },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Уведомления
        </h2>

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
                  n.read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="mt-1">
                  {n.read ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <Info className="text-blue-500 w-5 h-5" />
                  )}
                </div>
                <div className="text-sm text-gray-800">{n.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
