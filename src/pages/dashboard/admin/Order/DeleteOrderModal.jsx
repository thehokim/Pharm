import React from "react";
import { X } from "lucide-react";

const DeleteOrderModal = ({ isOpen, onClose, onConfirm, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600">Удалить заказ</h2>
        </div>

        <p className="mb-4 text-gray-700">
          Вы уверены, что хотите удалить заказ 
          <span className="font-semibold">{" "}{order.id || "№ заказа"}</span>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-100 w-full rounded-xl text-gray-500 hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 bg-red-500 w-full text-white rounded-xl hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
