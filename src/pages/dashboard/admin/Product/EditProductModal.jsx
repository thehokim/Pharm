import React, { useEffect, useRef, useState } from "react";
import { X, ChevronDown, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import DatePicker from "./DatePicker";
import { BASE_URL } from "../../../../utils/auth";

const CATEGORY_OPTIONS = [
  { value: "medicine", label: "category.medicine" },
  { value: "other", label: "category.other" }, // хозяйственные товары
];

const EditProductModal = ({ isOpen, onClose, product, onSubmit }) => {
  const { t } = useTranslation("product");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      supplier_id: Number(form.supplier_id),
      purchase_price: Number(form.purchase_price),
      stock_quantity: Number(form.stock_quantity),
      ...(form.selling_price && { selling_price: Number(form.selling_price) }),
      ...(form.expiration_date && { expiration_date: form.expiration_date }),
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  const selectedSupplier = suppliers.find(
    (s) => s.id === Number(form.supplier_id)
  );

  const selectedCategory = CATEGORY_OPTIONS.find(
    (c) => c.value === form.category
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl border border-gray-200 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold mb-7 text-gray-800">
          {t("edit_product")}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <label className="text-sm text-gray-700 font-medium">{t("name")} <span className="text-red-500">*</span></label>
            <input
              name="name"
              placeholder={t("name")}
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          {/* Категория dropdown */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1 relative" ref={categoryRef}>
            <label className="text-sm text-gray-700 font-medium">{t("category")} <span className="text-red-500">*</span></label>
            <button
              type="button"
              className={`flex items-center justify-between px-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 outline-none transition text-gray-700 ${!selectedCategory ? "text-gray-400" : ""}`}
              onClick={() => setCategoryOpen((v) => !v)}
            >
              <span>
                {selectedCategory ? t(selectedCategory.label) : t("select_category")}
              </span>
              <ChevronDown className="ml-2 text-gray-400" size={20} />
            </button>
            {categoryOpen && (
              <div className="absolute left-0 right-0 top-18 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition ${form.category === opt.value ? "bg-blue-50 text-blue-700 font-semibold" : ""}`}
                    onClick={() => handleCategorySelect(opt.value)}
                  >
                    {t(opt.label)}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Barcode */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <label className="text-sm text-gray-700 font-medium">{t("barcode")}</label>
            <input
              name="barcode"
              placeholder={t("barcode")}
              value={form.barcode}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          {/* QR code */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <label className="text-sm text-gray-700 font-medium">{t("qr_code")}</label>
            <input
              name="qr_code"
              placeholder={t("qr_code")}
              value={form.qr_code}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          {/* Описание */}
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-700 font-medium">{t("description")}</label>
            <textarea
              name="description"
              placeholder={t("description")}
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none h-11"
            />
          </div>
          {/* Поставщик dropdown */}
          <div className="col-span-2 flex flex-col gap-2 relative" ref={supplierRef}>
            <label className="text-sm text-gray-700 font-medium">{t("supplier")} <span className="text-red-500">*</span></label>
            <button
              type="button"
              onClick={() => setSupplierOpen((v) => !v)}
              className={`flex items-center justify-between px-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 outline-none transition text-gray-700 ${!selectedSupplier ? "text-gray-400" : ""}`}
            >
              <span>
                {suppliersLoading
                  ? t("suppliers_loading")
                  : suppliersError
                  ? t("suppliers_error")
                  : selectedSupplier
                  ? selectedSupplier.name
                  : t("select_supplier")}
              </span>
              <ChevronDown className="ml-2 text-gray-400" size={20} />
            </button>
            {supplierOpen && (
              <div className="absolute left-0 right-0 top-18 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                {suppliersLoading && (
                  <div className="flex justify-center py-3 text-gray-400">
                    <Loader className="animate-spin mr-2" /> {t("suppliers_loading")}
                  </div>
                )}
                {suppliersError && (
                  <div className="px-4 py-2 text-red-500">{t("suppliers_error")}</div>
                )}
                {!suppliersLoading && !suppliersError && suppliers.length === 0 && (
                  <div className="px-4 py-2 text-gray-400">{t("no_suppliers")}</div>
                )}
                {!suppliersLoading &&
                  suppliers.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`w-full px-4 py-2 text-left hover:bg-indigo-50 rounded-lg transition-colors ${
                        form.supplier_id === String(s.id)
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-700"
                      }`}
                      onClick={() => handleSupplierSelect(s.id)}
                    >
                      {s.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
          {/* Purchase Price */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <label className="text-sm text-gray-700 font-medium">{t("purchase_price")} <span className="text-red-500">*</span></label>
            <input
              name="purchase_price"
              type="number"
              placeholder={t("purchase_price")}
              value={form.purchase_price}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          {/* Selling Price: only if medicine */}
          {form.category !== "other" && (
            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
              <label className="text-sm text-gray-700 font-medium">{t("selling_price")}</label>
              <input
                name="selling_price"
                type="number"
                placeholder={t("selling_price")}
                value={form.selling_price}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
              />
            </div>
          )}
          {/* Stock Quantity */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <label className="text-sm text-gray-700 font-medium">{t("stock_quantity")} <span className="text-red-500">*</span></label>
            <input
              name="stock_quantity"
              type="number"
              placeholder={t("stock_quantity")}
              value={form.stock_quantity}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          {/* Expiration Date: only if medicine */}
          {form.category !== "other" && (
            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
              <label className="text-sm text-gray-700 font-medium">{t("expiration_date")}</label>
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
          <button
            type="submit"
            className="col-span-2 mt-3 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg text-base"
          >
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
