import React from "react";

const orders = [
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
      return "bg-black text-white";
    case "В обработке":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Orders = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Заказы</h2>
      <p className="text-gray-600">Список всех заказов, обрабатываемых складом.</p>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID Заказа</th>
              <th className="px-4 py-2 text-left">Клиент</th>
              <th className="px-4 py-2 text-left">Дата</th>
              <th className="px-4 py-2 text-left">Кол-во товаров</th>
              <th className="px-4 py-2 text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.client}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">{order.items}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}
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
