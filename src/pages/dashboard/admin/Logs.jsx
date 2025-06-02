import React, { useEffect, useState } from "react";
import { Search, ClipboardList } from "lucide-react";
import { BASE_URL } from "../../../utils/auth";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/action-logs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Преобразуем timestamp в формат "YYYY-MM-DD HH:mm"
        const parsed = data.map((log) => ({
          ...log,
          date: new Date(log.timestamp).toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setLogs(parsed);
        setFilteredLogs(parsed);
      })
      .catch((err) => {
        console.error("Ошибка загрузки логов:", err);
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredLogs(
      logs.filter(
        (log) =>
          log.role.toLowerCase().includes(term) ||
          log.user_id.toString().includes(term) ||
          log.action.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, logs]);

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <ClipboardList /> Журнал действий
        </h2>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по роли, ID или действию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">Пользователь ID</th>
              <th className="px-6 py-4">Роль</th>
              <th className="px-6 py-4">Действие</th>
              <th className="px-6 py-4">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.map((log, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{log.user_id}</td>
                <td className="px-6 py-4">{log.role}</td>
                <td className="px-6 py-4">{log.action}</td>
                <td className="px-6 py-4">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="p-6 text-center text-gray-500">Нет совпадений</div>
        )}
      </div>
    </div>
  );
};

export default Logs;
