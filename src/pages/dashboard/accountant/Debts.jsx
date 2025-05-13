import React, { useState } from "react";
import { AlertOctagon, Filter } from "lucide-react";

const mockDebts = [
  { client: "Аптека Акме", due: "2025-05-15", amount: "$2450.00", overdue: "30 дней" },
  { client: "МедПлюс", due: "2025-05-22", amount: "$1850.00", overdue: "23 дня" },
  { client: "МедПоставка", due: "2025-05-30", amount: "$3200.00", overdue: "15 дней" },
  { client: "Городская клиника", due: "2025-06-10", amount: "$950.00", overdue: "4 дня" },
  { client: "МедЭкспресс", due: "2025-06-15", amount: "$4000.00", overdue: "Скоро" },
];

const Debts = () => {
  const [filter, setFilter] = useState("all");

  const filteredDebts = mockDebts.filter((debt) => {
    if (filter === "soon") return debt.overdue === "Скоро";
    if (filter === "overdue") return debt.overdue.includes("дней");
    return true;
  });

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl gap-2">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <AlertOctagon className="w-6 h-6" />
          Задолженности клиентов
        </h2>
        <div className="flex gap-2 text-sm font-medium">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full border ${
              filter === "all"
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "text-gray-600 border-gray-200"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter("overdue")}
            className={`px-4 py-1.5 rounded-full border ${
              filter === "overdue"
                ? "bg-red-50 text-red-600 border-red-200"
                : "text-gray-600 border-gray-200"
            }`}
          >
            Просроченные
          </button>
          <button
            onClick={() => setFilter("soon")}
            className={`px-4 py-1.5 rounded-full border ${
              filter === "soon"
                ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                : "text-gray-600 border-gray-200"
            }`}
          >
            Скоро истекают
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-4 space-y-2 text-sm">
        {filteredDebts.length > 0 ? (
          filteredDebts.map((debt, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">{debt.client}</p>
                <p className="text-xs text-gray-500">Срок: {debt.due}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{debt.amount}</p>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    debt.overdue.includes("дней")
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {debt.overdue}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">Нет данных для выбранного фильтра.</p>
        )}
      </div>
    </div>
  );
};

export default Debts;
