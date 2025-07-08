import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const DeleteProductModal = ({ isOpen, onClose, onConfirm, product }) => {
  const { t } = useTranslation("product");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{t("delete_product")}</h2>
        </div>
        <p className="mb-4 text-gray-700 text-md ">
          {t("delete_product_question", { name: product?.name || t("no_name") })}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-100 rounded-xl w-full text-gray-500 hover:bg-gray-100"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 bg-red-500 w-full text-white rounded-xl hover:bg-red-600"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
