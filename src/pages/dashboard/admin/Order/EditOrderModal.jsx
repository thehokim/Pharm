import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

// Мок-данные (замени на реальные при необходимости)
const clients = [
  { id: 1, name: "Аптека Акме" },
  { id: 2, name: "МедПлюс" },
  { id: 3, name: "Городская Клиника" },
];

const products = [
  { id: 1, name: "Парацетамол", price: 4500 },
  { id: 2, name: "Амоксициллин", price: 7200 },
  { id: 3, name: "Цитрамон", price: 3000 },
];

const EditOrderModal = ({ isOpen, onClose, order, onSubmit }) => {
  const [form, setForm] = useState({
    client_id: "",
    status: "",
    payment_status: "",
    notes: "",
    items: [],
    total_amount: 0,
  });

  useEffect(() => {
    if (order) {
      setForm({
        client_id: order.client_id || "",
        status: order.status || "В процессе",
        payment_status: order.payment_status || "Не оплачен",
        notes: order.notes || "",
        items: order.items || [],
        total_amount: order.total_amount || 0,
      });
    }
  }, [order]);

  useEffect(() => {
    const total = form.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [form.items]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    if (field === "product_id") {
      const product = products.find((p) => p.id === parseInt(value));
      newItems[index] = {
        ...newItems[index],
        product_id: parseInt(value),
        price: product?.price || 0,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: field === "quantity" ? parseInt(value) : value,
      };
    }
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = [...form.items];
    newItems.splice(index, 1);
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, id: order.id });
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Редактировать заказ</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              name="client_id"
              value={form.client_id}
              onChange={handleChange}
              required
              className="border border-gray-100 rounded-xl px-4 py-2 h-12"
            >
              <option value="">Выберите клиента</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-gray-100 rounded-xl px-4 py-2 h-12"
            >
              <option value="В процессе">В процессе</option>
              <option value="Выполнен">Выполнен</option>
              <option value="Отменён">Отменён</option>
            </select>

            <select
              name="payment_status"
              value={form.payment_status}
              onChange={handleChange}
              className="border border-gray-100 rounded-xl px-4 py-2 h-12"
            >
              <option value="Не оплачен">Не оплачен</option>
              <option value="Оплачен">Оплачен</option>
            </select>

            <input
              type="text"
              name="notes"
              placeholder="Примечание"
              value={form.notes}
              onChange={handleChange}
              className="border border-gray-100 rounded-xl px-4 py-2 h-12"
            />
          </div>

          {/* Товары */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Товары</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <Plus size={16} /> Добавить товар
              </button>
            </div>

            {form.items.map((item, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 items-center">
                <select
                  value={item.product_id}
                  onChange={(e) =>
                    handleItemChange(i, "product_id", e.target.value)
                  }
                  required
                  className="border border-gray-100 rounded-xl px-2 py-2 h-10"
                >
                  <option value="">Продукт</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    handleItemChange(i, "quantity", e.target.value)
                  }
                  className="border border-gray-100 rounded-xl px-2 py-2 h-10"
                />
                <input
                  type="number"
                  value={item.price}
                  readOnly
                  className="border border-gray-100 rounded-xl px-2 py-2 h-10 bg-gray-50"
                />
                <div className="text-sm font-semibold">
                  {(item.quantity * item.price).toLocaleString()} сум
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Общая сумма и кнопка */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-lg font-bold text-indigo-600">
              Общая сумма: {form.total_amount.toLocaleString()} сум
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
