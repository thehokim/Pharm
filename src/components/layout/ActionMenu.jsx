import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, MoreVertical, PencilIcon, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ActionMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation("booking"); // Namespace 'booking'

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 rounded-xl bg-gray-800/50 border border-gray-600/50 hover:border-cyan-400/50 hover:bg-gray-700/50 transition-all duration-300 group"
        style={{ 
          boxShadow: open ? '0 0 15px rgba(6, 182, 212, 0.3)' : 'none'
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical
          size={18}
          className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300"
          style={{ 
            filter: open ? 'drop-shadow(0 0 8px #06b6d4)' : 'none'
          }}
        />
      </button>
      
      {open && (
        <div className="absolute -right-8 top-full mt-2 py-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl z-50 shadow-2xl animate-fadeIn"
             style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)' }}>
          
          {/* Декоративные неоновые элементы */}

          
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-sm text-white hover:text-emerald-400 hover:bg-emerald-400/10 flex items-center gap-3 transition-all duration-300 first:rounded-t-2xl"
          >
            <PencilIcon 
              className="w-4 h-4 text-emerald-400" 
              style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
            />
            <span className="font-medium">{t("dropdownMenu.edit")}</span>
          </button>
          
          <div className="h-px bg-gray-700/50 mx-2"></div>
          
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-sm text-white hover:text-red-400 hover:bg-red-400/10 flex items-center gap-3 transition-all duration-300 last:rounded-b-2xl"
          >
            <Trash2 
              className="w-4 h-4 text-red-400" 
              style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}
            />
            <span className="font-medium">{t("dropdownMenu.delete")}</span>
          </button>
        </div>
      )}
      
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
        `
      }} />
    </div>
  );
};

export default ActionMenu;