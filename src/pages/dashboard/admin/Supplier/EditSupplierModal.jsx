import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditSupplierModal = ({ isOpen, onClose, supplier, onSubmit }) => {
  const { t } = useTranslation("supplier");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      debt: Number(form.debt),
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t("edit_supplier")}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="name"
            placeholder={t("name")}
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="contact_person"
            placeholder={t("contact_person")}
            value={form.contact_person}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="phones"
            placeholder={t("phones")}
            value={form.phones}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="address"
            placeholder={t("address")}
            value={form.address}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="debt"
            type="number"
            placeholder={t("debt")}
            value={form.debt}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700"
          >
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
