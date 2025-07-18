import React, { useEffect, useRef, useState } from "react";
import { X, ChevronDown, Loader, Edit3, Package, Pill, Hash, DollarSign, Calendar, User, Barcode, AlignLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../../utils/auth";
import DatePicker from "./DatePicker";

const CATEGORY_OPTIONS = [
  { value: "medicine", label: "category.medicine" },
  { value: "other", label: "category.other" },
];



const EditProductModal = ({ isOpen, onClose, product, onSubmit }) => {
  const { t } = useTranslation("product");
  const [isLoading, setIsLoading] = useState(false);

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

  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [suppliersError, setSuppliersError] = useState("");
  const token = localStorage.getItem("token");

  const [supplierOpen, setSupplierOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const supplierRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setSuppliersLoading(true);
    setSuppliersError("");
    fetch(`${BASE_URL}/api/suppliers/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(t("suppliers_error"));
        return r.json();
      })
      .then((res) => setSuppliers(res.data || [])) // ВАЖНО!!!
      .catch((e) => setSuppliersError(e.message))
      .finally(() => setSuppliersLoading(false));
  }, [isOpen, token, t]);

  // Сброс скрытых полей если категория = other
  useEffect(() => {
    if (form.category === "other") {
      setForm((prev) => ({
        ...prev,
        selling_price: "",
        expiration_date: "",
      }));
    }
  }, [form.category]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        barcode: product.barcode || "",
        qr_code: product.qr_code || "",
        category: product.category || "",
        supplier_id: product.supplier_id?.toString() || "",
        purchase_price: product.purchase_price || "",
        selling_price: product.selling_price || "",
        stock_quantity: product.stock_quantity || "",
        expiration_date: product.expiration_date?.slice(0, 10) || "",
      });
    }
  }, [product]);

  useEffect(() => {
    if (!supplierOpen) return;
    const handleClick = (e) => {
      if (supplierRef.current && !supplierRef.current.contains(e.target)) {
        setSupplierOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [supplierOpen]);

  useEffect(() => {
    if (!categoryOpen) return;
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [categoryOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSupplierSelect = (id) => {
    setForm((prev) => ({ ...prev, supplier_id: id }));
    setSupplierOpen(false);
  };

  const handleCategorySelect = (value) => {
    setForm((prev) => ({ ...prev, category: value }));
    setCategoryOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        supplier_id: Number(form.supplier_id),
        purchase_price: Number(form.purchase_price),
        stock_quantity: Number(form.stock_quantity),
        ...(form.selling_price && { selling_price: Number(form.selling_price) }),
        ...(form.expiration_date && { expiration_date: form.expiration_date }),
      };
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
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

  const selectedSupplier = suppliers.find(
    (s) => s.id === Number(form.supplier_id)
  );

  const selectedCategory = CATEGORY_OPTIONS.find(
    (c) => c.value === form.category
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl w-full max-w-2xl overflow-x-auto max-h-[95vh]"
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
                  <div className="flex items-center gap-2">
                    <Edit3 className="text-emerald-400 w-5 h-5" 
                           style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                    <Package className="text-cyan-400 w-4 h-4" 
                             style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                  {t("edit_product")}
                </h2>
                <p className="text-emerald-400 text-sm mt-1">
                  {t("edit_product_desc")}
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
          
          {/* Информация о продукте */}
          {product && (
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"
                     style={{ boxShadow: '0 0 8px #10b981' }}></div>
                <div>
                  <p className="text-gray-400 text-sm">{t("edit_product")}</p>
                  <p className="text-white font-semibold">{product.name}</p>
                  {product.category && (
                    <p className="text-emerald-400 text-xs">
                      {product.category === 'medicine' ? t('category.medicine') : t('category.other')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Название */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Package className="inline w-4 h-4 mr-2 text-emerald-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                {t("name")} <span className="text-emerald-400">*</span>
              </label>
              <input
                name="name"
                placeholder={t("name")}
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.name ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Категория */}
            <div className="relative" ref={categoryRef}>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Pill className="inline w-4 h-4 mr-2 text-purple-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                {t("category")} <span className="text-emerald-400">*</span>
              </label>
              <button
                type="button"
                className={`w-full bg-gray-800/50 border border-gray-600/50 text-white px-4 py-4 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 flex items-center justify-between group ${!selectedCategory ? "text-gray-500" : ""}`}
                onClick={() => setCategoryOpen((v) => !v)}
                style={{ 
                  boxShadow: selectedCategory ? '0 0 15px rgba(168, 85, 247, 0.2)' : 'none'
                }}
              >
                <span className="font-medium">
                  {selectedCategory ? t(selectedCategory.label) : t("select_category")}
                </span>
                <ChevronDown className="text-gray-400 group-hover:text-white transition-colors" />
              </button>
              
              {categoryOpen && (
                <div className="absolute z-30 top-full mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl w-full shadow-2xl py-2 max-h-40 overflow-y-auto animate-fadeIn"
                     style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)' }}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-300 text-white ${form.category === opt.value ? "bg-purple-900/20 text-purple-400 font-semibold" : ""}`}
                      onClick={() => handleCategorySelect(opt.value)}
                    >
                      {t(opt.label)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Баркод */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Barcode className="inline w-4 h-4 mr-2 text-cyan-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                {t("barcode")}
              </label>
              <input
                name="barcode"
                placeholder={t("barcode")}
                value={form.barcode}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.barcode ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none'
                }}
              />
            </div>
            
            {/* QR код */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Hash className="inline w-4 h-4 mr-2 text-indigo-400" 
                       style={{ filter: 'drop-shadow(0 0 8px #6366f1)' }} />
                {t("qr_code")}
              </label>
              <input
                name="qr_code"
                placeholder={t("qr_code")}
                value={form.qr_code}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-indigo-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.qr_code ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Описание */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <AlignLeft className="inline w-4 h-4 mr-2 text-gray-400" />
                {t("description")}
              </label>
              <textarea
                name="description"
                placeholder={t("description")}
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-gray-400 focus:outline-none transition-all duration-300 resize-none"
                style={{ 
                  boxShadow: form.description ? '0 0 15px rgba(156, 163, 175, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Поставщик */}
            <div className="md:col-span-2 relative" ref={supplierRef}>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <User className="inline w-4 h-4 mr-2 text-amber-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                {t("supplier")} <span className="text-emerald-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setSupplierOpen((v) => !v)}
                className={`w-full bg-gray-800/50 border border-gray-600/50 text-white px-4 py-4 rounded-2xl focus:border-amber-400 focus:outline-none transition-all duration-300 flex items-center justify-between group ${!selectedSupplier ? "text-gray-500" : ""}`}
                style={{ 
                  boxShadow: selectedSupplier ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none'
                }}
              >
                <span className="font-medium">
                  {suppliersLoading
                    ? t("suppliers_loading")
                    : suppliersError
                    ? t("suppliers_error")
                    : selectedSupplier
                    ? selectedSupplier.name
                    : t("select_supplier")}
                </span>
                <ChevronDown className="text-gray-400 group-hover:text-white transition-colors" />
              </button>
              
              {supplierOpen && (
                <div className="absolute z-30 top-full mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl w-full shadow-2xl py-2 max-h-52 overflow-y-auto animate-fadeIn"
                     style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)' }}>
                  {suppliersLoading && (
                    <div className="flex justify-center py-4 text-amber-400">
                      <Loader className="animate-spin mr-2 w-4 h-4" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} /> 
                      {t("suppliers_loading")}
                    </div>
                  )}
                  {suppliersError && (
                    <div className="px-4 py-3 text-red-400 font-medium">{t("suppliers_error")}</div>
                  )}
                  {!suppliersLoading && !suppliersError && suppliers.length === 0 && (
                    <div className="px-4 py-3 text-gray-400">{t("no_suppliers")}</div>
                  )}
                  {!suppliersLoading &&
                    suppliers.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-300 text-white ${
                          form.supplier_id === String(s.id)
                            ? "bg-amber-900/20 text-amber-400 font-semibold"
                            : ""
                        }`}
                        onClick={() => handleSupplierSelect(s.id)}
                      >
                        {s.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Цена закупки */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <DollarSign className="inline w-4 h-4 mr-2 text-red-400" 
                           style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                {t("purchase_price")} <span className="text-emerald-400">*</span>
              </label>
              <input
                name="purchase_price"
                type="number"
                placeholder={t("purchase_price")}
                value={form.purchase_price}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-red-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.purchase_price ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Цена продажи: только если лекарство */}
            {form.category !== "other" && (
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <DollarSign className="inline w-4 h-4 mr-2 text-green-400" 
                             style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  {t("selling_price")}
                </label>
                <input
                  name="selling_price"
                  type="number"
                  placeholder={t("selling_price")}
                  value={form.selling_price}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300"
                  style={{ 
                    boxShadow: form.selling_price ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                />
              </div>
            )}

            {/* Количество на складе */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Hash className="inline w-4 h-4 mr-2 text-yellow-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #eab308)' }} />
                {t("stock_quantity")} <span className="text-emerald-400">*</span>
              </label>
              <input
                name="stock_quantity"
                type="number"
                placeholder={t("stock_quantity")}
                value={form.stock_quantity}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-yellow-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.stock_quantity ? '0 0 15px rgba(234, 179, 8, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Срок годности: только если лекарство */}
            {form.category !== "other" && (
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  <Calendar className="inline w-4 h-4 mr-2 text-blue-400" 
                            style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} />
                  {t("expiration_date")}
                </label>
                <DatePicker
                  value={form.expiration_date}
                  onChange={(date) =>
                    setForm((prev) => ({
                      ...prev,
                      expiration_date: date,
                    }))
                  }
                />
              </div>
            )}
          </div>

          {/* Кнопка сохранения */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-8 relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
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
                  <Package className="w-5 h-5" />
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

export default EditProductModal;