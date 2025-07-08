import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart2,
  BarChart3Icon,
  Bell,
  ChartCandlestick,
  MoreVertical,
  PencilIcon,
  Settings,
  User,
  UserPlus2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AddManagerModal from "./AddManagerModal";
import EditManagersModal from "./EditManagersModal";
import MonthlyChart from "./MonthlyChart";
import DebtList from "./DebtList";
import PopupNotification from "../Notif/PopupNotification";
import { BASE_URL } from "../../../../utils/auth";

const Home = () => {
  const { t } = useTranslation("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [managers, setManagers] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [popups, setPopups] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [todayIncome, setTodayIncome] = useState(0);
  const [productStats, setProductStats] = useState({
    count: 0,
    totalIncoming: 0,
    totalOutgoing: 0,
  });
  const [clientsCount, setClientsCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [debts, setDebts] = useState([]);
  const [activeOrders] = useState();

  const token = localStorage.getItem("token");

  

  useEffect(() => {
    fetchIncome();
    fetchProducts();
    fetchClients();
    fetchManagers();
    fetchDebts();
    // eslint-disable-next-line
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/income/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const today = new Date().toISOString().slice(0, 10);
      const monthlyMap = {};

      let total = 0;
      let todayTotal = 0;

      for (const item of data) {
        const date = new Date(item.timestamp);
        const month = date.toLocaleString("ru-RU", { month: "short" });
        total += item.amount;
        if (item.timestamp.slice(0, 10) === today) todayTotal += item.amount;
        monthlyMap[month] = (monthlyMap[month] || 0) + item.amount;
      }

      const chart = Object.entries(monthlyMap).map(([name, amount]) => ({
        name,
        amount,
      }));

      setTotalIncome(total);
      setTodayIncome(todayTotal);
      setChartData(chart);
    } catch (err) {
      console.error("Ошибка загрузки дохода:", err);
    }
  };

const fetchProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const arr = data.data || []; // <-- Правильно!

    // Оставляем только is_medicine: true
    const medicines = arr.filter((p) => p.is_medicine === true);

    const count = medicines.length;
    const totalIncoming = medicines.reduce(
      (sum, p) => sum + (p.purchase_price || 0),
      0
    );
    const totalOutgoing = medicines.reduce(
      (sum, p) => sum + (p.selling_price || 0),
      0
    );
    setProductStats({ count, totalIncoming, totalOutgoing });
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
  }
};



const fetchClients = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/clients/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setClientsCount((result.data || []).length);
  } catch (err) {
    console.error("Ошибка загрузки клиентов:", err);
  }
};


  const fetchManagers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/managers/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const formatted = data.map((m) => ({
        id: m.id,
        fullName: m.username,
        profit: m.monthly_profit,
      }));
      setManagers(formatted);
    } catch (err) {
      console.error("Ошибка загрузки менеджеров:", err);
    }
  };

const fetchDebts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/clients/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    const arr = result.data || []; // <-- вот так
    const debtsFiltered = arr
      .filter((c) => c.debt > 0)
      .map((c) => ({
        name: c.name,
        days: Math.floor(Math.random() * 20) + 5,
        sum: c.debt.toLocaleString(),
      }));
    setDebts(debtsFiltered);
  } catch (err) {
    console.error("Ошибка загрузки долгов:", err);
  }
};


  useEffect(() => {
    const wasViewed = localStorage.getItem("notifications_read") === "true";
    setHasUnreadNotifications(!wasViewed);
  }, []);

  const showPopup = ({ title, message, type = "info" }) => {
    const id = Date.now();
    setPopups((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/notifications/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        // Фильтруем только непрочитанные
        const unread = data.filter((n) => !n.is_read);

        unread.forEach((n) => {
          showPopup({
            title: n.title,
            message: n.message,
            type: n.type || "info",
          });
        });
      } catch (err) {
        console.error("Ошибка загрузки уведомлений:", err);
      }
    };

    fetchUnreadNotifications();
  }, []);

  const handleAddManager = (newManager) => {
    setManagers((prev) => [...prev, newManager]);
  };

  const handleSaveManagers = (updated) => {
    setManagers(updated);
  };

  return (
    <div className="p-0 space-y-4 bg-gray-50">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-indigo-100">
          <BarChart3Icon className="text-indigo-700"/>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {t("home.title")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/notifications"
            onClick={() => {
              setHasUnreadNotifications(false);
              localStorage.setItem("notifications_read", "true");
            }}
            className="relative"
          >
            <button className="bg-blue-100 rounded-full p-2.5 relative">
              <Bell className="w-5 h-5 text-blue-600" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              )}
            </button>
          </Link>
          <Link to="/admin/settings">
            <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center text-blue-600 justify-center">
              <Settings/>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 space-y-3 cursor-default">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{t("home.totalIncome")}</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {totalIncome.toLocaleString()} {t("home.soum")}
          </div>
          <div className="text-sm text-green-500">
            {t("home.today")}: +{todayIncome.toLocaleString()} {t("home.soum")}
          </div>
        </div>

        <Link
          to="/admin/products"
          className="bg-white rounded-2xl p-4 space-y-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <ChartCandlestick className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{t("home.products")}</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {productStats.count.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            <div>{t("home.purchase")}: {productStats.totalIncoming.toLocaleString()} {t("home.soum")}</div>
            <div>
              {t("home.sales")}: {productStats.totalOutgoing.toLocaleString()} {t("home.soum")}
            </div>
          </div>
        </Link>

        <Link
          to="/admin/clients"
          className="bg-white rounded-2xl p-4 space-y-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{t("home.clients")}</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {clientsCount.toLocaleString()}
          </div>
        </Link>

        <div className="relative bg-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">{t("home.managers")}</h3>
            </div>
            <button
              className="bg-blue-500 w-6 h-6 text-white rounded-full flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {menuOpen && (
            <div className="absolute top-12 right-4 bg-white border border-gray-100 rounded-lg w-60 z-10">
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:text-blue-500 hover:bg-blue-50 flex items-center gap-2"
              >
                <UserPlus2 className="w-5 h-5" />
                {t("home.addManager")}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:text-blue-500 hover:bg-blue-50 flex items-center gap-2"
              >
                <PencilIcon className="w-5 h-5" />
                {t("home.editManagers")}
              </button>
            </div>
          )}

          <ul className="text-sm space-y-1 mt-2">
            {managers.slice(0, 3).map((m, i) => (
              <li key={i} className="flex justify-between text-gray-700">
                <span>{m.fullName}</span>
                <span className="text-green-600 font-medium">
                  +{m.profit.toLocaleString()} {t("home.soum")}
                </span>
              </li>
            ))}
          </ul>

          {showAddModal && (
            <AddManagerModal
              onClose={() => setShowAddModal(false)}
              onAdd={handleAddManager}
            />
          )}
          {showEditModal && (
            <EditManagersModal
              managers={managers}
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveManagers}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyChart data={chartData} />
        <DebtList debts={debts} />
      </div>

      {popups.map((popup) => (
        <PopupNotification
          key={popup.id}
          title={popup.title}
          message={popup.message}
          type={popup.type}
          onClose={() =>
            setPopups((prev) => prev.filter((p) => p.id !== popup.id))
          }
        />
      ))}
    </div>
  );
};

export default Home;
