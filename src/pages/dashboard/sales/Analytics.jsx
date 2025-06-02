import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3Icon, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../../utils/auth";

const monthNames = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
];

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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchSalesData = (year) => {
    fetch(`${BASE_URL}/api/reports/sales-overview?year=${year}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        const prepared = monthNames.map((name, index) => {
          const found = response.find((r) => r.month === index + 1);
          return { name, value: found?.total_sales || 0 };
        });
        setData(prepared);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных аналитики:", err);
      });
  };

  useEffect(() => {
    fetchSalesData(selectedYear);
  }, [selectedYear]);

  const years = [2023, 2024, 2025, 2026];

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3Icon className="w-6 h-6" /> Аналитика продаж
        </h2>

        {/* Кастомный селектор года */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition"
          >
            {selectedYear} год
            <ChevronDown className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-36">
              {years.map((year) => (
                <li key={year}>
                  <button
                    onClick={() => {
                      setSelectedYear(year);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                      year === selectedYear ? "bg-blue-100 font-semibold text-blue-700" : ""
                    }`}
                  >
                    {year} год
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Продажи за {selectedYear} год
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} barGap={6}>
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
