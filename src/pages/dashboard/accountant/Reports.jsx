import React from "react";

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

const Reports = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Отчёты</h2>
      <p className="text-gray-600">Финансовые и налоговые отчёты компании.</p>

      <div className="bg-white shadow rounded-xl p-4">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Название</th>
              <th className="px-4 py-2 text-left">Тип</th>
              <th className="px-4 py-2 text-left">Дата</th>
              <th className="px-4 py-2 text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{report.title}</td>
                <td className="px-4 py-2">{report.type}</td>
                <td className="px-4 py-2">{report.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === "Готов"
                        ? "bg-green-100 text-green-700"
                        : report.status === "Ожидает подтверждения"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {report.status}
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

export default Reports;
