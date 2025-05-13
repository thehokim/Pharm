import React, { useState } from "react";
import { AlarmClock, Search, ArrowDownAZ, ArrowUpAZ, ChevronsUpDown } from "lucide-react";

const initialExpiringProducts = [
  {
    name: "Парацетамол 500мг",
    code: "PRC-500",
    expDate: "2025-06-15",
    daysLeft: 15,
    quantity: 120,
  },
  {
    name: "Амоксициллин 250мг",
    code: "AMX-250",
    expDate: "2025-07-22",
    daysLeft: 52,
    quantity: 85,
  },
  {
    name: "Ибупрофен 400мг",
    code: "IBP-400",
    expDate: "2025-06-30",
    daysLeft: 30,
    quantity: 65,
  },
  {
    name: "Цетиризин 10мг",
    code: "CTR-10",
    expDate: "2025-06-05",
    daysLeft: 5,
    quantity: 45,
  },
  {
    name: "Азитромицин 500мг",
    code: "AZT-500",
    expDate: "2025-07-01",
    daysLeft: 31,
    quantity: 92,
  },
  {
    name: "Цефтриаксон 1г",
    code: "CFT-1000",
    expDate: "2025-06-20",
    daysLeft: 20,
    quantity: 33,
  },
  {
    name: "Метронидазол 250мг",
    code: "MTZ-250",
    expDate: "2025-08-10",
    daysLeft: 71,
    quantity: 120,
  },
  {
    name: "Омепразол 20мг",
    code: "OMP-20",
    expDate: "2025-06-18",
    daysLeft: 18,
    quantity: 47,
  },
  {
    name: "Лоратадин 10мг",
    code: "LRT-10",
    expDate: "2025-07-05",
    daysLeft: 35,
    quantity: 60,
  },
  {
    name: "Но-шпа 40мг",
    code: "NOS-40",
    expDate: "2025-06-25",
    daysLeft: 25,
    quantity: 73,
  },
  {
    name: "Аспирин 100мг",
    code: "ASP-100",
    expDate: "2025-08-01",
    daysLeft: 62,
    quantity: 110,
  },
  {
    name: "Фурацилин 20мг",
    code: "FRC-20",
    expDate: "2025-07-28",
    daysLeft: 58,
    quantity: 40,
  },
  {
    name: "Ципрофлоксацин 500мг",
    code: "CIP-500",
    expDate: "2025-06-10",
    daysLeft: 10,
    quantity: 35,
  },
  {
    name: "Диклофенак 50мг",
    code: "DIC-50",
    expDate: "2025-06-28",
    daysLeft: 28,
    quantity: 78,
  },
  {
    name: "Нимесулид 100мг",
    code: "NIM-100",
    expDate: "2025-07-12",
    daysLeft: 42,
    quantity: 90,
  },
];


const getUrgencyColor = (daysLeft) => {
  if (daysLeft <= 15) return "bg-red-100 text-red-700";
  if (daysLeft <= 30) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-800";
};

const ExpiringItems = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("daysLeft");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const filtered = initialExpiringProducts
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = sortBy === "expDate" ? new Date(a.expDate) : a[sortBy];
      const bVal = sortBy === "expDate" ? new Date(b.expDate) : b[sortBy];
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <AlarmClock />
          Истекающие товары
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по названию или коду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Название</th>
              <th className="px-6 py-4 bg-gray-100">Код</th>
              <th className="px-6 py-4 bg-gray-100">Остаток</th>
              <th
                className="px-6 py-4 bg-gray-100 cursor-pointer select-none"
                onClick={() => handleSort("expDate")}
              >
                <span className="flex items-center gap-1">
                  Срок годности
                  {sortBy === "expDate" &&
                    (sortAsc ? <ChevronsUpDown size={14} /> : <ChevronsUpDown size={14} />)}
                </span>
              </th>
              <th
                className="px-6 py-4 bg-gray-100 rounded-tr-xl cursor-pointer select-none"
                onClick={() => handleSort("daysLeft")}
              >
                <span className="flex items-center gap-8">
                  Осталось дней
                  {sortBy === "daysLeft" &&
                    (sortAsc ? <ChevronsUpDown size={14} /> : <ChevronsUpDown size={14} />)}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.code}</td>
                <td className="px-6 py-4">{item.quantity} шт</td>
                <td className="px-6 py-4">{item.expDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getUrgencyColor(
                      item.daysLeft
                    )}`}
                  >
                    {item.daysLeft} дней
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Нет совпадений
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiringItems;
