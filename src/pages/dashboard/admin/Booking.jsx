import React from "react";
import { Search, CalendarDays } from "lucide-react";

const bookings = [
  {
    client: "Аптека Акме",
    date: "2025-05-10",
    status: "Ожидает",
    total: "750,000 сум",
  },
  {
    client: "МедПлюс",
    date: "2025-05-12",
    status: "Подтвержден",
    total: "1,100,000 сум",
  },
  {
    client: "Городская Клиника",
    date: "2025-05-08",
    status: "Отменён",
    total: "0 сум",
  },
];

const Booking = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Бронирование</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск бронирования..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Клиент</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{item.client}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  {item.date}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === "Подтвержден"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Ожидает"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;
