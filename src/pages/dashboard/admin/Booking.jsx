import React from "react";
import { Search, CalendarDays, CalendarCheck } from "lucide-react";

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

// Функция для получения числовой суммы
const getTotalSum = () => {
  const sum = bookings.reduce((acc, item) => {
    const numeric = parseInt(item.total.replace(/[^\d]/g, ""));
    return acc + numeric;
  }, 0);
  return sum.toLocaleString() + " сум";
};

const Booking = () => {
  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarCheck /> Бронирование
        </h2>
        <div className="flex gap-2">
          <button className="bg-black flex items-center justify-center w-1/5 rounded-full text-white">
            +
          </button>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск бронирования..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">Клиент</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((item, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{item.client}</td>
                <td className="px-6 py-4 flex items-center gap-2 text-gray-600">
                  <CalendarDays size={16} className="text-indigo-400" />
                  {item.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
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
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Итог */}
          <tfoot>
            <tr className="bg-white border-t-1 border-gray-100 font-semibold text-gray-700">
              <td className="px-6 py-4" colSpan={3}>
                Общая сумма
              </td>
              <td className="px-6 py-4">{getTotalSum()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Booking;
