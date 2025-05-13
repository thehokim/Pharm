import React from "react";
import { Search, Activity } from "lucide-react";

const activityLog = [
  {
    user: "John Doe",
    action: "Создал нового клиента",
    date: "2025-05-07 12:45",
    status: "Успешно",
  },
  {
    user: "Jane Smith",
    action: "Удалил товар",
    date: "2025-05-07 11:30",
    status: "Ошибка",
  },
  {
    user: "Robert Johnson",
    action: "Обновил заказ",
    date: "2025-05-06 17:15",
    status: "Успешно",
  },
  {
    user: "Sarah Williams",
    action: "Импортировал товары",
    date: "2025-05-06 15:40",
    status: "Успешно",
  },
];

const Activities = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <Activity size={28} /> Активности пользователей
        </h2>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по действиям..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">Пользователь</th>
              <th className="px-6 py-4">Действие</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activityLog.map((log, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{log.user}</td>
                <td className="px-6 py-4">{log.action}</td>
                <td className="px-6 py-4">{log.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      log.status === "Успешно"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activities;
