import React from "react";
import { X } from "lucide-react";

const DeleteClientModal = ({ isOpen, onClose, onConfirm, client }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Удалить клиента</h2>
        </div>

        <p className="mb-6 text-gray-700">
          Вы уверены, что хотите удалить клиента{" "}
          <span className="font-semibold">{client?.name || "Без названия"}</span>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 w-full border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 w-full bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;
