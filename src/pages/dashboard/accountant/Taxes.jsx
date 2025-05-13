import React, { useState } from "react";
import { Landmark } from "lucide-react";

const mockTaxes = [
  { name: "НДС", due: "2025-06-15", amount: "$4,250.65", status: "Срочно" },
  { name: "Подоходный налог", due: "2025-07-15", amount: "$2,850.00", status: "45 дней" },
  { name: "Налог на имущество", due: "2025-08-30", amount: "$1,145.00", status: "91 день" },
];

const getStatusColor = (status) => {
  if (status === "Срочно") return "bg-red-100 text-red-700";
  if (status.includes("дней") && parseInt(status) <= 45)
    return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-800";
};

const Taxes = () => {
  const [selectedStatus, setSelectedStatus] = useState("Все");

  const filteredTaxes =
    selectedStatus === "Все"
      ? mockTaxes
      : mockTaxes.filter((tax) => tax.status === selectedStatus);

  const statuses = ["Все", "Срочно", "45 дней", "91 день"];

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Landmark className="w-6 h-6" />
          Налоговые обязательства
        </h2>
        <div className="flex flex-wrap gap-2 px-4">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              selectedStatus === status
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      </div>
      {/* Tax List */}
      <div className="bg-white rounded-2xl p-4 text-sm space-y-2">
        {filteredTaxes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Ничего не найдено</p>
        ) : (
          filteredTaxes.map((tax, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">{tax.name}</p>
                <p className="text-xs text-gray-500">Срок уплаты: {tax.due}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{tax.amount}</p>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(tax.status)}`}>
                  {tax.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Taxes;
