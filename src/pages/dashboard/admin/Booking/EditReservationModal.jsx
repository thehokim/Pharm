import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const STATUS_OPTIONS = [
  { value: "pending", labelKey: "editReservation.statuses.pending" },
  { value: "confirmed", labelKey: "editReservation.statuses.confirmed" },
  { value: "cancelled", labelKey: "editReservation.statuses.cancelled" },
];

const EditReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onUpdate = () => {},
}) => {
  const { t } = useTranslation("booking");
  const [form, setForm] = useState({
    client_full_name: "",
    client_id: "",
    status: "pending",
    total_amount: "",
    notes: "",
    items: [],
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientDropdown, setClientDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [productDropdowns, setProductDropdowns] = useState({}); // { [index]: bool }

  const clientRef = useRef(null);
  const statusRef = useRef(null);
  const token = localStorage.getItem("token");

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

  // Заполнение формы из reservation
  useEffect(() => {
    if (reservation) {
      const client = clients.find((c) => c.id === reservation.client_id);
      setForm({
        client_full_name: client ? client.name || client.client_full_name : "",
        client_id: reservation.client_id || "",
        status: reservation.status || "pending",
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
      setProductDropdowns({});
    }
    // eslint-disable-next-line
  }, [reservation, clients]);

  // Закрытие dropdown по клику вне
  useEffect(() => {
    function handleClick(e) {
      if (
        statusDropdown &&
        statusRef.current &&
        !statusRef.current.contains(e.target)
      ) {
        setStatusDropdown(false);
      }
      if (
        clientDropdown &&
        clientRef.current &&
        !clientRef.current.contains(e.target)
      ) {
        setClientDropdown(false);
      }
      // Закрытие всех продуктов dropdown при клике вне
      setProductDropdowns((prev) => {
        const newState = { ...prev };
        let changed = false;
        Object.entries(prev).forEach(([idx, open]) => {
          if (open) {
            const el = document.getElementById(`product-dropdown-${idx}`);
            if (el && !el.contains(e.target)) {
              newState[idx] = false;
              changed = true;
            }
          }
        });
        return changed ? newState : prev;
      });
    }
    if (
      statusDropdown ||
      clientDropdown ||
      Object.values(productDropdowns).some(Boolean)
    ) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [statusDropdown, clientDropdown, productDropdowns]);

  const handleClientSelect = (client) => {
    setForm((prev) => ({
      ...prev,
      client_full_name: client.name || client.client_full_name,
      client_id: client.id,
    }));
    setClientDropdown(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm((prev) => ({ ...prev, items: updatedItems }));
    // если сменили продукт — закрываем dropdown
    if (field === "product_id") {
      setProductDropdowns((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleStatusSelect = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
    setStatusDropdown(false);
  };

  // dropdown по продукту
  const toggleProductDropdown = (index) => {
    setProductDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
      const res = await fetch(
        `${BASE_URL}/api/reservations/${reservation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(t("editReservation.error"));

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert(t("editReservation.error"));
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {t("editReservation.title")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Кастомный dropdown для клиента */}
          <div className="grid grid-cols-2 gap-5">
            {/* Клиент */}
            <div className="relative col-span-2 sm:col-span-1" ref={clientRef}>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {t("editReservation.client_full_name")}
              </label>
              <button
                type="button"
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2 bg-white"
                onClick={() => setClientDropdown((v) => !v)}
              >
                <span>
                  {form.client_full_name || (
                    <span className="text-gray-400">
                      {t("editReservation.select_client")}
                    </span>
                  )}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              {clientDropdown && (
                <div className="absolute left-0 right-0 mt-2 z-20 bg-white border border-gray-100 rounded-xl shadow-lg overflow-auto max-h-56">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => handleClientSelect(client)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                        form.client_id === client.id
                          ? "bg-blue-100 font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      {client.name || client.client_full_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Статус */}
            <div className="relative col-span-2 sm:col-span-1" ref={statusRef}>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {t("editReservation.status")}
              </label>
              <button
                type="button"
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2 bg-white"
                onClick={() => setStatusDropdown((v) => !v)}
              >
                <span>
                  {t(
                    STATUS_OPTIONS.find((opt) => opt.value === form.status)
                      ?.labelKey
                  )}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              {statusDropdown && (
                <div className="absolute left-0 right-0 mt-2  z-20 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleStatusSelect(opt.value)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                        form.status === opt.value
                          ? "bg-blue-100 font-semibold text-blue-500"
                          : ""
                      }`}
                    >
                      {t(opt.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Сумма */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {t("editReservation.sum")}
              </label>
              <input
                type="number"
                name="total_amount"
                placeholder={t("editReservation.sum")}
                value={form.total_amount}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2"
              />
            </div>
            {/* Примечания */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {t("editReservation.notes")}
              </label>
              <textarea
                name="notes"
                placeholder={t("editReservation.notes")}
                value={form.notes}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            {form.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-x-8 gap-y-2 items-start"
              >
                {/* Product dropdown */}
                <div className="relative" id={`product-dropdown-${index}`}>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("reservation.selectProduct")}
                  </label>
                  <button
                    type="button"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white flex justify-between items-center"
                    onClick={() => toggleProductDropdown(index)}
                  >
                    <span>
                      {products.find((p) => p.id === Number(item.product_id))
                        ?.name || t("reservation.selectProduct")}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {productDropdowns[index] && (
                    <div className="absolute left-0 top-full mt-2 z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {products.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() =>
                            handleItemChange(index, "product_id", product.id)
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
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("editReservation.quantity")}
                  </label>
                  <input
                    type="number"
                    placeholder={t("editReservation.quantity")}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2 w-full"
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("editReservation.price")}
                  </label>
                  <input
                    type="number"
                    placeholder={t("editReservation.price")}
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2 w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl"
          >
            {t("editReservation.save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;
