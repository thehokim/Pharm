import React, { useState } from "react";
import { X } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";

const AddReservationModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    client_id: "",
    status: "pending",
    total_amount: "",
    notes: "",
    items: [{ product_id: "", quantity: 1, price: "" }],
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, price: "" }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      client_id: Number(form.client_id),
      total_amount: Number(form.total_amount),
      items: form.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };

    try {
      const response = await fetch(`${BASE_URL}/api/reservations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Ошибка при создании бронирования");

      onAdd(); // обновить список
      onClose(); // закрыть
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Добавить бронирование</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="client_id"
            placeholder="ID клиента"
            value={form.client_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2"
          >
            <option value="pending">Ожидает</option>
            <option value="confirmed">Подтвержден</option>
            <option value="cancelled">Отменён</option>
            <option value="completed">Заверщен</option>
          </select>

          <input
            type="number"
            name="total_amount"
            placeholder="Общая сумма"
            value={form.total_amount}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2"
          />

          <textarea
            name="notes"
            placeholder="Заметки"
            value={form.notes}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2"
          />

          <div className="space-y-2">
            <p className="font-semibold">Товары:</p>
            {form.items.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 items-center">
                <input
                  type="number"
                  placeholder="Product ID"
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Количество"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Цена"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2"
                  required
                />
                <div className="col-span-3 text-right">
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Удалить товар
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:underline text-sm"
            >
              + Добавить товар
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl">
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReservationModal;
