import { FileText } from "lucide-react";
import React from "react";

const statements = [
  {
    bank: "First National Bank",
    date: "2025-05-31",
    amount: "$24,560.75",
    status: "Обработано",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    bank: "Commerce Bank",
    date: "2025-05-30",
    amount: "$12,450.50",
    status: "Ожидает",
    statusColor: "bg-gray-200 text-gray-700",
  },
];

const RecentStatements = () => (
  <div className="bg-white rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <FileText className="w-5 h-5" />
      Последние выписки
    </h3>

    <ul className="text-sm space-y-3">
      {statements.map((s, i) => (
        <li
          key={i}
          className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
        >
          <div>
            <p className="font-medium text-gray-800">{s.bank}</p>
            <p className="text-xs text-gray-500">{s.date}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{s.amount}</p>
            <span
              className={`text-xs px-2 py-1 rounded-full ${s.statusColor}`}
            >
              {s.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentStatements;
