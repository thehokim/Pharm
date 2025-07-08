import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const DeleteClientModal = ({ isOpen, onClose, onConfirm, client }) => {
  const { t } = useTranslation("client");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">
            {t("deleteClientModal.title")}
          </h2>
        </div>

        <p className="mb-6 text-gray-700">
          {t("deleteClientModal.question", {
            name: client?.name || t("deleteClientModal.noName"),
          })}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 w-full border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            {t("deleteClientModal.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 w-full bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            {t("deleteClientModal.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;
