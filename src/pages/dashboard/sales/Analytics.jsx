import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const sales = [
  { name: "Янв", value: 3100 },
  { name: "Фев", value: 4200 },
  { name: "Мар", value: 3700 },
  { name: "Апр", value: 4500 },
  { name: "Май", value: 5200 },
];

const Analytics = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Аналитика</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sales}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
