import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

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

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Панель управления (Бухгалтер)</h1>

      {/* Основные карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Общая выручка</h2>
          <p className="text-xl font-bold">$45,231.89</p>
          <p className="text-xs text-green-600">+20.1% за месяц</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Невыполненные выписки</h2>
          <p className="text-xl font-bold">12</p>
          <p className="text-xs text-gray-600">+3 с вчерашнего дня</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Долги</h2>
          <p className="text-xl font-bold">$15,420.00</p>
          <p className="text-xs text-red-600">-2,340 от прошлого месяца</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Ближайшие налоги</h2>
          <p className="text-xl font-bold">$8,245.65</p>
          <p className="text-xs text-gray-600">Через 15 дней</p>
        </div>
      </div>

      {/* Финансовый график и сводка */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-2">Обзор финансов</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={financeChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-2">Финансовая сводка</h3>
          <div className="space-y-1 text-sm">
            <p>Доход: <span className="font-semibold">$45,231.89</span></p>
            <p>Расходы: <span className="font-semibold">$21,456.78</span></p>
            <p className="text-green-600">Прибыль: <span className="font-semibold">$23,775.11</span></p>
            <p className="text-xs text-green-500">+15.2% по сравнению с прошлым месяцем</p>
          </div>
          <div className="mt-4">
            <p className="text-red-600 text-sm">Задолженность клиентов: $15,420.00</p>
            <p className="text-sm">Налоговые обязательства: $8,245.65</p>
          </div>
        </div>
      </div>

      {/* Выписки и календарь налогов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-2">Последние выписки</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between items-center">
              <div>
                <p>First National Bank</p>
                <p className="text-xs text-gray-500">2025-05-31</p>
              </div>
              <div className="text-right">
                <p>$24,560.75</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Обработано</span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p>Commerce Bank</p>
                <p className="text-xs text-gray-500">2025-05-30</p>
              </div>
              <div className="text-right">
                <p>$12,450.50</p>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Ожидает</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-2">Календарь налогов</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between items-center">
              <div>
                <p>НДС</p>
                <p className="text-xs text-gray-500">Срок: 2025-06-15</p>
              </div>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Срочно</span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p>Подоходный налог</p>
                <p className="text-xs text-gray-500">Срок: 2025-07-15</p>
              </div>
              <span className="text-xs bg-gray-200 text-black px-2 py-0.5 rounded">45 дней</span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p>Налог на имущество</p>
                <p className="text-xs text-gray-500">Срок: 2025-08-30</p>
              </div>
              <span className="text-xs bg-gray-100 text-black px-2 py-0.5 rounded">91 день</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
