import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditClientModal = ({ isOpen, onClose, client, onSubmit }) => {
  const { t } = useTranslation("client");
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phones: "",
    username: "",
    address: "",
    debt: "",
  });

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || "",
        contact_person: client.contact_person || "",
        phones: client.phones || "",
        username: client.username || "",
        address: client.address || "",
        debt: client.debt ?? 0,
      });
    }
  }, [client]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, debt: Number(form.debt) };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t("editClientModal.title")}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="name"
            placeholder={t("editClientModal.name")}
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="contact_person"
            placeholder={t("editClientModal.contactPerson")}
            value={form.contact_person}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="phones"
            placeholder={t("editClientModal.phones")}
            value={form.phones}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="username"
            placeholder={t("editClientModal.username")}
            value={form.username}
            onChange={handleChange}
            required
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="address"
            placeholder={t("editClientModal.address")}
            value={form.address}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="debt"
            type="number"
            placeholder={t("editClientModal.debt")}
            value={form.debt}
            onChange={handleChange}
            className="border border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700"
          >
            {t("editClientModal.save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
