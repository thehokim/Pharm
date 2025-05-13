import React from "react";
import WarehouseStatCard from "./WarehouseStatCard";
import StockPieChart from "./StockPieChart";
import PendingOrdersList from "./PendingOrdersList";
import {
  PhoneIncomingIcon,
  PackageCheck,
  TimerReset,
  AlarmClock,
  AlertTriangle,
} from "lucide-react";

const stats = {
  totalProducts: 1245,
  pendingOrders: 42,
  expiringProducts: 28,
  lowStockItems: 15,
};

const Home = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white rounded-xl p-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-4">
          <PhoneIncomingIcon className="text-blue-500" />
          Панель управления — Оператор склада
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WarehouseStatCard
          label="Всего товаров"
          value={stats.totalProducts}
          delta="+180 новых"
          icon={<PackageCheck className="w-5 h-5 text-green-600" />}
        />
        <WarehouseStatCard
          label="Ожидают обработки"
          value={stats.pendingOrders}
          delta="+8 с вчера"
          icon={<TimerReset className="w-5 h-5 text-yellow-500" />}
        />
        <WarehouseStatCard
          label="Истекает срок"
          value={stats.expiringProducts}
          delta="в 90 дней"
          icon={<AlarmClock className="w-5 h-5 text-orange-500" />}
        />
        <WarehouseStatCard
          label="Мало на складе"
          value={stats.lowStockItems}
          delta="ниже минимума"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockPieChart />
        <PendingOrdersList />
      </div>
    </div>
  );
};

export default Home;
