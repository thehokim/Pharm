import React, { useEffect, useState } from "react";
import {
  BarChart2,
  BarChart3Icon,
  Bell,
  ChartBar,
  ChartCandlestick,
  ChartColumnStacked,
  Combine,
  User,
  Users,
} from "lucide-react";
import StatCard from "./StatCard";
import MonthlyChart from "./MonthlyChart";
import DebtList from "./DebtList";

const mockData = {
  totalIncome: 45231890,
  todayIncome: 1250000,
  productCount: 1245,
  productPurchaseTotal: 10500000,
  productRevenue: 125450000,
  totalProductIncoming: 3540000,
  totalProductOutgoing: 2040000,
  clientsCount: 342,
  newClients: 18,
  activeOrders: 57,
  managers: [
    { fullName: "Иванов И.И.", profit: 1250000 },
    { fullName: "Петров П.П.", profit: 980000 },
    { fullName: "Сидоров С.С.", profit: 730000 },
  ],
  chartData: [
    { name: "Янв", amount: 32000000 },
    { name: "Фев", amount: 45000000 },
    { name: "Мар", amount: 39000000 },
    { name: "Апр", amount: 28000000 },
    { name: "Май", amount: 52000000 },
    { name: "Июнь", amount: 26000000 },
    { name: "Июль", amount: 27000000 },
    { name: "Авг", amount: 26000000 },
    { name: "Сен", amount: 41000000 },
    { name: "Окт", amount: 23000000 },
    { name: "Ноя", amount: 35000000 },
    { name: "Дек", amount: 57000000 },
  ],
  debts: [
    { name: "Аптека “Акме”", days: 8, sum: "1,999,000" },
    { name: "МедиПлюс", days: 12, sum: "1,599,000" },
    { name: "Медицинские Поставки", days: 5, sum: "2,499,000" },
    { name: "Городская Клиника", days: 3, sum: "899,000" },
    { name: "МедЭкспресс", days: 15, sum: "3,499,000" },
    { name: "ЭкспрессАптека", days: 18, sum: "2,399,000" },
    { name: "Арзон аптека", days: 20, sum: "1,199,000" },
    { name: "Яхши Аптека", days: 21, sum: "5,699,000" },
  ],
};

const Home = () => {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    // axios.get("/api/dashboard")
    //   .then(res => setData(res.data))
    //   .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-0 space-y-4 bg-gray-50">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <BarChart3Icon />
          <h2 className="text-2xl font-semibold text-gray-800">
            Управление фармацевтикой
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-100 rounded-full p-2.5">
            <Bell className="w-5 h-5 text-blue-600" />
          </button>
          <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center text-blue-600 justify-center">
            AD
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart2}
          title="Общий доход"
          value={data.totalIncome}
          subtitle={
            <>
              <div className="text-green-500">
                Сегодня: + ${data.todayIncome.toLocaleString()} сум
              </div>
            </>
          }
        />
        <StatCard
          icon={ChartCandlestick}
          title="Товары"
          value={data.productCount}
          subtitle={
            <>
              <div>Закуп: {data.totalProductIncoming.toLocaleString()} сум</div>
              <div>
                Продажа: {data.totalProductOutgoing.toLocaleString()} сум
              </div>
            </>
          }
        />

        <StatCard
          icon={User}
          title="Клиенты"
          value={data.clientsCount}
          subtitle={`+${data.newClients} новых клиентов`}
        />
        <StatCard
          icon={Users}
          title="Менеджеры"
          value={data.managers.length}
          subtitle={`Активных заказов: ${data.activeOrders}`}
          managers={data.managers}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyChart data={data.chartData} />
        <DebtList debts={data.debts} />
      </div>
    </div>
  );
};

export default Home;
