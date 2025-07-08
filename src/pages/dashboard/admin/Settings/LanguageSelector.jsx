import React, { useEffect } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { languages } from "./Settings"; // или ../constants

const LanguageSelector = ({
  language,
  setLanguage,
  langDropdown,
  setLangDropdown,
  langRef,
  label,
}) => {
  const { t } = useTranslation("settings");

  // OUTSIDE CLICK CLOSE (ref — обязательно на обертке div!)
  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        console.log("Outside click detected, closing dropdown");
        setLangDropdown(false);
      }
    }
    if (langDropdown) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langDropdown, setLangDropdown, langRef]);

  console.log("LanguageSelector rendered", { language, langDropdown });

  return (
    <div
      ref={langRef} // Важно! ref на ОБЕРТКЕ, а не на кнопке!
      className="bg-blue-50 rounded-2xl px-8 py-7 flex flex-col items-center justify-center relative h-full"
    >
      {/* Заголовок */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex gap-2">
          <Languages className="text-blue-500 w-7 h-7 mb-1" />
          <span className="font-extrabold text-[#2F3747] text-xl text-center leading-tight">
            {label || t("language")}
          </span>
        </div>
      </div>

      {/* Кнопка выбора */}
      <button
        className="flex relative items-center justify-between w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-lg font-bold transition ring-2 ring-transparent hover:ring-blue-200 focus:ring-blue-400 outline-none"
        onClick={() => {
          console.log("Dropdown button clicked");
          setLangDropdown((v) => !v);
        }}
        type="button"
        style={{ minHeight: 56 }}
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl">{language.flag}</span>
          <span>{language.label}</span>
        </span>
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#9CA3AF"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 9l6 6 6-6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {langDropdown && (
        <div className="absolute left-1/2 -translate-x-1/2 top-52 w-full z-30 rounded-xl border border-gray-100 bg-white py-2 animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                console.log("Language selected:", lang);
                setLanguage(lang); // здесь handleLanguageChange!
                setLangDropdown(false);
              }}
              className={`w-full text-left px-6 py-4 flex items-center gap-3 text-lg font-semibold rounded-lg transition ${
                language.code === lang.code
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 px-6"
              }`}
              style={{
                fontWeight: language.code === lang.code ? 700 : 500,
                fontSize: 18,
              }}
            >
              <span className="text-2xl">{lang.flag}</span>
              {lang.label}
              {language.code === lang.code && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="ml-auto"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="#2563eb"
                    strokeWidth="2"
                    fill="#e0eaff"
                  />
                  <circle cx="20" cy="20" r="8" fill="#2563eb" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
