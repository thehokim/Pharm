import React from "react";
import { Search } from "lucide-react";

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Активности пользователей</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск по действиям..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Пользователь</th>
              <th className="px-4 py-2">Действие</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {activityLog.map((log, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{log.user}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{log.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
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
