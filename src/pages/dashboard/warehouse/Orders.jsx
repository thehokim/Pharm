import React, { useState } from "react";
import { Search, ClipboardList, ShoppingCart } from "lucide-react";

const initialOrders = [
  {
    id: "ORD-12345",
    client: "Аптека Акме",
    date: "2025-05-31",
    items: 12,
    status: "Готово",
  },
  {
    id: "ORD-12346",
    client: "МедПлюс",
    date: "2025-05-30",
    items: 8,
    status: "В обработке",
  },
  {
    id: "ORD-12347",
    client: "Городская Клиника",
    date: "2025-06-01",
    items: 5,
    status: "Готово",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Готово":
      return "bg-green-500 text-white";
    case "В обработке":
      return "bg-yellow-300 text-gray-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Orders = () => {
  const [orders] = useState(initialOrders);

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart /> Заказы
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск заказов..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">ID Заказа</th>
              <th className="px-6 py-4 bg-gray-100">Клиент</th>
              <th className="px-6 py-4 bg-gray-100">Дата</th>
              <th className="px-6 py-4 bg-gray-100">Товары</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.client}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">{order.items}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
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

export default Orders;
