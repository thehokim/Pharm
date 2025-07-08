import { Pen, Trash } from "lucide-react";
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
      className="absolute right-0 top-8 min-w-[170px] rounded-xl border border-gray-200 bg-white z-20 py-1 shadow-lg animate-fadeIn"
      style={{ boxShadow: "0 6px 32px 0 rgba(44, 62, 80, 0.10)" }}
    >
      <button
        className="group flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-800 rounded-xl hover:bg-indigo-50 focus:bg-indigo-50 transition-colors"
        onClick={onEdit}
        type="button"
      >
        <Pen
          size={18}
          className="text-indigo-500 group-hover:text-indigo-700 transition-colors"
        />
        <span className="font-medium group-hover:text-indigo-700 transition-colors">
          {t("dropdownMenu.edit")}
        </span>
      </button>
      <button
        className="group flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 rounded-xl hover:bg-red-50 focus:bg-red-50 transition-colors"
        onClick={onDelete}
        type="button"
      >
        <Trash
          size={18}
          className="text-red-500 group-hover:text-red-700 transition-colors"
        />
        <span className="font-medium group-hover:text-red-700 transition-colors">
          {t("dropdownMenu.delete")}
        </span>
      </button>
    </div>
  );
}
