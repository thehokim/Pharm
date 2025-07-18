import React, { useEffect, useState } from "react";
import { X, Edit3, Truck, User, Phone, Mail, MapPin, DollarSign, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditSupplierModal = ({ isOpen, onClose, supplier, onSubmit }) => {
  const { t } = useTranslation("supplier");
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phones: "",
    email: "",
    address: "",
    debt: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || "",
        contact_person: supplier.contact_person || "",
        phones: supplier.phones || "",
        email: supplier.email || "",
        address: supplier.address || "",
        debt: supplier.debt || 0,
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        debt: Number(form.debt),
      };
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error(t("error_updating_supplier"), error);
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-orange-400/30 rounded-3xl w-full max-w-2xl overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(249, 115, 22, 0.3)' }}>
        
        {/* Декоративные неоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
        {/* Заголовок */}
        <div className="relative bg-gray-800/50 border-b border-gray-700/50 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400 rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gray-800 border-2 border-orange-400 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Edit3 className="text-orange-400 w-5 h-5" 
                           style={{ filter: 'drop-shadow(0 0 10px #f97316)' }} />
                    <Truck className="text-amber-400 w-4 h-4" 
                           style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 15px rgba(249, 115, 22, 0.5)' }}>
                  {t("edit_supplier")}
                </h2>
                <p className="text-orange-400 text-sm mt-1">
                  {t("edit_supplier_desc")}
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
        <div className="px-8 py-6 relative z-10">
          
          {/* Информация о поставщике */}
          {supplier && (
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"
                     style={{ boxShadow: '0 0 8px #f97316' }}></div>
                <div>
                  <p className="text-gray-400 text-sm">{t("edit_supplier")}</p>
                  <p className="text-white font-semibold">{supplier.name}</p>
                  {supplier.contact_person && (
                    <p className="text-orange-400 text-xs">
                      {t("contact_colon")} {supplier.contact_person}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Название поставщика */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Truck className="inline w-4 h-4 mr-2 text-orange-400" 
                       style={{ filter: 'drop-shadow(0 0 8px #f97316)' }} />
                {t("name")} <span className="text-orange-400">*</span>
              </label>
              <input
                name="name"
                placeholder={t("name")}
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-orange-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.name ? '0 0 15px rgba(249, 115, 22, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Контактное лицо */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <User className="inline w-4 h-4 mr-2 text-cyan-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                {t("contact_person")}
              </label>
              <input
                name="contact_person"
                placeholder={t("contact_person")}
                value={form.contact_person}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.contact_person ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Телефоны */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Phone className="inline w-4 h-4 mr-2 text-emerald-400" 
                       style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                {t("phones")}
              </label>
              <input
                name="phones"
                placeholder={t("phones")}
                value={form.phones}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.phones ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Mail className="inline w-4 h-4 mr-2 text-purple-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.email ? '0 0 15px rgba(168, 85, 247, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Адрес */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <MapPin className="inline w-4 h-4 mr-2 text-indigo-400" 
                        style={{ filter: 'drop-shadow(0 0 8px #6366f1)' }} />
                {t("address")}
              </label>
              <input
                name="address"
                placeholder={t("address")}
                value={form.address}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-indigo-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.address ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Задолженность */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <DollarSign className="inline w-4 h-4 mr-2 text-red-400" 
                           style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                {t("debt")}
              </label>
              <input
                name="debt"
                type="number"
                placeholder={t("debt")}
                value={form.debt}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-red-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.debt ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none'
                }}
              />
            </div>
          </div>

          {/* Кнопка сохранения */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-8 relative bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:from-orange-600 hover:to-amber-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            style={{ 
              boxShadow: '0 0 30px rgba(249, 115, 22, 0.3)',
              filter: isLoading ? 'none' : 'drop-shadow(0 0 15px rgba(249, 115, 22, 0.5))'
            }}
          >
            {/* Анимированный фон */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{t("save")}</span>
                </>
              )}
            </div>
          </button>
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

export default EditSupplierModal;