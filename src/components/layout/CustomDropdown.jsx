import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Zap } from "lucide-react";

function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
  t,
  icon: Icon,
  iconColor = "text-cyan-400"
}) {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  
  const selected = options.find((o) => o.value === value);

  const handleOpen = () => {
    setOpen(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setOpen(false);
      setIsAnimating(false);
    }, 150);
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleOptionSelect = (optValue) => {
    onChange(optValue);
    handleClose();
  };

  // Определяем цвет свечения на основе iconColor
  const getGlowColor = () => {
    switch(iconColor) {
      case "text-cyan-400": return "rgba(6, 182, 212, 0.3)";
      case "text-emerald-400": return "rgba(16, 185, 129, 0.3)";
      case "text-purple-400": return "rgba(168, 85, 247, 0.3)";
      case "text-amber-400": return "rgba(245, 158, 11, 0.3)";
      case "text-red-400": return "rgba(239, 68, 68, 0.3)";
      case "text-indigo-400": return "rgba(99, 102, 241, 0.3)";
      case "text-blue-400": return "rgba(59, 130, 246, 0.3)";
      default: return "rgba(6, 182, 212, 0.3)";
    }
  };

  const getDropShadowColor = () => {
    switch(iconColor) {
      case "text-cyan-400": return "#06b6d4";
      case "text-emerald-400": return "#10b981";
      case "text-purple-400": return "#a855f7";
      case "text-amber-400": return "#f59e0b";
      case "text-red-400": return "#ef4444";
      case "text-indigo-400": return "#6366f1";
      case "text-blue-400": return "#3b82f6";
      default: return "#06b6d4";
    }
  };

  const getBorderColor = () => {
    switch(iconColor) {
      case "text-cyan-400": return "border-cyan-400/50";
      case "text-emerald-400": return "border-emerald-400/50";
      case "text-purple-400": return "border-purple-400/50";
      case "text-amber-400": return "border-amber-400/50";
      case "text-red-400": return "border-red-400/50";
      case "text-indigo-400": return "border-indigo-400/50";
      case "text-blue-400": return "border-blue-400/50";
      default: return "border-cyan-400/50";
    }
  };

  const getActiveBorderColor = () => {
    switch(iconColor) {
      case "text-cyan-400": return "border-cyan-400";
      case "text-emerald-400": return "border-emerald-400";
      case "text-purple-400": return "border-purple-400";
      case "text-amber-400": return "border-amber-400";
      case "text-red-400": return "border-red-400";
      case "text-indigo-400": return "border-indigo-400";
      case "text-blue-400": return "border-blue-400";
      default: return "border-cyan-400";
    }
  };

  const getSelectedBgColor = () => {
    switch(iconColor) {
      case "text-cyan-400": return "bg-cyan-400/20";
      case "text-emerald-400": return "bg-emerald-400/20";
      case "text-purple-400": return "bg-purple-400/20";
      case "text-amber-400": return "bg-amber-400/20";
      case "text-red-400": return "bg-red-400/20";
      case "text-indigo-400": return "bg-indigo-400/20";
      case "text-blue-400": return "bg-blue-400/20";
      default: return "bg-cyan-400/20";
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Основная кнопка */}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          relative w-full flex justify-between items-center 
          bg-gray-800/60 backdrop-blur-sm border-2 text-white px-4 py-4 rounded-2xl 
          transition-all duration-300 group overflow-hidden
          ${open ? getActiveBorderColor() : `border-gray-600/50 hover:${getActiveBorderColor()}`}
        `}
        style={{
          boxShadow: open 
            ? `0 0 25px ${getGlowColor()}, inset 0 0 20px rgba(255, 255, 255, 0.05)` 
            : `0 0 10px rgba(0, 0, 0, 0.3)`,
        }}
      >
        {/* Декоративный неоновый фон */}
        <div 
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}
          style={{
            background: `radial-gradient(circle at center, ${getGlowColor()}, transparent 70%)`
          }}
        />
        
        {/* Анимированная граница */}
        <div 
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          style={{
            background: `linear-gradient(45deg, ${getGlowColor()}, transparent, ${getGlowColor()})`,
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />

        <div className="relative flex items-center gap-3 z-10">
          {/* Иконка с пульсацией */}
          <div className="relative">
            {Icon ? (
              <>
                {/* Пульсирующее свечение для иконки */}
                <div 
                  className={`absolute inset-0 ${iconColor} opacity-50 blur-sm scale-150 animate-pulse`}
                  style={{ filter: `drop-shadow(0 0 8px ${getDropShadowColor()})` }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {/* Основная иконка */}
                <Icon 
                  className={`relative w-4 h-4 ${iconColor} transition-transform duration-300 group-hover:scale-110`} 
                  style={{ filter: `drop-shadow(0 0 8px ${getDropShadowColor()})` }} 
                />
              </>
            ) : (
              <>
                {/* Дефолтная иконка с эффектами */}
                <div 
                  className={`absolute inset-0 ${iconColor} opacity-50 blur-sm scale-150 animate-pulse`}
                  style={{ filter: `drop-shadow(0 0 8px ${getDropShadowColor()})` }}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <Zap 
                  className={`relative w-4 h-4 ${iconColor} transition-transform duration-300 group-hover:scale-110`} 
                  style={{ filter: `drop-shadow(0 0 8px ${getDropShadowColor()})` }} 
                />
              </>
            )}
          </div>
          
          {/* Текст с эффектом */}
          <span className="relative">
            {selected ? (
              <span className="text-white font-medium tracking-wide">
                {t(selected.labelKey || selected.label)}
              </span>
            ) : (
              <span className="text-gray-500 tracking-wide">
                {t(placeholder)}
              </span>
            )}
          </span>
        </div>

        {/* Анимированная стрелка */}
        <div className="relative z-10">
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
              open ? 'rotate-180 text-white' : 'group-hover:text-white'
            }`}
            style={{ 
              filter: open ? `drop-shadow(0 0 8px ${getDropShadowColor()})` : 'none'
            }}
          />
        </div>
      </button>

      {/* Выпадающий список */}
      {open && (
        <div 
          className={`
            absolute z-30 mt-3 w-full 
            bg-gray-800/95 backdrop-blur-xl border-2 ${getBorderColor()} rounded-2xl 
            shadow-2xl max-h-60 overflow-y-auto
            transform transition-all duration-200 ease-out
            ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
          `}
          style={{
            boxShadow: `
              0 0 40px ${getGlowColor()}, 
              0 20px 40px rgba(0, 0, 0, 0.8),
              inset 0 0 20px rgba(255, 255, 255, 0.05)
            `
          }}
        >
          {/* Декоративный верхний элемент */}
          <div 
            className="h-1 rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, ${getGlowColor()}, transparent, ${getGlowColor()})`
            }}
          />
          
          {options.map((opt, index) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleOptionSelect(opt.value)}
              className={`
                relative w-full text-left px-6 py-4 transition-all duration-200 group overflow-hidden
                ${opt.value === value
                  ? `${getSelectedBgColor()} ${iconColor} font-semibold border-l-4 ${getActiveBorderColor()}`
                  : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                }
                ${index === 0 ? 'rounded-t-2xl' : ''}
                ${index === options.length - 1 ? 'rounded-b-2xl' : ''}
              `}
            >
              {/* Hover эффект */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: `linear-gradient(90deg, ${getGlowColor()}, transparent)`
                }}
              />
              
              {/* Индикатор выбранного элемента */}
              {opt.value === value && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                  style={{
                    background: getDropShadowColor(),
                    boxShadow: `0 0 10px ${getDropShadowColor()}`
                  }}
                />
              )}
              
              <div className="relative flex items-center gap-3">
                {/* Иконка для выбранного элемента */}
                {opt.value === value && Icon && (
                  <Icon 
                    className={`w-4 h-4 ${iconColor}`} 
                    style={{ filter: `drop-shadow(0 0 6px ${getDropShadowColor()})` }}
                  />
                )}
                
                {/* Текст опции */}
                <span className="tracking-wide">
                  {t(opt.labelKey || opt.label)}
                </span>
                
                {/* Эффект искры для выбранного элемента */}
                {opt.value === value && (
                  <div className="ml-auto">
                    <div 
                      className={`w-2 h-2 rounded-full ${iconColor.replace('text-', 'bg-')} animate-pulse`}
                      style={{ boxShadow: `0 0 8px ${getDropShadowColor()}` }}
                    />
                  </div>
                )}
              </div>
            </button>
          ))}
          
          {/* Декоративный нижний элемент */}
          <div 
            className="h-1 rounded-b-2xl"
            style={{
              background: `linear-gradient(90deg, transparent, ${getGlowColor()}, transparent)`
            }}
          />
        </div>
      )}

      {/* Стили для анимаций */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes dropdownSlideIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes dropdownSlideOut {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
          }
          
          .dropdown-enter {
            animation: dropdownSlideIn 0.2s ease-out;
          }
          
          .dropdown-exit {
            animation: dropdownSlideOut 0.15s ease-in;
          }
        `
      }} />
    </div>
  );
}

export default CustomDropdown;