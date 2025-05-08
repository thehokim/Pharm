import React, { useState } from "react";

const Settings = () => {
  const [language, setLanguage] = useState("ru");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Настройки системы</h2>

      {/* Язык интерфейса */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Язык интерфейса</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="ru">Русский</option>
          <option value="uz">O‘zbekcha</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Уведомления */}
      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="h-4 w-4"
          />
          Включить уведомления
        </label>
      </div>

      {/* Темная тема */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Тема</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </div>

      <button
        onClick={() => alert("Настройки сохранены (фейковое действие)")}
        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-900"
      >
        Сохранить изменения
      </button>
    </div>
  );
};

export default Settings;
