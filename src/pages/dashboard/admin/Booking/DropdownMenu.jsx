import { Edit3, Trash2 } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function DropdownMenu({ onEdit, onDelete, onClose }) {
  const { t } = useTranslation("booking");
  const menuRef = useRef();

  // Закрытие по клику вне
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-14 min-w-[200px] bg-gray-900/95 backdrop-blur-xl border-2 border-gray-700/50 rounded-2xl z-50 py-3 animate-fadeIn"
      style={{ 
        boxShadow: "0 0 30px rgba(16, 185, 129, 0.2), 0 0 60px rgba(16, 185, 129, 0.1)",
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))'
      }}
    >
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/10 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-red-400/10 rounded-full blur-xl translate-y-6 -translate-x-6"></div>
      
      <div className="relative z-10">
        {/* Кнопка редактирования */}
        <button
          className="group flex items-center gap-3 w-full px-4 py-3 text-left transition-all duration-300 hover:bg-emerald-900/30 hover:border-l-2 border-emerald-400"
          onClick={onEdit}
          style={{
            borderLeft: '2px solid transparent'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-gray-800 border border-emerald-400/30 p-2 rounded-lg group-hover:border-emerald-400 transition-all duration-300">
              <Edit3
                size={16}
                className="text-emerald-400 group-hover:scale-110 transition-transform duration-300"
                style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
              />
            </div>
          </div>
          <span className="font-medium text-white group-hover:text-emerald-400 transition-colors duration-300"
                style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0)' }}>
            {t("dropdownMenu.edit")}
          </span>
        </button>

        {/* Разделитель */}
        <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

        {/* Кнопка удаления */}
        <button
          className="group flex items-center gap-3 w-full px-4 py-3 text-left transition-all duration-300 hover:bg-red-900/30 hover:border-l-2 border-red-400"
          onClick={onDelete}
          style={{
            borderLeft: '2px solid transparent'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-gray-800 border border-red-400/30 p-2 rounded-lg group-hover:border-red-400 transition-all duration-300">
              <Trash2
                size={16}
                className="text-red-400 group-hover:scale-110 transition-transform duration-300"
                style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}
              />
            </div>
          </div>
          <span className="font-medium text-white group-hover:text-red-400 transition-colors duration-300"
                style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0)' }}>
            {t("dropdownMenu.delete")}
          </span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          
          .group:hover .font-medium {
            text-shadow: 0 0 10px currentColor;
          }
        `
      }} />
    </div>
  );
}