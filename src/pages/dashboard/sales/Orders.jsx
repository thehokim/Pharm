import React from "react";
import { Search, MoreVertical } from "lucide-react";

const orders = [
  { id: "#ORD-011", client: "Аптека Акме", date: "2025-05-07", status: "В процессе", total: "880,000 сум" },
  { id: "#ORD-012", client: "МедПлюс", date: "2025-05-06", status: "Выполнен", total: "1,250,000 сум" },
];

const Orders = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Заказы</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск заказов..."
          className="pl-10 pr-4 py-2 border rounded w-full"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-700">
            <tr>
              <th className="px-4 py-2">Номер</th>
              <th className="px-4 py-2">Клиент</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Сумма</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{o.id}</td>
                <td className="px-4 py-2">{o.client}</td>
                <td className="px-4 py-2">{o.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      o.status === "Выполнен"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-2">{o.total}</td>
                <td className="px-4 py-2">
                  <MoreVertical size={18} className="text-gray-500 cursor-pointer" />
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
