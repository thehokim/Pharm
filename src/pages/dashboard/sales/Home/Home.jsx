import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardCard from "./DashboardCard";
import SalesChart from "./SalesChart";
import RecentSales from "./RecentSales";
import ExpiringProducts from "./ExpiringProducts";
import ClientDebts from "./ClientDebts";
import { BarChart2, User, AlertCircle, CreditCard } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

function extractArray(raw, keys = ["data", "results", "products", "clients", "debts"]) {
  if (Array.isArray(raw)) return raw;
  for (const key of keys) {
    if (Array.isArray(raw[key])) return raw[key];
  }
  return [];
}

const Home = () => {
  const [stats, setStats] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [debts, setDebts] = useState([]);
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation("sales_home");

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [i18n.language]);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      const startDate = oneYearAgo.toISOString().slice(0, 10);
      const endDate = today.toISOString().slice(0, 10);

      const [
        overviewRes,
        clientsRes,
        productsRes,
        debtsRes,
        incomeRes,
        ordersRes,
      ] = await Promise.all([
        fetch(`${BASE_URL}/api/reports/sales-overview?start_date=${startDate}&end_date=${endDate}&format=json`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/clients/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/products/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/reports/client-debts?start_date=${startDate}&end_date=${endDate}&format=json`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/income/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/orders/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [
        overview,
        clientsRaw,
        productsRaw,
        debtDataRaw,
        income,
        ordersRaw,
      ] = await Promise.all([
        overviewRes.json(),
        clientsRes.json(),
        productsRes.json(),
        debtsRes.json(),
        incomeRes.json(),
        ordersRes.json(),
      ]);

      // Универсально получаем массивы:
      const clients = extractArray(clientsRaw, ["data", "clients"]);
      const products = extractArray(productsRaw, ["data", "products"]);
      const debtData = extractArray(debtDataRaw, ["data", "debts"]);
      const orders = extractArray(ordersRaw, ["data", "orders"]);

      // 📊 График продаж
      const chartByMonth = income.reduce((acc, item) => {
        const date = new Date(item.timestamp);
        const month = date.toLocaleString(
          i18n.language === "ru" ? "ru-RU" :
          i18n.language === "uz" ? "uz-UZ" : "uz-Cyrl-UZ",
          { month: "short" }
        );
        acc[month] = (acc[month] || 0) + item.amount;
        return acc;
      }, {});
      const salesChartFormatted = Object.entries(chartByMonth).map(([name, value]) => ({ name, value }));

      // ⏳ Истекающие товары (до 90 дней)
      const todayDate = new Date();
      const expiringList = products
        .filter((p) => {
          if (!p.expiration_date) return false;
          const exp = new Date(p.expiration_date);
          const daysLeft = (exp - todayDate) / (1000 * 60 * 60 * 24);
          return daysLeft >= 0 && daysLeft <= 90;
        })
        .map((p) => ({
          name: p.name,
          exp: new Date(p.expiration_date).toLocaleDateString(
            i18n.language === "ru" ? "ru-RU" :
            i18n.language === "uz" ? "uz-UZ" : "uz-Cyrl-UZ"
          ),
          left: `${Math.ceil((new Date(p.expiration_date) - todayDate) / (1000 * 60 * 60 * 24))} ${
            i18n.language === "ru" ? "дн." : i18n.language === "uz" ? "kun" : "кун"
          }`,
          stock: p.stock_quantity,
          level: p.stock_quantity < 50
            ? (i18n.language === "ru" ? "Критично" : i18n.language === "uz" ? "Critical" : "Критикал")
            : (i18n.language === "ru" ? "Предупреждение" : i18n.language === "uz" ? "Warning" : "Огоҳлантириш"),
        }));

      // 💳 Долги клиентов
      const clientDebtList = debtData.map((c) => ({
        name: c.name,
        amount: c.debt,
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
          amount: o.total_amount,
        }));

      setStats([
        {
          icon: <BarChart2 className="w-5 h-5 text-indigo-600" />,
          title: t("dashboard_total_sales"),
          value: salesChartFormatted.reduce((acc, el) => acc + el.value, 0).toLocaleString(),
          sub: `${t("dashboard_avg_check")}: ${overview.average_order_value?.toLocaleString?.() || 0}`,
          subColor: "text-green-600",
        },
        {
          icon: <User className="w-5 h-5 text-emerald-600" />,
          title: t("dashboard_active_clients"),
          value: clients.length.toString(),
          sub: "",
          subColor: "text-green-600",
        },
        {
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          title: t("dashboard_expiring_products"),
          value: expiringList.length.toString(),
          sub: t("dashboard_expiring_sub"),
          subColor: "text-yellow-600",
        },
        {
          icon: <CreditCard className="w-5 h-5 text-rose-600" />,
          title: t("dashboard_client_debts"),
          value: clientDebtList.reduce((acc, c) => acc + c.amount, 0).toLocaleString(),
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
