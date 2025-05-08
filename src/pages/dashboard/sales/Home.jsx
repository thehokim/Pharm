import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Янв", value: 4300 },
  { name: "Фев", value: 2100 },
  { name: "Мар", value: 4200 },
  { name: "Апр", value: 2600 },
  { name: "Май", value: 4700 },
  { name: "Июн", value: 2500 },
  { name: "Июл", value: 2600 },
  { name: "Авг", value: 3900 },
  { name: "Сен", value: 3100 },
  { name: "Окт", value: 3000 },
  { name: "Ноя", value: 2700 },
  { name: "Дек", value: 5300 },
];

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Общая выручка", value: "$24,563.82", sub: "+15.2% за месяц" },
          { label: "Активные клиенты", value: "245", sub: "+12 новых клиентов" },
          { label: "Истекающие товары", value: "28", sub: "в течение 90 дней" },
          { label: "Долги клиентов", value: "$12,450.00", sub: "+$2,100 за месяц" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm text-gray-500">{item.label}</h2>
            <p className="text-xl font-bold">{item.value}</p>
            <p className="text-xs text-gray-500">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* График и недавние продажи */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Обзор продаж */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-bold mb-2">Обзор продаж</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Недавние продажи */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-bold mb-2">Последние продажи</h3>
          <p className="text-sm text-gray-500 mb-4">Вы совершили 265 продаж в этом месяце.</p>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Аптека Акме", email: "acme@example.com", amount: "+$1,999.00" },
              { name: "МедПлюс", email: "mediplus@example.com", amount: "+$1,599.00" },
              { name: "МедПоставка", email: "healthcare@example.com", amount: "+$2,499.00" },
              { name: "Городская клиника", email: "cityclinic@example.com", amount: "+$899.00" },
              { name: "МедЭкспресс", email: "medexpress@example.com", amount: "+$3,499.00" },
            ].map((sale, i) => (
              <li key={i} className="flex justify-between">
                <div>
                  <p className="font-medium">{sale.name}</p>
                  <p className="text-gray-500 text-xs">{sale.email}</p>
                </div>
                <p className="font-medium">{sale.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Истекающие товары и долги */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-bold mb-2">Истекающие товары</h3>
          <p className="text-sm text-gray-500 mb-4">Товары, срок которых истекает в течение 90 дней.</p>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Парацетамол 500мг", exp: "15.06.2025", left: "15 дн.", stock: 120, level: "Критично" },
              { name: "Амоксициллин 250мг", exp: "22.07.2025", left: "52 дн.", stock: 85, level: "Предупреждение" },
              { name: "Ибупрофен 400мг", exp: "30.06.2025", left: "30 дн.", stock: 65, level: "Критично" },
            ].map((p, i) => (
              <li key={i} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <p>{p.name}</p>
                  <p className="text-xs text-gray-500">Истекает: {p.exp} ({p.left})</p>
                </div>
                <div className="text-right">
                  <p>{p.stock} в наличии</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.level === "Критично"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.level}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-bold mb-2">Задолженности клиентов</h3>
          <p className="text-sm text-gray-500 mb-4">Клиенты с просроченными платежами.</p>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Аптека Акме", due: "15.05.2025", amount: "$2450.00", days: "30 дней просрочки" },
              { name: "МедПлюс", due: "22.05.2025", amount: "$1850.00", days: "23 дня просрочки" },
              { name: "Городская клиника", due: "10.06.2025", amount: "$950.00", days: "4 дня просрочки" },
            ].map((d, i) => (
              <li key={i} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <p>{d.name}</p>
                  <p className="text-xs text-gray-500">До: {d.due}</p>
                </div>
                <div className="text-right">
                  <p>{d.amount}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                    {d.days}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
