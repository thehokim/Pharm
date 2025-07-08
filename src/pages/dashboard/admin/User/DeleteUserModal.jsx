import { X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const DeleteUserModal = ({ isOpen, onClose, onConfirm, user }) => {
  const { t } = useTranslation("user");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("deleteTitle")}
          </h2>
        </div>

        <p className="mb-6 text-gray-700 text-md">
          {t("deleteQuestion")}{" "}
          <span className="font-semibold">{user?.name || t("user")}</span>?
        </p>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border border-gray-100 w-full rounded-xl text-gray-500 hover:bg-gray-100"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
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

export default DeleteUserModal;
