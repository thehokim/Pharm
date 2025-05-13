import React from "react";
import { CalendarCheck, CalendarDays} from "lucide-react";

const bookings = [
  {
    client: "Аптека Акме",
    date: "2025-05-10",
    status: "Ожидает",
    total: "750,000 сум",
  },
  {
    client: "Городская Клиника",
    date: "2025-05-12",
    status: "Подтвержден",
    total: "1,200,000 сум",
  },
];

const Booking = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarCheck /> Бронирование
        </h2>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Клиент</th>
              <th className="px-6 py-4 bg-gray-100">Дата</th>
              <th className="px-6 py-4 bg-gray-100">Статус</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((item, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{item.client}</td>
                <td className="px-6 py-4 flex items-center gap-2 text-sm">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  {item.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "Подтвержден"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;
