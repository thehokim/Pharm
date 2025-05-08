import React from "react";

const transactions = [
  {
    bank: "First National Bank",
    date: "2025-05-31",
    amount: "$24,560.75",
    status: "Обработано",
  },
  {
    bank: "Commerce Bank",
    date: "2025-05-30",
    amount: "$12,450.50",
    status: "Ожидает",
  },
  {
    bank: "City Trust",
    date: "2025-04-30",
    amount: "$18,750.25",
    status: "Обработано",
  },
];

const Transactions = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Выписки</h2>
      <p className="text-gray-600">История всех финансовых операций по счетам компании.</p>

      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Банк</th>
              <th className="px-4 py-2 text-left">Дата</th>
              <th className="px-4 py-2 text-left">Сумма</th>
              <th className="px-4 py-2 text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{tx.bank}</td>
                <td className="px-4 py-2">{tx.date}</td>
                <td className="px-4 py-2">{tx.amount}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tx.status === "Обработано"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
