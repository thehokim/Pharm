import { X, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation("user");
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef(null);

  // Роли c переводом
  const roles = [
    { value: "admin", label: t("admin") },
    { value: "sales", label: t("sales") },
    { value: "accountant", label: t("accountant") },
    { value: "warehouse", label: t("warehouse") },
  ];

  useEffect(() => {
    if (!isOpen) {
      setForm({
        username: "",
        full_name: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setRoleOpen(false);
    }
  }, [isOpen]);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    if (!roleOpen) return;
    const handleClick = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [roleOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleSelect = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
    setRoleOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert(t("passwordsNotMatch"));
      return;
    }
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  const selectedRole = roles.find((r) => r.value === form.role);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t("addTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="username"
            placeholder={t("login")}
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="full_name"
            placeholder={t("fio")}
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          {/* Кастомный select роли */}
          <div className="relative col-span-2" ref={roleRef}>
            <button
              type="button"
              onClick={() => setRoleOpen((v) => !v)}
              className={`flex items-center justify-between px-4 py-2 w-full rounded-xl border border-gray-100 bg-gray-50 focus:border-blue-500 outline-none transition text-gray-700 h-12 ${
                !selectedRole ? "text-gray-400" : ""
              }`}
            >
              <span>
                {selectedRole ? selectedRole.label : t("chooseRole")}
              </span>
              <ChevronDown className="ml-2 text-gray-400" size={20} />
            </button>
            {roleOpen && (
              <div className="absolute z-20 top-14 left-0 bg-white border border-gray-100 rounded-xl w-full shadow-lg animate-fadeIn max-h-52 overflow-y-auto">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`w-full px-4 py-2 text-left hover:bg-indigo-50 rounded-xl transition-colors ${
                      form.role === r.value
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-gray-700"
                    }`}
                    onClick={() => handleRoleSelect(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            name="password"
            type="password"
            placeholder={t("password")}
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder={t("repeatPassword")}
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <button
            type="submit"
            className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 h-12"
          >
            {t("add")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
