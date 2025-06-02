import React, { useEffect, useState } from "react";
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
import { BASE_URL } from "../../../../utils/auth";

const Home = () => {
  const [stats, setStats] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [debts, setDebts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, clientsRes, productsRes, debtsRes, incomeRes, ordersRes] =
        await Promise.all([
          fetch(`${BASE_URL}/api/reports/sales-overview`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/clients/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/products/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/reports/client-debts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/income/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const [overview, clients, products, debtData, income, orders] =
        await Promise.all([
          overviewRes.json(),
          clientsRes.json(),
          productsRes.json(),
          debtsRes.json(),
          incomeRes.json(),
          ordersRes.json(),
        ]);

      // 📊 График продаж
      const chartByMonth = income.reduce((acc, item) => {
        const date = new Date(item.timestamp);
        const month = date.toLocaleString("ru-RU", { month: "short" });
        acc[month] = (acc[month] || 0) + item.amount;
        return acc;
      }, {});
      const salesChartFormatted = Object.entries(chartByMonth).map(([name, value]) => ({ name, value }));

      // ⏳ Истекающие товары (до 90 дней)
      const today = new Date();
      const expiringList = products
        .filter((p) => {
          const exp = new Date(p.expiration_date);
          const daysLeft = (exp - today) / (1000 * 60 * 60 * 24);
          return daysLeft >= 0 && daysLeft <= 90;
        })
        .map((p) => ({
          name: p.name,
          exp: new Date(p.expiration_date).toLocaleDateString("ru-RU"),
          left: `${Math.ceil((new Date(p.expiration_date) - today) / (1000 * 60 * 60 * 24))} дн.`,
          stock: p.stock_quantity,
          level: p.stock_quantity < 50 ? "Критично" : "Предупреждение",
        }));

      // 💳 Долги клиентов
      const clientDebtList = debtData.map((c) => ({
        name: c.name,
        amount: `$${c.debt.toFixed(2)}`,
        due: "",
        days: "",
      }));

      // 🧾 Последние продажи
      const sortedOrders = orders
        .filter((o) => o.status === "completed" || o.payment_status === "paid")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map((o) => ({
          name: clients.find((c) => c.id === o.client_id)?.name || `ID ${o.client_id}`,
          email: clients.find((c) => c.id === o.client_id)?.username || "",
          amount: `$${o.total_amount.toFixed(2)}`,
        }));

      // 📦 Карточки
      setStats([
        {
          icon: <BarChart2 className="w-5 h-5 text-indigo-600" />,
          title: "Общая выручка",
          value: `$${overview.total_sales.toFixed(2)}`,
          sub: `Средний чек: $${overview.average_order_value.toFixed(2)}`,
          subColor: "text-green-600",
        },
        {
          icon: <User className="w-5 h-5 text-emerald-600" />,
          title: "Активные клиенты",
          value: clients.length.toString(),
          sub: "",
          subColor: "text-green-600",
        },
        {
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          title: "Истекающие товары",
          value: expiringList.length.toString(),
          sub: "в течение 90 дней",
          subColor: "text-yellow-600",
        },
        {
          icon: <CreditCard className="w-5 h-5 text-rose-600" />,
          title: "Долги клиентов",
          value: `$${debtData.reduce((acc, c) => acc + c.debt, 0).toFixed(2)}`,
          sub: "",
          subColor: "text-red-600",
        },
      ]);

      setSalesChart(salesChartFormatted);
      setExpiringProducts(expiringList);
      setDebts(clientDebtList);
      setRecentSales(sortedOrders);
    } catch (err) {
      console.error("Ошибка загрузки данных дашборда:", err);
    }
  };

  return (
    <div className="space-y-4 bg-gray-50">
      <DashboardHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <DashboardCard key={idx} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesChart data={salesChart} />
        <RecentSales sales={recentSales} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpiringProducts products={expiringProducts} />
        <ClientDebts debts={debts} />
      </div>
    </div>
  );
};

export default Home;
