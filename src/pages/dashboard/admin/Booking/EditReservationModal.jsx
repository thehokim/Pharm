import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Edit3, Users, AlertTriangle, Package, DollarSign, FileText, Save, Clock, CheckCircle, XCircle } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const STATUS_OPTIONS = [
  { 
    value: "pending", 
    labelKey: "editReservation.statuses.pending",
    color: "text-amber-400",
    bg: "bg-amber-900/20",
    border: "border-amber-400/30",
    icon: Clock,
    glow: "#f59e0b"
  },
  { 
    value: "confirmed", 
    labelKey: "editReservation.statuses.confirmed",
    color: "text-cyan-400",
    bg: "bg-cyan-900/20",
    border: "border-cyan-400/30",
    icon: CheckCircle,
    glow: "#06b6d4"
  },
  { 
    value: "cancelled", 
    labelKey: "editReservation.statuses.cancelled",
    color: "text-red-400",
    bg: "bg-red-900/20",
    border: "border-red-400/30",
    icon: XCircle,
    glow: "#ef4444"
  },
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
  const [productDropdowns, setProductDropdowns] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
        .catch((err) => console.error(t("error_loading_clients"), err));

      fetch(`${BASE_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => setProducts(res.data || []))
        .catch((err) => console.error(t("error_loading_products"), err));
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

  const handleSubmit = async () => {
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !reservation) return null;

  const currentStatus = STATUS_OPTIONS.find(opt => opt.value === form.status) || STATUS_OPTIONS[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-hidden"
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
                  <Edit3 className="text-cyan-400 w-6 h-6" 
                         style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}>
                  {t("editReservation.title")}
                </h2>
                <p className="text-cyan-400 text-sm mt-1">
                  {t("editing_patient_record")}
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
        <div className="px-8 py-6 flex-1 overflow-y-auto relative z-10 max-h-[calc(95vh-120px)]">
          <div className="space-y-8">
            
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Клиент (dropdown) */}
              <div className="relative" ref={clientRef}>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <Users className="inline w-4 h-4 mr-2 text-emerald-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  {t("editReservation.client_full_name")}
                </label>
                <button
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white px-4 py-4 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-300 flex items-center justify-between group"
                  style={{ 
                    boxShadow: form.client_full_name ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                  onClick={() => setClientDropdown((v) => !v)}
                >
                  <span className="font-medium">
                    {form.client_full_name || (
                      <span className="text-gray-500">
                        {t("select_client")}
                      </span>
                    )}
                  </span>
                  <ChevronDown className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </button>
                
                {clientDropdown && (
                  <div className="absolute left-0 right-0 mt-2 z-30 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl py-2 max-h-56 overflow-auto"
                       style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors duration-300 flex items-center gap-3 ${
                          form.client_id === client.id
                            ? "bg-emerald-900/30 text-emerald-400 font-semibold"
                            : "text-white"
                        }`}
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"
                             style={{ boxShadow: '0 0 8px #10b981' }}></div>
                        {client.name || client.client_full_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Статус (dropdown) */}
              <div className="relative" ref={statusRef}>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <AlertTriangle className="inline w-4 h-4 mr-2 text-amber-400" 
                                 style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                  {t("editReservation.status")}
                </label>
                <button
                  className={`w-full bg-gray-800/50 border px-4 py-4 rounded-2xl focus:outline-none transition-all duration-300 flex items-center justify-between group ${currentStatus.border}`}
                  style={{ 
                    boxShadow: `0 0 15px ${currentStatus.glow}20`
                  }}
                  onClick={() => setStatusDropdown((v) => !v)}
                >
                  <div className="flex items-center gap-3">
                    <currentStatus.icon className={`w-4 h-4 ${currentStatus.color}`} 
                                      style={{ filter: `drop-shadow(0 0 8px ${currentStatus.glow})` }} />
                    <span className={`font-medium ${currentStatus.color}`}>
                      {t(currentStatus.labelKey)}
                    </span>
                  </div>
                  <ChevronDown className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
                
                {statusDropdown && (
                  <div className="absolute left-0 right-0 mt-2 z-30 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl py-2">
                    {STATUS_OPTIONS.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleStatusSelect(option.value)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-3 ${
                            form.status === option.value ? option.bg : ''
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 ${option.color}`} 
                                        style={{ filter: `drop-shadow(0 0 8px ${option.glow})` }} />
                          <span className={`font-medium ${option.color}`}>
                            {t(option.labelKey)}
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
                  {t("editReservation.sum")}
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
                  {t("editReservation.notes")}
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
                Препараты в назначении
              </label>
              
              {/* Заголовки колонок */}
              <div className="grid grid-cols-3 gap-6 text-xs text-gray-500 font-medium px-4">
                <div>Препарат</div>
                <div>Количество</div>
                <div>Цена</div>
              </div>
              
              {/* Список товаров */}
              <div className="space-y-4">
                {form.items.map((item, index) => (
                  <div key={index} 
                       className="grid grid-cols-3 gap-6 bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4 hover:border-gray-600/50 transition-all duration-300">
                    
                    {/* Product dropdown */}
                    <div className="relative" id={`product-dropdown-${index}`}>
                      <button
                        className="w-full bg-gray-800/50 border border-gray-600/50 text-white px-4 py-3 rounded-xl flex justify-between items-center hover:border-emerald-400/50 transition-all duration-300"
                        onClick={() => toggleProductDropdown(index)}
                      >
                        <span className="text-sm">
                          {products.find((p) => p.id === Number(item.product_id))?.name || 
                           "Выберите препарат"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {productDropdowns[index] && (
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
                    <input
                      type="number"
                      placeholder="Кол-во"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                    
                    {/* Price */}
                    <input
                      type="number"
                      placeholder="Цена"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка сохранения */}
            <button
              onClick={handleSubmit}
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
                    <span>{t("editReservation.save")}</span>
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

export default EditReservationModal;