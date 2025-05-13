import React, { useState } from "react";
import { PackageSearch, Search } from "lucide-react";

const initialInventory = [
  {
    name: "Парацетамол 500мг",
    code: "PRC-500",
    quantity: 120,
    status: "В наличии",
  },
  {
    name: "Амоксициллин 250мг",
    code: "AMX-250",
    quantity: 25,
    status: "Мало",
  },
  {
    name: "Ибупрофен 400мг",
    code: "IBP-400",
    quantity: 0,
    status: "Нет в наличии",
  },
  {
    name: "Цетиризин 10мг",
    code: "CTR-10",
    quantity: 42,
    status: "Истекает",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "В наличии":
      return "bg-green-100 text-green-700";
    case "Мало":
      return "bg-yellow-100 text-yellow-700";
    case "Нет в наличии":
      return "bg-gray-200 text-gray-700";
    case "Истекает":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Inventory = () => {
  const [inventory] = useState(initialInventory);

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <PackageSearch /> Инвентарь
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск товаров..."
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
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((item, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.code}</td>
                <td className="px-6 py-4">{item.quantity} шт</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
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

export default Inventory;
