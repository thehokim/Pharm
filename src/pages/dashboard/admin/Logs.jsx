import React from "react";
import { Search, ClipboardList } from "lucide-react";

const logs = [
  {
    type: "AUTH",
    date: "2025-05-07 10:15",
    user: "admin",
    description: "Успешный вход в систему",
    result: "OK",
  },
  {
    type: "UPDATE",
    date: "2025-05-07 09:50",
    user: "john.doe",
    description: "Изменил данные клиента",
    result: "OK",
  },
  {
    type: "DELETE",
    date: "2025-05-06 17:35",
    user: "jane.smith",
    description: "Удалил заказ",
    result: "ERROR",
  },
  {
    type: "CREATE",
    date: "2025-05-06 14:20",
    user: "admin",
    description: "Создал нового пользователя",
    result: "OK",
  },
];

const Logs = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <ClipboardList /> Журнал действий
        </h2>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по логам..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">Тип</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Пользователь</th>
              <th className="px-6 py-4">Описание</th>
              <th className="px-6 py-4">Результат</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{log.type}</td>
                <td className="px-6 py-4">{log.date}</td>
                <td className="px-6 py-4">{log.user}</td>
                <td className="px-6 py-4">{log.description}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      log.result === "OK"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.result}
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

export default Logs;
