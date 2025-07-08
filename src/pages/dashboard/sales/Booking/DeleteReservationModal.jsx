import React from "react";
import { X } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation, Trans } from "react-i18next";

const DeleteReservationModal = ({ isOpen, onClose, reservation, onDelete }) => {
  const { t } = useTranslation("booking");
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/reservations/${reservation.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(t("deleteReservation.error"));

      onDelete();
      onClose();
    } catch (err) {
      console.error(err);
      alert(t("deleteReservation.error"));
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl relative">
        <h2 className="text-xl font-semibold mb-4">
          {t("deleteReservation.title")}
        </h2>
        <p className="mb-6">
          <Trans
            i18nKey="deleteReservation.confirm"
            ns="booking"
            values={{ client_full_name: reservation.client_full_name }}
            components={[<strong key="client" />]}
          />
        </p>
        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 w-full border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            {t("deleteReservation.cancel")}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-3 w-full bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            {t("deleteReservation.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReservationModal;
