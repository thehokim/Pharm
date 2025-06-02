import React from "react";
import { X } from "lucide-react";

const DeleteSupplierModal = ({ isOpen, onClose, onConfirm, supplier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600">Удалить поставщика</h2>
        </div>

        <p className="mb-4 text-gray-700">
          Вы уверены, что хотите удалить поставщика{" "}
          <span className="font-semibold">{supplier?.name || "Без названия"}</span>?<br />
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-3 w-full border-gray-100 border rounded-xl text-gray-500 hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 w-full  bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSupplierModal;
