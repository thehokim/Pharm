import React from "react";
import { Search, Download, FileText } from "lucide-react";

const reports = [
  {
    title: "Финансовый отчет за Апрель",
    category: "Финансы",
    date: "2025-05-01",
    author: "admin",
    fileUrl: "/downloads/report-april.pdf",
  },
  {
    title: "Отчет по остаткам товаров",
    category: "Товары",
    date: "2025-04-28",
    author: "john.doe",
    fileUrl: "/downloads/inventory-report.xlsx",
  },
  {
    title: "Отчет по активности пользователей",
    category: "Пользователи",
    date: "2025-04-25",
    author: "admin",
    fileUrl: "/downloads/user-activity.pdf",
  },
];

const Reports = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      {/* Заголовок и поиск */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText /> Отчеты
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по отчетам..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">Название</th>
              <th className="px-6 py-4">Категория</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Автор</th>
              <th className="px-6 py-4">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{report.title}</td>
                <td className="px-6 py-4">{report.category}</td>
                <td className="px-6 py-4">{report.date}</td>
                <td className="px-6 py-4">{report.author}</td>
                <td className="px-6 py-4">
                  <a
                    href={report.fileUrl}
                    download
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Download size={16} />
                    Скачать
                  </a>
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
