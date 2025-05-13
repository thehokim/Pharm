import React, { useState } from "react";
import { FileText, Search } from "lucide-react";

const mockReports = [
  {
    title: "Финансовый отчёт за Май 2025",
    type: "Финансовый",
    status: "Готов",
    date: "2025-06-01",
  },
  {
    title: "Налоговый отчёт за Апрель 2025",
    type: "Налоговый",
    status: "Ожидает подтверждения",
    date: "2025-05-01",
  },
  {
    title: "Сводный отчёт по задолженностям",
    type: "Аналитический",
    status: "В работе",
    date: "2025-06-05",
  },
];

const statusColors = {
  Готов: "bg-green-100 text-green-700",
  "Ожидает подтверждения": "bg-yellow-100 text-yellow-700",
  "В работе": "bg-gray-200 text-gray-700",
};

const typeColors = {
  Финансовый: "bg-blue-100 text-blue-700",
  Налоговый: "bg-purple-100 text-purple-700",
  Аналитический: "bg-indigo-100 text-indigo-700",
};

const Reports = () => {
  const [statusFilter, setStatusFilter] = useState("Все");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = mockReports.filter((report) => {
    const matchesStatus =
      statusFilter === "Все" || report.status === statusFilter;
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ["Все", "Готов", "Ожидает подтверждения", "В работе"];

  return (
    <div className="space-y-6 bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white rounded-xl p-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Отчёты
        </h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
          <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-full text-sm border ${
                  statusFilter === status
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 text-sm focus:outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Таблица */}
      <div className="bg-white rounded-2xl p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-xs text-gray-600 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Название</th>
              <th className="px-6 py-4 text-left">Тип</th>
              <th className="px-6 py-4 text-left">Дата</th>
              <th className="px-6 py-4 text-left">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  Нет отчётов по заданным условиям
                </td>
              </tr>
            ) : (
              filteredReports.map((report, i) => (
                <tr
                  key={i}
                  className="hover:bg-indigo-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium">{report.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        typeColors[report.type]
                      }`}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{report.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[report.status]
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
