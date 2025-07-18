import React, { useEffect, useState } from "react";
import {
  Info, CheckCircle, AlertTriangle, XCircle, X
} from "lucide-react";
import { useTranslation } from "react-i18next";

const PopupNotification = ({
  title,
  message,
  type = "info", // "info" | "success" | "error" | "warning"
  onClose,
  duration = 5000,
}) => {
  const { t } = useTranslation("notif");
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Анимация появления
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Автоматическое закрытие
    if (!duration) return () => clearTimeout(showTimer);
    
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Время анимации закрытия
  };

  // Неоновые иконки с пульсацией
  const getIcon = () => {
    switch (type) {
      case "success": 
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <CheckCircle className="relative w-6 h-6 text-green-400" 
                         style={{ filter: 'drop-shadow(0 0 12px #22c55e)' }} />
          </div>
        );
      case "error": 
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <XCircle className="relative w-6 h-6 text-red-400" 
                     style={{ filter: 'drop-shadow(0 0 12px #ef4444)' }} />
          </div>
        );
      case "warning": 
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <AlertTriangle className="relative w-6 h-6 text-yellow-400" 
                           style={{ filter: 'drop-shadow(0 0 12px #eab308)' }} />
          </div>
        );
      default: 
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <Info className="relative w-6 h-6 text-blue-400" 
                   style={{ filter: 'drop-shadow(0 0 12px #3b82f6)' }} />
          </div>
        );
    }
  };

  // Стили для разных типов
  const getStyles = () => {
    switch (type) {
      case "success": 
        return {
          border: "border-green-400/40",
          shadow: "0 0 30px rgba(34, 197, 94, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)",
          gradient: "from-green-400/10 via-transparent to-green-400/10"
        };
      case "error": 
        return {
          border: "border-red-400/40",
          shadow: "0 0 30px rgba(239, 68, 68, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)",
          gradient: "from-red-400/10 via-transparent to-red-400/10"
        };
      case "warning": 
        return {
          border: "border-yellow-400/40",
          shadow: "0 0 30px rgba(234, 179, 8, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)",
          gradient: "from-yellow-400/10 via-transparent to-yellow-400/10"
        };
      default: 
        return {
          border: "border-blue-400/40",
          shadow: "0 0 30px rgba(59, 130, 246, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)",
          gradient: "from-blue-400/10 via-transparent to-blue-400/10"
        };
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "success": return t("successTitle");
      case "error": return t("errorTitle");
      case "warning": return t("warningTitle");
      default: return t("infoTitle");
    }
  };

  const styles = getStyles();

  return (
    <div 
      className={`
        fixed top-6 right-6 z-[9999] min-w-[320px] max-w-sm overflow-hidden
        transition-all duration-300 ease-out transform
        ${isVisible && !isClosing 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div 
        className={`
          relative bg-gray-900/95 backdrop-blur-xl border-2 rounded-2xl p-5
          ${styles.border}
        `}
        style={{ boxShadow: styles.shadow }}
      >
        {/* Декоративный градиентный фон */}
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} rounded-2xl opacity-50`}></div>
        
        {/* Анимированная граница */}
        <div className="absolute inset-0 rounded-2xl opacity-30">
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{
              background: `linear-gradient(45deg, ${
                type === 'success' ? 'rgba(34, 197, 94, 0.3)' :
                type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                type === 'warning' ? 'rgba(234, 179, 8, 0.3)' :
                'rgba(59, 130, 246, 0.3)'
              }, transparent, ${
                type === 'success' ? 'rgba(34, 197, 94, 0.3)' :
                type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                type === 'warning' ? 'rgba(234, 179, 8, 0.3)' :
                'rgba(59, 130, 246, 0.3)'
              })`,
              padding: '1px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          />
        </div>

        {/* Основной контент */}
        <div className="relative flex items-start gap-4">
          
          {/* Иконка */}
          <div className="pt-1 flex-shrink-0">
            {getIcon()}
          </div>

          {/* Текстовый контент */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white mb-1 text-base"
                 style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
              {getTitle()}
            </div>
            <div className="text-gray-200 text-sm leading-relaxed">
              {message}
            </div>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 p-2 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-red-400 hover:text-red-400 transition-all duration-300 hover:scale-110 group"
            aria-label={t("close")}
            style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)' }}
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" 
               style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
          </button>
        </div>

        {/* Прогресс-бар (если есть duration) */}
        {duration && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50 rounded-b-2xl overflow-hidden">
            <div 
              className={`h-full transition-all ease-linear ${
                type === 'success' ? 'bg-green-400' :
                type === 'error' ? 'bg-red-400' :
                type === 'warning' ? 'bg-yellow-400' :
                'bg-blue-400'
              }`}
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear`,
                boxShadow: `0 0 10px ${
                  type === 'success' ? '#22c55e' :
                  type === 'error' ? '#ef4444' :
                  type === 'warning' ? '#eab308' :
                  '#3b82f6'
                }`
              }}
            />
          </div>
        )}

        {/* Декоративные элементы */}
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-20"
             style={{
               background: `radial-gradient(circle, ${
                 type === 'success' ? '#22c55e' :
                 type === 'error' ? '#ef4444' :
                 type === 'warning' ? '#eab308' :
                 '#3b82f6'
               }, transparent 70%)`,
               filter: 'blur(4px)'
             }}
        />
        
        <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full opacity-15"
             style={{
               background: `radial-gradient(circle, ${
                 type === 'success' ? '#22c55e' :
                 type === 'error' ? '#ef4444' :
                 type === 'warning' ? '#eab308' :
                 '#3b82f6'
               }, transparent 70%)`,
               filter: 'blur(3px)'
             }}
        />
      </div>

      {/* CSS анимации */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2px);
            }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
};

export default PopupNotification;