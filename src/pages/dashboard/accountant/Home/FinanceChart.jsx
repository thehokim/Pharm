import React, { useEffect, useState } from "react";
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
import { BASE_URL } from "../../../../utils/auth";

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

const FinanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем текущий год
        const currentYear = new Date().getFullYear();
        
        const response = await fetch(`${BASE_URL}/api/in_out?year=${currentYear}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Преобразуем данные в формат для графика
        const transformedData = data.map(item => ({
          month: item.month,
          revenue: item.income || 0,
          expenses: item.expenses || 0
        }));
        
        setChartData(transformedData);
      } catch (err) {
        console.error("Ошибка загрузки финансовых данных:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <LineChartIcon className="w-5 h-5" />
          Обзор финансов
        </h3>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <LineChartIcon className="w-5 h-5" />
          Обзор финансов
        </h3>
        <div className="flex justify-center items-center h-64 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <LineChartIcon className="w-5 h-5" />
        Обзор финансов
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
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
};

export default FinanceChart;
