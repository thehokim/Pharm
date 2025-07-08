import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../../utils/auth";

// Опции статусов (только значения для API!)
const STATUS_OPTIONS = [
  { value: "in_progress", labelKey: "in_progress" },
  { value: "done", labelKey: "done" },
  { value: "cancelled", labelKey: "cancelled" },
];
const PAYMENT_OPTIONS = [
  { value: "not_paid", labelKey: "not_paid" },
  { value: "paid", labelKey: "paid" },
];
const PAYMENT_TYPE_OPTIONS = [
  { value: "enumeration", labelKey: "enumeration" },
  { value: "cash", labelKey: "cash" },
  { value: "card", labelKey: "card" },
];

// Кастомный dropdown для любого списка
function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
  t,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex justify-between items-center border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-left text-gray-900 ${
          open ? "ring-2 ring-indigo-300" : ""
        }`}
      >
        <span>
          {selected ? (
            t(selected.labelKey || selected.label)
          ) : (
            <span className="text-gray-400">{t(placeholder)}</span>
          )}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-indigo-50 ${
                opt.value === value
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : ""
              }`}
            >
              {t(opt.labelKey || opt.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const AddOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation("order");

  const [form, setForm] = useState({
    client_id: "",
    status: STATUS_OPTIONS[0].value, // "in_progress"
    payment_status: PAYMENT_OPTIONS[0].value, // "not_paid"
    payment_type: PAYMENT_TYPE_OPTIONS[0].value, // "enumeration"
    notes: "",
    items: [],
    total_amount: 0,
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
      fetch(`${BASE_URL}/api/clients/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => setClients(res.data || [])) // <-- FIX!
        .catch((err) => console.error("Ошибка загрузки клиентов:", err));
      fetch(`${BASE_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => setProducts(res.data || [])) // <-- FIX!
        .catch((err) => console.error("Ошибка загрузки продуктов:", err));
    }
  }, [isOpen, token]);

  useEffect(() => {
    // Пересчёт суммы при изменении товаров
    const total = form.items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [form.items]);

  // Любое изменение в форме
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Изменение по товарам (product_id, quantity)
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    if (field === "product_id") {
      const product = products.find((p) => p.id === value);
      newItems[index] = {
        ...newItems[index],
        product_id: value,
        price: product?.selling_price || 0,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: field === "quantity" ? Number(value) : value,
      };
    }
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  // Добавить товар в заказ
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: null, quantity: 1, price: 0 }],
    }));
  };

  // Удалить товар
  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Отправить форму
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      client_id: Number(form.client_id),
      status: form.status,
      payment_status: form.payment_status,
      payment_type: form.payment_type,
      total_amount: form.total_amount,
      notes: form.notes,
      items: form.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t("add_order")}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <CustomDropdown
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
              value={form.client_id}
              onChange={(v) => handleChange("client_id", v)}
              placeholder="select_client"
              className=""
              t={t}
            />
            <CustomDropdown
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(v) => handleChange("status", v)}
              placeholder="status"
              className=""
              t={t}
            />
            <CustomDropdown
              options={PAYMENT_OPTIONS}
              value={form.payment_status}
              onChange={(v) => handleChange("payment_status", v)}
              placeholder="payment_status"
              className=""
              t={t}
            />
            <CustomDropdown
              options={PAYMENT_TYPE_OPTIONS}
              value={form.payment_type}
              onChange={(v) => handleChange("payment_type", v)}
              placeholder="payment_type"
              className=""
              t={t}
            />
          </div>
          <input
            type="text"
            name="notes"
            placeholder={t("note")}
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 w-full h-11 bg-gray-50 focus:border-blue-500 outline-none"
          />
          {/* Товары */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{t("products")}</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <Plus size={16} /> {t("add_product")}
              </button>
            </div>
            {form.items.map((item, i) => (
              <div key={i} className="grid grid-cols-5 gap-6 items-center">
                <CustomDropdown
                  options={products.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                  value={item.product_id}
                  onChange={(v) => handleItemChange(i, "product_id", v)}
                  placeholder="product"
                  t={t}
                />
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    handleItemChange(i, "quantity", e.target.value)
                  }
                  className="border border-gray-200 rounded-lg px-2 py-2 h-10 bg-white focus:border-blue-500 outline-none"
                  placeholder={t("quantity")}
                />
                <input
                  type="number"
                  value={item.price}
                  readOnly
                  className="border border-gray-200 rounded-lg px-2 py-2 h-10 bg-gray-50"
                  placeholder={t("price")}
                />
                <div className="text-sm font-semibold">
                  {(item.quantity * item.price).toLocaleString()} {t("total")}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-red-500 hover:text-red-700"
                  title={t("remove")}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-lg font-bold text-indigo-600">
              {t("total_amount")}: {form.total_amount.toLocaleString()} сум
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              {t("create_order")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
