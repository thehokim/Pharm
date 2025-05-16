import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart2,
  BarChart3Icon,
  Bell,
  ChartCandlestick,
  MoreVertical,
  PencilIcon,
  User,
  UserPlus2,
  Users,
} from "lucide-react";
import AddManagerModal from "./AddManagerModal";
import EditManagersModal from "./EditManagersModal";
import MonthlyChart from "./MonthlyChart";
import DebtList from "./DebtList";
import PopupNotification from "../PopupNotification";

const mockData = {
  totalIncome: 45231890,
  todayIncome: 1250000,
  productCount: 1245,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [data, setData] = useState(mockData);
  const [managers, setManagers] = useState(data.managers);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    const wasViewed = localStorage.getItem("notifications_read") === "true";
    setHasUnreadNotifications(!wasViewed);
  }, []);

  const handleAddManager = (newManager) => {
    setManagers((prev) => [...prev, newManager]);
  };

  const handleSaveManagers = (updated) => {
    setManagers(updated);
  };

  const showPopup = (message) => {
    const id = Date.now();
    setPopups((prev) => [...prev, { id, message }]);

    // автоматическое закрытие через 10 сек
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 10000);
  };

  useEffect(() => {
    // 🔴 Бронирование без оплаты 5+ дней
    const unpaidBookings = [{ id: 1, created_at: "2024-12-01" }];
    if (unpaidBookings.length > 0) {
      showPopup("Есть бронирования без оплаты более 5 дней!");
    }

    // 🟡 Товары не продаются 30+ дней
    const unsoldProducts = [{ id: 2, name: "Анальгин" }];
    if (unsoldProducts.length > 0) {
      showPopup("Некоторые товары не продаются более 30 дней!");
    }

    // 🔵 Долги 10+ дней
    const overdueDebts = [{ client: "Аптека Акме", days: 12 }];
    if (overdueDebts.length > 0) {
      showPopup("Есть просроченные долги более 10 дней!");
    }

    // 🟣 Истекает срок
    const expiring = [{ id: 3, name: "Парацетамол", days_left: 5 }];
    if (expiring.length > 0) {
      showPopup("Есть товары с близким сроком годности!");
      showPopup("Не закупайте товары с истекающим сроком!");
    }
  }, []);

  return (
    <div className="p-0 space-y-4 bg-gray-50">
      {/* Шапка */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <BarChart3Icon />
          <h2 className="text-2xl font-semibold text-gray-800">
            Управление фармацевтикой
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
              AD
            </div>
          </Link>
        </div>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Общий доход */}
        <div className="bg-white rounded-2xl p-4 space-y-3 cursor-default">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Общий доход</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {data.totalIncome.toLocaleString()} сум
          </div>
          <div className="text-sm text-green-500">
            Сегодня: +{data.todayIncome.toLocaleString()} сум
          </div>
        </div>

        {/* Товары */}
        <Link
          to="/admin/products"
          className="bg-white rounded-2xl p-4 space-y-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <ChartCandlestick className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Товары</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {data.productCount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            <div>Закуп: {data.totalProductIncoming.toLocaleString()} сум</div>
            <div>Продажа: {data.totalProductOutgoing.toLocaleString()} сум</div>
          </div>
        </Link>

        {/* Клиенты */}
        <Link
          to="/admin/clients"
          className="bg-white rounded-2xl p-4 space-y-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Клиенты</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {data.clientsCount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            +{data.newClients} новых клиентов
          </div>
        </Link>

        {/* Менеджеры */}
        <div className="relative bg-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Менеджеры</h3>
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
                className="w-full px-4 py-2 text-left hover:text-blue-500 transition-colors duration-200 hover:bg-blue-50 flex items-center gap-2"
              >
                <UserPlus2 className="w-5 h-5" />
                Добавить менеджера
              </button>
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-500 transition-colors duration-200 flex items-center gap-2"
              >
                <PencilIcon className="w-5 h-5" />
                Редактировать
              </button>
            </div>
          )}

          <ul className="text-sm space-y-1 mt-2">
            {managers.slice(0, 3).map((m, i) => (
              <li key={i} className="flex justify-between text-gray-700">
                <span>{m.fullName}</span>
                <span className="text-green-600 font-medium">
                  +{m.profit.toLocaleString()} сум
                </span>
              </li>
            ))}
          </ul>
          <div className="text-xs text-gray-500">
            Активных заказов: {data.activeOrders}
          </div>

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

      {/* Графики и долги */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyChart data={data.chartData} />
        <DebtList debts={data.debts} />
      </div>

      {popups.map((popup) => (
        <PopupNotification
          key={popup.id}
          message={popup.message}
          onClose={() =>
            setPopups((prev) => prev.filter((p) => p.id !== popup.id))
          }
        />
      ))}
    </div>
  );
};

export default Home;
