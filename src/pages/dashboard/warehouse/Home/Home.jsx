import React, { useEffect, useState } from "react";
import WarehouseStatCard from "./WarehouseStatCard";
import StockPieChart from "./StockPieChart";
import PendingOrdersList from "./PendingOrdersList";
import { PackageCheck, TimerReset, AlarmClock, AlertTriangle } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("warehouse");
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
      .then(res => {
        const products = res.data || [];
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
      .then(res => setStats(prev => ({ ...prev, pendingOrders: (res.data || []).length })))
      .catch(err => console.error("Orders fetch error:", err));
  }, [token]);

  return (
    <div className="space-y-4 bg-gray-50 p-4">
      <div className="bg-white rounded-xl p-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-4">
          {t("dashboard_title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WarehouseStatCard
          label={t("total_products")}
          value={stats.totalProducts}
          delta=""
          icon={<PackageCheck className="w-5 h-5 text-green-600" />}
        />
        <WarehouseStatCard
          label={t("pending_orders")}
          value={stats.pendingOrders}
          delta=""
          icon={<TimerReset className="w-5 h-5 text-yellow-500" />}
        />
        <WarehouseStatCard
          label={t("expiring_products")}
          value={stats.expiringProducts}
          delta={t("expiring_in_6_months")}
          icon={<AlarmClock className="w-5 h-5 text-orange-500" />}
        />
        <WarehouseStatCard
          label={t("low_stock_items")}
          value={stats.lowStockItems}
          delta={t("below_minimum")}
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