import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const DeleteOrderModal = ({ isOpen, onClose, onConfirm, order }) => {
  const { t } = useTranslation("order");

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600">{t("delete_order")}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <p className="mb-2 text-gray-700">
          {t("delete_question", { id: order.id })}
        </p>

        {order.client && (
          <p className="text-sm text-gray-600 mb-1">
            {t("client")}: <span className="font-medium">{order.client}</span>
          </p>
        )}
        {order.total_amount !== undefined && (
          <p className="text-sm text-gray-600 mb-4">
            {t("order_amount")}:{" "}
            <span className="font-semibold text-indigo-600">
              {order.total_amount.toLocaleString()} {t("delete_sum")}
            </span>
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-100 w-full rounded-xl text-gray-500 hover:bg-gray-100"
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


export default DeleteOrderModal;
