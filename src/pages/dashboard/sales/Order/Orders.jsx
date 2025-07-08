import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddOrderModal from "./AddOrderModal";
import EditOrderModal from "./EditOrderModal";
import DeleteOrderModal from "./DeleteOrderModal";
import Pagination from "../../../../components/layout/Pagination";
import { BASE_URL } from "../../../../utils/auth";

// Цвета для статусов и оплат
const STATUS_COLORS = {
  done: "bg-gradient-to-r from-green-400 to-green-600 text-white shadow border-green-500",
  in_progress: "bg-gradient-to-r from-yellow-300 to-orange-400 text-yellow-900 shadow border-yellow-400",
  cancelled: "bg-gradient-to-r from-rose-400 to-red-500 text-white shadow border-red-500",
};
const PAYMENT_COLORS = {
  paid: "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow border-emerald-500",
  not_paid: "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800 shadow border-slate-400",
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
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
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
          page: (result.meta?.page ?? 0) + 1,
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
  }, [orders, search, t]);

  return (
    <div className="space-y-4 bg-gray-50 p-4 min-h-screen">
      <div className="bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-indigo-100 rounded-full p-3">
            <ShoppingCart className="text-indigo-700" />
          </div>
          <span className="text-2xl font-bold text-gray-800">
            {t("orders")}
          </span>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-2xl font-bold hover:bg-indigo-100 hover:text-indigo-800 transition-colors focus:outline-none"
            title={t("add_order")}
          >
            <Plus size={20} />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">{t("client")}</th>
              <th className="px-6 py-4 font-semibold">{t("date")}</th>
              <th className="px-6 py-4 font-semibold">{t("status")}</th>
              <th className="px-6 py-4 font-semibold">{t("payment_status")}</th>
              <th className="px-6 py-4 font-semibold">{t("total_amount")}</th>
              <th className="px-6 py-4 font-semibold text-center">
                {t("payment_type")}
              </th>
              <th className="px-6 py-4 font-semibold text-center">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-indigo-50 border-b border-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.client_full_name}</td>
                  <td className="px-6 py-4">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition shadow
                        ${
                          STATUS_COLORS[order.status] ||
                          "bg-gray-200 text-gray-600 border-gray-300"
                        }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition shadow
                        ${
                          PAYMENT_COLORS[order.payment_status] ||
                          "bg-gray-200 text-gray-600 border-gray-300"
                        }`}
                    >
                      {PAYMENT_LABELS[order.payment_status] ||
                        order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {(order.total_amount ?? 0).toLocaleString()}{" "}
                    {t("delete_sum")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                      {PAYMENT_TYPE_LABELS[order.payment_type] ||
                        order.payment_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
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
                <td
                  colSpan={8}
                  className="text-center px-6 py-8 text-gray-400 font-medium"
                >
                  {t("no_data")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

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
