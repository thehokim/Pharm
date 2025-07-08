import React, { useEffect, useState } from "react";
import { LucidePieChart } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import tinycolor from "tinycolor2";
import { BASE_URL } from "../../../../utils/auth";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value, fill } = payload[0].payload;
    const bg = tinycolor(fill).saturate(80).brighten(50).toHexString();
    const textColor = tinycolor(bg).isLight() ? "#000" : "#fff";
    return (
      <div className="rounded-lg p-2 text-sm shadow-lg" style={{ backgroundColor: bg, color: textColor }}>
        <p className="font-semibold">{name}</p>
        <p className="text-xs opacity-90">Количество: {value}</p>
      </div>
    );
  }
  return null;
};

const StockPieChart = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const today = new Date();
    const sixMonths = new Date();
    sixMonths.setMonth(today.getMonth() + 6);

    fetch(`${BASE_URL}/api/products/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(products => {
        const inStock = products.filter(p => p.stock_quantity > 10 && new Date(p.expiration_date) > sixMonths).length;
        const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
        const expiring = products.filter(p => {
          const exp = new Date(p.expiration_date);
          return exp > today && exp <= sixMonths;
        }).length;
        const outOfStock = products.filter(p => p.stock_quantity === 0).length;
        setData([
          { name: "В наличии", value: inStock, fill: "#22C55E" },
          { name: "Низкий остаток", value: lowStock, fill: "#FBBF24" },
          { name: "Истекает срок", value: expiring, fill: "#EF4444" },
          { name: "Нет в наличии", value: outOfStock, fill: "#9CA3AF" },
        ]);
      })
      .catch(err => console.error("StockPieChart fetch error:", err));
  }, [token]);

  return (
    <div className="bg-white p-4 rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <LucidePieChart className="w-5 h-5" /> Обзор остатков
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={130} paddingAngle={1} cornerRadius={6} dataKey="value" labelLine={false}>
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 text-sm">
        {data.map(entry => (
          <div key={entry.name} className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
              <span className="text-gray-700">{entry.name}</span>
            </div>
            <span className="text-gray-500">{entry.value} шт</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockPieChart;