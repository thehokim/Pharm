import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartColumnStacked } from "lucide-react";
import { useTranslation } from "react-i18next";

// Кастомный тултип с поддержкой i18n
const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-indigo-600 font-medium">
          {t("sales")}: {payload[0].value.toLocaleString()} {t("sum")}
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart = ({ data }) => {
  const { t } = useTranslation("sales_home");

  return (
    <div className="bg-white rounded-2xl p-4">
      <h3 className="flex items-center text-lg text-gray-700 gap-2 mb-4">
        <ChartColumnStacked className="w-5 h-5" />
        {t("monthly_income")}
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={6}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip t={t} />} />
          <Bar
            dataKey="value"
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
