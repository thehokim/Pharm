import { X, ChevronDown } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const EditUserModal = ({ isOpen, onClose, userData, onSubmit }) => {
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

  // Роли с поддержкой перевода
  const roles = [
    { value: "admin", label: t("admin") },
    { value: "sales", label: t("sales") },
    { value: "accountant", label: t("accountant") },
    { value: "warehouse", label: t("warehouse") },
  ];

  useEffect(() => {
    if (userData) {
      setForm({
        username: userData.username || "",
        full_name: userData.full_name || userData.name || "",
        role: userData.role || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userData, isOpen]);

  // Закрытие дропдауна при клике вне
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
    if (form.password && form.password !== form.confirmPassword) {
      alert(t("passwordsNotMatch"));
      return;
    }
    const payload = {
      username: form.username,
      full_name: form.full_name,
      role: form.role,
      ...(form.password && { password: form.password }),
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;
  const selectedRole = roles.find((r) => r.value === form.role);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md p-7 shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-bold text-gray-800">{t("editTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
            tabIndex={0}
          >
            <X size={22} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 font-medium">{t("login")}</label>
            <input
              name="username"
              placeholder={t("login")}
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 font-medium">{t("fio")}</label>
            <input
              name="full_name"
              placeholder={t("fio")}
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          {/* Кастомный дропдаун */}
          <div className="flex flex-col gap-2 relative" ref={roleRef}>
            <label className="text-sm text-gray-700 font-medium">{t("role")}</label>
            <button
              type="button"
              onClick={() => setRoleOpen((v) => !v)}
              className={`flex items-center justify-between px-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 outline-none transition text-gray-700 ${
                !selectedRole ? "text-gray-400" : ""
              }`}
            >
              <span>
                {selectedRole ? selectedRole.label : t("chooseRole")}
              </span>
              <ChevronDown className="ml-2 text-gray-400" size={20} />
            </button>
            {roleOpen && (
              <div className="absolute z-20 top-18 bg-white border border-gray-200 rounded-lg w-full shadow-lg animate-fadeIn max-h-52 overflow-y-auto">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`w-full px-4 py-2 text-left hover:bg-indigo-50 rounded-lg transition-colors ${
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
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 font-medium">{t("newPassword")}</label>
            <input
              name="password"
              type="password"
              placeholder={t("newPassword")}
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 font-medium">{t("repeatPassword")}</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder={t("repeatPassword")}
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg text-base"
          >
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
