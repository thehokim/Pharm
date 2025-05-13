import React, { useState } from "react";
import { TimerReset } from "lucide-react";

const orders = [
  { id: "ORD-12345", client: "Аптека Акме", date: "2025-05-31", items: 12, status: "Готово" },
  { id: "ORD-12346", client: "МедПлюс", date: "2025-05-31", items: 8, status: "В обработке" },
  { id: "ORD-12347", client: "МедСнаб", date: "2025-06-01", items: 15, status: "Готово" },
  { id: "ORD-12348", client: "Аптека Акме", date: "2025-06-02", items: 10, status: "В обработке" },
  { id: "ORD-12349", client: "ФармМир", date: "2025-06-02", items: 6, status: "Готово" },
  { id: "ORD-12350", client: "ЗдравПоставка", date: "2025-06-03", items: 9, status: "В обработке" },
];

const PendingOrdersList = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleOrders = showAll ? orders : orders.slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <TimerReset className="w-5 h-5" />
        Ожидающие заказы
      </h2>

      <ul className="space-y-2 text-sm">
        {visibleOrders.map((order) => (
          <li
            key={`${order.id}-${order.date}`}
            className="flex justify-between items-center p-2 rounded-xl"
          >
            <div>
              <p className="font-medium text-gray-800">{order.id}</p>
              <p className="text-xs text-gray-500">
                {order.client} — {order.date}
              </p>
            </div>
            <div className="text-right">
              <p>{order.items} товаров</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === "Готово"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-300 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {orders.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-md font-bold text-blue-600 bg-blue-50 px-4 py-3 w-full rounded-2xl hover:bg-blue-100 transition-colors duration-200"
          >
            {showAll ? "Скрыть" : "Показать ещё"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingOrdersList;
