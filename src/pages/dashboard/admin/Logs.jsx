import React from "react";
import { Search } from "lucide-react";

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Журнал действий</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск по логам..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Тип</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Пользователь</th>
              <th className="px-4 py-2">Описание</th>
              <th className="px-4 py-2">Результат</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{log.type}</td>
                <td className="px-4 py-2">{log.date}</td>
                <td className="px-4 py-2">{log.user}</td>
                <td className="px-4 py-2">{log.description}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
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
