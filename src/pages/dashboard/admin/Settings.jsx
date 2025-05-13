import React, { useState } from "react";
import { Bell, Sun, Moon, Languages, ShieldCheck, Save, TimerReset } from "lucide-react";

const Settings = () => {
  const [language, setLanguage] = useState("ru");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [autoLogout, setAutoLogout] = useState("15");
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="space-y-6 bg-white rounded-xl p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
        <ShieldCheck className="text-blue-500" />
        Настройки системы
      </h2>

      {/* Язык интерфейса */}
      <div className="bg-gray-50 rounded-xl p-4  space-y-2">
        <label className="font-medium flex items-center gap-2">
          <Languages className="text-blue-500" />
          Язык интерфейса
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="ru">Русский</option>
          <option value="uz">O‘zbekcha</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Уведомления */}
      <div className="bg-gray-50 rounded-xl p-4  flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-500" />
          <span className="font-medium">Уведомления</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-transition-all duration-300"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-full transition-transform duration-300" />
        </label>
      </div>

      {/* Тема */}
      <div className="bg-gray-50 rounded-xl p-4  space-y-2">
        <label className="font-medium flex items-center gap-2">
          {theme === "dark" ? <Moon className="text-blue-500" /> : <Sun className="text-yellow-500" />}
          Тема интерфейса
        </label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </div>

      {/* Автовыход */}
      <div className="bg-gray-50 rounded-xl p-4  space-y-2">
        <label className="font-medium flex items-center gap-2"> <TimerReset className="text-blue-500"/> Автовыход после неактивности</label>
        <select
          value={autoLogout}
          onChange={(e) => setAutoLogout(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="5">5 минут</option>
          <option value="15">15 минут</option>
          <option value="30">30 минут</option>
          <option value="never">Никогда</option>
        </select>
      </div>

      {/* 2FA */}
      <div className="bg-gray-50 rounded-xl p-4  flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-500" />
          <span className="font-medium">Двухфакторная аутентификация (2FA)</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-transition-all duration-300"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-full transition-transform duration-300" />
        </label>
      </div>

      {/* Сохранить */}
      <div className="text-right">
        <button
          onClick={() => alert("Настройки сохранены")}
          className="bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 inline-flex w-full items-center justify-center gap-2"
        >
          <Save size={16} />
          Сохранить изменения
        </button>
      </div>
    </div>
  );
};

export default Settings;
