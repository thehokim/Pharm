import React, { useState } from "react";
import { Plus, Search, ShoppingCart } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddOrderModal from "./AddOrderModal";
import EditOrderModal from "./EditOrderModal";
import DeleteOrderModal from "./DeleteOrderModal";

const initialOrders = [
  {
    id: "#ORD-001",
    client_id: 1,
    client: "Аптека Акме",
    status: "Выполнен",
    payment_status: "Оплачен",
    notes: "Доставка вовремя",
    total_amount: 1200000,
    date: "2025-05-01",
    items: [],
  },
  {
    id: "#ORD-002",
    client_id: 2,
    client: "Городская Клиника",
    status: "В процессе",
    payment_status: "Не оплачен",
    notes: "",
    total_amount: 980000,
    date: "2025-05-03",
    items: [],
  },
  {
    id: "#ORD-003",
    client_id: 3,
    client: "МедПлюс",
    status: "Отменён",
    payment_status: "Не оплачен",
    notes: "Отмена по запросу клиента",
    total_amount: 0,
    date: "2025-05-05",
    items: [],
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);

  const handleAdd = (newOrder) => {
    const newId = `#ORD-${(orders.length + 1).toString().padStart(3, "0")}`;
    const orderWithId = {
      ...newOrder,
      id: newId,
      date: new Date().toISOString().split("T")[0],
    };
    setOrders((prev) => [...prev, orderWithId]);
  };

  const handleEdit = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleDelete = () => {
    setOrders((prev) => prev.filter((o) => o.id !== deletingOrder.id));
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2"><ShoppingCart/> Заказы</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-3 py-3 rounded-full hover:bg-gray-900 transition"
          >
            <Plus size={16} />
          </button>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск заказов..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Номер</th>
              <th className="px-6 py-4 bg-gray-100">Клиент</th>
              <th className="px-6 py-4 bg-gray-100">Дата</th>
              <th className="px-6 py-4 bg-gray-100">Статус</th>
              <th className="px-6 py-4 bg-gray-100">Оплата</th>
              <th className="px-6 py-4 bg-gray-100">Сумма</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.client}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === "Выполнен"
                        ? "bg-green-100 text-green-700"
                        : order.status === "В процессе"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.payment_status === "Оплачен"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {order.total_amount.toLocaleString()} сум
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалки */}
      <AddOrderModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />
      <EditOrderModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        order={editingOrder}
        onSubmit={handleEdit}
      />
      <DeleteOrderModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        order={deletingOrder}
      />
    </div>
  );
};

export default Orders;
