import React from "react";

const mockTaxes = [
  {
    name: "НДС",
    due: "2025-06-15",
    amount: "$4250.65",
    status: "Срочно",
  },
  {
    name: "Подоходный налог",
    due: "2025-07-15",
    amount: "$2850.00",
    status: "45 дней",
  },
  {
    name: "Налог на имущество",
    due: "2025-08-30",
    amount: "$1145.00",
    status: "91 день",
  },
];

const Taxes = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Налоги</h2>
      <p className="text-gray-600">Предстоящие налоговые обязательства и сроки уплаты.</p>

      <div className="bg-white shadow rounded-xl p-4">
        <ul className="space-y-2 text-sm">
          {mockTaxes.map((tax, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="font-medium">{tax.name}</p>
                <p className="text-xs text-gray-500">Срок: {tax.due}</p>
              </div>
              <div className="text-right">
                <p>{tax.amount}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    tax.status === "Срочно"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tax.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Taxes;
