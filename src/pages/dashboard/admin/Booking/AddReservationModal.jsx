import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Plus, Minus, Calendar, Users, Package, DollarSign, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const STATUS_OPTIONS = [
  {
    value: "pending",
    color: "text-amber-400",
    dot: "bg-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-900/20",
    glow: "#f59e0b",
    icon: Clock
  },
  {
    value: "confirmed",
    color: "text-cyan-400",
    dot: "bg-cyan-400",
    border: "border-cyan-400/30",
    bg: "bg-cyan-900/20",
    glow: "#06b6d4",
    icon: CheckCircle
  },
  {
    value: "cancelled",
    color: "text-red-400",
    dot: "bg-red-400",
    border: "border-red-400/30",
    bg: "bg-red-900/20",
    glow: "#ef4444",
    icon: XCircle
  },
  {
    value: "completed",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-900/20",
    glow: "#10b981",
    icon: CheckCircle
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
  const [isLoading, setIsLoading] = useState(false);
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
        .catch((err) => console.error(t("error_loading_clients"), err));

      fetch(`${BASE_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => setProducts(res.data || []))
        .catch((err) => console.error(t("error_loading_products"), err));
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

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const payload = {
      ...form,
      client_id: Number(form.client_id),
      client_full_name: form.client_full_name, // не нужен на сервере
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

      if (!response.ok) throw new Error(t("error_creating_reservation"));

      onAdd();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const statusObj = STATUS_OPTIONS.find((s) => s.value === form.status);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl flex flex-col max-h-[92vh] overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)' }}>
        
        {/* Декоративные неоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
        {/* Заголовок */}
        <div className="relative bg-gray-800/50 border-b border-gray-700/50 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gray-800 border-2 border-emerald-400 p-3 rounded-2xl">
                  <Calendar className="text-emerald-400 w-6 h-6" 
                           style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                  {t("reservation.add")}
                </h2>
                <p className="text-emerald-400 text-sm mt-1">
                  {t("new_patient_record")}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-gray-800 border border-red-400/50 p-3 rounded-2xl transition-all duration-300 hover:border-red-400 hover:scale-110 group"
              style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}
              type="button"
            >
              <X className="w-6 h-6 text-red-400 group-hover:rotate-90 transition-transform duration-300" 
                 style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
            </button>
          </div>
        </div>
        
        {/* Содержимое формы */}
        <div className="px-8 py-6 flex-1 overflow-y-auto relative z-10">
          <div className="space-y-8">
            
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Клиент (dropdown) */}
              <div className="relative" ref={clientRef}>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <Users className="inline w-4 h-4 mr-2 text-emerald-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  {t("reservation.client_full_name")}
                </label>
                <button
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white px-4 py-4 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-300 flex items-center justify-between group"
                  style={{ 
                    boxShadow: form.client_full_name ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                  onClick={() => setClientOpen((v) => !v)}
                >
                  <span className="font-medium">
                    {form.client_full_name || (
                      <span className="text-gray-500">
                        {t("select_patient")}
                      </span>
                    )}
                  </span>
                  <ChevronDown className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </button>
                
                {clientOpen && (
                  <div className="absolute left-0 top-full mt-2 z-30 w-full bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl py-2 max-h-60 overflow-auto"
                       style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>
                    {clients.length === 0 ? (
                      <div className="px-4 py-3 text-gray-400 text-center">
                        {t("no_clients")}
                      </div>
                    ) : (
                      clients.map((client) => (
                        <button
                          key={client.id}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-700/50 transition-colors duration-300 flex items-center gap-3"
                          onClick={() => handleClientChange(client)}
                        >
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"
                               style={{ boxShadow: '0 0 8px #10b981' }}></div>
                          {client.name || client.client_full_name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Статус (dropdown) */}
              <div className="relative" ref={statusRef}>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <AlertTriangle className="inline w-4 h-4 mr-2 text-amber-400" 
                                 style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                  {t("reservation.status")}
                </label>
                <button
                  className={`w-full bg-gray-800/50 border px-4 py-4 rounded-2xl focus:outline-none transition-all duration-300 flex items-center justify-between group ${statusObj?.border}`}
                  style={{ 
                    boxShadow: `0 0 15px ${statusObj?.glow}20`
                  }}
                  onClick={() => setStatusOpen((v) => !v)}
                >
                  <div className="flex items-center gap-3">
                    {statusObj?.icon && (
                      <statusObj.icon className={`w-4 h-4 ${statusObj.color}`} 
                                      style={{ filter: `drop-shadow(0 0 8px ${statusObj.glow})` }} />
                    )}
                    <span className={`font-medium ${statusObj?.color}`}>
                      {t(`reservation.statuses.${statusObj?.value}`)}
                    </span>
                  </div>
                  <ChevronDown className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
                
                {statusOpen && (
                  <div className="absolute left-0 top-full mt-2 z-30 w-full bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl py-2">
                    {STATUS_OPTIONS.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-3 ${
                            form.status === option.value ? option.bg : ''
                          }`}
                          onClick={() => handleStatusChange(option.value)}
                        >
                          <IconComponent className={`w-4 h-4 ${option.color}`} 
                                        style={{ filter: `drop-shadow(0 0 8px ${option.glow})` }} />
                          <span className={`font-medium ${option.color}`}>
                            {t(`reservation.statuses.${option.value}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Общая сумма */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <DollarSign className="inline w-4 h-4 mr-2 text-cyan-400" 
                             style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                  {t("reservation.total")}
                </label>
                <input
                  type="number"
                  name="total_amount"
                  placeholder={t("enter_amount")}
                  value={form.total_amount}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                  style={{ 
                    boxShadow: form.total_amount ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none'
                  }}
                />
              </div>

              {/* Описание */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <FileText className="inline w-4 h-4 mr-2 text-purple-400" 
                            style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                  {t("reservation.notes")}
                </label>
                <textarea
                  name="notes"
                  placeholder="Дополнительные заметки"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 h-15 resize-none"
                  style={{ 
                    boxShadow: form.notes ? '0 0 15px rgba(168, 85, 247, 0.2)' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Товары */}
            <div className="space-y-4">
              <label className="block text-gray-400 text-sm font-medium">
                <Package className="inline w-4 h-4 mr-2 text-emerald-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                {t("reservation.products")}
              </label>
              
              {/* Заголовки колонок */}
              <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 font-medium px-4">
                <div className="col-span-5">Препарат</div>
                <div className="col-span-3">Количество</div>
                <div className="col-span-3">Цена</div>
                <div className="col-span-1">Действие</div>
              </div>
              
              {/* Список товаров */}
              <div className="space-y-4">
                {form.items.map((item, index) => (
                  <div key={index} 
                       className="grid grid-cols-12 gap-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4 hover:border-gray-600/50 transition-all duration-300">
                    
                    {/* Product dropdown */}
                    <div className="col-span-5 relative" id={`product-dropdown-${index}`}>
                      <button
                        className="w-full bg-gray-800/50 border border-gray-600/50 text-white px-4 py-3 rounded-xl flex justify-between items-center hover:border-emerald-400/50 transition-all duration-300"
                        onClick={() => handleProductDropdown(index)}
                      >
                        <span className="text-sm">
                          {products.find((p) => p.id === Number(item.product_id))?.name || 
                           "Выберите препарат"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {item.productDropdown && (
                        <div className="absolute left-0 top-full mt-2 z-40 w-full bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl max-h-48 overflow-auto">
                          {products.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleItemChange(index, "product_id", product.id)}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors text-sm ${
                                product.id === item.product_id
                                  ? "bg-emerald-900/30 text-emerald-400 font-semibold"
                                  : "text-white"
                              }`}
                            >
                              {product.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Кол-во"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    
                    {/* Price */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Цена"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    
                    {/* Remove button */}
                    <div className="col-span-1 flex items-center justify-center">
                      {form.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="bg-red-900/30 border border-red-400/30 text-red-400 p-2 rounded-xl hover:bg-red-900/50 hover:scale-110 transition-all duration-300"
                          style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)' }}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Добавить товар */}
              <button
                onClick={addItem}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300 mt-4"
              >
                <Plus className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                {t("reservation.addProduct")}
              </button>
            </div>

            {/* Кнопка сохранения */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              style={{ 
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                filter: isLoading ? 'none' : 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))'
              }}
            >
              {/* Анимированный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{t("reservation.save")}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReservationModal;