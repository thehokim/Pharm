import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";

const EditReservationModal = ({ isOpen, onClose, reservation, onUpdate }) => {
  const [form, setForm] = useState({
    client_id: "",
    status: "",
    total_amount: "",
    notes: "",
    items: [],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (reservation) {
      setForm({
        client_id: reservation.client_id || "",
        status: reservation.status || "Ожидает",
        total_amount: reservation.total_amount || "",
        notes: reservation.notes || "",
        items: reservation.items?.length
          ? reservation.items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
            }))
          : [{ product_id: "", quantity: 1, price: "" }],
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      client_id: Number(form.client_id),
      status: form.status,
      total_amount: Number(form.total_amount),
      notes: form.notes,
      items: form.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/reservations/${reservation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Ошибка при обновлении бронирования");

      onUpdate(); // обновить список
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Редактировать бронирование</h2>
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
            <option value="Ожидает">Ожидает</option>
            <option value="Подтвержден">Подтвержден</option>
            <option value="Отменён">Отменён</option>
          </select>
          <input
            type="number"
            name="total_amount"
            placeholder="Сумма"
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
            {form.items.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 items-center">
                <input
                  type="number"
                  placeholder="Product ID"
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Количество"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Цена"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl">
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;
