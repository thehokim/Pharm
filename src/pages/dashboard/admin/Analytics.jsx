import { BarChartBigIcon } from "lucide-react";
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-2">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-indigo-600">
          Продажи: {payload[0].value.toLocaleString()} сум
        </p>
      </div>
    );
  }

  return null;
};

const Analytics = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <BarChartBigIcon /> Аналитика продаж
        </h2>
      </div>
      <div className="bg-white rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={salesData} barSize={35}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
