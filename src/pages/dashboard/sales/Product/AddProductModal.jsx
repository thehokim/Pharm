import React, { useState } from "react";
import { X } from "lucide-react";

// Заглушка для списка поставщиков
const mockSuppliers = [
  { id: 1, name: "Тибби Снаб" },
  { id: 2, name: "ФармГлобал" },
  { id: 3, name: "Медика Центр" },
];

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    barcode: "",
    qr_code: "",
    category: "",
    supplier_id: "",
    purchase_price: "",
    selling_price: "",
    stock_quantity: "",
    expiration_date: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      supplier_id: Number(form.supplier_id),
      purchase_price: Number(form.purchase_price),
      selling_price: Number(form.selling_price),
      stock_quantity: Number(form.stock_quantity),
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Добавить товар</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Название"
            value={form.name}
            onChange={handleChange}
            required
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="category"
            placeholder="Категория"
            value={form.category}
            onChange={handleChange}
            required
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="barcode"
            placeholder="Штрихкод"
            value={form.barcode}
            onChange={handleChange}
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="qr_code"
            placeholder="QR-код"
            value={form.qr_code}
            onChange={handleChange}
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="col-span-2 focus:outline-none h-12 border border-gray-100 rounded-xl px-4 py-2"
          />

          <select
            name="supplier_id"
            value={form.supplier_id}
            onChange={handleChange}
            required
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          >
            <option value="">Выберите поставщика</option>
            {mockSuppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            name="purchase_price"
            type="number"
            placeholder="Цена закупки"
            value={form.purchase_price}
            onChange={handleChange}
            required
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="selling_price"
            type="number"
            placeholder="Цена продажи"
            value={form.selling_price}
            onChange={handleChange}
            required
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="stock_quantity"
            type="number"
            placeholder="Остаток"
            value={form.stock_quantity}
            onChange={handleChange}
            required
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="expiration_date"
            type="date"
            value={form.expiration_date}
            onChange={handleChange}
            required
            className="border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
