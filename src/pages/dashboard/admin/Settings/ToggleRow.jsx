import React from "react";
import Toggle from "./Toggle";
import { useTranslation } from "react-i18next";

const ToggleRow = ({
  icon: Icon,
  labelKey, // Ключ основного лейбла (например, "notifications")
  checked, // Состояние включен/выключен
  setChecked, // Сеттер состояния
  labelOnKey, // Ключ лейбла для состояния "Вкл"
  labelOffKey, // Ключ лейбла для состояния "Выкл"
  color = "#2979FF" // Основной цвет свитча
}) => {
  const { t } = useTranslation("settings");
  const label = t(labelKey);
  const labelOn = t(labelOnKey);
  const labelOff = t(labelOffKey);

  // Определяем цвета для неонового эффекта
  const getGlowColor = () => {
    switch(color) {
      case "#f59e0b": return "rgba(245, 158, 11, 0.3)";
      case "#3b82f6": return "rgba(59, 130, 246, 0.3)";
      case "#10b981": return "rgba(16, 185, 129, 0.3)";
      case "#a855f7": return "rgba(168, 85, 247, 0.3)";
      case "#ef4444": return "rgba(239, 68, 68, 0.3)";
      default: return "rgba(41, 121, 255, 0.3)";
    }
  };

  const getTextShadowColor = () => {
    switch(color) {
      case "#f59e0b": return "rgba(245, 158, 11, 0.5)";
      case "#3b82f6": return "rgba(59, 130, 246, 0.5)";
      case "#10b981": return "rgba(16, 185, 129, 0.5)";
      case "#a855f7": return "rgba(168, 85, 247, 0.5)";
      case "#ef4444": return "rgba(239, 68, 68, 0.5)";
      default: return "rgba(41, 121, 255, 0.5)";
    }
  };

  return (
    <div 
      className="relative backdrop-blur-xl z-0 bg-gradient-to-br from-gray-800/40 via-gray-800/30 to-gray-800/40 border-2 rounded-2xl px-8 py-7 flex flex-col items-center justify-center transition-all duration-300"
      style={{ 
        borderColor: checked ? `${color}66` : 'rgba(107,114,128,0.3)',
        boxShadow: checked 
          ? `0 0 30px ${getGlowColor()}, 0 8px 32px rgba(0,0,0,0.3)`
          : '0 8px 24px rgba(0,0,0,0.3)',
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%),
          linear-gradient(225deg, ${getGlowColor()}, transparent 70%)
        `
      }}
    >
      {/* Декоративные эффекты */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30"
        style={{ backgroundColor: color }}
      />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gray-400/10 rounded-full blur-xl"></div>
      
      {/* Заголовок с иконкой */}
      <div className="relative flex flex-col items-center mb-8">
        <div className="flex gap-3 items-center">
          {/* Неоновая иконка */}
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-xl blur-lg opacity-50 animate-pulse"
              style={{ backgroundColor: color }}
            />
            <div className="relative bg-gray-800/50 border border-opacity-50 p-2 rounded-xl"
                 style={{ borderColor: color }}>
              <Icon 
                className="w-7 h-7" 
                style={{ 
                  color: color,
                  filter: `drop-shadow(0 0 10px ${color})`
                }} 
              />
            </div>
          </div>
          
          <span 
            className="font-extrabold text-white text-xl text-center leading-tight"
            style={{ textShadow: `0 0 15px ${getTextShadowColor()}` }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Toggle */}
      <div className="relative">
        <Toggle
          checked={checked}
          onChange={setChecked}
          color={color}
          hideInlineLabel
        />
      </div>

      {/* Статус текст */}
      <div
        className="relative mt-8 text-lg font-medium text-center transition-all duration-300"
        style={{
          color: checked ? color : "#94a3b8",
          minHeight: 28,
          textShadow: checked ? `0 0 10px ${getTextShadowColor()}` : 'none'
        }}
      >
        <div className="flex items-center gap-2 justify-center">
          {/* Индикатор состояния */}
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${checked ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: checked ? color : "#64748b",
              boxShadow: checked ? `0 0 8px ${color}` : 'none'
            }}
          />
          
          <span>
            {checked ? labelOn : labelOff}
          </span>
        </div>
      </div>

      {/* Декоративная нижняя полоска */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
          opacity: checked ? 0.6 : 0.2
        }}
      />

      {/* Стеклянный блик */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/3 opacity-10"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)'
        }}
      />
    </div>
  );
};

export default ToggleRow;