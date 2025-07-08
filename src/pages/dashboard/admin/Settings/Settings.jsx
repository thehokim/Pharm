import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, LogOut, Bell } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import ToggleRow from "./ToggleRow";
import AutoLogoutSelector from "./AutoLogoutSelector";
import SaveButton from "./SaveButton";
import { useTranslation } from "react-i18next";

export const languages = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uz", label: "O‘zbekcha", flag: "🇺🇿" },
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
        // console.log("Загружены настройки:", s);
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
    <div className="w-full min-h-[calc(100vh-32px)] flex items-center justify-center p-2 bg-gray-50">
      <div className="w-full rounded-3xl bg-white px-2 sm:px-6 py-4 sm:py-8 flex flex-col gap-6 sm:gap-8 mt-4 sm:mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-3">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-indigo-100 rounded-full p-3">
              <ShieldCheck className="text-indigo-700" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              {t("title")}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleLogout}
              className={`
                flex items-center justify-center gap-2
                px-4 py-3 rounded-2xl
                text-base font-bold
                text-red-500 bg-red-50
                hover:bg-red-100
                active:scale-95 transition-all
                border-none outline-none
                focus:ring-2 focus:ring-red-300
                duration-200
              `}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6">
          <AutoLogoutSelector />
          <div className="w-full sm:w-2/3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ThemeSelector theme={theme} setTheme={setTheme} label={t("theme")} />
          <ToggleRow
            icon={Bell}
            labelKey="notifications"
            checked={notifications}
            setChecked={setNotifications}
            labelOnKey="notificationsOn"
            labelOffKey="notificationsOff"
            color="#2979FF"
          />
          <ToggleRow
            icon={ShieldCheck}
            labelKey="2fa"
            checked={twoFactor}
            setChecked={setTwoFactor}
            labelOnKey="2faOn"
            labelOffKey="2faOff"
            color="#2979FF"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
