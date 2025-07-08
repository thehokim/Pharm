import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const DeleteSupplierModal = ({ isOpen, onClose, onConfirm, supplier }) => {
  const { t } = useTranslation("supplier");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600">{t("delete_supplier")}</h2>
        </div>

        <p className="mb-4 text-gray-700">
          {t("delete_supplier_question", { name: supplier?.name || t("name") })}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-3 w-full border-gray-100 border rounded-xl text-gray-500 hover:bg-gray-100"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 w-full bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSupplierModal;
