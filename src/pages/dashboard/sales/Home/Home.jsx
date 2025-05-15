import DashboardHeader from "./DashboardHeader";
import DashboardCard from "./DashboardCard";
import SalesChart from "./SalesChart";
import RecentSales from "./RecentSales";
import ExpiringProducts from "./ExpiringProducts";
import ClientDebts from "./ClientDebts";
import {
  BarChart2,
  User,
  AlertCircle,
  CreditCard,
} from "lucide-react";

const mockData = {
  stats: [
    {
      icon: <BarChart2 className="w-5 h-5 text-indigo-600" />,
      title: "Общая выручка",
      value: "$24,563.82",
      sub: "+15.2% за месяц",
      subColor: "text-green-600",
    },
    {
      icon: <User className="w-5 h-5 text-emerald-600" />,
      title: "Активные клиенты",
      value: "245",
      sub: "+12 новых клиентов",
      subColor: "text-green-600",
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      title: "Истекающие товары",
      value: "28",
      sub: "в течение 90 дней",
      subColor: "text-yellow-600",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-rose-600" />,
      title: "Долги клиентов",
      value: "$12,450.00",
      sub: "+$2,100 за месяц",
      subColor: "text-red-600",
    },
  ],
  salesChart: [
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
  ],
  sales: [
    { name: "Аптека Акме", email: "acme@example.com", amount: "+$1,999.00" },
    { name: "МедПлюс", email: "mediplus@example.com", amount: "+$1,599.00" },
    { name: "МедПоставка", email: "healthcare@example.com", amount: "+$2,499.00" },
    { name: "Городская клиника", email: "cityclinic@example.com", amount: "+$899.00" },
    { name: "МедЭкспресс", email: "medexpress@example.com", amount: "+$3,499.00" },
  ],
  expiring: [
    { name: "Парацетамол 500мг", exp: "15.06.2025", left: "15 дн.", stock: 120, level: "Критично" },
    { name: "Амоксициллин 250мг", exp: "22.07.2025", left: "52 дн.", stock: 85, level: "Предупреждение" },
    { name: "Ибупрофен 400мг", exp: "30.06.2025", left: "30 дн.", stock: 65, level: "Критично" },
  ],
  debts: [
    { name: "Аптека Акме", due: "15.05.2025", amount: "$2450.00", days: "30 дней просрочки" },
    { name: "МедПлюс", due: "22.05.2025", amount: "$1850.00", days: "23 дня просрочки" },
    { name: "Городская клиника", due: "10.06.2025", amount: "$950.00", days: "4 дня просрочки" },
  ],
};

const Home = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      <DashboardHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockData.stats.map((item, idx) => (
          <DashboardCard key={idx} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesChart data={mockData.salesChart} />
        <RecentSales sales={mockData.sales} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpiringProducts products={mockData.expiring} />
        <ClientDebts debts={mockData.debts} />
      </div>
    </div>
  );
};

export default Home;
