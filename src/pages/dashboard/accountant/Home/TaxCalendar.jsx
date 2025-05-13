import { CalendarClock } from "lucide-react";
import React, { useEffect, useState } from "react";

// Временно: мок-данные
const mockTaxes = [
  {
    name: "НДС",
    due: "2025-06-15",
    label: "Срочно",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Подоходный налог",
    due: "2025-07-15",
    label: "45 дней",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    name: "Налог на имущество",
    due: "2025-08-30",
    label: "91 день",
    color: "bg-gray-100 text-gray-700",
  },
];

const TaxCalendar = () => {
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    // TODO: заменить fetch на реальный API вызов
    const fetchTaxes = async () => {
      // const response = await fetch("/api/taxes");
      // const data = await response.json();
      // setTaxes(data);
      setTaxes(mockTaxes); // пока подставляем мок
    };

    fetchTaxes();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CalendarClock className="w-5 h-5" />
        Календарь налогов
      </h3>
      <ul className="text-sm space-y-3">
        {taxes.map((t, i) => (
          <li
            key={i}
            className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
          >
            <div>
              <p className="font-medium text-gray-800">{t.name}</p>
              <p className="text-xs text-gray-500">Срок: {t.due}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${t.color}`}>
              {t.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaxCalendar;
