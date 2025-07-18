import React from "react";
import { useTranslation } from "react-i18next";

const WarehouseStatCard = ({ label, value, delta, icon }) => {
  const { t } = useTranslation("warehouse");
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h2 className="text-sm text-gray-500">{label}</h2>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {delta && <p className="text-xs text-gray-400">{t(delta, delta)}</p>}
      </div>
    </div>
  );
};

export default WarehouseStatCard;