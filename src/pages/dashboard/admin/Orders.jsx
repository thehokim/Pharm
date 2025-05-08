import React from "react";
import { Plus, Search, MoreVertical } from "lucide-react";

const orders = [
  {
    id: "#ORD-001",
    client: "Аптека Акме",
    date: "2025-05-01",
    status: "Выполнен",
    total: "1,200,000 сум",
  },
  {
    id: "#ORD-002",
    client: "Городская Клиника",
    date: "2025-05-03",
    status: "В процессе",
    total: "980,000 сум",
  },
  {
    id: "#ORD-003",
    client: "МедПлюс",
    date: "2025-05-05",
    status: "Отменён",
    total: "0 сум",
  },
];

const Orders = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Список заказов</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-900">
          <Plus size={16} />
          Добавить заказ
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск заказов..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Номер заказа</th>
              <th className="px-4 py-2">Клиент</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Сумма</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.client}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "Выполнен"
                        ? "bg-green-100 text-green-700"
                        : order.status === "В процессе"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">{order.total}</td>
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
