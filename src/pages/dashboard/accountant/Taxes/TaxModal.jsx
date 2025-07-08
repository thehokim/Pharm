import React from "react";
import { useTranslation } from "react-i18next";
import DropDown from "../../../../components/layout/DropDown";

export default function TaxModal({
  open,
  onClose,
  taxTypes,
  selectedTypeId,
  setSelectedTypeId,
  percentage,
  setPercentage,
  amount,
  setAmount,
  handleSubmit
}) {
  const { t } = useTranslation("acc_tax");
  if (!open) return null;

  // Формируем options для DropDown
  const taxTypeOptions = taxTypes.map((tt) => ({
    value: tt.id,
    label: tt.name,
    ...tt,
  }));

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h3 className="text-lg font-medium mb-4">{t("modal_title")}</h3>

        <label className="block mb-2 text-sm">{t("type")}</label>
        <DropDown
          value={selectedTypeId}
          onChange={(val) => {
            setSelectedTypeId(val);
            const type = taxTypes.find((tt) => String(tt.id) === String(val));
            setPercentage(type?.default_percentage || "");
          }}
          options={taxTypeOptions}
          placeholder={t("choose_type")}
        />

        <label className="block mb-2 text-sm mt-4">{t("percentage")}</label>
        <input
          type="number"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none"
        />

        <label className="block mb-2 text-sm">{t("amount")}</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
}
