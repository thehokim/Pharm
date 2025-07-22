import React, { useEffect, useState, useRef } from "react";
import { X, Plus, Trash2, ChevronDown, Edit3, ShoppingCart, User, CheckCircle, DollarSign, CreditCard, Package, Hash, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../../utils/auth";

// Статусы и опции ― только значения для API!
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

// Универсальный dropdown в неоновом стиле
function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
  t,
  icon: Icon,
  iconColor = "text-cyan-400"
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
        className={`w-full flex justify-between items-center bg-gray-800/50 border border-gray-600/50 text-white px-4 py-4 rounded-2xl transition-all duration-300 hover:border-cyan-400 ${
          open ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-4 h-4 ${iconColor}`} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />}
          <span>
            {selected ? (
              t(selected.labelKey || selected.label)
            ) : (
              <span className="text-gray-500">{t(placeholder)}</span>
            )}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl max-h-52 overflow-y-auto"
             style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)' }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 transition-all duration-200 ${
                opt.value === value
                  ? "bg-cyan-400/20 text-cyan-400 font-semibold"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
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

const EditOrderModal = ({ isOpen, onClose, order, onSubmit }) => {
  const { t } = useTranslation("order");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    client_full_name: "",
    status: STATUS_OPTIONS[0].value,
    payment_status: PAYMENT_OPTIONS[0].value,
    payment_type: PAYMENT_TYPE_OPTIONS[0].value,
    notes: "",
    items: [],
    total_amount: 0,
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  // Получить клиентов и товары при открытии
  useEffect(() => {
    if (isOpen) {
      fetch(`${BASE_URL}/api/clients/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(res => setClients(res.data || []))
        .catch((err) => console.error("Ошибка загрузки клиентов:", err));

      fetch(`${BASE_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(res => setProducts(res.data || []))
        .catch((err) => console.error("Ошибка загрузки продуктов:", err));
    }
  }, [isOpen, token]);

  // Когда меняется order, обновить форму
  useEffect(() => {
    if (order) {
      setForm({
        client_full_name: order.client_full_name ?? "",
        status: order.status ?? STATUS_OPTIONS[0].value,
        payment_status: order.payment_status ?? PAYMENT_OPTIONS[0].value,
        payment_type: order.payment_type ?? PAYMENT_TYPE_OPTIONS[0].value,
        notes: order.notes ?? "",
        items: order.items ?? [],
        total_amount: order.total_amount ?? 0,
      });
    }
  }, [order]);

  // Пересчитывать сумму при изменении товаров
  useEffect(() => {
    const total = form.items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [form.items]);

  // Изменения в форме
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Товары
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

  // Добавить товар
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

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        client_full_name: form.client_full_name,
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
      await onSubmit({ ...payload, id: order.id });
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(6, 182, 212, 0.3)' }}>
        
        {/* Декоративные неоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
        {/* Заголовок */}
        <div className="relative bg-gray-800/50 border-b border-gray-700/50 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gray-800 border-2 border-cyan-400 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Edit3 className="text-cyan-400 w-5 h-5" 
                           style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
                    <ShoppingCart className="text-emerald-400 w-4 h-4" 
                                  style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}>
                  {t("edit_order")}
                </h2>
                <p className="text-cyan-400 text-sm mt-1">
                  {t("order_editing")}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-gray-800 border border-red-400/50 p-3 rounded-2xl transition-all duration-300 hover:border-red-400 hover:scale-110 group"
              style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}
            >
              <X className="w-6 h-6 text-red-400 group-hover:rotate-90 transition-transform duration-300" 
                 style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
            </button>
          </div>
        </div>
        
        {/* Содержимое формы */}
        <div className="px-8 py-6 relative z-10 overflow-y-auto max-h-[calc(95vh-120px)]">
          
          {/* Информация о заказе */}
          {order && (
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"
                     style={{ boxShadow: '0 0 8px #06b6d4' }}></div>
                <div>
                  <p className="text-gray-400 text-sm">{t("editing_order")}</p>
                  <p className="text-white font-semibold">#{order.id}</p>
                  {order.client_full_name && (
                    <p className="text-cyan-400 text-xs">
                      {t("client_colon")} {order.client_full_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Клиент */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <User className="inline w-4 h-4 mr-2 text-cyan-400" 
                        style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                  {t("select_client")} <span className="text-cyan-400">*</span>
                </label>
                <CustomDropdown
                  options={clients.map((c) => ({ value: c.id, label: c.name }))}
                  value={form.client_id}
                  onChange={(v) => handleChange("client_id", v)}
                  placeholder="select_client"
                  t={t}
                  icon={User}
                  iconColor="text-cyan-400"
                />
              </div>

              {/* Статус */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <CheckCircle className="inline w-4 h-4 mr-2 text-emerald-400" 
                               style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  {t("status")}
                </label>
                <CustomDropdown
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={(v) => handleChange("status", v)}
                  placeholder="status"
                  t={t}
                  icon={CheckCircle}
                  iconColor="text-emerald-400"
                />
              </div>

              {/* Статус оплаты */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <DollarSign className="inline w-4 h-4 mr-2 text-purple-400" 
                              style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                  {t("payment_status")}
                </label>
                <CustomDropdown
                  options={PAYMENT_OPTIONS}
                  value={form.payment_status}
                  onChange={(v) => handleChange("payment_status", v)}
                  placeholder="payment_status"
                  t={t}
                  icon={DollarSign}
                  iconColor="text-purple-400"
                />
              </div>

              {/* Тип оплаты */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <CreditCard className="inline w-4 h-4 mr-2 text-amber-400" 
                              style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                  {t("payment_type")}
                </label>
                <CustomDropdown
                  options={PAYMENT_TYPE_OPTIONS}
                  value={form.payment_type}
                  onChange={(v) => handleChange("payment_type", v)}
                  placeholder="payment_type"
                  t={t}
                  icon={CreditCard}
                  iconColor="text-amber-400"
                />
              </div>
            </div>

            {/* Заметки */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Hash className="inline w-4 h-4 mr-2 text-indigo-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #6366f1)' }} />
                {t("note")}
              </label>
              <input
                type="text"
                name="notes"
                placeholder={t("note")}
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-indigo-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.notes ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Товары */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" 
                           style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  {t("products")}
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/50 text-emerald-400 px-4 py-2 rounded-xl hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 flex items-center gap-2"
                  style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}
                >
                  <Plus size={16} /> {t("add_product")}
                </button>
              </div>
              
              <div className="space-y-4">
                {form.items.map((item, i) => (
                  <div key={i} className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                      
                      {/* Продукт */}
                      <div className="lg:col-span-2">
                        <label className="block text-gray-400 text-xs font-medium mb-2">
                          {t("product")}
                        </label>
                        <CustomDropdown
                          options={products.map((p) => ({
                            value: p.id,
                            label: p.name,
                          }))}
                          value={item.product_id}
                          onChange={(v) => handleItemChange(i, "product_id", v)}
                          placeholder="product"
                          t={t}
                          icon={Package}
                          iconColor="text-emerald-400"
                        />
                      </div>

                      {/* Количество */}
                      <div>
                        <label className="block text-gray-400 text-xs font-medium mb-2">
                          {t("quantity")}
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) =>
                            handleItemChange(i, "quantity", e.target.value)
                          }
                          className="w-full bg-gray-800/50 border border-gray-600/50 text-white px-3 py-3 rounded-xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                          placeholder={t("quantity")}
                        />
                      </div>

                      {/* Цена */}
                      <div>
                        <label className="block text-gray-400 text-xs font-medium mb-2">
                          {t("price")}
                        </label>
                        <input
                          type="number"
                          value={item.price}
                          readOnly
                          className="w-full bg-gray-700/50 border border-gray-600/30 text-gray-400 px-3 py-3 rounded-xl cursor-not-allowed"
                          placeholder={t("price")}
                        />
                      </div>

                      {/* Сумма и удаление */}
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-gray-400 text-xs font-medium mb-2">
                            {t("total")}
                          </label>
                          <div className="text-red-400 font-semibold text-lg py-3">
                            {(item.quantity * item.price).toLocaleString()}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="bg-red-500/20 border border-red-400/50 text-red-400 p-3 rounded-xl hover:bg-red-500/30 transition-all duration-300"
                          title={t("remove")}
                          style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Итоговая сумма */}
            <div className="bg-gray-800/30 border border-cyan-400/30 rounded-2xl p-6"
                 style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)' }}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-white">
                  {t("total_amount")}:
                </div>
                <div className="text-2xl font-bold text-cyan-400"
                     style={{ textShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}>
                  {form.total_amount.toLocaleString()} сум
                </div>
              </div>
            </div>

            {/* Кнопка сохранения */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:from-cyan-600 hover:to-emerald-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              style={{ 
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
                filter: isLoading ? 'none' : 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))'
              }}
            >
              {/* Анимированный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{t("save_changes")}</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default EditOrderModal;