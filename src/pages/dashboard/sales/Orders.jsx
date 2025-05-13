import React, { useState } from "react";
import {Search, ShoppingCart } from "lucide-react";

const initialOrders = [
  {
    id: "#ORD-011",
    client: "Аптека Акме",
    date: "2025-05-07",
    status: "В процессе",
    total: "880,000 сум",
  },
  {
    id: "#ORD-012",
    client: "МедПлюс",
    date: "2025-05-06",
    status: "Выполнен",
    total: "1,250,000 сум",
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart /> Заказы
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск заказов..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Номер</th>
              <th className="px-6 py-4 bg-gray-100">Клиент</th>
              <th className="px-6 py-4 bg-gray-100">Дата</th>
              <th className="px-6 py-4 bg-gray-100">Статус</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{o.id}</td>
                <td className="px-6 py-4">{o.client}</td>
                <td className="px-6 py-4">{o.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      o.status === "Выполнен"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4">{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
