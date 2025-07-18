import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, LogOut, Bell, SettingsIcon } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import ToggleRow from "./ToggleRow";
import AutoLogoutSelector from "./AutoLogoutSelector";
import SaveButton from "./SaveButton";
import { useTranslation } from "react-i18next";

export const languages = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "uzcryl", label: "Ўзбекча", flag: "🇺🇿" },
];

const Settings = () => {
  const { t, i18n } = useTranslation("settings");

  const [language, setLanguage] = useState(languages[0]);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [autoLogout, setAutoLogout] = useState("15");
  const [twoFactor, setTwoFactor] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  const token = localStorage.getItem("token") || "";
  const langRef = useRef();

  useEffect(() => {
    fetch(`${BASE_URL}/api/settings/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((s) => {
        setLanguage(
          languages.find((l) => l.code === s.language) || languages[0]
        );
        setNotifications(s.notifications_enabled);
        setTheme(s.theme);
        setAutoLogout(
          s.auto_logout_minutes === 0 ? "never" : String(s.auto_logout_minutes)
        );
        setTwoFactor(s.two_factor_enabled);
        if (s.language) i18n.changeLanguage(s.language);
      });
  }, [token, i18n]);

  const updateSettings = (overrides = {}) => {
    const payload = {
      language: language.code,
      notifications_enabled: notifications,
      theme,
      auto_logout_minutes:
        autoLogout === "never" ? 0 : parseInt(autoLogout, 10),
      two_factor_enabled: twoFactor,
      ...overrides,
    };
    return fetch(`${BASE_URL}/api/settings/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.code);
    updateSettings({ language: lang.code });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl"></div>

      <div className="w-full min-h-[calc(100vh-32px)] flex items-center justify-center p-2">
        <div 
          className="w-full backdrop-blur-xl bg-gray-900/90 border-2 border-cyan-400/30 rounded-3xl px-6 py-8 flex flex-col gap-6 sm:gap-8 mt-4 sm:mt-6"
          style={{ boxShadow: '0 0 50px rgba(6, 182, 212, 0.2)' }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-50"></div>
                <div className="relative bg-gray-800 border-2 border-cyan-400 p-3 rounded-full">
                  <ShieldCheck className="text-cyan-400 w-7 h-7"
                              style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                {t("title")}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleLogout}
                className="relative flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-red-500/20 border-2 border-red-400/50 text-red-400 hover:bg-red-500/30 hover:border-red-400 hover:text-red-300 hover:scale-105 transition-all duration-200 group "
                style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
              >
                {/* Анимированный фон */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <LogOut className="relative w-5 h-5" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
              </button>
            </div>
          </div>

          {/* Controls - оригинальная структура */}
          <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6">
            <div className="w-full">
              <AutoLogoutSelector />
            </div>
            <div className="w-full">
              <div 
                className="backdrop-blur-xl bg-gray-800/40 border-2 border-emerald-400/30 rounded-3xl p-6 h-full"
                style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}
              >
                {/* Декоративный фон */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-transparent to-blue-400/5 rounded-3xl"></div>
                
                <LanguageSelector
                  language={language}
                  setLanguage={handleLanguageChange}
                  langDropdown={langDropdown}
                  setLangDropdown={setLangDropdown}
                  langRef={langRef}
                  label={t("language")}
                />
              </div>
            </div>
          </div>

          {/* Grid для остальных настроек - оригинальная структура */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Theme Selector */}
            <div 
              className="backdrop-blur-xl bg-gray-800/40 border-2 border-purple-400/30 rounded-3xl p-6 relative"
              style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)' }}
            >
              {/* Декоративный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-transparent to-pink-400/5"></div>
              
              <ThemeSelector 
                theme={theme} 
                setTheme={setTheme} 
                label={t("theme")} 
              />
            </div>

            {/* Notifications Toggle */}
            <div 
              className="backdrop-blur-xl bg-gray-800/40 border-2 border-amber-400/30 rounded-3xl p-6 relative "
              style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)' }}
            >
              {/* Декоративный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-transparent to-orange-400/5"></div>
              
              <ToggleRow
                icon={Bell}
                labelKey="notifications"
                checked={notifications}
                setChecked={setNotifications}
                labelOnKey="notificationsOn"
                labelOffKey="notificationsOff"
                color="#f59e0b"
              />
            </div>

            {/* 2FA Toggle */}
            <div 
              className="backdrop-blur-xl bg-gray-800/40 border-2 border-blue-400/30 rounded-3xl p-6 relative "
              style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}
            >
              {/* Декоративный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-indigo-400/5"></div>
              
              <ToggleRow
                icon={ShieldCheck}
                labelKey="2fa"
                checked={twoFactor}
                setChecked={setTwoFactor}
                labelOnKey="2faOn"
                labelOffKey="2faOff"
                color="#3b82f6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;