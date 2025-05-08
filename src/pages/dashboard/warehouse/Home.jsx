import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const stats = {
  totalProducts: 1245,
  pendingOrders: 42,
  expiringProducts: 28,
  lowStockItems: 15,
};

const pieData = [
  { name: "В наличии", value: 94 },
  { name: "Низкий остаток", value: 2 },
  { name: "Истекает срок", value: 3 },
  { name: "Нет в наличии", value: 1 },
];

const COLORS = ["#4F46E5", "#FBBF24", "#F87171", "#9CA3AF"];

const orders = [
  { id: "ORD-12345", client: "Аптека Акме", date: "2025-05-31", items: 12, status: "Готово" },
  { id: "ORD-12346", client: "МедПлюс", date: "2025-05-31", items: 8, status: "В обработке" },
  { id: "ORD-12347", client: "МедСнаб", date: "2025-06-01", items: 15, status: "Готово" },
];

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Панель управления (Оператор склада)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Всего товаров" value={stats.totalProducts} delta="+180 новых" />
        <StatCard label="Ожидают обработки" value={stats.pendingOrders} delta="+8 с вчера" />
        <StatCard label="Истекает срок" value={stats.expiringProducts} delta="в 90 дней" />
        <StatCard label="Мало на складе" value={stats.lowStockItems} delta="ниже минимума" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4">Обзор остатков</h2>
          <PieChart width={320} height={260}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4">Ожидающие заказы</h2>
          <ul className="space-y-2 text-sm">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-xs text-gray-500">
                    {order.client} — {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p>{order.items} товаров</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Готово"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, delta }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h2 className="text-sm text-gray-500">{label}</h2>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-gray-400">{delta}</p>
  </div>
);

export default Home;
