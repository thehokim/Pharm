import React, { useEffect } from "react";
import { Languages, ChevronDown, Check } from "lucide-react";
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
      className="relative backdrop-blur-xl bg-gradient-to-br from-gray-800/40 via-gray-800/30 to-gray-800/40 border-2 border-emerald-400/30 rounded-2xl px-8 py-7 flex flex-col items-center justify-center h-full "
      style={{ 
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%),
          linear-gradient(225deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.1) 100%)
        `
      }}
    >
      {/* Декоративные эффекты */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl"></div>
      
      {/* Заголовок */}
      <div className="relative flex flex-col items-center mb-10">
        <div className="flex gap-3 items-center">
          {/* Неоновая иконка */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gray-800/50 border border-emerald-400/50 p-2 rounded-xl">
              <Languages 
                className="text-emerald-400 w-7 h-7" 
                style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} 
              />
            </div>
          </div>
          
          <span 
            className="font-extrabold text-white text-xl text-center leading-tight"
            style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
          >
            {label || t("language")}
          </span>
        </div>
      </div>

      {/* Кнопка выбора */}
      <button
        className={`
          relative flex items-center justify-between w-full px-5 py-4 rounded-xl 
          backdrop-blur-sm bg-gray-800/50 border-2 border-gray-600/50 
          text-lg font-bold transition-all duration-300 outline-none group 
          hover:border-emerald-400/50 hover:bg-gray-800/60
          ${langDropdown ? 'border-emerald-400/70 bg-gray-800/70' : ''}
        `}
        onClick={() => {
          console.log("Dropdown button clicked");
          setLangDropdown((v) => !v);
        }}
        type="button"
        style={{ 
          minHeight: 56,
          boxShadow: langDropdown 
            ? '0 0 25px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
            : '0 8px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      >
        {/* Hover эффект */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        
        <span className="relative flex items-center gap-3">
          <span className="text-2xl filter drop-shadow-lg">{language.flag}</span>
          <span className="text-white">{language.label}</span>
        </span>
        
        <ChevronDown 
          className={`relative w-6 h-6 text-emerald-400 transition-all duration-300 ${
            langDropdown ? 'rotate-180' : ''
          }`}
          style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
        />
      </button>

      {/* Dropdown */}
      {langDropdown && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-64 w-full z-50 backdrop-blur-2xl bg-gray-800/95 border-2 border-emerald-400/40 rounded-2xl py-2 transform transition-all duration-300 ease-out"
          style={{
            boxShadow: `
              0 25px 50px rgba(0,0,0,0.8),
              0 0 0 1px rgba(16,185,129,0.3),
              0 0 40px rgba(16,185,129,0.2),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
            background: `
              linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.9) 100%),
              linear-gradient(225deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.2) 100%)
            `
          }}
        >
          {/* Декоративная верхняя полоска */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(6,182,212,0.8), transparent)'
            }}
          />
          
          {languages.map((lang, index) => {
            const isSelected = language.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  console.log("Language selected:", lang);
                  setLanguage(lang); // здесь handleLanguageChange!
                  setLangDropdown(false);
                }}
                className={`
                  relative w-full text-left px-6 py-4 flex items-center gap-3 text-lg font-semibold transition-all duration-200 group
                  ${isSelected
                    ? "bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 text-emerald-400 border-l-4 border-emerald-400"
                    : "text-gray-200 hover:bg-gray-700/50 hover:text-white"
                  }
                  ${index === 0 ? 'rounded-t-2xl' : ''}
                  ${index === languages.length - 1 ? 'rounded-b-2xl' : ''}
                `}
                style={{
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: 18,
                  textShadow: isSelected ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
                }}
              >
                {/* Hover эффект */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     style={{
                       background: 'linear-gradient(90deg, rgba(16,185,129,0.1), transparent)'
                     }}
                />
                
                {/* Индикатор выбранного элемента */}
                {isSelected && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                    style={{
                      background: '#10b981',
                      boxShadow: '0 0 10px #10b981'
                    }}
                  />
                )}
                
                <span className="relative text-2xl filter drop-shadow-lg">{lang.flag}</span>
                <span className="relative">{lang.label}</span>
                
                {isSelected && (
                  <div className="relative ml-auto">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-50"></div>
                      <div className="relative bg-emerald-400/20 border-2 border-emerald-400 rounded-full p-1">
                        <Check 
                          className="w-4 h-4 text-emerald-400" 
                          style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
          
          {/* Декоративная нижняя полоска */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(16,185,129,0.6), transparent)'
            }}
          />
        </div>
      )}

      {/* CSS анимации */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes langFadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .animate-fade-in {
            animation: langFadeIn 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default LanguageSelector;