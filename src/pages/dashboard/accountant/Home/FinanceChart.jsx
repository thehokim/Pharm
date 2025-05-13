import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChartBig, LineChartIcon } from "lucide-react";

const financeChartData = [
  { month: "Янв", revenue: 2500, expenses: 1800 },
  { month: "Фев", revenue: 3100, expenses: 2300 },
  { month: "Мар", revenue: 4800, expenses: 3200 },
  { month: "Апр", revenue: 4300, expenses: 2900 },
  { month: "Май", revenue: 5200, expenses: 4500 },
  { month: "Июн", revenue: 2100, expenses: 2800 },
  { month: "Июл", revenue: 2900, expenses: 1700 },
  { month: "Авг", revenue: 5400, expenses: 2100 },
  { month: "Сен", revenue: 4100, expenses: 1900 },
  { month: "Окт", revenue: 3000, expenses: 1600 },
  { month: "Ноя", revenue: 3200, expenses: 1400 },
  { month: "Дек", revenue: 1500, expenses: 3000 },
];

// Кастомный тултип
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { month, revenue, expenses } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs">
        <p className="font-semibold text-gray-800">{month}</p>
        <p className="text-green-600">Доход: ${revenue.toLocaleString()}</p>
        <p className="text-red-500">Расходы: ${expenses.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const FinanceChart = () => (
  <div className="bg-white rounded-2xl p-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <LineChartIcon className="w-5 h-5" />
      Обзор финансов
    </h3>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={financeChartData} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
        <XAxis
          dataKey="month"
          interval="preserveStartEnd"
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#22C55E"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#EF4444"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default FinanceChart;
