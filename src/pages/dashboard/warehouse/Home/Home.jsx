import React, { useEffect, useState } from "react";
import WarehouseStatCard from "./WarehouseStatCard";
import StockPieChart from "./StockPieChart";
import PendingOrdersList from "./PendingOrdersList";
import { PackageCheck, TimerReset, AlarmClock, AlertTriangle } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";

const Home = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    expiringProducts: 0,
    lowStockItems: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const today = new Date();
    const sixMonths = new Date();
    sixMonths.setMonth(today.getMonth() + 6);

    // 1) Products
    fetch(`${BASE_URL}/api/products/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(products => {
        const expiring = products.filter(p => {
          const exp = new Date(p.expiration_date);
          return exp > today && exp <= sixMonths;
        }).length;
        const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
          expiringProducts: expiring,
          lowStockItems: lowStock,
        }));
      })
      .catch(err => console.error("Products fetch error:", err));

    // 2) Pending orders
    fetch(`${BASE_URL}/api/orders/?status=pending`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(pending => setStats(prev => ({ ...prev, pendingOrders: pending.length })))
      .catch(err => console.error("Orders fetch error:", err));
  }, [token]);

  return (
    <div className="space-y-4 bg-gray-50 p-4">
      <div className="bg-white rounded-xl p-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-4">
          Панель управления — Оператор склада
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WarehouseStatCard
          label="Всего товаров"
          value={stats.totalProducts}
          delta=""
          icon={<PackageCheck className="w-5 h-5 text-green-600" />}
        />
        <WarehouseStatCard
          label="Ожидают обработки"
          value={stats.pendingOrders}
          delta=""
          icon={<TimerReset className="w-5 h-5 text-yellow-500" />}
        />
        <WarehouseStatCard
          label="Истекает срок"
          value={stats.expiringProducts}
          delta="в 6 месяцев"
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