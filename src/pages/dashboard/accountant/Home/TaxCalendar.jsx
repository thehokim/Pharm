import { CalendarClock } from "lucide-react";
import React, { useEffect, useState } from "react";

const TaxCalendar = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate days remaining until the 15th of the next month
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status color based on days remaining
  const getStatusColor = (daysRemaining) => {
    if (daysRemaining < 0) {
      return "bg-red-100 text-red-700"; // Overdue
    } else if (daysRemaining <= 7) {
      return "bg-red-100 text-red-700"; // Urgent
    } else if (daysRemaining <= 30) {
      return "bg-yellow-100 text-yellow-700"; // Warning
    } else {
      return "bg-gray-100 text-gray-700"; // Normal
    }
  };

  // Get status label
  const getStatusLabel = (daysRemaining) => {
    if (daysRemaining < 0) {
      return "Просрочено";
    } else if (daysRemaining === 0) {
      return "Сегодня";
    } else if (daysRemaining === 1) {
      return "Завтра";
    } else if (daysRemaining <= 7) {
      return `${daysRemaining} дней`;
    } else if (daysRemaining <= 30) {
      return `${daysRemaining} дней`;
    } else {
      return `${daysRemaining} дней`;
    }
  };

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/tax-obligations");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter only unpaid taxes and add calculated fields
        const unpaidTaxes = data
          .filter(tax => tax.status !== "paid" && tax.status !== "оплачено")
          .map(tax => {
            const daysRemaining = getDaysRemaining(tax.due_date);
            return {
              ...tax,
              daysRemaining,
              statusColor: getStatusColor(daysRemaining),
              statusLabel: getStatusLabel(daysRemaining)
            };
          })
          .sort((a, b) => a.daysRemaining - b.daysRemaining); // Sort by urgency
        
        setTaxes(unpaidTaxes);
      } catch (err) {
        console.error("Error fetching tax obligations:", err);
        setError("Ошибка загрузки налоговых обязательств");
      } finally {
        setLoading(false);
      }
    };

    fetchTaxes();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarClock className="w-5 h-5" />
          Календарь налогов
        </h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarClock className="w-5 h-5" />
          Календарь налогов
        </h3>
        <div className="text-center py-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CalendarClock className="w-5 h-5" />
        Календарь налогов
      </h3>
      {taxes.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Все налоги оплачены</p>
        </div>
      ) : (
        <ul className="text-sm space-y-3">
          {taxes.map((tax) => (
            <li
              key={tax.id}
              className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">{tax.type_name}</p>
                <p className="text-xs text-gray-500">
                  Срок: {new Date(tax.due_date).toLocaleDateString('ru-RU')}
                </p>
                <p className="text-xs text-gray-500">
                  Сумма: {tax.amount?.toLocaleString('ru-RU')} сум
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${tax.statusColor}`}>
                {tax.statusLabel}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaxCalendar;
