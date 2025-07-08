import React, { useState } from "react";
import { Combine } from "lucide-react";
import { useTranslation } from "react-i18next";

const DebtList = ({ debts }) => {
  const { t } = useTranslation("home");
  const [showAll, setShowAll] = useState(false);
  const visibleDebts = showAll ? debts : debts.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center gap-3">
          <div className="bg-indigo-100 rounded-full p-2">
          <Combine className="text-indigo-700" />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {t("debtList.title")}
          </span>
        </div>

      <ul className="divide-y divide-gray-100 text-sm">
        {visibleDebts.map((debt, i) => (
          <li key={i} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{debt.name}</p>
              <p className="text-xs text-gray-500">
                {t("debtList.overdue", { days: debt.days })}
              </p>
            </div>
            <p className="text-red-600 font-semibold whitespace-nowrap">
              {debt.sum} {t("home.soum")}
            </p>
          </li>
        ))}
      </ul>

      {debts.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-blue-600 text-md font-medium bg-blue-50 hover:bg-blue-100 rounded-xl px-4 py-3 w-full transition-colors duration-200"
          >
            {showAll ? t("debtList.showLess") : t("debtList.showMore")}
          </button>
        </div>
      )}
    </div>
  );
};

export default DebtList;
