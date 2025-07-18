import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Sun, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";

const ThemeSelector = ({ theme, setTheme }) => {
  const { t } = useTranslation("settings");

  return (
    <div 
      className="relative backdrop-blur-xl bg-gradient-to-br from-gray-800/40 via-gray-800/30 to-gray-800/40 border-2 border-purple-400/30 rounded-2xl px-6 py-8 flex flex-col gap-4 items-center"
      style={{ 
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)',
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%),
          linear-gradient(225deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 100%)
        `
      }}
    >
      {/* Декоративные эффекты */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-400/10 rounded-full blur-xl"></div>
      
      {/* Заголовок с иконкой */}
      <div className="relative font-bold flex items-center justify-center gap-3 text-xl mb-2">
        {/* Неоновая иконка */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-400 rounded-xl blur-lg opacity-50 animate-pulse"></div>
          <div className="relative bg-gray-800/50 border border-purple-400/50 p-2 rounded-xl">
            <div className="flex items-center gap-1">
              <Sun 
                className="text-purple-400 w-6 h-6" 
                style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} 
              />
              <Palette 
                className="text-pink-400 w-4 h-4" 
                style={{ filter: 'drop-shadow(0 0 6px #ec4899)' }} 
              />
            </div>
          </div>
        </div>
        
        <span 
          className="text-white"
          style={{ textShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }}
        >
          {t("theme")}
        </span>
      </div>

      {/* Theme Toggle */}
      <div className="relative">
        <ThemeToggle 
          value={theme === "dark"} 
          onChange={v => setTheme(v ? "dark" : "light")} 
        />
      </div>

      {/* Текущая тема */}
      <div 
        className="relative text-base mt-2 font-medium"
        style={{
          color: theme === "dark" ? "#a855f7" : "#ec4899",
          textShadow: `0 0 10px ${theme === "dark" ? "#a855f7" : "#ec4899"}`
        }}
      >
        <div className="flex items-center gap-2">
          {/* Индикатор */}
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: theme === "dark" ? "#a855f7" : "#ec4899",
              boxShadow: `0 0 8px ${theme === "dark" ? "#a855f7" : "#ec4899"}`
            }}
          />
          
          <span>
            {theme === "light" ? t("light") : t("dark")}
          </span>
        </div>
      </div>

      {/* Декоративная нижняя полоска */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-50"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(236,72,153,0.6), transparent)'
        }}
      />
    </div>
  );
};

export default ThemeSelector;