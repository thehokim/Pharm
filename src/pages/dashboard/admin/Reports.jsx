import React from "react";
import { Search, Download } from "lucide-react";

const reports = [
  {
    title: "Финансовый отчет за Апрель",
    category: "Финансы",
    date: "2025-05-01",
    author: "admin",
  },
  {
    title: "Отчет по остаткам товаров",
    category: "Товары",
    date: "2025-04-28",
    author: "john.doe",
  },
  {
    title: "Отчет по активности пользователей",
    category: "Пользователи",
    date: "2025-04-25",
    author: "admin",
  },
];

const Reports = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Отчеты</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск по отчетам..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Название</th>
              <th className="px-4 py-2">Категория</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Автор</th>
              <th className="px-4 py-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{report.title}</td>
                <td className="px-4 py-2">{report.category}</td>
                <td className="px-4 py-2">{report.date}</td>
                <td className="px-4 py-2">{report.author}</td>
                <td className="px-4 py-2">
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <Download size={16} />
                    Скачать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
