import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", amount: 3200 },
  { name: "Feb", amount: 4500 },
  { name: "Mar", amount: 3900 },
  { name: "Apr", amount: 2800 },
  { name: "May", amount: 5200 },
  { name: "Jun", amount: 2600 },
  { name: "Jul", amount: 2700 },
  { name: "Aug", amount: 2600 },
  { name: "Sep", amount: 4100 },
  { name: "Oct", amount: 2300 },
  { name: "Nov", amount: 3500 },
  { name: "Dec", amount: 5700 },
];

const debts = [
  { name: "Аптека “Акме”", days: 8, sum: "1,999,000" },
  { name: "МедиПлюс", days: 12, sum: "1,599,000" },
  { name: "Медицинские Поставки", days: 5, sum: "2,499,000" },
  { name: "Городская Клиника", days: 3, sum: "899,000" },
  { name: "МедЭкспресс", days: 15, sum: "3,499,000" },
];

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Управление фармацевтикой</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Общий доход</h2>
          <p className="text-2xl font-bold">45,231,890 сум</p>
          <p className="text-xs text-gray-400">Сегодня: 1,250,000 сум</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Товары</h2>
          <p className="text-2xl font-bold">1,245</p>
          <p className="text-xs text-gray-400">На сумму: 125,450 тыс. сум</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Клиенты</h2>
          <p className="text-2xl font-bold">342</p>
          <p className="text-xs text-gray-400">+18 новых клиентов</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Менеджеры</h2>
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-gray-400">Активных заказов: 57</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 col-span-2">
          <h2 className="text-lg font-semibold mb-2">Обзор</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Задолженности</h2>
          <ul className="space-y-3">
            {debts.map((debt, i) => (
              <li key={i} className="text-sm">
                <div className="font-semibold">{debt.name}</div>
                <div className="text-gray-500 text-xs">Просрочено: {debt.days} дней</div>
                <div className="text-right text-red-600 font-bold">{debt.sum} сум</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
