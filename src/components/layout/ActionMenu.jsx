import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, PencilIcon, Trash2 } from "lucide-react";
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
      <MoreHorizontal
        size={18}
        className="text-gray-500 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute -right-8 py-2 w-42 bg-white border border-gray-200 rounded-xl z-50 shadow-md">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-sm hover:text-blue-500 flex items-center gap-2 transition-colors duration-300"
          >
            <PencilIcon className="w-4 h-4" />
            {t("dropdownMenu.edit")}
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-sm hover:text-red-500 flex items-center gap-2 transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4" />
            {t("dropdownMenu.delete")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
