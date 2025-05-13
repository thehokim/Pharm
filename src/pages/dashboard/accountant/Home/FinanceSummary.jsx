import { ChartGantt } from "lucide-react";
import React from "react";

const FinanceSummary = ({
  revenue = 45231.89,
  expenses = 21456.78,
  profit = 23775.11,
  profitGrowth = "+15.2%",
  clientDebt = 15420,
  taxObligation = 8245.65,
}) => (
  <div className="bg-white rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <ChartGantt className="w-5 h-5" />
      Финансовая сводка
    </h3>

    <div className="space-y-2 text-sm text-gray-700">
      <div className="flex justify-between">
        <span>Доход:</span>
        <span className="font-semibold text-green-600">
          ${revenue.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Расходы:</span>
        <span className="font-semibold text-red-500">
          ${expenses.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between border-t pt-2">
        <span className="font-medium">Прибыль:</span>
        <span className="font-bold text-green-700">
          ${profit.toLocaleString()}
        </span>
      </div>
      <p className="text-xs text-green-500 mt-1">
        {profitGrowth} по сравнению с прошлым месяцем
      </p>
    </div>

    <hr className="my-4" />

    <div className="space-y-2 text-sm">
      <p className="text-red-600 font-medium">
        Задолженность клиентов:{" "}
        <span className="font-bold">${clientDebt.toLocaleString()}</span>
      </p>
      <p className="text-gray-700">
        Налоговые обязательства:{" "}
        <span className="font-medium">${taxObligation.toLocaleString()}</span>
      </p>
    </div>
  </div>
);

export default FinanceSummary;
