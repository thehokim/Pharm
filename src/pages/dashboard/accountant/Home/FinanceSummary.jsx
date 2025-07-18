import { ChartGantt } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../utils/auth";

const FinanceSummary = () => {
  const [financeData, setFinanceData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    profitGrowth: "0%",
    clientDebt: 0,
    taxObligation: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем текущий год
        const currentYear = new Date().getFullYear();
        
        const response = await fetch(`${BASE_URL}/api/in_out?year=${currentYear}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Вычисляем общие суммы
        const totalRevenue = data.reduce((sum, item) => sum + (item.income || 0), 0);
        const totalExpenses = data.reduce((sum, item) => sum + (item.expenses || 0), 0);
        const totalProfit = totalRevenue - totalExpenses;
        
        // Вычисляем рост прибыли (сравниваем с предыдущим месяцем)
        const currentMonth = data[data.length - 1];
        const previousMonth = data[data.length - 2];
        
        let profitGrowth = "0%";
        if (previousMonth && currentMonth) {
          const currentProfit = (currentMonth.income || 0) - (currentMonth.expenses || 0);
          const previousProfit = (previousMonth.income || 0) - (previousMonth.expenses || 0);
          
          if (previousProfit > 0) {
            const growth = ((currentProfit - previousProfit) / previousProfit) * 100;
            profitGrowth = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
          }
        }
        
        setFinanceData({
          revenue: totalRevenue,
          expenses: totalExpenses,
          profit: totalProfit,
          profitGrowth,
          clientDebt: 0, // Будет получено из другого API
          taxObligation: 0 // Будет получено из другого API
        });
        
      } catch (err) {
        console.error("Ошибка загрузки финансовых данных:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ChartGantt className="w-5 h-5" />
          Финансовая сводка
        </h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ChartGantt className="w-5 h-5" />
          Финансовая сводка
        </h3>
        <div className="flex justify-center items-center h-32 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ChartGantt className="w-5 h-5" />
        Финансовая сводка
      </h3>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Доход:</span>
          <span className="font-semibold text-green-600">
            ${financeData.revenue.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Расходы:</span>
          <span className="font-semibold text-red-500">
            ${financeData.expenses.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="font-medium">Прибыль:</span>
          <span className="font-bold text-green-700">
            ${financeData.profit.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-green-500 mt-1">
          {financeData.profitGrowth} по сравнению с прошлым месяцем
        </p>
      </div>

      <hr className="my-4" />

      <div className="space-y-2 text-sm">
        <p className="text-red-600 font-medium">
          Задолженность клиентов:{" "}
          <span className="font-bold">${financeData.clientDebt.toLocaleString()}</span>
        </p>
        <p className="text-gray-700">
          Налоговые обязательства:{" "}
          <span className="font-medium">${financeData.taxObligation.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

export default FinanceSummary;
