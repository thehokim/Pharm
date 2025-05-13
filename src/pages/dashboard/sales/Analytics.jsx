import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3Icon } from "lucide-react";

const sales = [
  { name: "Янв", value: 3100 },
  { name: "Фев", value: 4200 },
  { name: "Мар", value: 3700 },
  { name: "Апр", value: 4500 },
  { name: "Май", value: 5200 },
  { name: "Июн", value: 4800 },
  { name: "Июл", value: 5100 },
  { name: "Авг", value: 4300 },
  { name: "Сен", value: 3900 },
  { name: "Окт", value: 4700 },
  { name: "Ноя", value: 5300 },
  { name: "Дек", value: 6100 },
];

// Кастомный тултип
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-indigo-600 font-medium">
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
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3Icon className="w-6 h-6" /> Аналитика продаж
        </h2>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Продажи за 2025 год</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={sales} barGap={6}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
