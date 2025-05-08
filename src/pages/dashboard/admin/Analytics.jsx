import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const salesData = [
  { month: "Янв", sales: 3400 },
  { month: "Фев", sales: 2900 },
  { month: "Мар", sales: 4100 },
  { month: "Апр", sales: 3800 },
  { month: "Май", sales: 5200 },
  { month: "Июн", sales: 4300 },
  { month: "Июл", sales: 4900 },
  { month: "Авг", sales: 3600 },
  { month: "Сен", sales: 4200 },
  { month: "Окт", sales: 3100 },
  { month: "Ноя", sales: 3900 },
  { month: "Дек", sales: 4500 },
];

const Analytics = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Аналитика продаж</h2>

      <div className="bg-white rounded-xl shadow p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
