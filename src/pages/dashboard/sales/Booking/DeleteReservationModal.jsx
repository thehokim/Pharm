import React from "react";
import { X } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";

const DeleteReservationModal = ({ isOpen, onClose, reservation, onDelete }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/reservations/${reservation.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Ошибка при удалении бронирования");

      onDelete();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Удалить бронирование</h2>
        <p className="mb-6">
          Вы уверены, что хотите удалить бронирование клиента <strong>{reservation.client_id}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl border-gray-300 text-gray-700"
          >
            Отмена
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReservationModal;
