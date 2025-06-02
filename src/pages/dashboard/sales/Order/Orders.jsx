import React, { useState, useEffect } from "react";
import { Plus, Search, ShoppingCart } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddOrderModal from "./AddOrderModal";
import EditOrderModal from "./EditOrderModal";
import DeleteOrderModal from "./DeleteOrderModal";
import { BASE_URL } from "../../../../utils/auth";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch(`${BASE_URL}/api/orders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Ошибка загрузки заказов:", err));
  };

  const handleAdd = (newOrder) => {
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
        fetchOrders();
        setIsAddOpen(false);
      })
      .catch((err) => console.error("Ошибка создания заказа:", err));
  };

  const handleEdit = (updatedOrder) => {
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
        fetchOrders();
        setIsEditOpen(false);
      })
      .catch((err) => console.error("Ошибка редактирования заказа:", err));
  };

  const handleDelete = () => {
    fetch(`${BASE_URL}/api/orders/${deletingOrder.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        fetchOrders();
        setIsDeleteOpen(false);
      })
      .catch((err) => console.error("Ошибка удаления заказа:", err));
  };

  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart /> Заказы
        </h2>
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
              disabled // пока не реализован поиск
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">ID</th>
              <th className="px-6 py-4 bg-gray-100">Клиент</th>
              <th className="px-6 py-4 bg-gray-100">Дата</th>
              <th className="px-6 py-4 bg-gray-100">Статус</th>
              <th className="px-6 py-4 bg-gray-100">Оплата</th>
              <th className="px-6 py-4 bg-gray-100">Сумма</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">#{order.id}</td>
                <td className="px-6 py-4">{order.client_id}</td>
                <td className="px-6 py-4">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
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
                  {(order.total_amount ?? 0).toLocaleString()} сум
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
