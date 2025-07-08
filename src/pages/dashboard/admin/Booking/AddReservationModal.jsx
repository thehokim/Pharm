import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const STATUS_OPTIONS = [
  {
    value: "pending",
    color: "text-yellow-700",
    dot: "bg-yellow-400",
    border: "border-yellow-300",
  },
  {
    value: "confirmed",
    color: "text-blue-700",
    dot: "bg-blue-400",
    border: "border-blue-300",
  },
  {
    value: "cancelled",
    color: "text-red-700",
    dot: "bg-red-400",
    border: "border-red-300",
  },
  {
    value: "completed",
    color: "text-green-700",
    dot: "bg-green-400",
    border: "border-green-300",
  },
];

const AddReservationModal = ({ isOpen, onClose, onAdd }) => {
  const { t } = useTranslation("booking");
  const [form, setForm] = useState({
    client_full_name: "",
    client_id: "",
    status: "pending",
    total_amount: "",
    notes: "",
    items: [{ product_id: "", quantity: 1, price: "", productDropdown: false }],
  });
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientOpen, setClientOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const token = localStorage.getItem("token");
  const statusRef = useRef(null);
  const clientRef = useRef(null);

  // Загрузка клиентов и продуктов
  useEffect(() => {
    if (isOpen) {
      fetch(`${BASE_URL}/api/clients/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => setClients(res.data || []))
        .catch((err) => console.error("Ошибка загрузки клиентов:", err));

      fetch(`${BASE_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => setProducts(res.data || []))
        .catch((err) => console.error("Ошибка загрузки продуктов:", err));
    }
  }, [isOpen, token]);

  useEffect(() => {
    if (!clientOpen) return;
    function handleClick(e) {
      if (clientRef.current && !clientRef.current.contains(e.target)) {
        setClientOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [clientOpen]);

  useEffect(() => {
    if (!statusOpen) return;
    function handleClick(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [statusOpen]);

  // Закрытие dropdown продуктов при клике вне
  useEffect(() => {
    function handleClick(e) {
      setForm((prev) => ({
        ...prev,
        items: prev.items.map((it, idx) =>
          it.productDropdown &&
          !document
            .getElementById(`product-dropdown-${idx}`)
            ?.contains(e.target)
            ? { ...it, productDropdown: false }
            : it
        ),
      }));
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [form.items]);

  const handleClientChange = (client) => {
    setForm((prev) => ({
      ...prev,
      client_full_name: client.name || client.client_full_name,
      client_id: client.id,
    }));
    setClientOpen(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({
      ...prev,
      status: value,
    }));
    setStatusOpen(false);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    // если сменили продукт — закрываем dropdown
    if (field === "product_id") updatedItems[index].productDropdown = false;
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleProductDropdown = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) =>
        idx === index ? { ...it, productDropdown: !it.productDropdown } : it
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { product_id: "", quantity: 1, price: "", productDropdown: false },
      ],
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
      client_full_name: undefined, // не нужен на сервере
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

      onAdd();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const statusObj = STATUS_OPTIONS.find((s) => s.value === form.status);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white flex flex-col max-h-[92vh]">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-7 pt-7 pb-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("reservation.add")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black"
            type="button"
          >
            <X size={22} />
          </button>
        </div>
        <div className="px-7 pb-7 pt-2 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              {/* Клиент (dropdown) */}
              <div className="flex flex-col gap-2 relative" ref={clientRef}>
                <label className="text-sm text-gray-700 font-medium mb-1">
                  {t("reservation.client_full_name")}
                </label>
                <button
                  type="button"
                  className="flex items-center justify-between px-4 py-2 w-full rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 text-left"
                  onClick={() => setClientOpen((v) => !v)}
                  tabIndex={0}
                >
                  <span className="font-medium">
                    {form.client_full_name || (
                      <span className="text-gray-400">
                        {t("reservation.client_full_name")}
                      </span>
                    )}
                  </span>
                  <ChevronDown className="text-gray-400 ml-2" size={20} />
                </button>
                {clientOpen && (
                  <div className="absolute left-0 top-full z-20 w-full bg-white border border-gray-200 rounded-lg shadow-sm py-1 max-h-60 overflow-auto">
                    {clients.length === 0 && (
                      <div className="px-4 py-2 text-gray-400">
                        {t("reservation.no_clients")}
                      </div>
                    )}
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        className="flex w-full px-4 py-2 items-center text-left hover:bg-gray-100"
                        onClick={() => handleClientChange(client)}
                      >
                        {client.name || client.client_full_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Статус (dropdown) */}

              <div className="flex flex-col gap-2 relative" ref={statusRef}>
                <label className="text-sm text-gray-700 font-medium mb-1">
                  {t("reservation.status")}
                </label>
                <button
                  type="button"
                  className={`flex items-center justify-between px-4 py-2 w-full rounded-lg border focus:border-yellow-400 outline-none bg-gray-50 transition ${statusObj?.border}`}
                  onClick={() => setStatusOpen((v) => !v)}
                  tabIndex={0}
                  style={{
                    borderColor:
                      form.status === "pending" ? "#facc15" : undefined,
                  }}
                >
                  <span
                    className={`flex items-center gap-2 font-medium ${statusObj?.color}`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full inline-block ${statusObj?.dot}`}
                    />
                    {t(`reservation.statuses.${statusObj?.value}`)}
                  </span>
                  <ChevronDown className="text-gray-400 ml-2" size={20} />
                </button>
                {statusOpen && (
                  <div className="absolute left-0 top-full z-20 w-full bg-white border border-gray-200 rounded-lg shadow-sm py-1">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`flex w-full px-4 py-2 items-center gap-2 text-left hover:bg-gray-100 ${option.color}`}
                        style={{
                          fontWeight:
                            form.status === option.value ? "bold" : "normal",
                          background:
                            form.status === option.value
                              ? "rgba(253, 224, 71, 0.09)"
                              : undefined,
                        }}
                        onClick={() => handleStatusChange(option.value)}
                      >
                        <span
                          className={`w-3 h-3 rounded-full inline-block ${option.dot}`}
                        />
                        {t(`reservation.statuses.${option.value}`)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Общая сумма */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700 font-medium mb-1">
                  {t("reservation.total")}
                </label>
                <input
                  type="number"
                  name="total_amount"
                  placeholder={t("reservation.total")}
                  value={form.total_amount}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 outline-none bg-gray-50"
                />
              </div>

              {/* Описание */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700 font-medium mb-1">
                  {t("reservation.notes")}
                </label>
                <textarea
                  name="notes"
                  placeholder={t("reservation.notes")}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 h-11 focus:border-blue-500 outline-none bg-gray-50"
                />
              </div>
            </div>

            {/* Товары */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700 font-medium mb-1">
                {t("reservation.products")}
              </label>
              <div>
                <div className="grid grid-cols-3 gap-x-12">
                  <span className="block text-gray-400 font-semibold text-sm">
                    {t("reservation.selectProduct")}
                  </span>
                  <span className="block text-gray-400 font-semibold text-sm">
                    {t("reservation.quantity")}
                  </span>
                  <span className="block text-gray-400 font-semibold text-sm">
                    {t("reservation.price")}
                  </span>
                </div>
                {form.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-x-12 gap-y-2 rounded-lg p-4 bg-white"
                  >
                    {/* Product dropdown */}
                    <div className="relative" id={`product-dropdown-${index}`}>
                      <button
                        type="button"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white flex justify-between items-center"
                        onClick={() => handleProductDropdown(index)}
                      >
                        <span>
                          {products.find(
                            (p) => p.id === Number(item.product_id)
                          )?.name || t("reservation.selectProduct")}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      {item.productDropdown && (
                        <div className="absolute left-0 top-full mt-2 z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                          {products.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() =>
                                handleItemChange(
                                  index,
                                  "product_id",
                                  product.id
                                )
                              }
                              className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                                product.id === item.product_id
                                  ? "bg-blue-100 text-blue-700 font-semibold"
                                  : ""
                              }`}
                            >
                              {product.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Quantity */}
                    <input
                      type="number"
                      placeholder={t("reservation.quantity")}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                      required
                    />
                    {/* Price (+ удалить) */}
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder={t("reservation.price")}
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        required
                      />
                      {form.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-xs text-red-600 hover:underline ml-2"
                          tabIndex={-1}
                        >
                          {t("reservation.delete")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="text-blue-600 hover:underline text-sm mt-1"
                >
                  {t("reservation.addProduct")}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg text-base mt-2"
            >
              {t("reservation.save")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReservationModal;
