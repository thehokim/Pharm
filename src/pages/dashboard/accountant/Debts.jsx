import React from "react";

const mockDebts = [
  { client: "Аптека Акме", due: "2025-05-15", amount: "$2450.00", overdue: "30 дней" },
  { client: "МедПлюс", due: "2025-05-22", amount: "$1850.00", overdue: "23 дня" },
  { client: "МедПоставка", due: "2025-05-30", amount: "$3200.00", overdue: "15 дней" },
  { client: "Городская клиника", due: "2025-06-10", amount: "$950.00", overdue: "4 дня" },
  { client: "МедЭкспресс", due: "2025-06-15", amount: "$4000.00", overdue: "Скоро" },
];

const Debts = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Задолженности клиентов</h2>
      <p className="text-gray-600">Клиенты с просроченными или близкими к сроку платежами.</p>

      <div className="bg-white shadow rounded-xl p-4">
        <ul className="space-y-2 text-sm">
          {mockDebts.map((debt, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="font-medium">{debt.client}</p>
                <p className="text-xs text-gray-500">Срок: {debt.due}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{debt.amount}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    debt.overdue.includes("дней")
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {debt.overdue}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Debts;
