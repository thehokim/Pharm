import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart2,
  BarChart3,
  Bell,
  TrendingUp as ChartIcon,
  MoreVertical,
  Edit3,
  Settings,
  User,
  UserPlus2,
  Users,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Pill,
  Stethoscope,
  Heart,
  HeartPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AddManagerModal from "./AddManagerModal";
import EditManagersModal from "./EditManagersModal";
import MonthlyChart from "./MonthlyChart";
import DebtList from "./DebtList";
import PopupNotification from "../Notif/PopupNotification";
import { BASE_URL } from "../../../../utils/auth";
import LogoutButton from "../Settings/LogoutButton";

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
    fetchMonthlyChartData();
    fetchProducts();
    fetchClients();
    fetchManagers();
    fetchDebts();
    // eslint-disable-next-line
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/profit`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTotalIncome(data.total_income || 0);
      setTodayIncome(data.today_income || 0);
    } catch (err) {
      console.error("Ошибка загрузки дохода:", err);
    }
  };

  const fetchMonthlyChartData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/income/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Новый формат: [{ year: '2025', month: 'Jul', income: 11219.04 }]
      const chart = (data || []).map((item) => ({
        name: `${item.month} ${item.year}`,
        amount: item.income,
      }));
      setChartData(chart);
    } catch (err) {
      console.error("Ошибка загрузки данных для графика:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const arr = data.data || [];

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
      const arr = result.data || [];
      const debtsFiltered = arr
        .filter((c) => c.debt > 0)
        .map((c) => ({
          name: c.name,
          days: c.created_at ? Math.floor((new Date() - new Date(c.created_at)) / (1000 * 60 * 60 * 24)) : 0,
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

  // Компонент для фармацевтических карт
  const PharmaCard = ({ title, value, subtitle, icon: Icon, neonColor, link, children }) => {
    const CardContent = (
      <div className={`relative bg-gray-900/95 backdrop-blur-xl min-h-56 h-[100%] border border-gray-800 rounded-3xl p-4 transform transition-all duration-500 hover:scale-[1.02] group ${link ? 'cursor-pointer' : 'cursor-default'}`}
           style={{
             boxShadow: `0 0 0 1px ${neonColor}20, 0 0 20px ${neonColor}10, 0 0 40px ${neonColor}05`,
           }}>
        
        {/* Неоновые световые эффекты */}
        <div className="absolute inset-0 rounded-3xl transition-all duration-500 group-hover:opacity-100 opacity-0"
             style={{
               background: `radial-gradient(circle at 20% 20%, ${neonColor}15, transparent 60%)`
             }}></div>
        
        {/* Пульсирующий border при hover */}
        <div className="absolute inset-0 rounded-3xl transition-all duration-500 group-hover:opacity-100 opacity-0"
             style={{
               background: `linear-gradient(45deg, ${neonColor}30, transparent, ${neonColor}30)`,
               animation: 'pulse 2s infinite'
             }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              {/* Неоновое свечение иконки */}
              <div className="absolute inset-0 rounded-2xl blur-md transition-all duration-300"
                   style={{ backgroundColor: neonColor, opacity: 0.3 }}></div>
              <div className="relative bg-gray-800 border border-gray-700 p-3 rounded-2xl transition-all duration-300 group-hover:border-opacity-50"
                   style={{ borderColor: neonColor }}>
                <Icon className="w-6 h-6 transition-all duration-300" 
                      style={{ color: neonColor, filter: `drop-shadow(0 0 8px ${neonColor})` }} />
              </div>
            </div>
            {link && (
              <ArrowUpRight className="w-5 h-5 text-gray-400 transition-all duration-300 group-hover:scale-110"
                            style={{ color: neonColor }} />
            )}
          </div>
          
          <h3 className="text-gray-400 text-sm font-medium mb-3 transition-colors duration-300 group-hover:text-gray-300">
            {title}
          </h3>
          
          <div className="text-3xl font-bold text-white mb-2 transition-all duration-300 group-hover:scale-105"
               style={{ textShadow: `0 0 10px ${neonColor}50` }}>
            {value}
          </div>
          
          {subtitle && (
            <div className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-gray-300">
              {subtitle}
            </div>
          )}
          
          {children}
        </div>
      </div>
    );

    return link ? <Link to={link}>{CardContent}</Link> : CardContent;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4 space-y-6">
      {/* Заголовок с фармацевтической тематикой */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border border-emerald-500/20 shadow-2xl rounded-3xl p-6"
           style={{ boxShadow: '0 0 30px #10b98120, 0 0 60px #10b98110' }}>
        
        {/* Неоновый эффект заголовка */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-emerald-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <HeartPlus className="text-emerald-400 w-6 h-6" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1"
                  style={{ textShadow: '0 0 20px #10b98150' }}>
                {t("home.title")}
              </h1>
              <p className="text-emerald-400 text-sm flex items-center gap-2">
                <Pill className="w-4 h-4" />
                {t("pharma_analytics")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/admin/notifications"
              onClick={() => {
                setHasUnreadNotifications(false);
                localStorage.setItem("notifications_read", "true");
              }}
              className="relative group"
            >
              <div className="bg-gray-800 border border-cyan-400 p-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                   style={{ boxShadow: hasUnreadNotifications ? '0 0 15px #06b6d4' : 'none' }}>
                <Bell className="w-5 h-5 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                {hasUnreadNotifications && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"
                        style={{ boxShadow: '0 0 10px #ef4444' }}></span>
                )}
              </div>
            </Link>
            
            <Link to="/admin/settings" className="group">
              <div className="bg-gray-800 border border-purple-400 p-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-110">
                <Settings className="w-5 h-5 text-purple-400" style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
              </div>
            </Link>
            <LogoutButton handleLogout={handleLogout} />
          </div>
        </div>
      </div>

      {/* Фармацевтические статистические карты */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PharmaCard
          title={t("home.totalIncome")}
          value={`${totalIncome.toLocaleString()} ${t("home.soum")}`}
          subtitle={`${t("home.today")}: +${todayIncome.toLocaleString()} ${t("home.soum")}`}
          icon={Activity}
          neonColor="#10b981"
        />

        <PharmaCard
          title={t("home.products")}
          value={productStats.count.toLocaleString()}
          icon={Pill}
          neonColor="#06b6d4"
          link="/admin/products"
        >
          <div className="text-gray-400 text-sm space-y-1 mt-3">
            <div className="flex justify-between">
              <span>{t("purchase_colon")}</span>
              <span className="text-cyan-400">{productStats.totalIncoming.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("sales_colon")}</span>
              <span className="text-emerald-400">{productStats.totalOutgoing.toLocaleString()}</span>
            </div>
          </div>
        </PharmaCard>

        <PharmaCard
          title={t("home.clients")}
          value={clientsCount.toLocaleString()}
          icon={Stethoscope}
          neonColor="#8b5cf6"
          link="/admin/clients"
        />

        <div className="relative">
          <PharmaCard
            title={t("home.managers")}
            value={managers.length.toString()}
            icon={Users}
            neonColor="#f59e0b"
          >
            <div className="absolute top-0 right-0 z-20">
              <button
                className="bg-gray-800 border border-amber-400 p-2 rounded-xl transition-all duration-300 hover:scale-110"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ boxShadow: menuOpen ? '0 0 15px #f59e0b' : 'none' }}
              >
                <MoreVertical className="w-4 h-4 text-amber-400" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
              </button>
            </div>

            {menuOpen && (
              <div className="absolute top-10 right-0 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl w-64 z-50"
                   style={{ boxShadow: '0 0 30px #10b98120' }}>
                <button
                  onClick={() => {
                    setShowAddModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-800/50 flex items-center gap-3 transition-all duration-300 group"
                >
                  <UserPlus2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" 
                            style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  <span className="text-gray-300 group-hover:text-emerald-400">{t("home.addManager")}</span>
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-800/50 flex items-center gap-3 transition-all duration-300 group"
                >
                  <Edit3 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform"
                         style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                  <span className="text-gray-300 group-hover:text-cyan-400">{t("home.editManagers")}</span>
                </button>
              </div>
            )}

            <div className="space-y-2 mt-4">
              {managers.slice(0, 3).map((m, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 transition-all duration-300 hover:border-amber-400/30 hover:bg-gray-800/50">
                  <span className="text-gray-300 text-sm font-medium">{m.fullName}</span>
                  <span className="text-amber-400 font-bold text-sm flex items-center gap-1"
                        style={{ textShadow: '0 0 8px #f59e0b' }}>
                    <TrendingUp className="w-3 h-3" />
                    +{m.profit.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </PharmaCard>
        </div>
      </div>

      {/* Графики и списки с неоновой стилизацией */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900/90 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6"
             style={{ boxShadow: '0 0 20px #10b98110' }}>
          <MonthlyChart data={chartData} />
        </div>
        <div className="bg-gray-900/90 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6"
             style={{ boxShadow: '0 0 20px #ef444410' }}>
          <DebtList debts={debts} />
        </div>
      </div>

      {/* Модальные окна */}
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

      {/* Уведомления */}
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

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Home;