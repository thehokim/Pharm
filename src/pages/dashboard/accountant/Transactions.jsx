import React, { useEffect, useState } from "react";
import { Receipt } from "lucide-react";

// Мок-данные (можно заменить на данные с бэкенда)
const mockTransactions = [
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
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // В будущем здесь будет fetch("/api/transactions")
    setTransactions(mockTransactions);
  }, []);

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          Выписки
        </h2>
      </div>

      {/* Таблица */}
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Банк</th>
              <th className="px-6 py-4 bg-gray-100">Дата</th>
              <th className="px-6 py-4 bg-gray-100">Сумма</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="bg-white px-6 py-4 font-medium">{tx.bank}</td>
                <td className="bg-white px-6 py-4">{tx.date}</td>
                <td className="bg-white px-6 py-4">{tx.amount}</td>
                <td className="bg-white px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
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
  );
};

export default Transactions;
