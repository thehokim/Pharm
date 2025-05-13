import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import { Calendar1Icon, ChartColumnStacked } from "lucide-react";

// Кастомный тултип
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-sm">
        <p className="text-gray-700 font-semibold">{label}</p>
        <p className="text-indigo-600 font-medium">
          Доход: {payload[0].value.toLocaleString()} сум
        </p>
      </div>
    );
  }
  return null;
};

// Цвет бара по значению
const getBarColor = (value, min, max) => {
  if (value === max) return "#22c55e";
  if (value === min) return "#ef4444";
  return "#6366f1";
};

const MonthlyChart = ({ data }) => {
  const amounts = data.map((item) => item.amount);
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);

  return (
    <div className="bg-white rounded-2xl p-6 col-span-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar1Icon className="w-5 h-5" />
        Ежемесячный доход
      </h2>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, bottom: 10, left: -40, right: 20 }}
          barCategoryGap={10}
        >
          <XAxis
            type="number"
            tickFormatter={(val) => val.toLocaleString()}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={90}
            interval={0} // ← Показывает все месяца
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="amount"
            radius={[0, 6, 6, 0]}
            barSize={22}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.amount, min, max)}
              />
            ))}
            <LabelList
              dataKey="amount"
              position="insideRight"
              formatter={(val) => `${val.toLocaleString()} сум`}
              fill="#fff"
              fontSize={12}
              style={{ fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
