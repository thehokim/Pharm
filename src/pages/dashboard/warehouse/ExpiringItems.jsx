import React from "react";

const expiringProducts = [
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
];

const getUrgencyColor = (daysLeft) => {
  if (daysLeft <= 15) return "bg-red-100 text-red-700";
  if (daysLeft <= 30) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-800";
};

const ExpiringItems = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Истекающие товары</h2>
      <p className="text-gray-600">Товары, срок годности которых истекает в течение ближайших 90 дней.</p>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Название</th>
              <th className="px-4 py-2 text-left">Код</th>
              <th className="px-4 py-2 text-left">Остаток</th>
              <th className="px-4 py-2 text-left">Срок годности</th>
              <th className="px-4 py-2 text-left">Осталось дней</th>
            </tr>
          </thead>
          <tbody>
            {expiringProducts.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.code}</td>
                <td className="px-4 py-2">{item.quantity} шт</td>
                <td className="px-4 py-2">{item.expDate}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${getUrgencyColor(
                      item.daysLeft
                    )}`}
                  >
                    {item.daysLeft} дней
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

export default ExpiringItems;
