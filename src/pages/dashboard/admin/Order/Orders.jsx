import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  ShoppingCart,
  Hash,
  User,
  Calendar,
  CheckCircle,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddOrderModal from "./AddOrderModal";
import EditOrderModal from "./EditOrderModal";
import DeleteOrderModal from "./DeleteOrderModal";
import Pagination from "../../../../components/layout/Pagination";
import { BASE_URL } from "../../../../utils/auth";

// Цвета для статусов и оплат (теперь с неоновыми эффектами)
const STATUS_COLORS = {
  done: "bg-gradient-to-r from-green-400/20 to-green-600/20 text-green-400 border-green-400/50",
  in_progress:
    "bg-gradient-to-r from-yellow-300/20 to-orange-400/20 text-yellow-400 border-yellow-400/50",
  cancelled:
    "bg-gradient-to-r from-rose-400/20 to-red-500/20 text-red-400 border-red-400/50",
};
const PAYMENT_COLORS = {
  paid: "bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 text-emerald-400 border-emerald-400/50",
  not_paid:
    "bg-gradient-to-r from-slate-300/20 to-slate-400/20 text-slate-400 border-slate-400/50",
};

const PAGE_SIZE = 10;

const Orders = () => {
  const { t } = useTranslation("order");

  const STATUS_LABELS = {
    in_progress: t("in_progress"),
    done: t("done"),
    cancelled: t("cancelled"),
    "В процессе": t("in_progress"),
    Выполнен: t("done"),
    Отменён: t("cancelled"),
    Отменен: t("cancelled"),
  };
  const PAYMENT_LABELS = {
    not_paid: t("not_paid"),
    paid: t("paid"),
    "Не оплачен": t("not_paid"),
    Оплачен: t("paid"),
  };
  const PAYMENT_TYPE_LABELS = {
    enumeration: t("enumeration"),
    cash: t("cash"),
    card: t("card"),
    Перечисление: t("enumeration"),
    Наличные: t("cash"),
    Карта: t("card"),
  };

  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");

  // Пагинированный fetch
  const fetchOrders = (page = 1, pageSize = PAGE_SIZE) => {
    fetch(`${BASE_URL}/api/orders/?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        setOrders(Array.isArray(result.data) ? result.data : []);
        setMeta({
          page: result.meta?.page || 1,
          pageSize: result.meta?.pageSize || PAGE_SIZE,
          total: result.meta?.total || 0,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error("Ошибка загрузки заказов:", err));
  };

  useEffect(() => {
    fetchOrders(page, PAGE_SIZE);
    // eslint-disable-next-line
  }, [page]);

  const handleAddOrder = (newOrder) => {
    fetch(`${BASE_URL}/api/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newOrder),
    })
      .then((res) => res.json())
      .then(() => {
        fetchOrders(page, PAGE_SIZE);
        setIsAddOpen(false);
      })
      .catch((err) => console.error("Ошибка создания заказа:", err));
  };

  const handleEditOrder = (updatedOrder) => {
    fetch(`${BASE_URL}/api/orders/${updatedOrder.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedOrder),
    })
      .then((res) => res.json())
      .then(() => {
        fetchOrders(page, PAGE_SIZE);
        setIsEditOpen(false);
      })
      .catch((err) => console.error("Ошибка редактирования заказа:", err));
  };

  const handleDeleteOrder = () => {
    fetch(`${BASE_URL}/api/orders/${deletingOrder.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        fetchOrders(page, PAGE_SIZE);
        setIsDeleteOpen(false);
      })
      .catch((err) => console.error("Ошибка удаления заказа:", err));
  };

  // Фильтрация и поиск (по текущей странице)
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) =>
      [
        o.id,
        o.client_full_name,
        o.created_at,
        STATUS_LABELS[o.status] || o.status,
        PAYMENT_LABELS[o.payment_status] || o.payment_status,
        PAYMENT_TYPE_LABELS[o.payment_type] || o.payment_type,
        o.total_amount,
      ]
        .map((v) => (v ? String(v).toLowerCase() : ""))
        .some((val) => val.includes(q))
    );
  }, [orders, search, STATUS_LABELS, PAYMENT_LABELS, PAYMENT_TYPE_LABELS]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div
        className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 "
        style={{ boxShadow: "0 0 50px rgba(6, 182, 212, 0.2)" }}
      >
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-emerald-400/10"></div>

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-cyan-400 p-4 rounded-2xl">
                <ShoppingCart
                  className="text-cyan-400 w-7 h-7"
                  style={{ filter: "drop-shadow(0 0 10px #06b6d4)" }}
                />
              </div>
            </div>
            <div>
              <h1
                className="text-3xl font-bold text-white"
                style={{ textShadow: "0 0 20px rgba(6, 182, 212, 0.5)" }}
              >
                {t("orders")}
              </h1>
              <p className="text-cyan-400 text-sm mt-1">
                {t("orders_management")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Кнопка добавления */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg group"
              style={{
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))",
              }}
              title={t("add_order")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-6 h-6 text-white relative z-10" />
            </button>

            {/* Поиск */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search
                  className="text-cyan-400 w-5 h-5"
                  style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                />
              </div>
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: search
                    ? "0 0 20px rgba(6, 182, 212, 0.2)"
                    : "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div
        className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl hidden lg:block"
        style={{ boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Hash
                      className="w-4 h-4 text-cyan-400"
                      style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                    />
                    ID
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <User
                      className="w-4 h-4 text-emerald-400"
                      style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                    />
                    {t("client")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-4 h-4 text-purple-400"
                      style={{ filter: "drop-shadow(0 0 8px #a855f7)" }}
                    />
                    {t("date")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className="w-4 h-4 text-amber-400"
                      style={{ filter: "drop-shadow(0 0 8px #f59e0b)" }}
                    />
                    {t("status")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className="w-4 h-4 text-blue-400"
                      style={{ filter: "drop-shadow(0 0 8px #3b82f6)" }}
                    />
                    {t("payment_status")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <DollarSign
                      className="w-4 h-4 text-red-400"
                      style={{ filter: "drop-shadow(0 0 8px #ef4444)" }}
                    />
                    {t("total_amount")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <CreditCard
                      className="w-4 h-4 text-indigo-400"
                      style={{ filter: "drop-shadow(0 0 8px #6366f1)" }}
                    />
                    {t("payment_type")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300 text-center">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          style={{ boxShadow: "0 0 8px #06b6d4" }}
                        ></div>
                        <span className="font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          #{order.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-medium">
                        {order.client_full_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-400">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition backdrop-blur-sm
                          ${
                            STATUS_COLORS[order.status] ||
                            "bg-gray-200/20 text-gray-400 border-gray-400/50"
                          }`}
                        style={{
                          boxShadow:
                            order.status === "done"
                              ? "0 0 15px rgba(34, 197, 94, 0.3)"
                              : order.status === "in_progress"
                              ? "0 0 15px rgba(251, 191, 36, 0.3)"
                              : order.status === "cancelled"
                              ? "0 0 15px rgba(239, 68, 68, 0.3)"
                              : "none",
                        }}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition backdrop-blur-sm
                          ${
                            PAYMENT_COLORS[order.payment_status] ||
                            "bg-gray-200/20 text-gray-400 border-gray-400/50"
                          }`}
                        style={{
                          boxShadow:
                            order.payment_status === "paid"
                              ? "0 0 15px rgba(16, 185, 129, 0.3)"
                              : "none",
                        }}
                      >
                        {PAYMENT_LABELS[order.payment_status] ||
                          order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-red-400">
                        {(order.total_amount ?? 0).toLocaleString()}{" "}
                        {t("delete_sum")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full border bg-indigo-400/20 text-indigo-400 border-indigo-400/50 backdrop-blur-sm"
                        style={{
                          boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)",
                        }}
                      >
                        {PAYMENT_TYPE_LABELS[order.payment_type] ||
                          order.payment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ActionMenu
                        onEdit={() => {
                          setEditingOrder(order);
                          setIsEditOpen(true);
                        }}
                        onDelete={() => {
                          setDeletingOrder(order);
                          setIsDeleteOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center px-6 py-12">
                    <div className="flex flex-col items-center gap-4">
                      <ShoppingCart className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        {t("no_data")}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden">
        {filtered.length === 0 ? (
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl py-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <span className="text-gray-400 font-medium">{t("no_data")}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 space-y-4"
                style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)" }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      style={{ boxShadow: "0 0 8px #06b6d4" }}
                    ></div>
                    <span className="text-lg font-semibold text-cyan-400">
                      #{order.id}
                    </span>
                  </div>
                  <ActionMenu
                    onEdit={() => {
                      setEditingOrder(order);
                      setIsEditOpen(true);
                    }}
                    onDelete={() => {
                      setDeletingOrder(order);
                      setIsDeleteOpen(true);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User
                      className="w-4 h-4 text-emerald-400"
                      style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                    />
                    <span className="text-gray-400">Клиент:</span>
                    <span className="text-emerald-400 font-medium">
                      {order.client_full_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-4 h-4 text-purple-400"
                      style={{ filter: "drop-shadow(0 0 8px #a855f7)" }}
                    />
                    <span className="text-gray-400">Дата:</span>
                    <span className="text-purple-400">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className="w-4 h-4 text-amber-400"
                      style={{ filter: "drop-shadow(0 0 8px #f59e0b)" }}
                    />
                    <span className="text-gray-400">Статус:</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border transition backdrop-blur-sm
                        ${
                          STATUS_COLORS[order.status] ||
                          "bg-gray-200/20 text-gray-400 border-gray-400/50"
                        }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className="w-4 h-4 text-blue-400"
                      style={{ filter: "drop-shadow(0 0 8px #3b82f6)" }}
                    />
                    <span className="text-gray-400">Оплата:</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border transition backdrop-blur-sm
                        ${
                          PAYMENT_COLORS[order.payment_status] ||
                          "bg-gray-200/20 text-gray-400 border-gray-400/50"
                        }`}
                    >
                      {PAYMENT_LABELS[order.payment_status] ||
                        order.payment_status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign
                      className="w-4 h-4 text-red-400"
                      style={{ filter: "drop-shadow(0 0 8px #ef4444)" }}
                    />
                    <span className="text-gray-400">Сумма:</span>
                    <span className="font-semibold text-red-400">
                      {(order.total_amount ?? 0).toLocaleString()}{" "}
                      {t("delete_sum")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard
                      className="w-4 h-4 text-indigo-400"
                      style={{ filter: "drop-shadow(0 0 8px #6366f1)" }}
                    />
                    <span className="text-gray-400">Тип оплаты:</span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-indigo-400/20 text-indigo-400 border-indigo-400/50 backdrop-blur-sm">
                      {PAYMENT_TYPE_LABELS[order.payment_type] ||
                        order.payment_type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination meta={meta} onPageChange={handlePageChange} />
      </div>

      {/* Модальные окна */}
      <AddOrderModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddOrder}
      />
      <EditOrderModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        order={editingOrder}
        onSubmit={handleEditOrder}
      />
      <DeleteOrderModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteOrder}
        order={deletingOrder}
      />
    </div>
  );
};

export default Orders;
