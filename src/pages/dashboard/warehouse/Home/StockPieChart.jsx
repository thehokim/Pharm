import { LucidePieChart } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const pieData = [
  { name: "В наличии", value: 94 },
  { name: "Низкий остаток", value: 64 },
  { name: "Истекает срок", value: 18 },
  { name: "Нет в наличии", value: 22 },
];

const COLORS = ["#22C55E", "#FBBF24", "#EF4444", "#9CA3AF"];

// Внутренние проценты
const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={16}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Кастомный тултип
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-blue-50 border border-gray-100 rounded-lg p-2 text-sm">
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-gray-500">Количество: {value}</p>
      </div>
    );
  }
  return null;
};

const StockPieChart = () => (
  <div className="bg-white p-4 rounded-2xl">
    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <LucidePieChart className="w-5 h-5" />
      Обзор остатков
    </h2>

    {/* Диаграмма */}
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={130}
          paddingAngle={1}
          cornerRadius={6}
          dataKey="value"
          label={renderLabel}
          labelLine={false}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>

    {/* Легенда снизу в 2 колонки */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 text-sm">
      {pieData.map((entry, index) => (
        <div
          key={entry.name}
          className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2"
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-gray-700">{entry.name}</span>
          </div>
          <span className="text-gray-500">{entry.value} шт</span>
        </div>
      ))}
    </div>
  </div>
);

export default StockPieChart;
