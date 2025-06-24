import React, { useState } from "react";
import { BASE_URL } from "../../../../utils/auth";

const AddManagerModal = ({ onClose, onAdd }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim() || !password.trim()) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    const newManager = {
      full_name: fullName,
      username,
      role: "sales",
      password,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newManager),
      });

      if (!res.ok) throw new Error("Ошибка при добавлении менеджера");

      const data = await res.json();
      if (onAdd) onAdd({ fullName: data.full_name, profit: 0 });
      onClose();
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Добавить менеджера</h2>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="ФИО"
          className="w-full border border-gray-100 px-3 py-3 rounded-xl"
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Логин"
          className="w-full border border-gray-100 px-3 py-3 rounded-xl"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full border border-gray-100 px-3 py-3 rounded-xl"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-50 border border-gray-100 hover:bg-gray-100 px-4 py-3 rounded-xl w-full"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl w-full"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddManagerModal;
