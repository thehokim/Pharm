import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const EditUserModal = ({ isOpen, onClose, userData, onSubmit }) => {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

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
  }, [userData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      alert("Пароли не совпадают!");
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Редактировать пользователя</h2>
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
            placeholder="Логин"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="full_name"
            placeholder="ФИО"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="role"
            placeholder="Роль"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="password"
            type="password"
            placeholder="Новый пароль"
            value={form.password}
            onChange={handleChange}
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border focus:outline-none border-gray-100 rounded-xl px-4 py-2 h-12"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
