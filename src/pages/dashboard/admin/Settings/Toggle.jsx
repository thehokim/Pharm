import React from "react";

// Современный toggle с неоновыми эффектами
function Toggle({ checked, onChange, color = "#2979FF", hideInlineLabel }) {
  // Определяем цвета для неонового эффекта
  const getGlowColor = () => {
    switch(color) {
      case "#f59e0b": return "rgba(245, 158, 11, 0.4)";
      case "#3b82f6": return "rgba(59, 130, 246, 0.4)";
      case "#10b981": return "rgba(16, 185, 129, 0.4)";
      case "#a855f7": return "rgba(168, 85, 247, 0.4)";
      case "#ef4444": return "rgba(239, 68, 68, 0.4)";
      default: return "rgba(41, 121, 255, 0.4)";
    }
  };

  const getRgbColor = () => {
    switch(color) {
      case "#f59e0b": return "245, 158, 11";
      case "#3b82f6": return "59, 130, 246";
      case "#10b981": return "16, 185, 129";
      case "#a855f7": return "168, 85, 247";
      case "#ef4444": return "239, 68, 68";
      default: return "41, 121, 255";
    }
  };

  return (
    <button
      type="button"
      aria-label="toggle"
      onClick={() => onChange(!checked)}
      className="relative w-[88px] h-[44px] flex items-center rounded-full border-2 transition-all duration-300 group"
      style={{
        background: checked 
          ? `linear-gradient(135deg, ${color}E6, ${color})`
          : "linear-gradient(135deg, rgba(55,65,81,0.8), rgba(75,85,99,0.6))",
        borderColor: checked ? color : "rgba(107,114,128,0.5)",
        boxShadow: checked
          ? `0 0 20px ${getGlowColor()}, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`
          : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        outline: "none",
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Декоративное свечение фона */}
      <div 
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${checked ? 'opacity-30' : ''}`}
        style={{
          background: `radial-gradient(circle at center, ${getGlowColor()}, transparent 70%)`
        }}
      />

      {/* Анимированная граница */}
      {checked && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `linear-gradient(45deg, ${getGlowColor()}, transparent, ${getGlowColor()})`,
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />
      )}

      {/* Бегунок */}
      <span
        className="absolute top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full transition-all duration-300 group-hover:scale-110"
        style={{
          left: checked ? "44px" : "4px",
          background: checked 
            ? `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.9) 100%),
                linear-gradient(135deg, rgba(${getRgbColor()},0.1) 0%, transparent 100%)
              `
            : `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.8) 100%),
                linear-gradient(135deg, rgba(107,114,128,0.1) 0%, transparent 100%)
              `,
          boxShadow: checked
            ? `
                0 0 15px ${getGlowColor()},
                0 4px 12px rgba(0,0,0,0.3),
                inset 0 1px 0 rgba(255,255,255,0.4),
                inset 0 -1px 0 rgba(0,0,0,0.1)
              `
            : `
                0 4px 8px rgba(0,0,0,0.2),
                inset 0 1px 0 rgba(255,255,255,0.3),
                inset 0 -1px 0 rgba(0,0,0,0.1)
              `,
          border: checked ? `1px solid ${color}66` : '1px solid rgba(107,114,128,0.3)'
        }}
      >
        {/* Стеклянный блик на бегунке */}
        <div 
          className="absolute top-1 left-1 right-2 h-1/2 rounded-full opacity-60"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)'
          }}
        />
        
        {/* Центральная точка */}
        {checked && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`
            }}
          />
        )}
      </span>

      {/* Невидимая кликабельная область */}
      <span className="w-full h-full block opacity-0 absolute inset-0 cursor-pointer z-20" />

      {/* CSS для дополнительных анимаций */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes toggleGlow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          
          @keyframes toggleSlide {
            0% { transform: translateX(-2px); }
            50% { transform: translateX(0px); }
            100% { transform: translateX(-2px); }
          }
          
          .animate-toggle-glow {
            animation: toggleGlow 2s ease-in-out infinite;
          }
          
          .animate-toggle-slide {
            animation: toggleSlide 3s ease-in-out infinite;
          }
        `
      }} />
    </button>
  );
}

export default Toggle;